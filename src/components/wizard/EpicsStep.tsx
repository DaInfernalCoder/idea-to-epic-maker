import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  ArrowLeft,
  Layout,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface EpicsStepProps {
  prd: string;
  research: string;
  brainstorm: any;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  projectId?: string;
}

export function EpicsStep({
  prd,
  research,
  brainstorm,
  value,
  onChange,
  onNext,
  onBack,
  projectId,
}: EpicsStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { isGuest } = useAuth();

  const generateEpics = async () => {
    setIsGenerating(true);

    try {
      console.log("Calling generate-epics with full context and projectId:", {
        hasPrd: !!prd,
        hasResearch: !!research,
        hasBrainstorm: !!brainstorm,
        projectId,
      });

      const { data, error } = await supabase.functions.invoke(
        "generate-epics",
        {
          body: {
            prd,
            research,
            brainstorm,
            projectId,
          },
        }
      );

      if (error) throw error;

      onChange(data.epics);
      toast({
        title: "Epics Generated",
        description:
          "Development epics and tickets have been created with full context from research and brainstorming.",
      });
    } catch (error) {
      console.error("Error generating epics:", error);
      toast({
        title: "Error",
        description: "Failed to generate epics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const countTickets = (epicsText: string) => {
    const ticketMatches = epicsText.match(/^\d+\.\s\*\*/gm);
    return ticketMatches ? ticketMatches.length : 0;
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Development Epics & Tickets
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Break down your PRD into actionable development epics and detailed
          tickets using insights from technical research and brainstorming.
        </p>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Layout className="w-5 h-5 text-orange-500" />
            Development Plan
          </CardTitle>
          <CardDescription className="text-gray-400">
            Organized epics and tickets for agile development with technical
            research insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!value && !isGenerating && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layout className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Ready to Plan Development
              </h3>
              <p className="text-gray-400 mb-6">
                Transform your PRD into organized epics and actionable
                development tickets using insights from technical research and
                brainstorming.
              </p>
              <Button
                onClick={generateEpics}
                disabled={!prd || !research}
                className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
              >
                Generate Development Plan
                <Layout className="w-4 h-4 ml-2" />
              </Button>
              {(!prd || !research) && (
                <p className="text-yellow-500 text-sm mt-2">
                  Need PRD and research to generate comprehensive epics
                </p>
              )}
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500 mb-4">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  Creating development epics with research insights and
                  brainstorming context...
                </span>
              </div>
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
              <Skeleton className="h-4 w-1/2 bg-gray-700" />
              <Skeleton className="h-40 w-full bg-gray-700" />
              <Skeleton className="h-4 w-2/3 bg-gray-700" />
            </div>
          )}

          {value && !isGenerating && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-500">
                  ✓ Generated {countTickets(value)} development tickets with
                  research context
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateEpics}
                  disabled={!prd || !research || isGuest}
                  className="border-gray-600 text-gray-400 hover:text-white disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                  {value}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-gray-600 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PRD
        </Button>
        <Button
          onClick={handleNext}
          disabled={!value}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2 disabled:opacity-50"
        >
          Complete Project
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
