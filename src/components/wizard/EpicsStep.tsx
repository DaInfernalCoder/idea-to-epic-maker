
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
  CheckSquare,
  RefreshCw,
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

const GUEST_RATE_LIMIT = 8; // 8 regenerations per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

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

  const checkGuestRateLimit = (): boolean => {
    if (!isGuest) return true;

    const rateLimitKey = 'promptflow_guest_regenerations';
    const now = Date.now();
    
    // Get existing regeneration timestamps
    const storedData = localStorage.getItem(rateLimitKey);
    let regenerations: number[] = [];
    
    if (storedData) {
      try {
        regenerations = JSON.parse(storedData);
      } catch (e) {
        regenerations = [];
      }
    }
    
    // Filter out regenerations older than 1 hour
    regenerations = regenerations.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
    
    // Check if we've exceeded the limit
    if (regenerations.length >= GUEST_RATE_LIMIT) {
      const oldestRegeneration = Math.min(...regenerations);
      const timeUntilReset = Math.ceil((RATE_LIMIT_WINDOW - (now - oldestRegeneration)) / (60 * 1000));
      
      toast({
        title: "Rate Limit Reached",
        description: `Guest users can make ${GUEST_RATE_LIMIT} regenerations per hour. Try again in ${timeUntilReset} minutes.`,
        variant: "destructive",
      });
      return false;
    }
    
    // Add current timestamp and save
    regenerations.push(now);
    localStorage.setItem(rateLimitKey, JSON.stringify(regenerations));
    
    return true;
  };

  const generateEpics = async () => {
    if (!checkGuestRateLimit()) return;
    
    setIsGenerating(true);

    try {
      console.log("Calling generate-epics with projectId:", projectId);

      const { data, error } = await supabase.functions.invoke("generate-epics", {
        body: {
          prd,
          research,
          brainstorm,
          projectId,
        },
      });

      if (error) throw error;

      onChange(data.epics);
      toast({
        title: "Epics Generated",
        description: "Development epics have been created successfully.",
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

  const getRemainingRegenerations = (): number => {
    if (!isGuest) return -1; // Unlimited for authenticated users
    
    const rateLimitKey = 'promptflow_guest_regenerations';
    const now = Date.now();
    
    const storedData = localStorage.getItem(rateLimitKey);
    let regenerations: number[] = [];
    
    if (storedData) {
      try {
        regenerations = JSON.parse(storedData);
      } catch (e) {
        regenerations = [];
      }
    }
    
    // Filter out regenerations older than 1 hour
    regenerations = regenerations.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
    
    return Math.max(0, GUEST_RATE_LIMIT - regenerations.length);
  };

  const remainingRegenerations = getRemainingRegenerations();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Development Epics
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Break down your PRD into actionable development epics that can guide your implementation process.
        </p>
        {isGuest && (
          <p className="text-sm text-orange-400">
            Guest mode: {remainingRegenerations} regenerations remaining this hour
          </p>
        )}
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <CheckSquare className="w-5 h-5 text-orange-500" />
            Development Epics
          </CardTitle>
          <CardDescription className="text-gray-400">
            Structured development tasks and milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!value && !isGenerating && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Ready to Create Epics
              </h3>
              <p className="text-gray-400 mb-6">
                Generate development epics and tasks based on your PRD and research.
              </p>
              <Button
                onClick={generateEpics}
                className="bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isGuest && remainingRegenerations === 0}
              >
                Generate Development Epics
                <CheckSquare className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500 mb-4">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  Creating development epics and tasks...
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
                  ✓ Epics completed
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateEpics}
                  disabled={isGuest && remainingRegenerations === 0}
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
          onClick={onNext}
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
