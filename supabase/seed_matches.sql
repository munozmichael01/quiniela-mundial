-- ============================================================
-- Quiniela Mundial 2026 – 72 partidos de fase de grupos
-- Horarios en hora España (CEST = UTC+2)
-- Ejecutar en Supabase SQL Editor DESPUÉS del schema
-- ============================================================

-- Limpiar partidos de grupos si ya existen (no toca KO ni resultados)
DELETE FROM public.matches
WHERE "group" NOT IN ('r32','r16','qf','sf','third','final');

INSERT INTO public.matches ("group", home, home_flag, away, away_flag, date, status, external_id) VALUES

-- ── Grupo A ──────────────────────────────────────────────────
('A','México','mx','Sudáfrica','za',               '2026-06-11 21:00:00+02','scheduled',1),
('A','Corea del Sur','kr','República Checa','cz',  '2026-06-12 04:00:00+02','scheduled',2),
('A','República Checa','cz','Sudáfrica','za',       '2026-06-18 18:00:00+02','scheduled',25),
('A','México','mx','Corea del Sur','kr',            '2026-06-19 03:00:00+02','scheduled',28),
('A','República Checa','cz','México','mx',          '2026-06-25 03:00:00+02','scheduled',53),
('A','Sudáfrica','za','Corea del Sur','kr',         '2026-06-25 03:00:00+02','scheduled',54),

-- ── Grupo B ──────────────────────────────────────────────────
('B','Canadá','ca','Bosnia y Herzegovina','ba',     '2026-06-12 21:00:00+02','scheduled',3),
('B','Catar','qa','Suiza','ch',                     '2026-06-13 21:00:00+02','scheduled',8),
('B','Suiza','ch','Bosnia y Herzegovina','ba',      '2026-06-18 21:00:00+02','scheduled',26),
('B','Canadá','ca','Catar','qa',                    '2026-06-19 00:00:00+02','scheduled',27),
('B','Suiza','ch','Canadá','ca',                    '2026-06-24 21:00:00+02','scheduled',51),
('B','Bosnia y Herzegovina','ba','Catar','qa',      '2026-06-24 21:00:00+02','scheduled',52),

-- ── Grupo C ──────────────────────────────────────────────────
('C','Brasil','br','Marruecos','ma',                '2026-06-14 00:00:00+02','scheduled',7),
('C','Haití','ht','Escocia','gb-sct',               '2026-06-14 03:00:00+02','scheduled',5),
('C','Escocia','gb-sct','Marruecos','ma',           '2026-06-20 00:00:00+02','scheduled',30),
('C','Brasil','br','Haití','ht',                    '2026-06-20 02:30:00+02','scheduled',29),
('C','Escocia','gb-sct','Brasil','br',              '2026-06-25 00:00:00+02','scheduled',49),
('C','Marruecos','ma','Haití','ht',                 '2026-06-25 00:00:00+02','scheduled',50),

-- ── Grupo D ──────────────────────────────────────────────────
('D','Estados Unidos','us','Paraguay','py',         '2026-06-13 03:00:00+02','scheduled',4),
('D','Australia','au','Turquía','tr',               '2026-06-14 06:00:00+02','scheduled',6),
('D','Estados Unidos','us','Australia','au',        '2026-06-19 21:00:00+02','scheduled',32),
('D','Turquía','tr','Paraguay','py',                '2026-06-20 05:00:00+02','scheduled',31),
('D','Turquía','tr','Estados Unidos','us',          '2026-06-26 04:00:00+02','scheduled',59),
('D','Paraguay','py','Australia','au',              '2026-06-26 04:00:00+02','scheduled',60),

-- ── Grupo E ──────────────────────────────────────────────────
('E','Alemania','de','Curazao','cw',                '2026-06-14 19:00:00+02','scheduled',10),
('E','Costa de Marfil','ci','Ecuador','ec',         '2026-06-15 01:00:00+02','scheduled',9),
('E','Alemania','de','Costa de Marfil','ci',        '2026-06-20 22:00:00+02','scheduled',33),
('E','Ecuador','ec','Curazao','cw',                 '2026-06-21 02:00:00+02','scheduled',34),
('E','Curazao','cw','Costa de Marfil','ci',         '2026-06-25 22:00:00+02','scheduled',55),
('E','Ecuador','ec','Alemania','de',                '2026-06-25 22:00:00+02','scheduled',56),

-- ── Grupo F ──────────────────────────────────────────────────
('F','Países Bajos','nl','Japón','jp',              '2026-06-14 22:00:00+02','scheduled',11),
('F','Suecia','se','Túnez','tn',                    '2026-06-15 04:00:00+02','scheduled',12),
('F','Países Bajos','nl','Suecia','se',             '2026-06-20 19:00:00+02','scheduled',35),
('F','Túnez','tn','Japón','jp',                     '2026-06-21 06:00:00+02','scheduled',36),
('F','Japón','jp','Suecia','se',                    '2026-06-26 01:00:00+02','scheduled',57),
('F','Túnez','tn','Países Bajos','nl',              '2026-06-26 01:00:00+02','scheduled',58),

