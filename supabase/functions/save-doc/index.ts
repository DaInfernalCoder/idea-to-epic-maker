
import { serve } from "std/http/server.ts"
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: { method: string; json: () => PromiseLike<{ projectId: any; step: any; content: any; tokenCost?: 0 | undefined; }> | { projectId: any; step: any; content: any; tokenCost?: 0 | undefined; }; }) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, step, content, tokenCost = 0 } = await req.json();
    
    if (!projectId || !step || content === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: projectId, step, content' }),
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

    console.log(`Saving doc for project ${projectId}, step ${step}`);

    const { data, error } = await supabase.rpc('save_doc', {
      p_project_id: projectId,
      p_step: step,
      p_content: content,
      p_token_cost: tokenCost
    });

    if (error) {
      console.error('Error saving doc:', error);
      throw error;
    }

    console.log(`Successfully saved doc with ID: ${data}`);

    return new Response(
      JSON.stringify({ 
        id: data, 
        step, 
        updated_at: new Date().toISOString() 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in save-doc function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save document' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
