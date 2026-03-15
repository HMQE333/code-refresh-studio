-- Allow admins and moderators to delete any channel message
CREATE POLICY "Admins and moderators can delete any message"
ON public.channel_messages
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role)
);