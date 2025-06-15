
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
    const { requirements, brainstorm, projectId } = await req.json();
    
    const prompt = `You are a technical research analyst. Analyze the following project requirements and brainstorming results to provide comprehensive technical research.

Project Requirements:
${requirements}

Brainstorming Results:
${JSON.stringify(brainstorm, null, 2)}

Please provide a detailed technical research report covering:
1. Technology stack recommendations
2. Architecture considerations
3. Implementation complexity analysis
4. Key technical risks and mitigation strategies
5. Best practices and industry standards
6. Development timeline estimates

Format the response as a well-structured markdown document with clear sections and actionable insights.`;

    console.log('Generating research with Perplexity sonar-reasoning-pro model');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a technical research analyst specializing in software architecture and technology recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Perplexity API error: ${response.status} - ${errorText}`);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const research = data.choices[0].message.content;

    // Log the prompt if projectId is provided
    if (projectId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        await supabase.from('prompt_log').insert({
          project_id: projectId,
          step: 'research',
          prompt: prompt,
          completion: research,
          model: 'sonar-reasoning-pro',
          token_cost: data.usage?.total_tokens || 0
        });

        console.log('Successfully logged research generation prompt');
      } catch (logError) {
        console.error('Failed to log prompt, but continuing:', logError);
      }
    }

    console.log('Successfully generated research');

    return new Response(
      JSON.stringify({ research }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error generating research:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate research' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
