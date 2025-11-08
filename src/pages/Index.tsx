import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Users, AlertCircle } from "lucide-react";
import SentimentChart from "@/components/SentimentChart";
import FeedbackCard from "@/components/FeedbackCard";

interface Analysis {
  sentiment: "positive" | "neutral" | "negative";
  confidence: number;
  reasoning: string;
  themes: string[];
  urgency: "low" | "medium" | "high";
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
        description: `Sentiment: ${data.sentiment} (${Math.round(data.confidence * 100)}% confidence)`,
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

  const sentimentDistribution = results.reduce((acc, item) => {
    acc[item.analysis.sentiment] = (acc[item.analysis.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6 shadow-lg">
            <TrendingUp className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Stakeholder Sentiment Analyzer
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            AI-powered analysis of stakeholder feedback and requirement validation
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-lg border-0" style={{ boxShadow: 'var(--shadow-card)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Input Feedback
              </CardTitle>
              <CardDescription>
                Enter stakeholder feedback or requirements for sentiment analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Stakeholder Type</label>
                <Select value={stakeholderType} onValueChange={setStakeholderType}>
                  <SelectTrigger>
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

              <div>
                <label className="text-sm font-medium mb-2 block">Feedback / Requirements</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter stakeholder feedback, requirements, or validation comments..."
                  className="min-h-[200px] resize-none"
                />
              </div>

              <Button 
                onClick={analyzeFeedback} 
                disabled={isAnalyzing || !feedback.trim()}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Sentiment"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0" style={{ boxShadow: 'var(--shadow-card)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Sentiment Distribution
              </CardTitle>
              <CardDescription>
                Overall sentiment breakdown of analyzed feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <SentimentChart distribution={sentimentDistribution} />
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <TrendingUp className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-center">No analysis yet.<br />Start by analyzing some feedback.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Analysis Results</h2>
              <Badge variant="secondary" className="text-sm">
                {results.length} {results.length === 1 ? 'analysis' : 'analyses'}
              </Badge>
            </div>
            <div className="grid gap-6">
              {results.map((result) => (
                <FeedbackCard
                  key={result.id}
                  feedback={result.feedback}
                  stakeholderType={result.stakeholderType}
                  analysis={result.analysis}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
