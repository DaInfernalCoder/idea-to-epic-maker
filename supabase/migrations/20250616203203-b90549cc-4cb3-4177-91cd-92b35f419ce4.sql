
-- Drop the existing function first
DROP FUNCTION IF EXISTS public.fetch_project_state(UUID);

-- Remove the prompt_log table since it's no longer needed
DROP TABLE IF EXISTS public.prompt_log;

-- Add proper RLS policies for the project table
DROP POLICY IF EXISTS "Users can view their own projects" ON public.project;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.project;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.project;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.project;

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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.project 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add proper RLS policies for the doc table
DROP POLICY IF EXISTS "Users can view docs for their projects" ON public.doc;
DROP POLICY IF EXISTS "Users can create docs for their projects" ON public.doc;
DROP POLICY IF EXISTS "Users can update docs for their projects" ON public.doc;
DROP POLICY IF EXISTS "Users can delete docs for their projects" ON public.doc;

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
  ));

CREATE POLICY "Users can delete docs for their projects" 
  ON public.doc 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.project p 
    WHERE p.id = doc.project_id AND p.user_id = auth.uid()
  ));

-- Create the updated fetch_project_state function without prompt_log
CREATE OR REPLACE FUNCTION public.fetch_project_state(p_project_id UUID)
RETURNS TABLE (
  project_data JSONB,
  docs_data JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_jsonb(p.*) as project_data,
    COALESCE(
      jsonb_object_agg(d.step, d.content) FILTER (WHERE d.id IS NOT NULL),
      '{}'::jsonb
    ) as docs_data
  FROM public.project p
  LEFT JOIN public.doc d ON d.project_id = p.id
  WHERE p.id = p_project_id
    AND p.user_id = auth.uid()
  GROUP BY p.id, p.user_id, p.name, p.created_at, p.updated_at;
END;
$$;
