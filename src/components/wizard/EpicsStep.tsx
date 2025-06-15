
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Layout, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface EpicsStepProps {
  prd: string;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EpicsStep({ prd, value, onChange, onNext, onBack }: EpicsStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [epics, setEpics] = useState(value);

  const generateEpics = async () => {
    setIsGenerating(true);
    
    // Simulate API call for now - will be replaced with actual Claude integration
    setTimeout(() => {
      const mockEpics = `# Development Epics & Tickets

## Epic 1: Foundation & Setup
**Goal**: Establish the core project infrastructure and development environment

### Tickets:
1. **Setup Development Environment**
   - Initialize project repository with chosen tech stack
   - Configure build tools and development scripts
   - Set up code quality tools (ESLint, Prettier, etc.)
   - **Acceptance Criteria**: Development environment runs locally without errors
   - **Estimate**: 2 days

2. **Database Schema Design**
   - Design initial database schema
   - Set up database migrations
   - Create seed data for development
   - **Acceptance Criteria**: Database can be set up and seeded consistently
   - **Estimate**: 3 days

3. **Basic Authentication System**
   - Implement user registration and login
   - Set up JWT token management
   - Create protected route middleware
   - **Acceptance Criteria**: Users can register, login, and access protected routes
   - **Estimate**: 5 days

## Epic 2: Core Features Implementation
**Goal**: Implement the primary features identified in requirements

### Tickets:
1. **User Dashboard**
   - Create main user interface layout
   - Implement navigation and routing
   - Add responsive design framework
   - **Acceptance Criteria**: Users can navigate the application on desktop and mobile
   - **Estimate**: 4 days

2. **Data Management System**
   - Implement CRUD operations for main entities
   - Create API endpoints with proper validation
   - Add error handling and logging
   - **Acceptance Criteria**: Users can create, read, update, and delete data
   - **Estimate**: 6 days

3. **Search and Filtering**
   - Add search functionality
   - Implement filtering and sorting options
   - Create pagination for large datasets
   - **Acceptance Criteria**: Users can efficiently find and filter data
   - **Estimate**: 4 days

## Epic 3: User Experience Enhancement
**Goal**: Polish the user interface and add advanced features

### Tickets:
1. **Real-time Updates**
   - Implement WebSocket connections
   - Add real-time notifications
   - Handle connection state management
   - **Acceptance Criteria**: Users see updates in real-time without page refresh
   - **Estimate**: 5 days

2. **File Upload System**
   - Create file upload component
   - Implement file validation and storage
   - Add progress indicators
   - **Acceptance Criteria**: Users can upload files with visual feedback
   - **Estimate**: 3 days

3. **Mobile Optimization**
   - Optimize mobile responsiveness
   - Add touch-friendly interactions
   - Test across different devices
   - **Acceptance Criteria**: Application works smoothly on mobile devices
   - **Estimate**: 3 days

## Epic 4: Testing & Deployment
**Goal**: Ensure quality and prepare for production deployment

### Tickets:
1. **Unit Test Coverage**
   - Write unit tests for core functions
   - Set up automated testing pipeline
   - Achieve >80% code coverage
   - **Acceptance Criteria**: All critical paths have test coverage
   - **Estimate**: 4 days

2. **Integration Testing**
   - Create end-to-end test scenarios
   - Test API integrations
   - Validate user workflows
   - **Acceptance Criteria**: Critical user journeys work as expected
   - **Estimate**: 3 days

3. **Production Deployment**
   - Set up production environment
   - Configure CI/CD pipeline
   - Implement monitoring and logging
   - **Acceptance Criteria**: Application deployed and accessible in production
   - **Estimate**: 2 days

## Summary
- **Total Epics**: 4
- **Total Tickets**: 12
- **Estimated Timeline**: 8-12 weeks
- **Key Milestones**: Foundation (Week 2), Core Features (Week 6), Enhancement (Week 9), Deployment (Week 12)

Each ticket includes detailed acceptance criteria and should be reviewed and estimated by the development team before implementation.`;

      setEpics(mockEpics);
      onChange(mockEpics);
      setIsGenerating(false);
    }, 4000);
  };

  const countTickets = (epicsText: string) => {
    const ticketMatches = epicsText.match(/^\d+\.\s\*\*/gm);
    return ticketMatches ? ticketMatches.length : 0;
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Development Epics & Tickets
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Break down your PRD into actionable development epics and detailed tickets ready for implementation.
        </p>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Layout className="w-5 h-5 text-orange-500" />
            Development Plan
          </CardTitle>
          <CardDescription className="text-gray-400">
            Organized epics and tickets for agile development
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!epics && !isGenerating && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layout className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Ready to Plan Development</h3>
              <p className="text-gray-400 mb-6">
                Transform your PRD into organized epics and actionable development tickets.
              </p>
              <Button
                onClick={generateEpics}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Generate Development Plan
                <Layout className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500 mb-4">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Creating development epics and tickets...</span>
              </div>
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
              <Skeleton className="h-4 w-1/2 bg-gray-700" />
              <Skeleton className="h-40 w-full bg-gray-700" />
              <Skeleton className="h-4 w-2/3 bg-gray-700" />
            </div>
          )}

          {epics && !isGenerating && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-500">
                  ✓ Generated {countTickets(epics)} development tickets
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateEpics}
                  className="border-gray-600 text-gray-400 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                  {epics}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PRD
        </Button>
        <Button
          onClick={handleNext}
          disabled={!epics}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2 disabled:opacity-50"
        >
          Complete Project
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
