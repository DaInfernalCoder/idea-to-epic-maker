
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, FileText, RefreshCw, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface PRDStepProps {
  research: string;
  brainstorm: any;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  projectId?: string;
}

export function PRDStep({ research, brainstorm, value, onChange, onNext, onBack, projectId }: PRDStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { isGuest } = useAuth();

  const generatePRD = async () => {
    if (isGuest) {
      toast({
        title: "Feature Limited",
        description: "AI generation is only available for authenticated users. Please sign up or sign in to use this feature.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Calling generate-prd with projectId:', projectId);
      
      const { data, error } = await supabase.functions.invoke('generate-prd', {
        body: {
          research,
          brainstorm,
          projectId
        }
      });

      if (error) throw error;

      onChange(data.prd);
      toast({
        title: "PRD Generated",
        description: "Product Requirements Document has been created successfully.",
      });
    } catch (error) {
      console.error('Error generating PRD:', error);
      toast({
        title: "Error",
        description: "Failed to generate PRD. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Product Requirements Document
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Transform your research into a comprehensive Product Requirements Document that will guide development.
        </p>
      </div>

      {isGuest && (
        <Card className="bg-yellow-900/20 border-yellow-600">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm">
                <strong>Guest Mode:</strong> AI generation features are limited. Sign up for an account to access full functionality and save your progress to the cloud.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-orange-500" />
            Product Requirements Document
          </CardTitle>
          <CardDescription className="text-gray-400">
            Detailed specifications and requirements for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!value && !isGenerating && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Ready to Create PRD</h3>
              <p className="text-gray-400 mb-6">
                Generate a comprehensive Product Requirements Document based on your research and brainstorming.
              </p>
              <Button
                onClick={generatePRD}
                disabled={isGuest}
                className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
              >
                Generate PRD
                <FileText className="w-4 h-4 ml-2" />
              </Button>
              {isGuest && (
                <p className="text-yellow-500 text-sm mt-2">
                  Sign in required for AI generation
                </p>
              )}
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500 mb-4">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Creating comprehensive product requirements...</span>
              </div>
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
              <Skeleton className="h-4 w-1/2 bg-gray-700" />
              <Skeleton className="h-32 w-full bg-gray-700" />
              <Skeleton className="h-4 w-2/3 bg-gray-700" />
            </div>
          )}

          {value && !isGenerating && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-500">✓ PRD generated successfully</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generatePRD}
                  disabled={isGuest}
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
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Research
        </Button>
        <Button
          onClick={handleNext}
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
