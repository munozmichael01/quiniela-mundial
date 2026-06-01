-- Guardar contraseña generada para que el admin pueda verla/compartirla en todo momento
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password text;
