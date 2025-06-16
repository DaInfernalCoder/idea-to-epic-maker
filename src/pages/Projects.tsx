
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthPage } from '@/components/auth/AuthPage';

interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  docs_data: Record<string, any>;
}

const Projects = () => {
  const { user, loading, isGuest } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [user, isGuest]);

  const loadProjects = async () => {
    setIsLoading(true);
    
    if (isGuest) {
      // For guest users, load from localStorage
      const guestProjects: Project[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('promptflow_data_')) {
          const projectId = key.replace('promptflow_data_', '');
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const projectData = JSON.parse(data);
              guestProjects.push({
                id: projectId,
                name: `Project ${projectId.slice(0, 8)}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user_id: 'guest',
                docs_data: projectData
              });
            } catch (e) {
              console.error('Error parsing project data:', e);
            }
          }
        }
      }
      setProjects(guestProjects);
    } else if (user) {
      // For authenticated users, load from Supabase
      try {
        const { data, error } = await supabase
          .from('project')
          .select(`
            id,
            name,
            created_at,
            updated_at,
            user_id,
            doc!inner(step, content)
          `)
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        // Transform the data to group docs by project
        const projectMap = new Map<string, Project>();
        
        (data || []).forEach((item: any) => {
          if (!projectMap.has(item.id)) {
            projectMap.set(item.id, {
              id: item.id,
              name: item.name,
              created_at: item.created_at,
              updated_at: item.updated_at,
              user_id: item.user_id,
              docs_data: {}
            });
          }
          
          const project = projectMap.get(item.id)!;
          if (item.doc) {
            item.doc.forEach((doc: any) => {
              project.docs_data[doc.step] = doc.content;
            });
          }
        });

        setProjects(Array.from(projectMap.values()));
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }
    
    setIsLoading(false);
  };

  const getProjectProgress = (project: Project) => {
    const steps = ['requirements', 'brainstorm', 'research', 'prd', 'epics'];
    const completedSteps = steps.filter(step => 
      project.docs_data[step] && 
      (typeof project.docs_data[step] === 'string' ? project.docs_data[step].trim() : true)
    ).length;
    return { completed: completedSteps, total: steps.length };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
              <h1 className="text-xl font-semibold text-white">PromptFlow - Projects</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Wizard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Your Projects
            </h2>
            <p className="text-gray-400 text-lg mt-2">
              {isGuest ? 'Projects stored locally in your browser' : 'All your generated project plans and documentation'}
            </p>
          </div>
          <Link to="/">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-orange-500">Loading projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
              <p className="text-gray-400 mb-6">Create your first project to get started</p>
              <Link to="/">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const progress = getProjectProgress(project);
              const progressPercentage = (progress.completed / progress.total) * 100;
              
              return (
                <Card key={project.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg truncate">
                        {project.name}
                      </CardTitle>
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(project.updated_at)}</span>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400">
                      Project ID: {project.id.slice(0, 12)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-300">Progress</span>
                          <span className="text-orange-400">{progress.completed}/{progress.total} steps</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Completed Steps */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Completed:</h4>
                        <div className="flex flex-wrap gap-1">
                          {['requirements', 'brainstorm', 'research', 'prd', 'epics'].map((step) => {
                            const isCompleted = project.docs_data[step] && 
                              (typeof project.docs_data[step] === 'string' ? project.docs_data[step].trim() : true);
                            return (
                              <span
                                key={step}
                                className={`px-2 py-1 rounded text-xs ${
                                  isCompleted 
                                    ? 'bg-green-600/20 text-green-400' 
                                    : 'bg-gray-700 text-gray-500'
                                }`}
                              >
                                {step.charAt(0).toUpperCase() + step.slice(1)}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link 
                          to={`/?project=${project.id}`}
                          className="w-full"
                        >
                          <Button 
                            variant="outline" 
                            className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                          >
                            Continue Project
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
