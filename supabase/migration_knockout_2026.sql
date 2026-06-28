-- ============================================================
-- Quiniela Mundial 2026 - Eliminatorias definidas
-- Horarios en EDT / Venezuela (UTC-4)
--
-- Conserva intacta la fase de grupos. Reinicia solo partidos,
-- pronósticos y resultados de eliminatorias previas.
-- ============================================================

DELETE FROM public.matches
WHERE "group" IN ('r32','r16','qf','sf','third','final');

INSERT INTO public.matches ("group", home, home_flag, away, away_flag, date, status, external_id) VALUES

-- Dieciseisavos
('r32','Sudáfrica','za','Canadá','ca',                         '2026-06-28 15:00:00-04','scheduled',1001),
('r32','Brasil','br','Japón','jp',                              '2026-06-29 13:00:00-04','scheduled',1002),
('r32','Alemania','de','Paraguay','py',                         '2026-06-29 16:30:00-04','scheduled',1003),
('r32','Países Bajos','nl','Marruecos','ma',                    '2026-06-29 21:00:00-04','scheduled',1004),
('r32','Costa de Marfil','ci','Noruega','no',                   '2026-06-30 13:00:00-04','scheduled',1005),
('r32','Francia','fr','Suecia','se',                            '2026-06-30 17:00:00-04','scheduled',1006),
('r32','México','mx','Ecuador','ec',                            '2026-06-30 21:00:00-04','scheduled',1007),
('r32','Inglaterra','gb-eng','RD Congo','cd',                   '2026-07-01 12:00:00-04','scheduled',1008),
('r32','Bélgica','be','Senegal','sn',                           '2026-07-01 16:00:00-04','scheduled',1009),
('r32','Estados Unidos','us','Bosnia y Herzegovina','ba',       '2026-07-01 20:00:00-04','scheduled',1010),
('r32','España','es','Austria','at',                            '2026-07-02 15:00:00-04','scheduled',1011),
('r32','Portugal','pt','Croacia','hr',                          '2026-07-02 19:00:00-04','scheduled',1012),
('r32','Suiza','ch','Argelia','dz',                             '2026-07-02 23:00:00-04','scheduled',1013),
('r32','Australia','au','Egipto','eg',                          '2026-07-03 14:00:00-04','scheduled',1014),
('r32','Argentina','ar','Cabo Verde','cv',                      '2026-07-03 18:00:00-04','scheduled',1015),
('r32','Colombia','co','Ghana','gh',                            '2026-07-03 21:30:00-04','scheduled',1016),

-- Octavos
('r16','Ganador Sudáfrica/Canadá',null,'Ganador Países Bajos/Marruecos',null,'2026-07-04 12:00:00-04','scheduled',1017),
('r16','Ganador Alemania/Paraguay',null,'Ganador Francia/Suecia',null,      '2026-07-04 16:00:00-04','scheduled',1018),
('r16','Ganador Brasil/Japón',null,'Ganador Costa de Marfil/Noruega',null,  '2026-07-05 12:00:00-04','scheduled',1019),
('r16','Ganador México/Ecuador',null,'Ganador Inglaterra/RD Congo',null,    '2026-07-05 16:00:00-04','scheduled',1020),
('r16','Ganador Portugal/Croacia',null,'Ganador España/Austria',null,       '2026-07-06 12:00:00-04','scheduled',1021),
('r16','Ganador EE. UU./Bosnia',null,'Ganador Bélgica/Senegal',null,        '2026-07-06 16:00:00-04','scheduled',1022),
('r16','Ganador Argentina/Cabo Verde',null,'Ganador Australia/Egipto',null, '2026-07-07 12:00:00-04','scheduled',1023),
('r16','Ganador Suiza/Argelia',null,'Ganador Colombia/Ghana',null,          '2026-07-07 16:00:00-04','scheduled',1024),

-- Cuartos, semifinales, tercer puesto y final
('qf','Ganador octavos 1',null,'Ganador octavos 2',null,        '2026-07-09 15:00:00-04','scheduled',1025),
('qf','Ganador octavos 3',null,'Ganador octavos 4',null,        '2026-07-10 15:00:00-04','scheduled',1026),
('qf','Ganador octavos 5',null,'Ganador octavos 6',null,        '2026-07-11 12:00:00-04','scheduled',1027),
('qf','Ganador octavos 7',null,'Ganador octavos 8',null,        '2026-07-11 16:00:00-04','scheduled',1028),
('sf','Ganador cuartos 1',null,'Ganador cuartos 2',null,        '2026-07-14 15:00:00-04','scheduled',1029),
('sf','Ganador cuartos 3',null,'Ganador cuartos 4',null,        '2026-07-15 15:00:00-04','scheduled',1030),
('third','Perdedor semifinal 1',null,'Perdedor semifinal 2',null,'2026-07-18 15:00:00-04','scheduled',1031),
('final','Ganador semifinal 1',null,'Ganador semifinal 2',null, '2026-07-19 15:00:00-04','scheduled',1032);

INSERT INTO public.phase_settings (id, is_open) VALUES
  ('bonus',  false),
  ('groups', false),
  ('r32',    true),
  ('r16',    false),
  ('qf',     false),
  ('sf',     false),
  ('third',  false),
  ('final',  false)
ON CONFLICT (id) DO UPDATE
SET is_open = EXCLUDED.is_open,
    updated_at = now();
