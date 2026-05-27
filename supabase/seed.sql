-- ============================================================
-- Quiniela Mundial 2026 – Fixture oficial fase de grupos
-- Fuente: github.com/openfootball/worldcup.json
-- Horarios convertidos a UTC. España = UTC+2 en verano.
-- Banderas: https://flagcdn.com/24x18/{code}.png (sin API key)
-- ============================================================

insert into public.matches ("group", home, away, home_flag, away_flag, date, status) values

-- ── GRUPO A ──────────────────────────────────────────────────
-- México, Sudáfrica, Corea del Sur, República Checa
('A', 'México',            'Sudáfrica',        'mx', 'za', '2026-06-11T19:00:00Z', 'scheduled'),
('A', 'Corea del Sur',     'Rep. Checa',       'kr', 'cz', '2026-06-12T02:00:00Z', 'scheduled'),
('A', 'Rep. Checa',        'Sudáfrica',        'cz', 'za', '2026-06-18T16:00:00Z', 'scheduled'),
('A', 'México',            'Corea del Sur',    'mx', 'kr', '2026-06-19T01:00:00Z', 'scheduled'),
('A', 'Rep. Checa',        'México',           'cz', 'mx', '2026-06-25T01:00:00Z', 'scheduled'),
('A', 'Sudáfrica',         'Corea del Sur',    'za', 'kr', '2026-06-25T01:00:00Z', 'scheduled'),

-- ── GRUPO B ──────────────────────────────────────────────────
-- Canadá, Bosnia y Herzegovina, Catar, Suiza
('B', 'Canadá',            'Bosnia y Herz.',   'ca', 'ba', '2026-06-12T19:00:00Z', 'scheduled'),
('B', 'Catar',             'Suiza',            'qa', 'ch', '2026-06-13T19:00:00Z', 'scheduled'),
('B', 'Suiza',             'Bosnia y Herz.',   'ch', 'ba', '2026-06-18T19:00:00Z', 'scheduled'),
('B', 'Canadá',            'Catar',            'ca', 'qa', '2026-06-18T22:00:00Z', 'scheduled'),
('B', 'Suiza',             'Canadá',           'ch', 'ca', '2026-06-24T19:00:00Z', 'scheduled'),
('B', 'Bosnia y Herz.',    'Catar',            'ba', 'qa', '2026-06-24T19:00:00Z', 'scheduled'),

-- ── GRUPO C ──────────────────────────────────────────────────
-- Brasil, Marruecos, Haití, Escocia
('C', 'Brasil',            'Marruecos',        'br', 'ma', '2026-06-13T22:00:00Z', 'scheduled'),
('C', 'Haití',             'Escocia',          'ht', 'gb-sct', '2026-06-14T01:00:00Z', 'scheduled'),
('C', 'Escocia',           'Marruecos',        'gb-sct', 'ma', '2026-06-19T22:00:00Z', 'scheduled'),
('C', 'Brasil',            'Haití',            'br', 'ht', '2026-06-20T00:30:00Z', 'scheduled'),
('C', 'Escocia',           'Brasil',           'gb-sct', 'br', '2026-06-24T22:00:00Z', 'scheduled'),
('C', 'Marruecos',         'Haití',            'ma', 'ht', '2026-06-24T22:00:00Z', 'scheduled'),

-- ── GRUPO D ──────────────────────────────────────────────────
-- EE.UU., Paraguay, Australia, Turquía
('D', 'EE.UU.',            'Paraguay',         'us', 'py', '2026-06-13T01:00:00Z', 'scheduled'),
('D', 'Australia',         'Turquía',          'au', 'tr', '2026-06-14T04:00:00Z', 'scheduled'),
('D', 'EE.UU.',            'Australia',        'us', 'au', '2026-06-19T19:00:00Z', 'scheduled'),
('D', 'Turquía',           'Paraguay',         'tr', 'py', '2026-06-20T03:00:00Z', 'scheduled'),
('D', 'Turquía',           'EE.UU.',           'tr', 'us', '2026-06-26T02:00:00Z', 'scheduled'),
('D', 'Paraguay',          'Australia',        'py', 'au', '2026-06-26T02:00:00Z', 'scheduled'),

