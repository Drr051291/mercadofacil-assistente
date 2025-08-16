-- 1. Create BEFORE UPDATE trigger to prevent unauthorized role changes
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow role changes only if the current user is a super admin
  IF OLD.role != NEW.role AND NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Only super administrators can change user roles';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create BEFORE UPDATE trigger on profiles
CREATE TRIGGER prevent_unauthorized_role_changes_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_unauthorized_role_changes();

-- 2. Add AFTER UPDATE trigger for role audit logging
CREATE TRIGGER log_role_changes_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_role_change();

-- 3. Add updated_at trigger to profiles
CREATE TRIGGER update_profiles_updated_at_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Add new RLS policies for profiles
CREATE POLICY "Super admins can update any profile"
ON public.profiles
FOR UPDATE
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

CREATE POLICY "Admins and super admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin_or_super());

-- 5. Replace the overly permissive product_costs policy
DROP POLICY IF EXISTS "Allow all operations for internal tool" ON public.product_costs;

CREATE POLICY "Admins can select product costs"
ON public.product_costs
FOR SELECT
USING (public.is_admin_or_super());

CREATE POLICY "Admins can insert product costs"
ON public.product_costs
FOR INSERT
WITH CHECK (public.is_admin_or_super());

CREATE POLICY "Admins can update product costs"
ON public.product_costs
FOR UPDATE
USING (public.is_admin_or_super())
WITH CHECK (public.is_admin_or_super());

CREATE POLICY "Admins can delete product costs"
ON public.product_costs
FOR DELETE
USING (public.is_admin_or_super());

-- 6. Add trigger for automatic profile creation on user signup
CREATE TRIGGER on_auth_user_created_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();