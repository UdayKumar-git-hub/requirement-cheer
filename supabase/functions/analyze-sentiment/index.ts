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
            content: `You are the world's most advanced AI analyst for Requirements Engineering and Stakeholder Management with 20+ breakthrough analysis engines.

Analyze stakeholder feedback comprehensively using ALL 20 NEXT-GEN AI FEATURES:

🔥 CORE ANALYSIS (Features 1-7):
1. Sentiment Analysis: sentiment, confidence, emotional_indicators, potential_risks
2. Requirement Quality: score 0-100, completeness checks, issues, improvements
3. Priority Estimator: priority level, reason, impact_if_ignored
4. Conflict Detection: conflicts, dependencies, resolution_suggestions
5. BRD/PRD Rewrite: requirement_statement, acceptance_criteria, test_cases, user_story
6. Visual Summary: bullet_summary, risk_heat_score 0-10, stakeholder_mood, stability_score 0-10
7. Recommendations: next_actions, inform_stakeholders, validation_needed, future_improvements

🚀 BREAKTHROUGH FEATURES (Features 8-20):
8. EMOTION TIMELINE: Analyze sentence-by-sentence emotional shifts with timestamps, emotion type, intensity 0-10
9. INTENT-EMOTION MISMATCH: Detect when words say one thing but tone suggests another. Return stated_intent, detected_emotion, mismatch_detected, hidden_meaning
10. PRESSURE INDEX: Calculate 0-100 urgency score using emotional_weight + keyword_intensity + time_pressure. Include breakdown
11. MICRO-SENTIMENT CHUNKING: Split into meaning blocks with sentiment per block, key_phrase, block_sentiment
12. TRUST-LOSS PREDICTION: Predict trust_damage_risk 0-100, abandonment_likelihood, escalation_probability, warning_signs
13. ACCOUNTABILITY HEATMAP: Map responsibility scores 0-100 for teams: ui_ux, backend, qa, product, compliance, management
14. SARCASM DETECTOR: Detect sarcasm_detected, passive_aggression_score 0-100, hidden_complaints, frustrated_politeness
15. ROOT-CAUSE EMOTION: Identify root_emotion (frustration/confusion/fear/distrust/expectation_gap), underlying_cause, emotional_trigger
16. ESCALATION PROBABILITY: Calculate escalation_score 0-1 for: support_ticket, negative_review, churn_risk, management_complaint
17. MOOD-TO-FEATURE MAPPER: Map emotions to specific features needing improvement with feature_area, emotion_trigger, severity
18. EMOTION FORECAST: Predict sentiment trajectory for 7/30/90 days with predicted_sentiment, confidence, trend_direction
19. PERSONALITY DETECTOR: Classify as assertive/analytical/emotional/collaborative communicator with communication_style, personality_traits, engagement_tips
20. SENTIMENT-ACTION FUSION: Single 0-100 score combining severity + solvability with breakdown

RESPOND ONLY WITH VALID JSON:
{
  "sentiment_analysis": {
    "sentiment": "positive|negative|neutral|mixed",
    "confidence": 0.0-1.0,
    "emotional_indicators": ["string"],
    "potential_risks": ["string"]
  },
  "requirement_quality": {
    "score": 0-100,
    "is_complete": boolean,
    "is_clear": boolean,
    "is_testable": boolean,
    "is_feasible": boolean,
    "is_consistent": boolean,
    "issues": ["string"],
    "improvements": ["string"]
  },
  "priority_estimate": {
    "priority": "high|medium|low",
    "reason": "string",
    "impact_if_ignored": "string"
  },
  "conflict_dependency_analysis": {
    "has_conflicts": boolean,
    "conflicts": ["string"],
    "has_dependencies": boolean,
    "dependencies": ["string"],
    "resolution_suggestions": ["string"]
  },
  "rewritten_requirement": {
    "requirement_statement": "string",
    "acceptance_criteria": ["string"],
    "test_cases": ["string"],
    "user_story": "string"
  },
  "visual_summary": {
    "bullet_summary": ["string"],
    "risk_heat_score": 0-10,
    "stakeholder_mood": "string",
    "requirement_stability_score": 0-10
  },
  "recommendations": {
    "next_actions": ["string"],
    "inform_stakeholders": ["string"],
    "validation_needed": ["string"],
    "future_improvements": ["string"]
  },
  "emotion_timeline": {
    "segments": [
      {
        "sentence": "string",
        "emotion": "string",
        "intensity": 0-10,
        "shift_detected": boolean
      }
    ],
    "overall_trajectory": "stable|escalating|de-escalating"
  },
  "intent_emotion_mismatch": {
    "mismatch_detected": boolean,
    "stated_intent": "string",
    "detected_emotion": "string",
    "hidden_meaning": "string",
    "confidence": 0.0-1.0
  },
  "pressure_index": {
    "score": 0-100,
    "emotional_weight": 0-100,
    "keyword_intensity": 0-100,
    "time_pressure": 0-100,
    "urgency_level": "low|medium|high|critical",
    "response_deadline": "string"
  },
  "micro_sentiment_chunks": [
    {
      "chunk_id": number,
      "text": "string",
      "sentiment": "positive|negative|neutral",
      "key_phrase": "string",
      "intensity": 0-10
    }
  ],
  "trust_loss_prediction": {
    "trust_damage_risk": 0-100,
    "abandonment_likelihood": 0-100,
    "escalation_probability": 0-100,
    "warning_signs": ["string"],
    "intervention_urgency": "low|medium|high|critical"
  },
  "accountability_heatmap": {
    "ui_ux": 0-100,
    "backend": 0-100,
    "qa": 0-100,
    "product": 0-100,
    "compliance": 0-100,
    "management": 0-100,
    "primary_responsible_team": "string"
  },
  "sarcasm_detection": {
    "sarcasm_detected": boolean,
    "passive_aggression_score": 0-100,
    "hidden_complaints": ["string"],
    "frustrated_politeness": boolean,
    "actual_sentiment": "string"
  },
  "root_cause_emotion": {
    "root_emotion": "frustration|confusion|fear|distrust|expectation_gap",
    "underlying_cause": "string",
    "emotional_trigger": "string",
    "resolution_approach": "string"
  },
  "escalation_probability": {
    "overall_score": 0.0-1.0,
    "support_ticket_risk": 0.0-1.0,
    "negative_review_risk": 0.0-1.0,
    "churn_risk": 0.0-1.0,
    "management_complaint_risk": 0.0-1.0,
    "intervention_needed": boolean
  },
  "mood_to_feature_mapping": [
    {
      "emotion": "string",
      "feature_area": "string",
      "severity": "low|medium|high|critical",
      "recommended_action": "string"
    }
  ],
  "emotion_forecast": {
    "7_day_prediction": {
      "predicted_sentiment": "positive|negative|neutral",
      "confidence": 0.0-1.0,
      "trend": "improving|stable|declining"
    },
    "30_day_prediction": {
      "predicted_sentiment": "positive|negative|neutral",
      "confidence": 0.0-1.0,
      "trend": "improving|stable|declining"
    },
    "forecast_summary": "string"
  },
  "personality_detector": {
    "communication_style": "assertive|analytical|emotional|collaborative",
    "personality_traits": ["string"],
    "engagement_tips": ["string"],
    "preferred_communication_method": "string"
  },
  "sentiment_action_fusion": {
    "fusion_score": 0-100,
    "severity_component": 0-100,
    "solvability_component": 0-100,
    "action_urgency": "low|medium|high|critical",
    "recommended_response_time": "string"
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
