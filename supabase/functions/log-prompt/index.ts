
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    const { data, error } = await supabase
      .from('prompt_log')
      .insert({
        project_id: projectId,
        step,
        prompt,
        completion,
        model,
        token_cost: tokenCost
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging prompt:', error);
      throw error;
    }

    console.log(`Successfully logged prompt with ID: ${data.id}`);

    return new Response(
      JSON.stringify({ 
        id: data.id,
        created_at: data.created_at
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
