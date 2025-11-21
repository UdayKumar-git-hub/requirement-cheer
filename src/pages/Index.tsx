import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Users, AlertCircle, Mic, MicOff } from "lucide-react";
import useSpeechRecognition from "@/hooks/use-speech";
import SentimentChart from "@/components/SentimentChart";
import FeedbackCard from "@/components/FeedbackCard";

export interface Analysis {
  sentiment_analysis: {
    sentiment: "positive" | "negative" | "neutral" | "mixed";
    confidence: number;
    emotional_indicators: string[];
    potential_risks: string[];
  };
  requirement_quality: {
    score: number;
    is_complete: boolean;
    is_clear: boolean;
    is_testable: boolean;
    is_feasible: boolean;
    is_consistent: boolean;
    issues: string[];
    improvements: string[];
  };
  priority_estimate: {
    priority: "high" | "medium" | "low";
    reason: string;
    impact_if_ignored: string;
  };
  conflict_dependency_analysis: {
    has_conflicts: boolean;
    conflicts: string[];
    has_dependencies: boolean;
    dependencies: string[];
    resolution_suggestions: string[];
  };
  rewritten_requirement: {
    requirement_statement: string;
    acceptance_criteria: string[];
    test_cases: string[];
    user_story: string;
  };
  visual_summary: {
    bullet_summary: string[];
    risk_heat_score: number;
    stakeholder_mood: string;
    requirement_stability_score: number;
  };
  recommendations: {
    next_actions: string[];
    inform_stakeholders: string[];
    validation_needed: string[];
    future_improvements: string[];
  };
  emotion_timeline: {
    segments: Array<{
      sentence: string;
      emotion: string;
      intensity: number;
      shift_detected: boolean;
    }>;
    overall_trajectory: string;
  };
  intent_emotion_mismatch: {
    mismatch_detected: boolean;
    stated_intent: string;
    detected_emotion: string;
    hidden_meaning: string;
    confidence: number;
  };
  pressure_index: {
    score: number;
    emotional_weight: number;
    keyword_intensity: number;
    time_pressure: number;
    urgency_level: string;
    response_deadline: string;
  };
  micro_sentiment_chunks: Array<{
    chunk_id: number;
    text: string;
    sentiment: string;
    key_phrase: string;
    intensity: number;
  }>;
  trust_loss_prediction: {
    trust_damage_risk: number;
    abandonment_likelihood: number;
    escalation_probability: number;
    warning_signs: string[];
    intervention_urgency: string;
  };
  accountability_heatmap: {
    ui_ux: number;
    backend: number;
    qa: number;
    product: number;
    compliance: number;
    management: number;
    primary_responsible_team: string;
  };
  sarcasm_detection: {
    sarcasm_detected: boolean;
    passive_aggression_score: number;
    hidden_complaints: string[];
    frustrated_politeness: boolean;
    actual_sentiment: string;
  };
  root_cause_emotion: {
    root_emotion: string;
    underlying_cause: string;
    emotional_trigger: string;
    resolution_approach: string;
  };
  escalation_probability: {
    overall_score: number;
    support_ticket_risk: number;
    negative_review_risk: number;
    churn_risk: number;
    management_complaint_risk: number;
    intervention_needed: boolean;
  };
  mood_to_feature_mapping: Array<{
    emotion: string;
    feature_area: string;
    severity: string;
    recommended_action: string;
  }>;
  emotion_forecast: {
    "7_day_prediction": {
      predicted_sentiment: string;
      confidence: number;
      trend: string;
    };
    "30_day_prediction": {
      predicted_sentiment: string;
      confidence: number;
      trend: string;
    };
    forecast_summary: string;
  };
  personality_detector: {
    communication_style: string;
    personality_traits: string[];
    engagement_tips: string[];
    preferred_communication_method: string;
  };
  sentiment_action_fusion: {
    fusion_score: number;
    severity_component: number;
    solvability_component: number;
    action_urgency: string;
    recommended_response_time: string;
  };
}

interface FeedbackItem {
  id: string;
  feedback: string;
  stakeholderType: string;
  analysis: Analysis;
}

