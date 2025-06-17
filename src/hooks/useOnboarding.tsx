
import { useState, useEffect } from "react";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  features?: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to PromptFlow",
    description:
      "This app writes prompts for you so you can launch easier. Transform your rough thoughts into development-ready specifications in minutes.",
    icon: "rocket",
    features: [
      "Turn ideas into clear specifications",
      "Generate perfect prompts for AI coding tools",
      "Save weeks of planning time",
      "Get from concept to code faster",
    ],
  },
  {
    id: "requirements",
    title: "Step 1: Requirements",
    description:
      "Start with your rough thoughts and ideas. Don't worry about being perfect …",
    icon: "lightbulb",
    features: [
      "Share your rough ideas and vision",
      "No need for perfect specifications",
      "Describe your target users",
      "Mention any technical preferences",
    ],
  },
  {
    id: "brainstorm",
    title: "Step 2: Brainstorm",
    description:
      "Select the key features that matter most to your project. We&apos;ll help you focus on what&apos;s essential.",
    icon: "brain",
    features: [
      "Choose from curated feature categories",
      "Select relevant technologies",
      "Focus on core functionality",
      "Build a solid foundation",
    ],
  },
  {
    id: "research",
    title: "Step 3: Research",
    description:
      "We do all the technical work for you - researching best practices, architecture patterns, and implementation details.",
    icon: "search",
    features: [
      "Automated technical research",
      "Best practice recommendations",
      "Architecture suggestions",
      "Technology stack analysis",
    ],
  },
  {
    id: "prd",
    title: "Step 4: PRD",
    description:
      "Get a complete Product Requirements Document with all your product&apos;s requirements clearly defined.",
    icon: "file-text",
    features: [
      "Comprehensive product specifications",
      "Clear feature definitions",
      "Technical requirements",
      "User stories and acceptance criteria",
    ],
  },
  {
    id: "epics",
    title: "Step 5: Epics",
    description:
      "Receive development epics that you can copy and paste directly into your AI coding editor like Cursor, Bolt, or Lovable.",
    icon: "code",
    features: [
      "Ready-to-use development tasks",
      "Perfect for AI coding tools",
      "Step-by-step implementation guide",
      "Copy-paste into your editor",
    ],
  },
];

export function useOnboarding() {
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("promptflow-onboarding-completed");

    if (completed === "true") {
      setHasCompletedOnboarding(true);
      setIsOnboardingVisible(false);
    } else {
      const hasVisited = localStorage.getItem("promptflow-has-visited");
      if (!hasVisited) {
        localStorage.setItem("promptflow-has-visited", "true");
        setIsOnboardingVisible(true);
      }
      setHasCompletedOnboarding(false);
    }

    setIsInitialized(true);
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
    localStorage.setItem("promptflow-onboarding-completed", "true");
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
    setIsOnboardingVisible,
    isInitialized,
  };
}
