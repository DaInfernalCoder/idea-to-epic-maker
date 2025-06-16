
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

    const { requirements, brainstorm, projectId } = await req.json();

    // Validate required inputs
    if (!requirements || !projectId) {
      return new Response(JSON.stringify({ error: 'Requirements and projectId are required' }), {
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

    const prompt = `Based on the following requirements and brainstorming results, provide comprehensive technical research:

Requirements: ${requirements}

Brainstorming Results: ${JSON.stringify(brainstorm)}

Please provide detailed technical research covering:
1. Technology stack recommendations with justifications
2. Architecture patterns and design considerations
3. Third-party integrations and APIs needed
4. Database design recommendations
5. Security considerations
6. Performance optimization strategies
7. Development best practices
8. Potential challenges and solutions

Format your response as detailed technical documentation.`;

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
    const research = result.content[0].text;

    // Log the prompt for audit trail
    await supabase.from('prompt_log').insert({
      project_id: projectId,
      step: 'research',
      prompt: prompt,
      completion: research,
      model: 'claude-3-sonnet-20240229',
      token_cost: result.usage?.output_tokens || 0
    });

    return new Response(JSON.stringify({ research }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-research:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
