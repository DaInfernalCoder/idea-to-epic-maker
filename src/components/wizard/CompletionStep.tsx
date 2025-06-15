
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, RotateCcw, Rocket } from 'lucide-react';

interface CompletionStepProps {
  epics: string;
  onRestart: () => void;
}

export function CompletionStep({ epics, onRestart }: CompletionStepProps) {
  const countTickets = (epicsText: string) => {
    const ticketMatches = epicsText.match(/^\d+\.\s\*\*/gm);
    return ticketMatches ? ticketMatches.length : 0;
  };

  const downloadContent = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ticketCount = countTickets(epics);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          Project Plan Complete!
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Your comprehensive project plan is ready. You now have everything needed to start building your software project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-900/20 border-green-700">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-green-400">Ready to Build</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-400">
              Your project plan includes requirements, research, PRD, and development tickets.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-900/20 border-orange-700">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl font-bold text-white">{ticketCount}</span>
            </div>
            <CardTitle className="text-orange-400">Development Tickets</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-400">
              Organized into actionable epics with detailed acceptance criteria.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/20 border-blue-700">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Download className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-blue-400">Export Ready</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-400">
              Download your complete project documentation in Markdown format.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Next Steps</CardTitle>
          <CardDescription className="text-gray-400">
            Recommendations for moving forward with your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-white">1. Set Up Development Environment</h4>
              <p className="text-sm text-gray-400">Initialize your project repository and configure your development tools based on the technology recommendations.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-white">2. Start with Foundation Epic</h4>
              <p className="text-sm text-gray-400">Begin with the infrastructure and setup tickets to establish a solid foundation for development.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-white">3. Iterate and Refine</h4>
              <p className="text-sm text-gray-400">Use the PRD as a living document and adjust tickets based on learnings during development.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-white">4. Regular Reviews</h4>
              <p className="text-sm text-gray-400">Schedule regular reviews to assess progress and adapt the plan based on user feedback.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => downloadContent(epics, 'development-plan.md')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Development Plan
        </Button>
        <Button
          variant="outline"
          onClick={onRestart}
          className="border-gray-600 text-gray-400 hover:text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start New Project
        </Button>
      </div>
    </div>
  );
}
