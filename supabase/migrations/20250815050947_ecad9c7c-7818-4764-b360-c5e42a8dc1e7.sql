-- Set admin status for the super admin user
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'contato@vivazagencia.com.br';