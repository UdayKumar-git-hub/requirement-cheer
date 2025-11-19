import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Gauge, 
  TrendingDown, 
  Users, 
  AlertOctagon,
  Smile,
  Timer,
  Calendar,
  UserCheck,
  Brain
} from "lucide-react";
import type { Analysis } from "@/pages/Index";

interface AdvancedAnalysisSectionProps {
  analysis: Analysis;
}

const AdvancedAnalysisSection = ({ analysis }: AdvancedAnalysisSectionProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-600 bg-red-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div className="space-y-6">
      {/* Pressure Index & SAF Score */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-50/50 to-background">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gauge className="w-5 h-5 text-orange-600" />
              🔥 AI Pressure Index
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold text-orange-600">
                {analysis.pressure_index.score}
              </span>
              <Badge className={`${getRiskColor(analysis.pressure_index.score)} text-xs px-3 py-1`}>
                {analysis.pressure_index.urgency_level}
              </Badge>
            </div>
            <Progress value={analysis.pressure_index.score} className="h-2" />
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Emotional</p>
                <p className="font-semibold">{analysis.pressure_index.emotional_weight}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Keywords</p>
                <p className="font-semibold">{analysis.pressure_index.keyword_intensity}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Time</p>
                <p className="font-semibold">{analysis.pressure_index.time_pressure}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Timer className="w-3 h-3" />
              Response deadline: <span className="font-medium">{analysis.pressure_index.response_deadline}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-50/50 to-background">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              💥 Sentiment-Action Fusion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold text-purple-600">
                {analysis.sentiment_action_fusion.fusion_score}
              </span>
              <Badge className={`${getRiskColor(analysis.sentiment_action_fusion.fusion_score)} text-xs px-3 py-1`}>
                {analysis.sentiment_action_fusion.action_urgency}
              </Badge>
            </div>
            <Progress value={analysis.sentiment_action_fusion.fusion_score} className="h-2" />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Severity</p>
                <p className="font-semibold">{analysis.sentiment_action_fusion.severity_component}/100</p>
              </div>
              <div>
                <p className="text-muted-foreground">Solvability</p>
                <p className="font-semibold">{analysis.sentiment_action_fusion.solvability_component}/100</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              ⏱️ Recommended response: <span className="font-medium">{analysis.sentiment_action_fusion.recommended_response_time}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Emotion Timeline */}
      {analysis.emotion_timeline.segments.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              🔥 Emotion Timeline (SET Engine)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.emotion_timeline.segments.map((segment, i) => (
                <div key={i} className={`p-3 rounded-lg border ${segment.shift_detected ? 'border-orange-300 bg-orange-50/50' : 'border-border bg-muted/30'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm flex-1">"{segment.sentence}"</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={segment.shift_detected ? "destructive" : "secondary"} className="text-xs">
                        {segment.emotion}
                      </Badge>
                      <span className={`text-xs font-bold ${getScoreColor(segment.intensity * 10)}`}>
                        {segment.intensity}/10
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-3 p-2 bg-primary/5 rounded-lg text-xs">
                <span className="font-semibold">Trajectory:</span>{" "}
                <Badge variant="outline" className="ml-2">
                  {analysis.emotion_timeline.overall_trajectory}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Intent-Emotion Mismatch */}
      {analysis.intent_emotion_mismatch.mismatch_detected && (
        <Card className="border-yellow-500/30 bg-yellow-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertOctagon className="w-5 h-5" />
              ⚡ Intent-Emotion Mismatch Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground mb-1">Stated Intent</p>
                <p className="font-medium">{analysis.intent_emotion_mismatch.stated_intent}</p>
              </div>
              <div className="p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground mb-1">Detected Emotion</p>
                <p className="font-medium text-yellow-700">{analysis.intent_emotion_mismatch.detected_emotion}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100/50 border border-yellow-200">
              <p className="text-xs text-muted-foreground mb-1">🔍 Hidden Meaning</p>
              <p className="font-medium text-yellow-900">{analysis.intent_emotion_mismatch.hidden_meaning}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Confidence: {Math.round(analysis.intent_emotion_mismatch.confidence * 100)}%
            </p>
          </CardContent>
        </Card>
      )}

      {/* Micro-Sentiment Chunks */}
      {analysis.micro_sentiment_chunks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              🔍 Micro-Sentiment Chunking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.micro_sentiment_chunks.map((chunk) => (
                <div key={chunk.chunk_id} className="p-3 rounded-lg border bg-muted/20">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        chunk.sentiment === 'positive' ? 'border-green-500 text-green-700' :
                        chunk.sentiment === 'negative' ? 'border-red-500 text-red-700' :
                        'border-gray-500 text-gray-700'
                      }`}
                    >
                      {chunk.sentiment}
                    </Badge>
                    <span className={`text-xs font-bold ${getScoreColor(chunk.intensity * 10)}`}>
                      {chunk.intensity}/10
                    </span>
                  </div>
                  <p className="text-sm mb-1">{chunk.text}</p>
                  <p className="text-xs text-muted-foreground">
                    Key: <span className="font-medium">{chunk.key_phrase}</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trust Loss & Escalation */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-red-500/20 bg-red-50/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <TrendingDown className="w-5 h-5" />
              ☄️ Trust-Loss Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Trust Damage</span>
                <span className={`font-bold ${getScoreColor(100 - analysis.trust_loss_prediction.trust_damage_risk)}`}>
                  {analysis.trust_loss_prediction.trust_damage_risk}%
                </span>
              </div>
              <Progress value={analysis.trust_loss_prediction.trust_damage_risk} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Abandonment Risk</span>
                <span className={`font-bold ${getScoreColor(100 - analysis.trust_loss_prediction.abandonment_likelihood)}`}>
                  {analysis.trust_loss_prediction.abandonment_likelihood}%
                </span>
              </div>
              <Progress value={analysis.trust_loss_prediction.abandonment_likelihood} className="h-2" />
            </div>
            <Badge className={`${getRiskColor(analysis.trust_loss_prediction.trust_damage_risk)} w-full justify-center py-1`}>
              {analysis.trust_loss_prediction.intervention_urgency} Intervention
            </Badge>
            {analysis.trust_loss_prediction.warning_signs.length > 0 && (
              <div className="text-xs">
                <p className="font-semibold mb-1">⚠️ Warning Signs:</p>
                <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                  {analysis.trust_loss_prediction.warning_signs.map((sign, i) => (
                    <li key={i}>{sign}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-orange-50/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
              <AlertOctagon className="w-5 h-5" />
              🚨 Escalation Probability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-orange-600">
                {Math.round(analysis.escalation_probability.overall_score * 100)}%
              </span>
              <Badge variant={analysis.escalation_probability.intervention_needed ? "destructive" : "secondary"}>
                {analysis.escalation_probability.intervention_needed ? "Action Needed" : "Monitor"}
              </Badge>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: "Support Ticket", value: analysis.escalation_probability.support_ticket_risk },
                { label: "Negative Review", value: analysis.escalation_probability.negative_review_risk },
                { label: "Churn Risk", value: analysis.escalation_probability.churn_risk },
                { label: "Management Complaint", value: analysis.escalation_probability.management_complaint_risk }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold">{Math.round(item.value * 100)}%</span>
                  </div>
                  <Progress value={item.value * 100} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accountability Heatmap */}
      <Card className="border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            🎯 Accountability Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(analysis.accountability_heatmap)
              .filter(([key]) => key !== 'primary_responsible_team')
              .map(([team, score]) => (
                <div key={team} className="p-3 rounded-lg border bg-muted/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium capitalize">{team.replace('_', '/')}</span>
                    <span className={`text-lg font-bold ${getScoreColor(score as number)}`}>
                      {score}
                    </span>
                  </div>
                  <Progress value={score as number} className="h-2" />
                </div>
              ))}
          </div>
          <div className="mt-4 p-3 bg-primary/5 rounded-lg text-sm">
            <span className="font-semibold">Primary Responsible:</span>{" "}
            <Badge className="ml-2">{analysis.accountability_heatmap.primary_responsible_team}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Sarcasm & Root Cause */}
      <div className="grid md:grid-cols-2 gap-4">
        {analysis.sarcasm_detection.sarcasm_detected && (
          <Card className="border-pink-500/20 bg-pink-50/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-pink-700">
                <Smile className="w-5 h-5" />
                🔥 Sarcasm Detected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Passive Aggression Score</span>
                <span className="text-xl font-bold text-pink-600">
                  {analysis.sarcasm_detection.passive_aggression_score}/100
                </span>
              </div>
              <Progress value={analysis.sarcasm_detection.passive_aggression_score} className="h-2" />
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant={analysis.sarcasm_detection.frustrated_politeness ? "destructive" : "secondary"}>
                    {analysis.sarcasm_detection.frustrated_politeness ? "Frustrated Politeness" : "Direct"}
                  </Badge>
                </div>
                <div>
                  <p className="font-semibold mb-1">Actual Sentiment:</p>
                  <p className="text-muted-foreground">{analysis.sarcasm_detection.actual_sentiment}</p>
                </div>
                {analysis.sarcasm_detection.hidden_complaints.length > 0 && (
                  <div>
                    <p className="font-semibold mb-1">Hidden Complaints:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                      {analysis.sarcasm_detection.hidden_complaints.map((complaint, i) => (
                        <li key={i}>{complaint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-indigo-500/20 bg-indigo-50/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-indigo-700">
              <Brain className="w-5 h-5" />
              🧠 Root-Cause Emotion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <Badge className="mb-2" variant="outline">{analysis.root_cause_emotion.root_emotion}</Badge>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Trigger:</span> {analysis.root_cause_emotion.emotional_trigger}
              </p>
            </div>
            <div className="p-3 bg-background rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Underlying Cause:</p>
              <p>{analysis.root_cause_emotion.underlying_cause}</p>
            </div>
            <div className="p-3 bg-indigo-100/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">💡 Resolution Approach:</p>
              <p className="text-indigo-900">{analysis.root_cause_emotion.resolution_approach}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood-to-Feature Mapping */}
      {analysis.mood_to_feature_mapping.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              💥 Mood-to-Feature Mapper
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {analysis.mood_to_feature_mapping.map((mapping, i) => (
                <div key={i} className="p-3 rounded-lg border bg-muted/20">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{mapping.emotion}</Badge>
                    <Badge className={
                      mapping.severity === 'critical' ? 'bg-red-500' :
                      mapping.severity === 'high' ? 'bg-orange-500' :
                      mapping.severity === 'medium' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }>
                      {mapping.severity}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold mb-1">{mapping.feature_area}</p>
                  <p className="text-xs text-muted-foreground">{mapping.recommended_action}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emotion Forecast & Personality */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-cyan-500/20 bg-cyan-50/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-cyan-700">
              <Calendar className="w-5 h-5" />
              🔮 Emotion Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-background rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">7-Day Prediction</span>
                  <Badge variant="outline">{analysis.emotion_forecast["7_day_prediction"].predicted_sentiment}</Badge>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Trend: {analysis.emotion_forecast["7_day_prediction"].trend}</span>
                  <span>{Math.round(analysis.emotion_forecast["7_day_prediction"].confidence * 100)}% confidence</span>
                </div>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">30-Day Prediction</span>
                  <Badge variant="outline">{analysis.emotion_forecast["30_day_prediction"].predicted_sentiment}</Badge>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Trend: {analysis.emotion_forecast["30_day_prediction"].trend}</span>
                  <span>{Math.round(analysis.emotion_forecast["30_day_prediction"].confidence * 100)}% confidence</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground p-2 bg-cyan-100/50 rounded">
              {analysis.emotion_forecast.forecast_summary}
            </p>
          </CardContent>
        </Card>

        <Card className="border-violet-500/20 bg-violet-50/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-violet-700">
              <UserCheck className="w-5 h-5" />
              📌 Personality Detector
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="text-sm px-3 py-1">{analysis.personality_detector.communication_style}</Badge>
            </div>
            <div className="text-xs space-y-2">
              <div>
                <p className="font-semibold mb-1">Traits:</p>
                <div className="flex flex-wrap gap-1">
                  {analysis.personality_detector.personality_traits.map((trait, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{trait}</Badge>
                  ))}
                </div>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="font-semibold mb-1">💡 Engagement Tips:</p>
                <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                  {analysis.personality_detector.engagement_tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
              <p className="text-muted-foreground">
                Preferred: <span className="font-medium">{analysis.personality_detector.preferred_communication_method}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalysisSection;
