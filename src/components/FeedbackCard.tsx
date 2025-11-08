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
    <Card className="shadow-elevated hover:shadow-hover transition-all duration-300 border-primary/10 bg-gradient-card backdrop-blur-sm group">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-primary rounded-full"></div>
              <User className="w-5 h-5 text-primary" />
              <span className="text-base font-semibold capitalize">
                {stakeholderType.replace('-', ' ')}
              </span>
            </div>
            <CardTitle className="text-lg font-normal text-foreground leading-relaxed pl-3 border-l-2 border-muted">
              "{feedback}"
            </CardTitle>
          </div>
          <Badge className={`${getSentimentColor()} flex items-center gap-2 px-4 py-2 text-base group-hover:scale-110 transition-transform duration-300`}>
            {getSentimentIcon()}
            <span className="capitalize font-semibold">{analysis.sentiment}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-px bg-gradient-primary opacity-20"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Confidence</span>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${analysis.confidence * 100}%` }}
                />
              </div>
              <span className="font-bold text-base min-w-[3rem] text-right">{Math.round(analysis.confidence * 100)}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Urgency Level</span>
            <Badge variant="outline" className={`${getUrgencyColor()} border-2 px-4 py-2 text-base`}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              {analysis.urgency} urgency
            </Badge>
          </div>
        </div>

        <div className="h-px bg-gradient-primary opacity-20"></div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Analysis Reasoning</p>
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <p className="text-sm leading-relaxed">{analysis.reasoning}</p>
          </div>
        </div>

        {analysis.themes.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Key Themes</p>
            <div className="flex flex-wrap gap-2">
              {analysis.themes.map((theme, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="px-3 py-1.5 hover:bg-primary/20 transition-colors cursor-default"
                >
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
