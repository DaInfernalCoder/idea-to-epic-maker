
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lightbulb } from 'lucide-react';

interface RequirementsStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export function RequirementsStep({ value, onChange, onNext }: RequirementsStepProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleNext = () => {
    onChange(localValue);
    onNext();
  };

  const exampleIdeas = [
    "A task management app for small teams with real-time collaboration",
    "An AI-powered personal finance tracker with budget recommendations",
    "A marketplace for local services with booking and payment integration",
    "A social platform for fitness enthusiasts to share workouts and progress"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          What problem are you solving?
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Describe your project idea in detail. The more context you provide, the better we can help you build a comprehensive plan.
        </p>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lightbulb className="w-5 h-5 text-orange-500" />
            Project Requirements
          </CardTitle>
          <CardDescription className="text-gray-400">
            Describe your vision, target users, core features, and any technical preferences (minimum 50 characters)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: I want to build a task management application that helps small teams collaborate more effectively. The app should include real-time updates, file sharing, deadline tracking, and integration with popular tools like Slack and Google Calendar. Target users are small businesses with 5-20 employees who need better project visibility..."
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className="min-h-[200px] bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
            maxLength={4000}
          />
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{localValue.length}/4000 characters</span>
            <span className={localValue.length >= 50 ? "text-green-500" : "text-yellow-500"}>
              {localValue.length >= 50 ? "✓ Ready to proceed" : "Need at least 50 characters"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Need inspiration?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleIdeas.map((idea, index) => (
              <button
                key={index}
                onClick={() => setLocalValue(idea)}
                className="text-left p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-orange-500 rounded-lg transition-all duration-200 text-sm text-gray-300 hover:text-white"
              >
                {idea}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={localValue.length < 50}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2"
        >
          Continue to Brainstorm
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
