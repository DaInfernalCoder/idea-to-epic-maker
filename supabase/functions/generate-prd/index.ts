
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { research, brainstorm } = await req.json();
    
    const prompt = `You are a product manager specializing in creating comprehensive Product Requirements Documents (PRDs). Based on the technical research and brainstorming results, create a detailed PRD.

Technical Research:
${research}

Brainstorming Results:
${JSON.stringify(brainstorm, null, 2)}

Create a comprehensive PRD that includes:

1. Executive Summary
2. Product Overview & Vision
3. Target Users & Use Cases
4. Functional Requirements (detailed features)
5. Non-Functional Requirements
6. Technical Requirements
7. Success Metrics & KPIs
8. Timeline & Milestones
9. Risk Assessment
10. Future Roadmap Considerations

Format as a professional markdown document with clear sections, bullet points, and actionable specifications that a development team can use to build the product.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('CLAUDE_KEY'),
        'Content-Type': 'application/json',
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
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const prd = data.content[0].text;

    return new Response(
      JSON.stringify({ prd }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error generating PRD:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate PRD' }),
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