const Index = () => {
  const [feedback, setFeedback] = useState("");
  const [stakeholderType, setStakeholderType] = useState("client");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<FeedbackItem[]>([]);
  const { toast } = useToast();

  const analyzeFeedback = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback required",
        description: "Please enter stakeholder feedback to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
        body: { feedback, stakeholderType }
      });

      if (error) throw error;

      const newResult: FeedbackItem = {
        id: Date.now().toString(),
        feedback,
        stakeholderType,
        analysis: data
      };

      setResults([newResult, ...results]);
      setFeedback("");

      toast({
        title: "Analysis complete",
        description: `Sentiment: ${data.sentiment_analysis.sentiment} | Priority: ${data.priority_estimate.priority} | Quality: ${data.requirement_quality.score}/100`,
      });
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze feedback",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Speech recognition integration
  const { listening, finalTranscript, error: speechError, start, stop } = useSpeechRecognition({ lang: 'en-US' });
  const lastAppendedRef = useRef<string>('');

  // Append final transcript to feedback when new final text arrives
  useEffect(() => {
    if (finalTranscript && finalTranscript !== lastAppendedRef.current) {
      setFeedback((prev) => (prev ? prev + ' ' + finalTranscript : finalTranscript));
      lastAppendedRef.current = finalTranscript;
      toast({ title: 'Voice input added', description: 'Speech was appended to the feedback.' });
    }
  }, [finalTranscript]);

  useEffect(() => {
    if (speechError) {
      toast({ title: 'Speech recognition', description: speechError, variant: 'destructive' });
    }
  }, [speechError]);

  const sentimentDistribution = results.reduce((acc, item) => {
    acc[item.analysis.sentiment_analysis.sentiment] = (acc[item.analysis.sentiment_analysis.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 py-16 max-w-7xl relative">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-6 shadow-glow">
              <TrendingUp className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Stakeholder Sentiment
              </span>
              <br />
              <span className="text-foreground">Analyzer</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              Transform feedback into actionable insights with AI-powered sentiment analysis
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4 max-w-7xl">

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-elevated hover:shadow-hover transition-all duration-300 border-primary/10 bg-gradient-card backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                Input Feedback
              </CardTitle>
              <CardDescription className="text-base">
                Enter stakeholder feedback or requirements for instant AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold">Stakeholder Type</label>
                <Select value={stakeholderType} onValueChange={setStakeholderType}>
                  <SelectTrigger className="text-base border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="end-user">End User</SelectItem>
                    <SelectItem value="team-member">Team Member</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Feedback / Requirements</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter stakeholder feedback, requirements, or validation comments..."
                  className="min-h-[200px] resize-none text-base border-2 focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => (listening ? stop() : start())}
                  disabled={isAnalyzing}
                  className="w-40 h-12"
                  size="md"
                >
                  {listening ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Record
                    </>
                  )}
                </Button>

                <Button 
                  onClick={analyzeFeedback} 
                  disabled={isAnalyzing || !feedback.trim()}
                  className="flex-1 h-12 shadow-glow hover:shadow-hover transition-all duration-300"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    "Analyze Sentiment"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elevated hover:shadow-hover transition-all duration-300 border-primary/10 bg-gradient-card backdrop-blur-sm">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-primary" />
                Sentiment Distribution
              </CardTitle>
              <CardDescription className="text-base">
                Overall sentiment breakdown of analyzed feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {results.length > 0 ? (
                <SentimentChart distribution={sentimentDistribution} />
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                  <TrendingUp className="w-20 h-20 mb-4 opacity-10" />
                  <p className="text-center text-base">No analysis yet.<br />Start by analyzing some feedback.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {results.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 flex-1 bg-gradient-primary rounded-full"></div>
              <h2 className="text-3xl font-bold">Analysis Results</h2>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {results.length} {results.length === 1 ? 'analysis' : 'analyses'}
              </Badge>
              <div className="h-1 flex-1 bg-gradient-primary rounded-full"></div>
            </div>
            <div className="grid gap-6">
              {results.map((result, index) => (
                <div key={result.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <FeedbackCard
                    feedback={result.feedback}
                    stakeholderType={result.stakeholderType}
                    analysis={result.analysis}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
