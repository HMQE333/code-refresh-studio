
CREATE OR REPLACE FUNCTION public.increment_thread_views(thread_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.threads SET view_count = view_count + 1 WHERE id = thread_id;
$$;