-- ── Grupo G ──────────────────────────────────────────────────
('G','Bélgica','be','Egipto','eg',                  '2026-06-15 21:00:00+02','scheduled',16),
('G','Irán','ir','Nueva Zelanda','nz',              '2026-06-16 03:00:00+02','scheduled',15),
('G','Bélgica','be','Irán','ir',                    '2026-06-21 21:00:00+02','scheduled',39),
('G','Nueva Zelanda','nz','Egipto','eg',            '2026-06-22 03:00:00+02','scheduled',40),
('G','Egipto','eg','Irán','ir',                     '2026-06-27 05:00:00+02','scheduled',63),
('G','Nueva Zelanda','nz','Bélgica','be',           '2026-06-27 05:00:00+02','scheduled',64),

-- ── Grupo H ──────────────────────────────────────────────────
('H','España','es','Cabo Verde','cv',               '2026-06-15 18:00:00+02','scheduled',14),
('H','Arabia Saudita','sa','Uruguay','uy',          '2026-06-16 00:00:00+02','scheduled',13),
('H','España','es','Arabia Saudita','sa',           '2026-06-21 18:00:00+02','scheduled',38),
('H','Uruguay','uy','Cabo Verde','cv',              '2026-06-22 00:00:00+02','scheduled',37),
('H','Cabo Verde','cv','Arabia Saudita','sa',       '2026-06-27 02:00:00+02','scheduled',65),
('H','Uruguay','uy','España','es',                  '2026-06-27 02:00:00+02','scheduled',66),

-- ── Grupo I ──────────────────────────────────────────────────
('I','Francia','fr','Senegal','sn',                 '2026-06-16 21:00:00+02','scheduled',17),
('I','Irak','iq','Noruega','no',                    '2026-06-17 00:00:00+02','scheduled',18),
('I','Francia','fr','Irak','iq',                    '2026-06-22 23:00:00+02','scheduled',42),
('I','Noruega','no','Senegal','sn',                 '2026-06-23 02:00:00+02','scheduled',41),
('I','Noruega','no','Francia','fr',                 '2026-06-26 21:00:00+02','scheduled',61),
('I','Senegal','sn','Irak','iq',                    '2026-06-26 21:00:00+02','scheduled',62),

-- ── Grupo J ──────────────────────────────────────────────────
('J','Argentina','ar','Argelia','dz',               '2026-06-17 03:00:00+02','scheduled',19),
('J','Austria','at','Jordania','jo',                '2026-06-17 06:00:00+02','scheduled',20),
('J','Argentina','ar','Austria','at',               '2026-06-22 19:00:00+02','scheduled',43),
('J','Jordania','jo','Argelia','dz',                '2026-06-23 05:00:00+02','scheduled',44),
('J','Argelia','dz','Austria','at',                 '2026-06-28 04:00:00+02','scheduled',69),
('J','Jordania','jo','Argentina','ar',              '2026-06-28 04:00:00+02','scheduled',70),

-- ── Grupo K ──────────────────────────────────────────────────
('K','Portugal','pt','RD Congo','cd',               '2026-06-17 19:00:00+02','scheduled',23),
('K','Uzbekistán','uz','Colombia','co',             '2026-06-18 04:00:00+02','scheduled',24),
('K','Portugal','pt','Uzbekistán','uz',             '2026-06-23 19:00:00+02','scheduled',47),
('K','Colombia','co','RD Congo','cd',               '2026-06-24 04:00:00+02','scheduled',48),
('K','Colombia','co','Portugal','pt',               '2026-06-28 01:30:00+02','scheduled',71),
('K','RD Congo','cd','Uzbekistán','uz',             '2026-06-28 01:30:00+02','scheduled',72),

-- ── Grupo L ──────────────────────────────────────────────────
('L','Inglaterra','gb-eng','Croacia','hr',          '2026-06-17 22:00:00+02','scheduled',22),
('L','Ghana','gh','Panamá','pa',                    '2026-06-18 01:00:00+02','scheduled',21),
('L','Inglaterra','gb-eng','Ghana','gh',            '2026-06-23 22:00:00+02','scheduled',45),
('L','Panamá','pa','Croacia','hr',                  '2026-06-24 01:00:00+02','scheduled',46),
('L','Panamá','pa','Inglaterra','gb-eng',           '2026-06-27 23:00:00+02','scheduled',67),
('L','Croacia','hr','Ghana','gh',                   '2026-06-27 23:00:00+02','scheduled',68);
