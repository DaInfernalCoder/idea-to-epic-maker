
import { useState, useEffect } from 'react';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image: string;
  features?: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to PromptFlow',
    description: 'Transform your ideas into detailed MVP plans with AI-powered planning that reduces development time by 90%.',
    image: 'photo-1486312338219-ce68d2c6f44d',
    features: [
      'AI-powered requirements analysis',
      'Automated technical research',
      'Complete PRD generation',
      'Development epics breakdown'
    ]
  },
  {
    id: 'better-prompts',
    title: 'Better Prompts = Better Code',
    description: 'Get crystal-clear requirements and technical specifications that work perfectly with Lovable, Cursor, and Bolt.',
    image: 'photo-1461749280684-dccba630e2f6',
    features: [
      'Detailed feature specifications',
      'Technical implementation guides',
      'Component-level breakdowns',
      'API and database schemas'
    ]
  },
  {
    id: 'workflow',
    title: 'Your 5-Step Workflow',
    description: 'From idea to development-ready epics in minutes, not days.',
    image: 'photo-1649972904349-6e44c42644a7',
    features: [
      'Requirements: Define your vision',
      'Brainstorm: Select key features',
      'Research: Technical analysis',
      'PRD: Product requirements',
      'Epics: Development tasks'
    ]
  },
  {
    id: 'time-savings',
    title: '90% Time Reduction',
    description: 'Skip weeks of planning and get straight to building with AI-generated specifications.',
    image: 'photo-1581091226825-a6a2a5aee158',
    features: [
      'Hours instead of weeks for planning',
      'No more unclear requirements',
      'Ready-to-use prompts for AI tools',
      'Consistent development workflow'
    ]
  }
];

export function useOnboarding() {
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('promptflow-onboarding-completed');
    if (!completed) {
      setIsOnboardingVisible(true);
    } else {
      setHasCompletedOnboarding(true);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('promptflow-onboarding-completed', 'true');
    setIsOnboardingVisible(false);
    setHasCompletedOnboarding(true);
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const restartOnboarding = () => {
    setCurrentStep(0);
    setIsOnboardingVisible(true);
    setHasCompletedOnboarding(false);
  };

  return {
    isOnboardingVisible,
    currentStep,
    hasCompletedOnboarding,
    onboardingSteps,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
    restartOnboarding,
    setIsOnboardingVisible
  };
}
