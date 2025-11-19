import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feedback, stakeholderType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing sentiment for:', { feedback, stakeholderType });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert AI analyst for Requirements Engineering and Stakeholder Management.
Your job is to analyse any stakeholder feedback, requirement document, meeting notes, user inputs, or feature requests.

Perform ALL of the following functions and return a complete JSON response:

1️⃣ Sentiment Analysis: Analyze emotional tone, return overall sentiment (positive/negative/neutral/mixed), confidence score, key emotional indicators, potential risks.

2️⃣ Requirement Quality Checker: Evaluate if requirement is complete, clear, testable, feasible, consistent, free of ambiguity. Return score out of 100, list of issues, suggested improvements.

3️⃣ Stakeholder Priority Estimator: Estimate priority (High/Medium/Low), reason for priority, impact if ignored.

4️⃣ Conflict & Dependency Detection: Check for conflicts with existing requirements, duplicates, dependencies. Return conflict report, dependency report, resolution suggestions.

5️⃣ AI-Generated Rewrite: Rewrite into BRD/PRD-ready format with clear requirement statement, acceptance criteria, test cases, user story format.

6️⃣ Visual Summary: Generate bullet summary, risk heat score (0-10), stakeholder mood meter, requirement stability score.

7️⃣ Smart Recommendations: What product team should do next, who needs to be informed, what needs validation, future improvement suggestions.

Respond ONLY with valid JSON in this exact format:
{
  "sentiment_analysis": {
    "sentiment": "positive" | "negative" | "neutral" | "mixed",
    "confidence": 0.0-1.0,
    "emotional_indicators": ["indicator1", "indicator2"],
    "potential_risks": ["risk1", "risk2"]
  },
  "requirement_quality": {
    "score": 0-100,
    "is_complete": boolean,
    "is_clear": boolean,
    "is_testable": boolean,
    "is_feasible": boolean,
    "is_consistent": boolean,
    "issues": ["issue1", "issue2"],
    "improvements": ["improvement1", "improvement2"]
  },
  "priority_estimate": {
    "priority": "high" | "medium" | "low",
    "reason": "explanation",
    "impact_if_ignored": "description"
  },
  "conflict_dependency_analysis": {
    "has_conflicts": boolean,
    "conflicts": ["conflict1"],
    "has_dependencies": boolean,
    "dependencies": ["dependency1"],
    "resolution_suggestions": ["suggestion1"]
  },
  "rewritten_requirement": {
    "requirement_statement": "clear statement",
    "acceptance_criteria": ["criteria1", "criteria2"],
    "test_cases": ["test1", "test2"],
    "user_story": "As a ___ I want ___ so that ___"
  },
  "visual_summary": {
    "bullet_summary": ["point1", "point2"],
    "risk_heat_score": 0-10,
    "stakeholder_mood": "positive" | "neutral" | "negative" | "frustrated" | "excited",
    "requirement_stability_score": 0-10
  },
  "recommendations": {
    "next_actions": ["action1", "action2"],
    "inform_stakeholders": ["role1", "role2"],
    "validation_needed": ["item1", "item2"],
    "future_improvements": ["improvement1", "improvement2"]
  }
}`
          },
          {
            role: 'user',
            content: `Analyze this ${stakeholderType} feedback:\n\n${feedback}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    console.log('AI response:', content);
    
    // Remove markdown code block syntax if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('Cleaned content:', content);
    
    // Parse the JSON response
    const analysis = JSON.parse(content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-sentiment function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
