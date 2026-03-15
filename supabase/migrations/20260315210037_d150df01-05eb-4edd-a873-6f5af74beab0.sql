CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'ogloszenia',
  author_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  published boolean NOT NULL DEFAULT true
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published announcements"
ON public.announcements FOR SELECT TO public
USING (published = true);

CREATE POLICY "Admins can insert announcements"
ON public.announcements FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update announcements"
ON public.announcements FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete announcements"
ON public.announcements FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.announcements (title, content, category) VALUES
('Witamy na nowej stronie!', 'RybiaPaka.pl przeszła gruntowny remont. Zapraszamy do eksploracji nowych funkcji — forum, galeria, czaty tematyczne i wiele więcej.', 'ogloszenia'),
('Nowy system galerii', 'Galeria zdjęć została całkowicie przebudowana. Teraz możesz dodawać opisy, tagi i komentarze pod każdym zdjęciem.', 'aktualnosci'),
('Konkurs na najlepsze zdjęcie', 'Do wygrania zestaw wędkarski! Wyślij swoje najlepsze zdjęcie z łowiska do galerii z tagiem "Życiówki".', 'konkursy'),
('Zlot wędkarski – Mazury', 'Zapraszamy na pierwszy zlot społeczności RybiaPaka nad jeziorem Śniardwy. Termin: czerwiec 2026.', 'wydarzenia'),
('Jak powstała RybiaPaka?', 'Historia projektu od pierwszego pomysłu do pełnoprawnej platformy społecznościowej dla wędkarzy z całej Polski.', 'kulisy');