-- ── GRUPO E ──────────────────────────────────────────────────
-- Alemania, Curazao, Costa de Marfil, Ecuador
('E', 'Alemania',          'Curazao',          'de', 'cw', '2026-06-14T17:00:00Z', 'scheduled'),
('E', 'Costa de Marfil',   'Ecuador',          'ci', 'ec', '2026-06-14T23:00:00Z', 'scheduled'),
('E', 'Alemania',          'Costa de Marfil',  'de', 'ci', '2026-06-20T20:00:00Z', 'scheduled'),
('E', 'Ecuador',           'Curazao',          'ec', 'cw', '2026-06-21T00:00:00Z', 'scheduled'),
('E', 'Curazao',           'Costa de Marfil',  'cw', 'ci', '2026-06-25T20:00:00Z', 'scheduled'),
('E', 'Ecuador',           'Alemania',         'ec', 'de', '2026-06-25T20:00:00Z', 'scheduled'),

-- ── GRUPO F ──────────────────────────────────────────────────
-- Países Bajos, Japón, Suecia, Túnez
('F', 'Países Bajos',      'Japón',            'nl', 'jp', '2026-06-14T20:00:00Z', 'scheduled'),
('F', 'Suecia',            'Túnez',            'se', 'tn', '2026-06-15T02:00:00Z', 'scheduled'),
('F', 'Países Bajos',      'Suecia',           'nl', 'se', '2026-06-20T17:00:00Z', 'scheduled'),
('F', 'Túnez',             'Japón',            'tn', 'jp', '2026-06-21T04:00:00Z', 'scheduled'),
('F', 'Japón',             'Suecia',           'jp', 'se', '2026-06-25T23:00:00Z', 'scheduled'),
('F', 'Túnez',             'Países Bajos',     'tn', 'nl', '2026-06-25T23:00:00Z', 'scheduled'),

-- ── GRUPO G ──────────────────────────────────────────────────
-- Bélgica, Egipto, Irán, Nueva Zelanda
('G', 'Bélgica',           'Egipto',           'be', 'eg', '2026-06-15T19:00:00Z', 'scheduled'),
('G', 'Irán',              'Nueva Zelanda',    'ir', 'nz', '2026-06-16T01:00:00Z', 'scheduled'),
('G', 'Bélgica',           'Irán',             'be', 'ir', '2026-06-21T19:00:00Z', 'scheduled'),
('G', 'Nueva Zelanda',     'Egipto',           'nz', 'eg', '2026-06-22T01:00:00Z', 'scheduled'),
('G', 'Egipto',            'Irán',             'eg', 'ir', '2026-06-27T03:00:00Z', 'scheduled'),
('G', 'Nueva Zelanda',     'Bélgica',          'nz', 'be', '2026-06-27T03:00:00Z', 'scheduled'),

-- ── GRUPO H ──────────────────────────────────────────────────
-- España, Cabo Verde, Arabia Saudí, Uruguay
('H', 'España',            'Cabo Verde',       'es', 'cv', '2026-06-15T16:00:00Z', 'scheduled'),
('H', 'Arabia Saudí',      'Uruguay',          'sa', 'uy', '2026-06-15T22:00:00Z', 'scheduled'),
('H', 'España',            'Arabia Saudí',     'es', 'sa', '2026-06-21T16:00:00Z', 'scheduled'),
('H', 'Uruguay',           'Cabo Verde',       'uy', 'cv', '2026-06-21T22:00:00Z', 'scheduled'),
('H', 'Cabo Verde',        'Arabia Saudí',     'cv', 'sa', '2026-06-27T00:00:00Z', 'scheduled'),
('H', 'Uruguay',           'España',           'uy', 'es', '2026-06-27T00:00:00Z', 'scheduled'),

