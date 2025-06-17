
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { generateProjectId, isValidUUID, clearMalformedProjectData } from "@/lib/utils";

interface BrainstormData {
  features: string[];
  technologies: string[];
  timestamp: string;
}

interface ProjectData {
  requirements: string;
  brainstorm: BrainstormData;
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
  const [projectId, setProjectId] = useState<string>("");
  const [projectData, setProjectData] = useState<ProjectData>({
    requirements: "",
    brainstorm: { features: [], technologies: [], timestamp: "" },
    research: "",
    prd: "",
    epics: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load project data when user is authenticated
  useEffect(() => {
    if (user) {
      // Clear any malformed project data first
      clearMalformedProjectData();
      loadOrCreateProject();
    }
  }, [user]);

  const loadOrCreateProject = async () => {
    setIsLoading(true);
    try {
      // For authenticated users (not guests), try to load from Supabase
      if (user && user.id !== "guest-user") {
        console.log("Loading project for authenticated user:", user.id);

        // First, try to get the most recent project for this user
        const { data: projects, error: projectError } = await supabase
          .from("project")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1);

        if (projectError) {
          console.error("Error loading projects:", projectError);
          throw projectError;
        }

        if (projects && projects.length > 0) {
          const project = projects[0];
          console.log("Found existing project:", project.id);
          
          // Validate that the project ID is a proper UUID
          if (!isValidUUID(project.id)) {
            console.log("Project has malformed ID, creating new project");
            await createNewProject();
            return;
          }
          
          setProjectId(project.id);
          localStorage.setItem("promptflow_project_id", project.id);

          // Load the project data using the fetch_project_state function
          const { data, error } = await supabase.rpc("fetch_project_state", {
            p_project_id: project.id,
          });

          if (data && Array.isArray(data) && data.length > 0) {
            const projectState = data[0];
            const docs = (projectState.docs_data as Record<string, any>) || {};
            setProjectData({
              requirements: docs.requirements || "",
              brainstorm: docs.brainstorm || {
                features: [],
                technologies: [],
                timestamp: "",
              },
              research: docs.research || "",
              prd: docs.prd || "",
              epics: docs.epics || "",
            });
            console.log("Loaded project data from Supabase");
          }
        } else {
          // No existing project, create a new one
          console.log("No existing project found, creating new one");
          await createNewProject();
        }
      } else {
        // Guest user or no auth - use localStorage only
        console.log("Using localStorage for guest user");
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("Error loading project:", error);
      // Fallback to localStorage-only mode
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    let storedProjectId = localStorage.getItem("promptflow_project_id");
    
    // Check if stored project ID is valid, if not generate a new one
    if (!storedProjectId || !isValidUUID(storedProjectId)) {
      console.log("Generating new project ID due to missing or invalid stored ID");
      storedProjectId = generateProjectId();
      localStorage.setItem("promptflow_project_id", storedProjectId);
    }
    
    setProjectId(storedProjectId);

    // Load existing project data from localStorage
    const storedData = localStorage.getItem(
      `promptflow_data_${storedProjectId}`
    );
    if (storedData) {
      setProjectData(JSON.parse(storedData));
    }
  };

  const createNewProject = async (): Promise<void> => {
    const newProjectId = generateProjectId();

    try {
      // Only create in Supabase for authenticated users (not guests)
      if (user && user.id !== "guest-user") {
        console.log("Creating new project in Supabase for user:", user.id);

        // Create project in Supabase
        const { data, error } = await supabase
          .from("project")
          .insert({
            id: newProjectId,
            user_id: user.id,
            name: "Untitled Project",
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating project:", error);
          throw error;
        }

        console.log("Created new project in Supabase:", newProjectId);
      }

      // Update local state
      setProjectId(newProjectId);
      localStorage.setItem("promptflow_project_id", newProjectId);

      const initialData = {
        requirements: "",
        brainstorm: { features: [], technologies: [], timestamp: "" },
        research: "",
        prd: "",
        epics: "",
      };
      setProjectData(initialData);
      localStorage.setItem(
        `promptflow_data_${newProjectId}`,
        JSON.stringify(initialData)
      );
    } catch (error) {
      console.error("Error creating project:", error);
      // Fallback to localStorage-only
      loadFromLocalStorage();
    }
  };

  const updateProjectData = async (step: string, data: any): Promise<void> => {
    const newData = { ...projectData, [step]: data };
    setProjectData(newData);

    // Always update localStorage immediately
    localStorage.setItem(
      `promptflow_data_${projectId}`,
      JSON.stringify(newData)
    );

    // Try to sync to Supabase if user is authenticated and not a guest
    if (user && user.id !== "guest-user" && projectId) {
      try {
        console.log(
          `Syncing ${step} data to Supabase for project ${projectId}`
        );

        // First ensure the project exists in Supabase
        const { data: existingProject } = await supabase
          .from("project")
          .select("id")
          .eq("id", projectId)
          .eq("user_id", user.id)
          .single();

        if (!existingProject) {
          console.log("Project does not exist in Supabase, creating it");
          await supabase.from("project").insert({
            id: projectId,
            user_id: user.id,
            name: "Untitled Project",
          });
        }

        // Now save the document data
        const { data: savedDoc, error } = await supabase.rpc("save_doc", {
          p_project_id: projectId,
          p_step: step,
          p_content: data,
        });

        if (error) {
          console.error("Error syncing to Supabase:", error);
          throw error;
        }

        console.log(`Successfully synced ${step} data to Supabase`);
      } catch (error) {
        console.error("Error syncing to Supabase:", error);
        // Continue working in localStorage-only mode
      }
    }
  };

  return {
    projectId,
    projectData,
    isLoading,
    updateProjectData,
    createNewProject,
  };
}
