
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Zap, Clock, Target, ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';

export function OnboardingTrigger() {
  const { restartOnboarding, hasCompletedOnboarding } = useOnboarding();

  // Only show for users who have completed onboarding (so they can retake the tour)
  if (!hasCompletedOnboarding) {
    return null;
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Ready to Save 90% Development Time?</CardTitle>
              <CardDescription className="text-gray-300">
                Transform your ideas into detailed MVP plans with AI-powered specifications
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={restartOnboarding}
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
            <Zap className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-sm font-medium text-white">Better Prompts</div>
              <div className="text-xs text-gray-300">For Lovable, Cursor & Bolt</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-sm font-medium text-white">90% Time Saved</div>
              <div className="text-xs text-gray-300">Hours instead of weeks</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium text-white">Clear Specs</div>
              <div className="text-xs text-gray-300">Ready-to-build epics</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
