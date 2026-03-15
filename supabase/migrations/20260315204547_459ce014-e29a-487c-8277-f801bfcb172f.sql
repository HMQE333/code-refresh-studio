
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banned_until timestamp with time zone DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ban_reason text DEFAULT NULL;
