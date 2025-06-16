
import { serve } from "std/http/server.ts"
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, step, prompt, completion, model, tokenCost = 0 } = await req.json();
    
    if (!projectId || !step || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: projectId, step, prompt' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Logging prompt for project ${projectId}, step ${step}, model ${model}`);

    // Since prompt_log table was removed, we'll just return success without logging
    console.log(`Prompt log functionality disabled - prompt_log table removed`);

    return new Response(
      JSON.stringify({ 
        id: 'disabled',
        created_at: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in log-prompt function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to log prompt' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
