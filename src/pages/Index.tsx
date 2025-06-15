
import { useState } from 'react';
import { WizardStepper } from '@/components/wizard/WizardStepper';
import { RequirementsStep } from '@/components/wizard/RequirementsStep';
import { BrainstormStep } from '@/components/wizard/BrainstormStep';
import { ResearchStep } from '@/components/wizard/ResearchStep';
import { PRDStep } from '@/components/wizard/PRDStep';
import { EpicsStep } from '@/components/wizard/EpicsStep';
import { CompletionStep } from '@/components/wizard/CompletionStep';
import { AuthPage } from '@/components/auth/AuthPage';
import { useAuth } from '@/hooks/useAuth';
import { useProject } from '@/hooks/useProject';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { projectId, projectData, isLoading, updateProjectData, createNewProject } = useProject();
  const [currentStep, setCurrentStep] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-orange-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const steps = [
    { title: 'Requirements', description: 'Define your project idea' },
    { title: 'Brainstorm', description: 'Select key features' },
    { title: 'Research', description: 'Technical analysis' },
    { title: 'PRD', description: 'Product requirements' },
    { title: 'Epics', description: 'Development tasks' },
    { title: 'Complete', description: 'Ready to build' }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <RequirementsStep
            value={projectData.requirements}
            onChange={(value) => updateProjectData('requirements', value)}
            onNext={() => setCurrentStep(1)}
          />
        );
      case 1:
        return (
          <BrainstormStep
            value={projectData.brainstorm}
            onChange={(value) => updateProjectData('brainstorm', value)}
            onNext={() => setCurrentStep(2)}
            onBack={() => setCurrentStep(0)}
          />
        );
      case 2:
        return (
          <ResearchStep
            requirements={projectData.requirements}
            brainstorm={projectData.brainstorm}
            value={projectData.research}
            onChange={(value) => updateProjectData('research', value)}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            projectId={projectId}
          />
        );
      case 3:
        return (
          <PRDStep
            research={projectData.research}
            brainstorm={projectData.brainstorm}
            value={projectData.prd}
            onChange={(value) => updateProjectData('prd', value)}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
            projectId={projectId}
          />
        );
      case 4:
        return (
          <EpicsStep
            prd={projectData.prd}
            research={projectData.research}
            brainstorm={projectData.brainstorm}
            value={projectData.epics}
            onChange={(value) => updateProjectData('epics', value)}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
            projectId={projectId}
          />
        );
      case 5:
        return (
          <CompletionStep
            epics={projectData.epics}
            onRestart={async () => {
              setCurrentStep(0);
              await createNewProject();
            }}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-orange-500">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center">
                <span className="text-sm font-bold text-white">PF</span>
              </div>
              <h1 className="text-xl font-semibold">PromptFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Project: {projectId.slice(0, 8)}...
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="border-gray-600 text-gray-400 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <WizardStepper steps={steps} currentStep={currentStep} />
        </div>
        
        <div className="animate-fade-in">
          {renderStep()}
        </div>
      </main>
    </div>
  );
};

export default Index;
