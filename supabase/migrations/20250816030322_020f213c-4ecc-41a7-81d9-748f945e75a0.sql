-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow role changes only if the current user is a super admin
  IF OLD.role != NEW.role AND NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Only super administrators can change user roles';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';