
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, Zap, Clock, Target } from 'lucide-react';
import { useOnboarding, OnboardingStep } from '@/hooks/useOnboarding';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const {
    currentStep,
    onboardingSteps,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding
  } = useOnboarding();

  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
      onClose();
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    skipOnboarding();
    onClose();
  };

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'welcome':
        return <Target className="w-5 h-5" />;
      case 'better-prompts':
        return <Zap className="w-5 h-5" />;
      case 'workflow':
        return <CheckCircle className="w-5 h-5" />;
      case 'time-savings':
        return <Clock className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-orange-500">
              Get Started with PromptFlow
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-400 hover:text-white"
            >
              Skip tour
            </Button>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-6">
          {/* Left side - Image */}
          <div className="relative rounded-lg overflow-hidden bg-gray-800">
            <img
              src={`https://images.unsplash.com/${step.image}?w=500&h=300&fit=crop`}
              alt={step.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-orange-600 text-white">
                {getStepIcon(step.id)}
                <span className="ml-2">{step.title}</span>
              </Badge>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {step.description}
              </p>
            </div>

            {step.features && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-orange-500 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {step.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {step.id === 'time-savings' && (
              <Card className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-1">90%</div>
                  <div className="text-sm text-gray-300">Development Time Saved</div>
                  <div className="text-xs text-gray-400 mt-1">
                    From weeks of planning to hours of execution
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="border-gray-600 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLastStep ? 'Start Building' : 'Next'}
            {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