-- ── GRUPO I ──────────────────────────────────────────────────
-- Francia, Senegal, Irak, Noruega
('I', 'Francia',           'Senegal',          'fr', 'sn', '2026-06-16T19:00:00Z', 'scheduled'),
('I', 'Irak',              'Noruega',          'iq', 'no', '2026-06-16T22:00:00Z', 'scheduled'),
('I', 'Francia',           'Irak',             'fr', 'iq', '2026-06-22T21:00:00Z', 'scheduled'),
('I', 'Noruega',           'Senegal',          'no', 'sn', '2026-06-23T00:00:00Z', 'scheduled'),
('I', 'Noruega',           'Francia',          'no', 'fr', '2026-06-26T19:00:00Z', 'scheduled'),
('I', 'Senegal',           'Irak',             'sn', 'iq', '2026-06-26T19:00:00Z', 'scheduled'),

-- ── GRUPO J ──────────────────────────────────────────────────
-- Argentina, Argelia, Austria, Jordania
('J', 'Argentina',         'Argelia',          'ar', 'dz', '2026-06-17T01:00:00Z', 'scheduled'),
('J', 'Austria',           'Jordania',         'at', 'jo', '2026-06-17T04:00:00Z', 'scheduled'),
('J', 'Argentina',         'Austria',          'ar', 'at', '2026-06-22T17:00:00Z', 'scheduled'),
('J', 'Jordania',          'Argelia',          'jo', 'dz', '2026-06-23T03:00:00Z', 'scheduled'),
('J', 'Argelia',           'Austria',          'dz', 'at', '2026-06-28T02:00:00Z', 'scheduled'),
('J', 'Jordania',          'Argentina',        'jo', 'ar', '2026-06-28T02:00:00Z', 'scheduled'),

-- ── GRUPO K ──────────────────────────────────────────────────
-- Portugal, Rep. Dem. del Congo, Uzbekistán, Colombia
('K', 'Portugal',          'R.D. Congo',       'pt', 'cd', '2026-06-17T17:00:00Z', 'scheduled'),
('K', 'Uzbekistán',        'Colombia',         'uz', 'co', '2026-06-18T02:00:00Z', 'scheduled'),
('K', 'Portugal',          'Uzbekistán',       'pt', 'uz', '2026-06-23T17:00:00Z', 'scheduled'),
('K', 'Colombia',          'R.D. Congo',       'co', 'cd', '2026-06-24T02:00:00Z', 'scheduled'),
('K', 'Colombia',          'Portugal',         'co', 'pt', '2026-06-27T23:30:00Z', 'scheduled'),
('K', 'R.D. Congo',        'Uzbekistán',       'cd', 'uz', '2026-06-27T23:30:00Z', 'scheduled'),

-- ── GRUPO L ──────────────────────────────────────────────────
-- Inglaterra, Croacia, Ghana, Panamá
('L', 'Inglaterra',        'Croacia',          'gb-eng', 'hr', '2026-06-17T20:00:00Z', 'scheduled'),
('L', 'Ghana',             'Panamá',           'gh', 'pa', '2026-06-17T23:00:00Z', 'scheduled'),
('L', 'Inglaterra',        'Ghana',            'gb-eng', 'gh', '2026-06-23T20:00:00Z', 'scheduled'),
('L', 'Panamá',            'Croacia',          'pa', 'hr', '2026-06-23T23:00:00Z', 'scheduled'),
('L', 'Panamá',            'Inglaterra',       'pa', 'gb-eng', '2026-06-27T21:00:00Z', 'scheduled'),
('L', 'Croacia',           'Ghana',            'hr', 'gh', '2026-06-27T21:00:00Z', 'scheduled');

-- ──────────────────────────────────────────────────────────────
-- NOTAS
-- • external_id: se actualizará cuando API-Football publique los
--   IDs oficiales del Mundial 2026. Ejecutar UPDATE manualmente
--   o via script una vez disponibles.
-- • Banderas: https://flagcdn.com/24x18/{home_flag}.png
--   Códigos ISO 3166-1 alpha-2, excepto gb-eng y gb-sct
--   que son códigos de subdivisión del Reino Unido.
-- ──────────────────────────────────────────────────────────────
