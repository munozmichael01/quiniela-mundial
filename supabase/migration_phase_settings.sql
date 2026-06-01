-- Tabla para controlar qué fases están abiertas para pronósticos
CREATE TABLE IF NOT EXISTS public.phase_settings (
  id text PRIMARY KEY,          -- 'groups', 'r32', 'r16', 'qf', 'sf', 'third', 'final'
  is_open boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed: grupos abiertos por defecto, resto cerrado
INSERT INTO public.phase_settings (id, is_open) VALUES
  ('groups', true),
  ('r32',    false),
  ('r16',    false),
  ('qf',     false),
  ('sf',     false),
  ('third',  false),
  ('final',  false)
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE public.phase_settings ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede leer
CREATE POLICY "phase_settings_read" ON public.phase_settings
  FOR SELECT USING (auth.role() = 'authenticated');

-- Solo admin puede modificar
CREATE POLICY "phase_settings_admin_write" ON public.phase_settings
  FOR UPDATE USING (is_admin());
