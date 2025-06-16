
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try to get user from token, but don't require it
    let user = null;
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data.user) {
          user = data.user;
        }
      } catch (e) {
        console.log('Token verification failed, proceeding as guest');
      }
    }

    const { prd, research, brainstorm, projectId } = await req.json();

    // Validate required inputs
    if (!prd) {
      return new Response(JSON.stringify({ error: 'PRD is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For authenticated users, verify project ownership
    if (user && projectId) {
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
    }

    const claudeKey = Deno.env.get('CLAUDE_KEY');
    if (!claudeKey) {
      throw new Error('Claude API key not configured');
    }

    const prompt = `Based on the following PRD, technical research, and brainstorming context, create detailed development epics and tickets:

PRD: ${prd}

Technical Research: ${research || 'Not provided'}

Brainstorming Context: ${JSON.stringify(brainstorm) || 'Not provided'}

Please break down the development work into:
1. Epic-level groupings (major feature areas)
2. Detailed user stories/tickets for each epic
3. Technical tasks and subtasks
4. Dependencies between tickets
5. Estimated complexity/effort
6. Acceptance criteria for each ticket
7. Priority ordering

Format this as an actionable development backlog with clear epics and numbered tickets.`;

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
    const epics = result.content[0].text;

    // Log the prompt for audit trail (only for authenticated users with valid projectId)
    if (user && projectId) {
      try {
        await supabase.from('prompt_log').insert({
          project_id: projectId,
          step: 'epics',
          prompt: prompt,
          completion: epics,
          model: 'claude-3-sonnet-20240229',
          token_cost: result.usage?.output_tokens || 0
        });
      } catch (logError) {
        console.error('Failed to log prompt:', logError);
        // Don't fail the request if logging fails
      }
    }

    return new Response(JSON.stringify({ epics }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-epics:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
