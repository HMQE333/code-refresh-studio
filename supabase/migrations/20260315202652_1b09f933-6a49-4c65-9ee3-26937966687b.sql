
-- Channel messages for realtime chat
CREATE TABLE public.channel_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_channel_messages_channel ON public.channel_messages(channel_id, created_at DESC);
CREATE INDEX idx_channel_messages_author ON public.channel_messages(author_id);

ALTER TABLE public.channel_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read channel messages" ON public.channel_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON public.channel_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

-- Enable realtime for channel_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.channel_messages;
