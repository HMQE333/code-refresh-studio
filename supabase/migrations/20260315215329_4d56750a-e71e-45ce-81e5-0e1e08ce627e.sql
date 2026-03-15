
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can update (mark read) their own notifications
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete own notifications
CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- System/admin can insert notifications (via security definer functions)
-- We'll use a security definer function to create notifications

CREATE OR REPLACE FUNCTION public.create_notification(
  _user_id UUID,
  _type TEXT,
  _title TEXT,
  _body TEXT DEFAULT NULL,
  _link TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  INSERT INTO public.notifications (user_id, type, title, body, link)
  VALUES (_user_id, _type, _title, _body, _link);
$$;

-- Trigger: notify thread author when someone comments
CREATE OR REPLACE FUNCTION public.notify_on_new_post()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  thread_author_id UUID;
  thread_title TEXT;
  commenter_name TEXT;
BEGIN
  -- Get thread author
  SELECT author_id, title INTO thread_author_id, thread_title
  FROM public.threads WHERE id = NEW.thread_id;

  -- Don't notify yourself
  IF thread_author_id IS NULL OR thread_author_id = NEW.author_id THEN
    RETURN NEW;
  END IF;

  -- Get commenter name
  SELECT username INTO commenter_name
  FROM public.profiles WHERE user_id = NEW.author_id;

  PERFORM public.create_notification(
    thread_author_id,
    'comment',
    'Nowy komentarz w Twoim wątku',
    COALESCE(commenter_name, 'Ktoś') || ' skomentował: ' || LEFT(thread_title, 50),
    '/forum/' || NEW.thread_id
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_post_notify
AFTER INSERT ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_new_post();

-- Trigger: notify thread author when someone likes their thread
CREATE OR REPLACE FUNCTION public.notify_on_thread_like()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  thread_author_id UUID;
  thread_title TEXT;
  liker_name TEXT;
BEGIN
  IF NEW.thread_id IS NULL THEN RETURN NEW; END IF;

  SELECT author_id, title INTO thread_author_id, thread_title
  FROM public.threads WHERE id = NEW.thread_id;

  IF thread_author_id IS NULL OR thread_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  SELECT username INTO liker_name
  FROM public.profiles WHERE user_id = NEW.user_id;

  PERFORM public.create_notification(
    thread_author_id,
    'like',
    'Ktoś polubił Twój wątek',
    COALESCE(liker_name, 'Ktoś') || ' polubił: ' || LEFT(thread_title, 50),
    '/forum/' || NEW.thread_id
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_thread_like_notify
AFTER INSERT ON public.reactions
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_thread_like();
