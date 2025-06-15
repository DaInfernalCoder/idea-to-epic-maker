
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, FileText, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PRDStepProps {
  research: string;
  brainstorm: any;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PRDStep({ research, brainstorm, value, onChange, onNext, onBack }: PRDStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prd, setPrd] = useState(value);

  const generatePRD = async () => {
    setIsGenerating(true);
    
    // Simulate API call for now - will be replaced with actual Claude integration
    setTimeout(() => {
      const mockPRD = `# Product Requirements Document (PRD)

## 1. Executive Summary
This document outlines the product requirements for a comprehensive software solution based on the provided specifications and technical research.

## 2. Product Overview
### Vision
To create a scalable, user-friendly application that addresses core user needs while maintaining technical excellence.

### Objectives
- Deliver a minimal viable product (MVP) within 3-6 months
- Ensure scalability for future feature additions
- Maintain high code quality and user experience standards

## 3. Functional Requirements

### 3.1 Core Features
${brainstorm.features ? brainstorm.features.map((feature: string, index: number) => 
  `#### ${index + 1}. ${feature}
**Description**: Implementation of ${feature.toLowerCase()} functionality
**Priority**: ${index < 3 ? 'High' : index < 6 ? 'Medium' : 'Low'}
**Acceptance Criteria**:
- Feature must be fully functional
- Proper error handling implemented
- Unit tests coverage > 80%`
).join('\n\n') : ''}

### 3.2 Technical Requirements
- **Performance**: Page load times < 2 seconds
- **Scalability**: Support for 10,000+ concurrent users
- **Security**: Industry-standard authentication and data protection
- **Accessibility**: WCAG 2.1 AA compliance

## 4. Non-Functional Requirements
- **Reliability**: 99.9% uptime
- **Maintainability**: Modular architecture with clear documentation
- **Usability**: Intuitive interface requiring minimal training

## 5. Technology Stack
${brainstorm.technologies ? brainstorm.technologies.map((tech: string) => `- ${tech}`).join('\n') : 'Technology stack to be determined based on requirements'}

## 6. Success Metrics
- User adoption rate > 70% within first month
- Task completion rate > 85%
- User satisfaction score > 4.5/5

## 7. Constraints and Assumptions
- Development timeline: 3-6 months
- Team size: 2-4 developers
- Budget considerations for infrastructure and tooling

## 8. Future Considerations
- Mobile application development
- Advanced analytics and reporting
- Third-party integrations
- Enterprise features and scaling

This PRD serves as the foundation for development planning and epic creation.`;

      setPrd(mockPRD);
      onChange(mockPRD);
      setIsGenerating(false);
    }, 4000);
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Product Requirements Document
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Transform your research into a comprehensive Product Requirements Document that will guide development.
        </p>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-orange-500" />
            Product Requirements Document
          </CardTitle>
          <CardDescription className="text-gray-400">
            Detailed specifications and requirements for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!prd && !isGenerating && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Ready to Create PRD</h3>
              <p className="text-gray-400 mb-6">
                Generate a comprehensive Product Requirements Document based on your research and brainstorming.
              </p>
              <Button
                onClick={generatePRD}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Generate PRD
                <FileText className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500 mb-4">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Creating comprehensive product requirements...</span>
              </div>
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
              <Skeleton className="h-4 w-1/2 bg-gray-700" />
              <Skeleton className="h-32 w-full bg-gray-700" />
              <Skeleton className="h-4 w-2/3 bg-gray-700" />
            </div>
          )}

          {prd && !isGenerating && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-500">✓ PRD generated successfully</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generatePRD}
                  className="border-gray-600 text-gray-400 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                  {prd}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Research
        </Button>
        <Button
          onClick={handleNext}
          disabled={!prd}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2 disabled:opacity-50"
        >
          Continue to Epics
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
