
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  description: string;
}

interface WizardStepperProps {
  steps: Step[];
  currentStep: number;
}

export function WizardStepper({ steps, currentStep }: WizardStepperProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center relative z-10 transition-all duration-300",
                  index < currentStep
                    ? "bg-orange-600 border-orange-600 text-white"
                    : index === currentStep
                    ? "bg-orange-600 border-orange-600 text-white animate-pulse"
                    : "border-gray-600 bg-gray-800 text-gray-400"
                )}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    index <= currentStep ? "text-white" : "text-gray-400"
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors duration-300 relative top-[-20px]",
                  index < currentStep ? "bg-orange-600" : "bg-gray-600"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
