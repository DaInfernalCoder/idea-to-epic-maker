
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Search, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ResearchStepProps {
  requirements: string;
  brainstorm: any;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ResearchStep({ requirements, brainstorm, value, onChange, onNext, onBack }: ResearchStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [research, setResearch] = useState(value);

  const generateResearch = async () => {
    setIsGenerating(true);
    
    // Simulate API call for now - will be replaced with actual Perplexity integration
    setTimeout(() => {
      const mockResearch = `# Technical Research Report

## Project Analysis
Based on your requirements for "${requirements.slice(0, 100)}...", we've identified key technical considerations and recommendations.

## Technology Stack Recommendations

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and developer experience
- **Styling**: Tailwind CSS for rapid, consistent UI development
- **State Management**: Zustand or Redux Toolkit for complex state needs

### Backend Considerations
- **API Design**: RESTful APIs with OpenAPI documentation
- **Database**: PostgreSQL for relational data, Redis for caching
- **Authentication**: JWT tokens with refresh token rotation

## Key Features Analysis
${brainstorm.features ? brainstorm.features.map((feature: string) => `- **${feature}**: Industry standard implementations available`).join('\n') : ''}

## Implementation Complexity
- **Timeline Estimate**: 3-6 months for MVP
- **Team Size**: 2-4 developers recommended
- **Key Risks**: ${brainstorm.features?.length > 10 ? 'Feature scope may be too broad for initial release' : 'Manageable scope for initial implementation'}

## Best Practices
1. Start with core features and iterate
2. Implement robust error handling and logging
3. Plan for scalability from day one
4. Consider progressive web app capabilities

## Technology Alternatives
${brainstorm.technologies ? brainstorm.technologies.map((tech: string) => `- ${tech}: Suitable for the proposed architecture`).join('\n') : ''}

This research provides a foundation for creating detailed product requirements and development planning.`;

      setResearch(mockResearch);
      onChange(mockResearch);
      setIsGenerating(false);
    }, 3000);
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Technical Research
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Our AI will analyze your requirements and brainstorming selections to provide comprehensive technical research and recommendations.
        </p>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="w-5 h-5 text-orange-500" />
            Research Report
          </CardTitle>
          <CardDescription className="text-gray-400">
            Deep technical analysis of your project requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!research && !isGenerating && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Ready to Research</h3>
              <p className="text-gray-400 mb-6">
                Click below to generate comprehensive technical research based on your requirements and brainstorming selections.
              </p>
              <Button
                onClick={generateResearch}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Generate Research Report
                <Search className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500 mb-4">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analyzing requirements and generating research...</span>
              </div>
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
              <Skeleton className="h-4 w-1/2 bg-gray-700" />
              <Skeleton className="h-20 w-full bg-gray-700" />
              <Skeleton className="h-4 w-2/3 bg-gray-700" />
            </div>
          )}

          {research && !isGenerating && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-500">✓ Research completed</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateResearch}
                  className="border-gray-600 text-gray-400 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                  {research}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Brainstorm
        </Button>
        <Button
          onClick={handleNext}
          disabled={!research}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2 disabled:opacity-50"
        >
          Continue to PRD
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
