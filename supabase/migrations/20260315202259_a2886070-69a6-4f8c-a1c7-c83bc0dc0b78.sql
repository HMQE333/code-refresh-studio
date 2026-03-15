
-- Forum boards (categories)
CREATE TABLE public.boards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Forum threads
CREATE TABLE public.threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tag TEXT,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Forum posts (comments on threads)
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reactions (likes on threads and posts)
CREATE TABLE public.reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'like',
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT reactions_target_check CHECK (
    (thread_id IS NOT NULL AND post_id IS NULL) OR
    (thread_id IS NULL AND post_id IS NOT NULL)
  ),
  CONSTRAINT reactions_unique_thread UNIQUE (thread_id, user_id, type),
  CONSTRAINT reactions_unique_post UNIQUE (post_id, user_id, type)
);

-- Indexes
CREATE INDEX idx_threads_board_created ON public.threads(board_id, created_at DESC);
CREATE INDEX idx_threads_author ON public.threads(author_id);
CREATE INDEX idx_posts_thread_created ON public.posts(thread_id, created_at);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_reactions_thread ON public.reactions(thread_id) WHERE thread_id IS NOT NULL;
CREATE INDEX idx_reactions_post ON public.reactions(post_id) WHERE post_id IS NOT NULL;
CREATE INDEX idx_reactions_user ON public.reactions(user_id);

-- Enable RLS
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- Boards: everyone can read
CREATE POLICY "Anyone can read boards" ON public.boards FOR SELECT USING (true);

-- Threads: everyone can read non-deleted, authenticated can create/update own
CREATE POLICY "Anyone can read threads" ON public.threads FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Authenticated users can create threads" ON public.threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own threads" ON public.threads FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

-- Posts: everyone can read non-deleted, authenticated can create/delete own
CREATE POLICY "Anyone can read posts" ON public.posts FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

-- Reactions: everyone can read, authenticated can insert/delete own
CREATE POLICY "Anyone can read reactions" ON public.reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reactions" ON public.reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON public.reactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Seed boards matching the original channels
INSERT INTO public.boards (name, slug, description, icon, sort_order) VALUES
  ('Ogólne', 'ogolne', 'Dyskusje ogólne na każdy temat wędkarski.', 'fish', 0),
  ('Spinning', 'spinning', 'Dla łowców drapieżników na spinning.', 'fish-symbol', 1),
  ('Karpiowanie', 'karpiowanie', 'Dla karpiarzy lubiących długie zasiadki.', 'tent', 2),
  ('Feeder', 'feeder', 'Dla wędkarzy łowiących na feeder.', 'anchor', 3),
  ('Method feeder', 'metoda', 'Dla fanów method feeder zestawów.', 'target', 4),
  ('Spławik', 'splawik', 'Dla zwolenników klasycznego spławika.', 'fish', 5),
  ('Muchowe', 'muchowe', 'Dla miłośników łowienia na muchę.', 'feather', 6),
  ('Podlodowe', 'podlodowe', 'Dla wędkarzy łowiących spod lodu.', 'snowflake', 7),
  ('Morskie', 'morskie', 'Dla tych, co kochają morze.', 'sailboat', 8),
  ('Memy', 'memy', 'Dla osób szukających wędkarskich memów.', 'laugh', 9),
  ('Gry', 'gry', 'Dla graczy lubiących wędkarskie gry.', 'gamepad-2', 10);
