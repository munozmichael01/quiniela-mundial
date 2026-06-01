-- Añadir columna paid a users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS paid boolean NOT NULL DEFAULT false;

-- Admin puede actualizar paid
CREATE POLICY "users_update_admin" ON public.users FOR UPDATE USING (is_admin());
