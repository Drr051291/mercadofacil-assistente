-- Ensure the super admin user has the correct role
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE email = 'contato@vivazagencia.com.br' AND role != 'super_admin';