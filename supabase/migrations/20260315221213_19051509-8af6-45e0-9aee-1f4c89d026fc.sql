
-- Reviews table for homepage testimonials
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published reviews" ON public.reviews
  FOR SELECT TO public
  USING (published = true);

CREATE POLICY "Admins can manage reviews" ON public.reviews
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed some default reviews
INSERT INTO public.reviews (author_name, text, rating) VALUES
  ('Marek W.', 'Najlepsza społeczność wędkarska w sieci! Tutaj zawsze znajdę odpowiedź na każde pytanie.', 5),
  ('Anna K.', 'Dzięki RybiaPaka poznałam świetnych ludzi i odkryłam nowe łowiska w mojej okolicy.', 5),
  ('Piotr S.', 'Forum pełne wiedzy, a galeria inspiruje do kolejnych wypraw. Polecam każdemu wędkarzowi!', 5),
  ('Tomek M.', 'Konkursy są super motywacją. Wygrałem już dwa razy sprzęt od sponsorów!', 5),
  ('Kasia L.', 'Świetna atmosfera i pomocni ludzie. Najlepsza strona wędkarska w PL!', 5),
  ('Janek R.', 'Mapa łowisk to rewelacja – odkryłem miejsca, o których nie miałem pojęcia.', 5);
