
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/components/auth/AuthPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Calendar, FileText, Lightbulb, Search, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  docs_data: Record<string, any>;
}

const Projects = () => {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (user && user.id !== 'guest-user') {
      loadProjects();
    } else if (user?.id === 'guest-user') {
      // For guest users, load from localStorage
      loadGuestProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const { data: projectsData, error } = await supabase
        .from('project')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading projects:', error);
        return;
      }

      // Load docs for each project
      const projectsWithDocs = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data } = await supabase.rpc('fetch_project_state', {
            p_project_id: project.id
          });
          
          return {
            ...project,
            docs_data: data?.[0]?.docs_data || {}
          };
        })
      );

      setProjects(projectsWithDocs);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGuestProjects = () => {
    setIsLoading(true);
    try {
      const guestProjects: Project[] = [];
      
      // Scan localStorage for guest projects
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('promptflow_data_')) {
          const projectId = key.replace('promptflow_data_', '');
          const data = localStorage.getItem(key);
          if (data) {
            const docs_data = JSON.parse(data);
            guestProjects.push({
              id: projectId,
              name: 'Guest Project',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              docs_data
            });
          }
        }
      }
      
      setProjects(guestProjects);
    } catch (error) {
      console.error('Error loading guest projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProjectStatus = (docs: Record<string, any>) => {
    const steps = ['requirements', 'brainstorm', 'research', 'prd', 'epics'];
    const completedSteps = steps.filter(step => docs[step] && 
      (typeof docs[step] === 'string' ? docs[step].trim() : Object.keys(docs[step] || {}).length > 0)
    );
    return `${completedSteps.length}/${steps.length} steps`;
  };

  const getProjectDescription = (docs: Record<string, any>) => {
    if (docs.requirements && typeof docs.requirements === 'string') {
      return docs.requirements.substring(0, 100) + (docs.requirements.length > 100 ? '...' : '');
    }
    return 'No description available';
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

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-300 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Project Details</h1>
            <p className="text-gray-400">ID: {selectedProject.id}</p>
          </div>

          <div className="grid gap-6">
            {selectedProject.docs_data.requirements && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-500">
                    <FileText className="w-5 h-5 mr-2" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedProject.docs_data.requirements}</p>
                </CardContent>
              </Card>
            )}

            {selectedProject.docs_data.brainstorm && Object.keys(selectedProject.docs_data.brainstorm).length > 0 && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-500">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Brainstorm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                    {JSON.stringify(selectedProject.docs_data.brainstorm, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {selectedProject.docs_data.research && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-500">
                    <Search className="w-5 h-5 mr-2" />
                    Research
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedProject.docs_data.research}</p>
                </CardContent>
              </Card>
            )}

            {selectedProject.docs_data.prd && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-500">
                    <FileText className="w-5 h-5 mr-2" />
                    Product Requirements Document
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedProject.docs_data.prd}</p>
                </CardContent>
              </Card>
            )}

            {selectedProject.docs_data.epics && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-500">
                    <Zap className="w-5 h-5 mr-2" />
                    Development Epics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedProject.docs_data.epics}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center">
                <span className="text-sm font-bold text-white">PF</span>
              </div>
              <h1 className="text-xl font-semibold text-white">PromptFlow - Projects</h1>
            </div>
            <Link to="/">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500">
                Back to Wizard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Projects</h1>
          <p className="text-gray-400">All the plans and projects you've generated</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-orange-500">Loading projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-6">Start creating your first project with our wizard</p>
              <Link to="/">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Create First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Projects Overview</CardTitle>
              <CardDescription className="text-gray-400">
                Click on any project to view its details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Project</TableHead>
                    <TableHead className="text-gray-300">Description</TableHead>
                    <TableHead className="text-gray-300">Progress</TableHead>
                    <TableHead className="text-gray-300">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="border-gray-700 hover:bg-gray-800 cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.id.slice(0, 8)}...</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {getProjectDescription(project.docs_data)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-orange-600 text-orange-500">
                          {getProjectStatus(project.docs_data)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {format(new Date(project.updated_at), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Projects;
