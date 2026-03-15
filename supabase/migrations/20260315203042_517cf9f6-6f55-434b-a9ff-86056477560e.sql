
-- Gallery items table
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Życiówki',
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_items_category ON public.gallery_items(category);
CREATE INDEX idx_gallery_items_author ON public.gallery_items(author_id);
CREATE INDEX idx_gallery_items_created ON public.gallery_items(created_at DESC);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery items" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create gallery items" ON public.gallery_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own gallery items" ON public.gallery_items FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own gallery items" ON public.gallery_items FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Gallery likes
CREATE TABLE public.gallery_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_item_id UUID NOT NULL REFERENCES public.gallery_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(gallery_item_id, user_id)
);

ALTER TABLE public.gallery_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery likes" ON public.gallery_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON public.gallery_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.gallery_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Gallery comments
CREATE TABLE public.gallery_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_item_id UUID NOT NULL REFERENCES public.gallery_items(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.gallery_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_comments_item ON public.gallery_comments(gallery_item_id);

ALTER TABLE public.gallery_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery comments" ON public.gallery_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON public.gallery_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON public.gallery_comments FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Anyone can view gallery files" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated users can upload gallery files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Users can delete own gallery files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND (storage.foldername(name))[1] = auth.uid()::text);
