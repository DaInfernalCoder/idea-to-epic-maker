
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for server operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { research, brainstorm, projectId } = await req.json();

    // Validate required inputs
    if (!research || !projectId) {
      return new Response(JSON.stringify({ error: 'Research and projectId are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user owns the project
    const { data: project, error: projectError } = await supabase
      .from('project')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return new Response(JSON.stringify({ error: 'Project not found or access denied' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const claudeKey = Deno.env.get('CLAUDE_KEY');
    if (!claudeKey) {
      throw new Error('Claude API key not configured');
    }

    const prompt = `Based on the following technical research and brainstorming, create a comprehensive Product Requirements Document (PRD):

Technical Research: ${research}

Brainstorming Results: ${JSON.stringify(brainstorm)}

Please create a detailed PRD that includes:
1. Executive Summary
2. Problem Statement and Opportunity
3. Success Metrics and KPIs
4. User Stories and Use Cases
5. Functional Requirements
6. Non-Functional Requirements (Performance, Security, Scalability)
7. Technical Specifications
8. Integration Requirements
9. Timeline and Milestones
10. Risk Assessment

Format this as a professional PRD document.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const result = await response.json();
    const prd = result.content[0].text;

    // Log the prompt for audit trail
    await supabase.from('prompt_log').insert({
      project_id: projectId,
      step: 'prd',
      prompt: prompt,
      completion: prd,
      model: 'claude-3-sonnet-20240229',
      token_cost: result.usage?.output_tokens || 0
    });

    return new Response(JSON.stringify({ prd }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-prd:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
