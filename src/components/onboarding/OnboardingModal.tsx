
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Rocket,
  Lightbulb,
  Brain,
  Search,
  FileText,
  Code,
  User,
} from "lucide-react";
import { useOnboarding, OnboardingStep } from "@/hooks/useOnboarding";
import { ProfileStep } from "./ProfileStep";

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
    skipOnboarding,
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

  const getStepIcon = (iconName: string) => {
    const iconProps = { className: "w-8 h-8" };
    switch (iconName) {
      case "rocket":
        return <Rocket {...iconProps} />;
      case "user":
        return <User {...iconProps} />;
      case "lightbulb":
        return <Lightbulb {...iconProps} />;
      case "brain":
        return <Brain {...iconProps} />;
      case "search":
        return <Search {...iconProps} />;
      case "file-text":
        return <FileText {...iconProps} />;
      case "code":
        return <Code {...iconProps} />;
      default:
        return <Rocket {...iconProps} />;
    }
  };

  // Handle profile step specially
  if (step.id === "profile") {
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
                <span>
                  Step {currentStep + 1} of {onboardingSteps.length}
                </span>
                <span>{Math.round(progress)}% complete</span>
              </div>
            </div>
          </DialogHeader>

          <div className="py-6">
            <ProfileStep onNext={nextStep} onBack={prevStep} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
              <span>
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">
          {/* Main Content */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-orange-500">{getStepIcon(step.icon)}</div>
            </div>
            <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
              {step.description}
            </p>
          </div>

          {step.features && (
            <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {step.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-300"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Special message for the final step */}
          {step.id === "epics" && (
            <div className="mt-6 text-center">
              <Badge className="bg-orange-600 text-white px-4 py-2">
                Ready to launch your project faster than ever!
              </Badge>
            </div>
          )}
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
                  index <= currentStep ? "bg-orange-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLastStep ? "Start Building" : "Next"}
            {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
