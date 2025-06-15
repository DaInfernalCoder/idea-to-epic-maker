
-- Create the complete database schema for PromptFlow

-- Create projects table
CREATE TABLE IF NOT EXISTS public.project (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table (single-version model)
CREATE TABLE IF NOT EXISTS public.doc (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.project NOT NULL,
  step TEXT NOT NULL,
  content JSONB NOT NULL,
  token_cost INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT doc_unique_step UNIQUE (project_id, step)
);

-- Create prompt log table for audit trail
CREATE TABLE IF NOT EXISTS public.prompt_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.project NOT NULL,
  step TEXT NOT NULL,
  prompt TEXT NOT NULL,
  completion TEXT,
  model TEXT,
  token_cost INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.project ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project table
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

-- RLS Policies for doc table
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

-- RLS Policies for prompt_log table
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_user_id ON public.project(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_project_step ON public.doc(project_id, step);
CREATE INDEX IF NOT EXISTS idx_prompt_log_project ON public.prompt_log(project_id, created_at DESC);

-- Create trigger function for auto-updating timestamps
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER trg_project_updated_at
  BEFORE UPDATE ON public.project
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_doc_updated_at
  BEFORE UPDATE ON public.doc
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- Helper function to fetch project state
CREATE OR REPLACE FUNCTION public.fetch_project_state(p_project_id UUID)
RETURNS TABLE (
  project_data JSONB,
  docs_data JSONB,
  recent_prompts JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_jsonb(p.*) as project_data,
    COALESCE(
      jsonb_object_agg(d.step, d.content) FILTER (WHERE d.id IS NOT NULL),
      '{}'::jsonb
    ) as docs_data,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', pl.id,
          'step', pl.step,
          'prompt', pl.prompt,
          'completion', pl.completion,
          'model', pl.model,
          'created_at', pl.created_at
        ) ORDER BY pl.created_at DESC
      ) FILTER (WHERE pl.id IS NOT NULL),
      '[]'::jsonb
    ) as recent_prompts
  FROM public.project p
  LEFT JOIN public.doc d ON d.project_id = p.id
  LEFT JOIN (
    SELECT *
    FROM public.prompt_log
    WHERE project_id = p_project_id
    ORDER BY created_at DESC
    LIMIT 20
  ) pl ON pl.project_id = p.id
  WHERE p.id = p_project_id
    AND p.user_id = auth.uid()
  GROUP BY p.id, p.user_id, p.name, p.created_at;
END;
$$;

-- Helper function for UPSERT operations
CREATE OR REPLACE FUNCTION public.save_doc(
  p_project_id UUID,
  p_step TEXT,
  p_content JSONB,
  p_token_cost INTEGER DEFAULT 0
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  doc_id UUID;
BEGIN
  -- Verify user owns the project
  IF NOT EXISTS (
    SELECT 1 FROM public.project 
    WHERE id = p_project_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Project not found or access denied';
  END IF;

  -- UPSERT the document
  INSERT INTO public.doc (project_id, step, content, token_cost)
  VALUES (p_project_id, p_step, p_content, p_token_cost)
  ON CONFLICT (project_id, step)
  DO UPDATE SET 
    content = EXCLUDED.content,
    token_cost = EXCLUDED.token_cost,
    updated_at = now()
  RETURNING id INTO doc_id;

  RETURN doc_id;
END;
$$;
