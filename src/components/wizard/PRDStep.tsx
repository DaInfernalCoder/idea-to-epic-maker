
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
  FileText,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PRDStepProps {
  research: string;
  brainstorm: any;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  projectId?: string;
}

export function PRDStep({
  research,
  brainstorm,
  value,
  onChange,
  onNext,
  onBack,
  projectId,
}: PRDStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePRD = async () => {
    setIsGenerating(true);

    try {
      console.log("Calling generate-prd with projectId:", projectId);

      const { data, error } = await supabase.functions.invoke("generate-prd", {
        body: {
          research,
          brainstorm,
          projectId,
        },
      });

      if (error) throw error;

      onChange(data.prd);
      toast({
        title: "PRD Generated",
        description: "Product Requirements Document has been created successfully.",
      });
    } catch (error) {
      console.error("Error generating PRD:", error);
      toast({
        title: "Error",
        description: "Failed to generate PRD. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Product Requirements Document
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Transform your research into a comprehensive PRD that outlines your product's scope, features, and technical specifications.
        </p>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-orange-500" />
            Product Requirements Document
          </CardTitle>
          <CardDescription className="text-gray-400">
            Detailed specifications and requirements for your product
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!value && !isGenerating && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Ready to Create PRD
              </h3>
              <p className="text-gray-400 mb-6">
                Generate a comprehensive Product Requirements Document based on your research and brainstorming.
              </p>
              <Button
                onClick={generatePRD}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Generate PRD
                <FileText className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500 mb-4">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  Creating Product Requirements Document...
                </span>
              </div>
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
              <Skeleton className="h-4 w-1/2 bg-gray-700" />
              <Skeleton className="h-20 w-full bg-gray-700" />
              <Skeleton className="h-4 w-2/3 bg-gray-700" />
            </div>
          )}

          {value && !isGenerating && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-500">
                  ✓ PRD completed
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generatePRD}
                  className="bg-orange-600 border-orange-600 text-white hover:bg-orange-700 hover:border-orange-700"
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
          className="bg-orange-600 border-orange-600 text-white hover:bg-orange-700 hover:border-orange-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Research
        </Button>
        <Button
          onClick={onNext}
          disabled={!value}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2 disabled:opacity-50"
        >
          Continue to Epics
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
