
-- Fix function search_path mutability issues for security
-- This prevents potential schema-based attacks by setting an immutable search_path

-- Update touch_updated_at function
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update fetch_project_state function  
CREATE OR REPLACE FUNCTION public.fetch_project_state(p_project_id UUID)
RETURNS TABLE (
  project_data JSONB,
  docs_data JSONB,
  recent_prompts JSONB
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

-- Update save_doc function
CREATE OR REPLACE FUNCTION public.save_doc(
  p_project_id UUID,
  p_step TEXT,
  p_content JSONB,
  p_token_cost INTEGER DEFAULT 0
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
