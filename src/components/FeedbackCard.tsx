import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Minus, AlertTriangle, Clock, User } from "lucide-react";

interface Analysis {
  sentiment: "positive" | "neutral" | "negative";
  confidence: number;
  reasoning: string;
  themes: string[];
  urgency: "low" | "medium" | "high";
}

interface FeedbackCardProps {
  feedback: string;
  stakeholderType: string;
  analysis: Analysis;
}

const FeedbackCard = ({ feedback, stakeholderType, analysis }: FeedbackCardProps) => {
  const getSentimentIcon = () => {
    switch (analysis.sentiment) {
      case "positive":
        return <ThumbsUp className="w-5 h-5" />;
      case "negative":
        return <ThumbsDown className="w-5 h-5" />;
      default:
        return <Minus className="w-5 h-5" />;
    }
  };

  const getSentimentColor = () => {
    switch (analysis.sentiment) {
      case "positive":
        return "bg-positive text-positive-foreground";
      case "negative":
        return "bg-negative text-negative-foreground";
      default:
        return "bg-neutral text-neutral-foreground";
    }
  };

  const getUrgencyColor = () => {
    switch (analysis.urgency) {
      case "high":
        return "bg-negative text-negative-foreground";
      case "medium":
        return "bg-neutral text-neutral-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow" style={{ boxShadow: 'var(--shadow-card)' }}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground capitalize">
                {stakeholderType.replace('-', ' ')}
              </span>
            </div>
            <CardTitle className="text-base font-normal text-foreground leading-relaxed">
              "{feedback}"
            </CardTitle>
          </div>
          <Badge className={`${getSentimentColor()} flex items-center gap-1.5 px-3 py-1`}>
            {getSentimentIcon()}
            <span className="capitalize">{analysis.sentiment}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Confidence:</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${analysis.confidence * 100}%` }}
                />
              </div>
              <span className="font-medium">{Math.round(analysis.confidence * 100)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <Badge variant="outline" className={getUrgencyColor()}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              {analysis.urgency} urgency
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Analysis:</p>
          <p className="text-sm leading-relaxed">{analysis.reasoning}</p>
        </div>

        {analysis.themes.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Key Themes:</p>
            <div className="flex flex-wrap gap-2">
              {analysis.themes.map((theme, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                  {theme}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
