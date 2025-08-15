-- Add is_admin column to profiles table
ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  send_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications or global notifications
CREATE POLICY "Users can view their own notifications or global notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Only admins can create notifications
CREATE POLICY "Admins can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Only admins can delete notifications
CREATE POLICY "Admins can delete notifications" 
ON public.notifications 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);