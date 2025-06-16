
-- Enable Row Level Security on all tables (if not already enabled)
ALTER TABLE public.project ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them properly
DROP POLICY IF EXISTS "Users can view their own projects" ON public.project;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.project;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.project;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.project;

DROP POLICY IF EXISTS "Users can view docs for their projects" ON public.doc;
DROP POLICY IF EXISTS "Users can create docs for their projects" ON public.doc;
DROP POLICY IF EXISTS "Users can update docs for their projects" ON public.doc;
DROP POLICY IF EXISTS "Users can delete docs for their projects" ON public.doc;

DROP POLICY IF EXISTS "Users can view prompt logs for their projects" ON public.prompt_log;
DROP POLICY IF EXISTS "Users can create prompt logs for their projects" ON public.prompt_log;

-- Create comprehensive RLS policies for project table
CREATE POLICY "Users can view their own projects" 
  ON public.project 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
  ON public.project 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON public.project 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.project 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create comprehensive RLS policies for doc table
CREATE POLICY "Users can view docs for their projects" 
  ON public.doc 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.project p 
    WHERE p.id = doc.project_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can create docs for their projects" 
  ON public.doc 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.project p 
    WHERE p.id = doc.project_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can update docs for their projects" 
  ON public.doc 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.project p 
    WHERE p.id = doc.project_id AND p.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.project p 
    WHERE p.id = doc.project_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete docs for their projects" 
  ON public.doc 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.project p 
    WHERE p.id = doc.project_id AND p.user_id = auth.uid()
  ));

-- Create comprehensive RLS policies for prompt_log table
CREATE POLICY "Users can view prompt logs for their projects" 
  ON public.prompt_log 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.project p 
    WHERE p.id = prompt_log.project_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can create prompt logs for their projects" 
  ON public.prompt_log 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.project p 
    WHERE p.id = prompt_log.project_id AND p.user_id = auth.uid()
  ));

-- Create indexes for RLS policy performance
CREATE INDEX IF NOT EXISTS idx_project_user_id ON public.project(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_project_id ON public.doc(project_id);
CREATE INDEX IF NOT EXISTS idx_prompt_log_project_id ON public.prompt_log(project_id);
