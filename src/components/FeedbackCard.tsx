import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, Users, Lightbulb, Target, Shield, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Analysis } from "@/pages/Index";

interface FeedbackCardProps {
  feedback: string;
  stakeholderType: string;
  analysis: Analysis;
}

const FeedbackCard = ({ feedback, stakeholderType, analysis }: FeedbackCardProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-sentiment-positive";
      case "negative":
        return "text-sentiment-negative";
      case "mixed":
        return "text-sentiment-mixed";
      default:
        return "text-sentiment-neutral";
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-sentiment-positive/10 border-sentiment-positive/20";
      case "negative":
        return "bg-sentiment-negative/10 border-sentiment-negative/20";
      case "mixed":
        return "bg-sentiment-mixed/10 border-sentiment-mixed/20";
      default:
        return "bg-sentiment-neutral/10 border-sentiment-neutral/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 7) return "text-red-600";
    if (score >= 4) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card className="shadow-elevated hover:shadow-hover transition-all duration-300 border-primary/10 bg-gradient-card backdrop-blur-sm">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-2">Stakeholder Feedback Analysis</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-3">{feedback}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="capitalize">
              {stakeholderType.replace("-", " ")}
            </Badge>
            <Badge className={getPriorityColor(analysis.priority_estimate.priority)}>
              {analysis.priority_estimate.priority} Priority
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sentiment Analysis */}
        <div className={`p-4 rounded-lg border ${getSentimentBg(analysis.sentiment_analysis.sentiment)}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Sentiment Analysis
            </h3>
            <Badge variant="outline" className={getSentimentColor(analysis.sentiment_analysis.sentiment)}>
              {analysis.sentiment_analysis.sentiment}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium">{Math.round(analysis.sentiment_analysis.confidence * 100)}%</span>
            </div>
            <Progress value={analysis.sentiment_analysis.confidence * 100} className="h-2" />
            {analysis.sentiment_analysis.emotional_indicators.length > 0 && (
              <div className="mt-3">
                <p className="text-muted-foreground mb-1">Emotional Indicators:</p>
                <div className="flex flex-wrap gap-1">
                  {analysis.sentiment_analysis.emotional_indicators.map((indicator, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{indicator}</Badge>
                  ))}
                </div>
              </div>
            )}
            {analysis.sentiment_analysis.potential_risks.length > 0 && (
              <div className="mt-3">
                <p className="text-muted-foreground mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Potential Risks:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {analysis.sentiment_analysis.potential_risks.map((risk, i) => (
                    <li key={i}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Requirement Quality */}
        <div className="p-4 rounded-lg border bg-background/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" />
              Requirement Quality
            </h3>
            <Badge variant="outline" className={analysis.requirement_quality.score >= 70 ? "text-green-600" : "text-yellow-600"}>
              {analysis.requirement_quality.score}/100
            </Badge>
          </div>
          <Progress value={analysis.requirement_quality.score} className="h-2 mb-3" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            {[
              { label: "Complete", value: analysis.requirement_quality.is_complete },
              { label: "Clear", value: analysis.requirement_quality.is_clear },
              { label: "Testable", value: analysis.requirement_quality.is_testable },
              { label: "Feasible", value: analysis.requirement_quality.is_feasible },
              { label: "Consistent", value: analysis.requirement_quality.is_consistent },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1 text-xs">
                {item.value ? (
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-600" />
                )}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          {analysis.requirement_quality.issues.length > 0 && (
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground font-medium">Issues:</p>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                {analysis.requirement_quality.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.requirement_quality.improvements.length > 0 && (
            <div className="space-y-1 text-xs mt-2">
              <p className="text-muted-foreground font-medium">Suggested Improvements:</p>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                {analysis.requirement_quality.improvements.map((improvement, i) => (
                  <li key={i}>{improvement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Priority & Impact */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border bg-background/50">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              Priority Estimate
            </h3>
            <p className="text-xs text-muted-foreground mb-2">{analysis.priority_estimate.reason}</p>
            <div className="text-xs">
              <span className="text-muted-foreground">Impact if ignored:</span>
              <p className="mt-1 text-red-600">{analysis.priority_estimate.impact_if_ignored}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-background/50">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4" />
              Visual Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Risk Heat Score</span>
                <span className={`font-bold ${getRiskColor(analysis.visual_summary.risk_heat_score)}`}>
                  {analysis.visual_summary.risk_heat_score}/10
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stability Score</span>
                <span className="font-medium">{analysis.visual_summary.requirement_stability_score}/10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Mood</span>
                <Badge variant="outline" className="text-xs capitalize">{analysis.visual_summary.stakeholder_mood}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Conflicts & Dependencies */}
        {(analysis.conflict_dependency_analysis.has_conflicts || analysis.conflict_dependency_analysis.has_dependencies) && (
          <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              Conflicts & Dependencies
            </h3>
            {analysis.conflict_dependency_analysis.conflicts.length > 0 && (
              <div className="mb-3 text-xs">
                <p className="text-muted-foreground font-medium mb-1">Conflicts:</p>
                <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                  {analysis.conflict_dependency_analysis.conflicts.map((conflict, i) => (
                    <li key={i}>{conflict}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.conflict_dependency_analysis.dependencies.length > 0 && (
              <div className="mb-3 text-xs">
                <p className="text-muted-foreground font-medium mb-1">Dependencies:</p>
                <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                  {analysis.conflict_dependency_analysis.dependencies.map((dep, i) => (
                    <li key={i}>{dep}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.conflict_dependency_analysis.resolution_suggestions.length > 0 && (
              <div className="text-xs">
                <p className="text-muted-foreground font-medium mb-1">Resolution Suggestions:</p>
                <ul className="list-disc list-inside space-y-0.5 text-green-600">
                  {analysis.conflict_dependency_analysis.resolution_suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Rewritten Requirement */}
        <div className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-background">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            AI-Generated BRD/PRD Format
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">User Story:</p>
              <p className="font-medium italic">{analysis.rewritten_requirement.user_story}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Requirement Statement:</p>
              <p>{analysis.rewritten_requirement.requirement_statement}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Acceptance Criteria:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {analysis.rewritten_requirement.acceptance_criteria.map((criteria, i) => (
                  <li key={i}>{criteria}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Test Cases:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {analysis.rewritten_requirement.test_cases.map((test, i) => (
                  <li key={i}>{test}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-4 rounded-lg border bg-background/50">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Smart Recommendations
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground font-medium mb-1">Next Actions:</p>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                {analysis.recommendations.next_actions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground font-medium mb-1">Inform:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysis.recommendations.inform_stakeholders.map((stakeholder, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{stakeholder}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground font-medium mb-1">Validation Needed:</p>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                {analysis.recommendations.validation_needed.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground font-medium mb-1">Future Improvements:</p>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                {analysis.recommendations.future_improvements.map((improvement, i) => (
                  <li key={i}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bullet Summary */}
        {analysis.visual_summary.bullet_summary.length > 0 && (
          <div className="p-3 rounded-lg bg-muted/50 text-xs">
            <p className="font-semibold mb-2">Quick Summary:</p>
            <ul className="space-y-1">
              {analysis.visual_summary.bullet_summary.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
