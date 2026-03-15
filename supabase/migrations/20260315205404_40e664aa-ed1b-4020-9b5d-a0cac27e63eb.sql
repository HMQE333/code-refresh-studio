
-- Allow users to delete their own channel messages
CREATE POLICY "Users can delete own messages"
ON public.channel_messages
FOR DELETE
TO authenticated
USING (auth.uid() = author_id);
