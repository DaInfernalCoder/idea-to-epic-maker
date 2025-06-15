
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
    const { prd } = await req.json();
    
    const prompt = `You are an agile development expert specializing in breaking down PRDs into actionable development epics and tickets. Transform this PRD into a comprehensive development plan.

Product Requirements Document:
${prd}

Create a detailed development plan that includes:

1. **Epic Breakdown**: 4-6 main development epics with clear goals
2. **Detailed Tickets**: For each epic, provide 3-5 specific, actionable tickets
3. **Acceptance Criteria**: Clear, testable criteria for each ticket
4. **Time Estimates**: Realistic estimates in days for each ticket
5. **Dependencies**: Identify ticket dependencies and suggested order
6. **Priority Levels**: Mark tickets as High/Medium/Low priority
7. **Technical Notes**: Implementation hints and considerations

Format as markdown with:
- Clear epic sections
- Numbered tickets under each epic
- Acceptance criteria in bullet points
- Time estimates and priority clearly marked
- A summary table at the end with totals

Focus on making this immediately actionable for a development team to start implementation.`;

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
    const epics = data.content[0].text;

    return new Response(
      JSON.stringify({ epics }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error generating epics:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate epics' }),
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
