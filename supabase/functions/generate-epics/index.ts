
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
    // Now accepting full context: prd, research, AND brainstorm
    const { prd, research, brainstorm, projectId } = await req.json();
    
    console.log('Generating epics with full context:', { 
      hasPrd: !!prd, 
      hasResearch: !!research, 
      hasBrainstorm: !!brainstorm 
    });
    
    const prompt = `You are an agile development expert specializing in breaking down PRDs into actionable development epics and tickets. Transform this PRD into a comprehensive development plan using the provided research and brainstorming context.

Product Requirements Document:
${prd}

Technical Research Context:
${research}

Brainstorming Results:
${JSON.stringify(brainstorm, null, 2)}

Create a detailed development plan that leverages insights from the technical research and brainstorming sessions:

1. **Epic Breakdown**: 4-6 main development epics with clear goals informed by the research
2. **Detailed Tickets**: For each epic, provide 3-5 specific, actionable tickets that consider the technical recommendations
3. **Acceptance Criteria**: Clear, testable criteria for each ticket
4. **Time Estimates**: Realistic estimates in days for each ticket based on technical complexity from research
5. **Dependencies**: Identify ticket dependencies and suggested order based on architecture recommendations
6. **Priority Levels**: Mark tickets as High/Medium/Low priority considering technical risks identified in research
7. **Technical Notes**: Implementation hints referencing specific technologies and approaches from the research

Format as markdown with:
- Clear epic sections
- Numbered tickets under each epic
- Acceptance criteria in bullet points
- Time estimates and priority clearly marked
- A summary table at the end with totals
- References to research findings where relevant

Focus on making this immediately actionable for a development team while incorporating the technical insights and recommendations from the research phase.`;

    console.log('Generating epics with Claude Sonnet 4 model and enhanced context');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('CLAUDE_KEY'),
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
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
      const errorText = await response.text();
      console.error(`Claude API error: ${response.status} - ${errorText}`);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const epics = data.content[0].text;

    // Log the prompt if projectId is provided
    if (projectId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        await supabase.from('prompt_log').insert({
          project_id: projectId,
          step: 'epics',
          prompt: prompt,
          completion: epics,
          model: 'claude-sonnet-4-20250514',
          token_cost: data.usage?.input_tokens + data.usage?.output_tokens || 0
        });

        console.log('Successfully logged epics generation prompt');
      } catch (logError) {
        console.error('Failed to log prompt, but continuing:', logError);
      }
    }

    console.log('Successfully generated epics with enhanced context');

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
