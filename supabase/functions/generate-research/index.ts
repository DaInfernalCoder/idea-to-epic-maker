
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

    // Get user from token - improved authentication handling
    let user = null;
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        console.log('Attempting to get user with token');
        
        // Use the anon client for token verification
        const anonClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!);
        const { data, error } = await anonClient.auth.getUser(token);
        
        if (error) {
          console.log('Token verification error:', error.message);
        } else if (data.user) {
          user = data.user;
          console.log('User authenticated:', user.id, user.email);
        }
      } catch (e) {
        console.log('Authentication failed:', e.message);
      }
    }

    const { requirements, brainstorm, projectId } = await req.json();

    // Validate required inputs
    if (!requirements) {
      return new Response(JSON.stringify({ error: 'Requirements are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For authenticated users, verify project ownership
    if (user && projectId) {
      console.log(`Checking project ownership for user ${user.id} and project ${projectId}`);
      const { data: project, error: projectError } = await supabase
        .from('project')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      if (projectError || !project) {
        console.log('Project verification failed:', projectError?.message);
        return new Response(JSON.stringify({ error: 'Project not found or access denied' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.log('Project ownership verified');
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

    console.log('Calling Claude API for research generation');
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

    console.log('Research generation completed successfully');
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
