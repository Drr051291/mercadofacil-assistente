-- Create role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin', 'super_admin');

-- Add role column to profiles table (remove is_admin column)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_admin;
ALTER TABLE public.profiles ADD COLUMN role public.user_role NOT NULL DEFAULT 'user';

-- Set the super admin
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE email = 'contato@vivazagencia.com.br';

-- Create audit log table for role changes
CREATE TABLE public.role_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  old_role public.user_role,
  new_role public.user_role NOT NULL,
  changed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT
);

-- Enable RLS on audit log
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to check if user is admin or super admin
CREATE OR REPLACE FUNCTION public.is_admin_or_super()
RETURNS BOOLEAN AS $$
  SELECT role IN ('admin', 'super_admin') FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT role = 'super_admin' FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update notifications policies to use new role system
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can delete notifications" ON public.notifications;

CREATE POLICY "Admins can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (public.is_admin_or_super());

CREATE POLICY "Admins can delete notifications" 
ON public.notifications 
FOR DELETE 
USING (public.is_admin_or_super());

-- Audit log policies
CREATE POLICY "Only super admins can view audit log" 
ON public.role_audit_log 
FOR SELECT 
USING (public.is_super_admin());

CREATE POLICY "Only super admins can create audit log entries" 
ON public.role_audit_log 
FOR INSERT 
WITH CHECK (public.is_super_admin());

-- Create trigger function to log role changes
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role != NEW.role THEN
    INSERT INTO public.role_audit_log (user_id, old_role, new_role, changed_by, reason)
    VALUES (NEW.user_id, OLD.role, NEW.role, auth.uid(), 'Role changed via admin panel');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role changes
CREATE TRIGGER trigger_log_role_change
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_role_change();