import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Lightbulb, Search, Code, ArrowRight } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";

export function OnboardingTrigger() {
  const { restartOnboarding, hasCompletedOnboarding } = useOnboarding();

  // Only show for users who have completed onboarding (so they can retake the tour)
  if (!hasCompletedOnboarding) {
    return null;
  }

  const handleTakeTour = () => {
    restartOnboarding();
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">
                Write Better Prompts, Launch Faster
              </CardTitle>
              <CardDescription className="text-gray-300">
                Transform rough thoughts into development-ready specifications
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTakeTour}
            className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Take Tour
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Lightbulb className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-sm font-medium text-white">
                Start with Ideas
              </div>
              <div className="text-xs text-gray-300">
                Rough thoughts → Clear specs
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-sm font-medium text-white">AI Research</div>
              <div className="text-xs text-gray-300">
                Technical work done for you
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Code className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium text-white">
                Ready Prompts
              </div>
              <div className="text-xs text-gray-300">
                Copy-paste into your editor
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
