
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { generateProjectId } from '@/lib/utils';

interface ProjectData {
  requirements: string;
  brainstorm: any;
  research: string;
  prd: string;
  epics: string;
}

interface ProjectState {
  projectId: string;
  projectData: ProjectData;
  isLoading: boolean;
  updateProjectData: (step: string, data: any) => Promise<void>;
  createNewProject: () => Promise<void>;
}

export function useProject(): ProjectState {
  const { user } = useAuth();
  const [projectId, setProjectId] = useState<string>('');
  const [projectData, setProjectData] = useState<ProjectData>({
    requirements: '',
    brainstorm: {},
    research: '',
    prd: '',
    epics: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load project data when user is authenticated
  useEffect(() => {
    if (user) {
      loadOrCreateProject();
    }
  }, [user]);

  const loadOrCreateProject = async () => {
    setIsLoading(true);
    try {
      // Try to get stored project ID from localStorage first
      let storedProjectId = localStorage.getItem('promptflow_project_id');
      
      if (storedProjectId) {
        // Try to load the project from Supabase
        const { data, error } = await supabase.rpc('fetch_project_state', {
          p_project_id: storedProjectId
        });

        if (data && data.length > 0) {
          const projectState = data[0];
          setProjectId(storedProjectId);
          
          // Convert docs_data back to projectData format
          const docs = projectState.docs_data || {};
          setProjectData({
            requirements: docs.requirements || '',
            brainstorm: docs.brainstorm || {},
            research: docs.research || '',
            prd: docs.prd || '',
            epics: docs.epics || ''
          });
          setIsLoading(false);
          return;
        }
      }

      // If no valid project found, create a new one
      await createNewProject();
    } catch (error) {
      console.error('Error loading project:', error);
      // Fallback to localStorage-only mode
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    let storedProjectId = localStorage.getItem('promptflow_project_id');
    if (!storedProjectId) {
      storedProjectId = generateProjectId();
      localStorage.setItem('promptflow_project_id', storedProjectId);
    }
    setProjectId(storedProjectId);

    // Load existing project data from localStorage
    const storedData = localStorage.getItem(`promptflow_data_${storedProjectId}`);
    if (storedData) {
      setProjectData(JSON.parse(storedData));
    }
  };

  const createNewProject = async (): Promise<void> => {
    const newProjectId = generateProjectId();
    
    try {
      if (user) {
        // Create project in Supabase
        const { data, error } = await supabase
          .from('project')
          .insert({
            id: newProjectId,
            user_id: user.id,
            name: 'Untitled Project'
          })
          .select()
          .single();

        if (error) throw error;
      }

      // Update local state
      setProjectId(newProjectId);
      localStorage.setItem('promptflow_project_id', newProjectId);
      
      const initialData = {
        requirements: '',
        brainstorm: {},
        research: '',
        prd: '',
        epics: ''
      };
      setProjectData(initialData);
      localStorage.setItem(`promptflow_data_${newProjectId}`, JSON.stringify(initialData));
    } catch (error) {
      console.error('Error creating project:', error);
      // Fallback to localStorage-only
      loadFromLocalStorage();
    }
  };

  const updateProjectData = async (step: string, data: any): Promise<void> => {
    const newData = { ...projectData, [step]: data };
    setProjectData(newData);
    
    // Always update localStorage immediately
    localStorage.setItem(`promptflow_data_${projectId}`, JSON.stringify(newData));

    // Try to sync to Supabase if user is authenticated
    if (user) {
      try {
        await supabase.rpc('save_doc', {
          p_project_id: projectId,
          p_step: step,
          p_content: data
        });
      } catch (error) {
        console.error('Error syncing to Supabase:', error);
        // Continue working in localStorage-only mode
      }
    }
  };

  return {
    projectId,
    projectData,
    isLoading,
    updateProjectData,
    createNewProject
  };
}
