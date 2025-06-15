
import { useState, useEffect } from 'react';
import { WizardStepper } from '@/components/wizard/WizardStepper';
import { RequirementsStep } from '@/components/wizard/RequirementsStep';
import { BrainstormStep } from '@/components/wizard/BrainstormStep';
import { ResearchStep } from '@/components/wizard/ResearchStep';
import { PRDStep } from '@/components/wizard/PRDStep';
import { EpicsStep } from '@/components/wizard/EpicsStep';
import { CompletionStep } from '@/components/wizard/CompletionStep';
import { generateProjectId } from '@/lib/utils';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectId, setProjectId] = useState<string>('');
  const [projectData, setProjectData] = useState({
    requirements: '',
    brainstorm: {},
    research: '',
    prd: '',
    epics: ''
  });

  useEffect(() => {
    // Get or create project ID
    let storedProjectId = localStorage.getItem('promptflow_project_id');
    if (!storedProjectId) {
      storedProjectId = generateProjectId();
      localStorage.setItem('promptflow_project_id', storedProjectId);
    }
    setProjectId(storedProjectId);

    // Load existing project data
    const storedData = localStorage.getItem(`promptflow_data_${storedProjectId}`);
    if (storedData) {
      setProjectData(JSON.parse(storedData));
    }
  }, []);

  const updateProjectData = (step: string, data: any) => {
    const newData = { ...projectData, [step]: data };
    setProjectData(newData);
    localStorage.setItem(`promptflow_data_${projectId}`, JSON.stringify(newData));
  };

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
          />
        );
      case 4:
        return (
          <EpicsStep
            prd={projectData.prd}
            value={projectData.epics}
            onChange={(value) => updateProjectData('epics', value)}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        );
      case 5:
        return (
          <CompletionStep
            epics={projectData.epics}
            onRestart={() => {
              setCurrentStep(0);
              const newProjectId = generateProjectId();
              setProjectId(newProjectId);
              localStorage.setItem('promptflow_project_id', newProjectId);
              setProjectData({
                requirements: '',
                brainstorm: {},
                research: '',
                prd: '',
                epics: ''
              });
            }}
          />
        );
      default:
        return null;
    }
  };

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
            <div className="text-sm text-gray-400">
              Project: {projectId.slice(0, 8)}...
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
