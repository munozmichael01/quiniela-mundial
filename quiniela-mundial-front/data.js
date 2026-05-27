// World Cup 2026 mock data — 48 teams, 12 groups A-L

const GROUPS = {
  A: ["México", "Canadá", "Croacia", "Marruecos"],
  B: ["EE.UU.", "Argentina", "Japón", "Senegal"],
  C: ["Brasil", "España", "Australia", "Irán"],
  D: ["Francia", "Alemania", "Suiza", "Corea del Sur"],
  E: ["Inglaterra", "Países Bajos", "Uruguay", "Irak"],
  F: ["Portugal", "Bélgica", "Ecuador", "Ghana"],
  G: ["Italia", "Colombia", "Chile", "Nigeria"],
  H: ["Dinamarca", "Polonia", "Costa Rica", "Túnez"],
  I: ["Suecia", "Serbia", "Camerún", "Arabia Saudita"],
  J: ["Noruega", "Gales", "Nueva Zelanda", "Egipto"],
  K: ["Austria", "Perú", "Catar", "Argelia"],
  L: ["Hungría", "Grecia", "Panamá", "Jordania"],
};

const FLAGS = {
  "México":"🇲🇽","Canadá":"🇨🇦","Croacia":"🇭🇷","Marruecos":"🇲🇦",
  "EE.UU.":"🇺🇸","Argentina":"🇦🇷","Japón":"🇯🇵","Senegal":"🇸🇳",
  "Brasil":"🇧🇷","España":"🇪🇸","Australia":"🇦🇺","Irán":"🇮🇷",
  "Francia":"🇫🇷","Alemania":"🇩🇪","Suiza":"🇨🇭","Corea del Sur":"🇰🇷",
  "Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Países Bajos":"🇳🇱","Uruguay":"🇺🇾","Irak":"🇮🇶",
  "Portugal":"🇵🇹","Bélgica":"🇧🇪","Ecuador":"🇪🇨","Ghana":"🇬🇭",
  "Italia":"🇮🇹","Colombia":"🇨🇴","Chile":"🇨🇱","Nigeria":"🇳🇬",
  "Dinamarca":"🇩🇰","Polonia":"🇵🇱","Costa Rica":"🇨🇷","Túnez":"🇹🇳",
  "Suecia":"🇸🇪","Serbia":"🇷🇸","Camerún":"🇨🇲","Arabia Saudita":"🇸🇦",
  "Noruega":"🇳🇴","Gales":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","Nueva Zelanda":"🇳🇿","Egipto":"🇪🇬",
  "Austria":"🇦🇹","Perú":"🇵🇪","Catar":"🇶🇦","Argelia":"🇩🇿",
  "Hungría":"🇭🇺","Grecia":"🇬🇷","Panamá":"🇵🇦","Jordania":"🇯🇴",
};

// ISO-2 codes for flagcdn.com (gb-eng / gb-wls for home nations)
const FLAG_CODES = {
  "México":"mx","Canadá":"ca","Croacia":"hr","Marruecos":"ma",
  "EE.UU.":"us","Argentina":"ar","Japón":"jp","Senegal":"sn",
  "Brasil":"br","España":"es","Australia":"au","Irán":"ir",
  "Francia":"fr","Alemania":"de","Suiza":"ch","Corea del Sur":"kr",
  "Inglaterra":"gb-eng","Países Bajos":"nl","Uruguay":"uy","Irak":"iq",
  "Portugal":"pt","Bélgica":"be","Ecuador":"ec","Ghana":"gh",
  "Italia":"it","Colombia":"co","Chile":"cl","Nigeria":"ng",
  "Dinamarca":"dk","Polonia":"pl","Costa Rica":"cr","Túnez":"tn",
  "Suecia":"se","Serbia":"rs","Camerún":"cm","Arabia Saudita":"sa",
  "Noruega":"no","Gales":"gb-wls","Nueva Zelanda":"nz","Egipto":"eg",
  "Austria":"at","Perú":"pe","Catar":"qa","Argelia":"dz",
  "Hungría":"hu","Grecia":"gr","Panamá":"pa","Jordania":"jo",
};

// Generate the 6 round-robin matches per group
// Schedule: each group plays 3 rounds; 3 groups share each day (6 matches/day)
function buildMatches() {
  const matches = [];
  const groupKeys = Object.keys(GROUPS);
  const monthsEs = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  groupKeys.forEach((g, groupIdx) => {
    const teams = GROUPS[g];
    const pairings = [[0,1],[2,3],[0,2],[1,3],[0,3],[1,2]];
    pairings.forEach((p, i) => {
      const round = Math.floor(i / 2);          // 0,1,2
      const matchInRound = i % 2;                // 0,1
      const dayInRound = Math.floor(groupIdx / 3); // 0-3 (4 days per round)
      const day = round * 4 + dayInRound;        // 0-11
      const slotInDay = (groupIdx % 3) * 2 + matchInRound; // 0-5
      const hour = 13 + slotInDay * 2;           // 13,15,17,19,21,23 UTC
      const kickoffMs = Date.UTC(2026, 5, 11 + day, hour, 0, 0);
      const d = new Date(kickoffMs);
      const dayLabel = `${d.getUTCDate()} ${monthsEs[d.getUTCMonth()]}`;
      const timeLabel = `${String(hour).padStart(2,"0")}:00`;
      matches.push({
        id: `${g}-${i}`,
        phase: "groups",
        group: g,
        round: round + 1,
        home: teams[p[0]],
        away: teams[p[1]],
        kickoffMs,
        kickoffISO: d.toISOString(),
        date: dayLabel,
        time: timeLabel,
      });
    });
  });
  // Sort by kickoff so matrix and admin show in chronological order naturally
  matches.sort((a, b) => a.kickoffMs - b.kickoffMs || a.id.localeCompare(b.id));
  return matches;
}

const MATCHES_GROUPS = buildMatches();

// Eliminatorias — 32 partidos con placeholders de cruces (1A, 2B, …)
function buildKnockout() {
  const monthsEs = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  // Slot labels are illustrative crossings (no Round-of-32 official bracket yet)
  const r32Pairs = [
    ["1A","3CD/F"], ["1C","3ABF"], ["1E","3ABCD"], ["1G","3CDFG"],
    ["2A","2C"],    ["1D","2F"],   ["1B","3GHIJ"], ["1F","3DEFG"],
    ["1H","3BEFI"], ["2H","2K"],   ["1J","3AEIJ"], ["1I","3HIJK"],
    ["1K","3DEIJ"], ["2J","2L"],   ["1L","3HIJK"], ["2B","2I"],
  ];
  const r32 = r32Pairs.map((p, i) => ({
    id: `R32-${i}`, phase: "r32", round: 4,
    homePlaceholder: p[0], awayPlaceholder: p[1],
    home: null, away: null,
  }));
  const r16 = Array.from({length:8}, (_, i) => ({
    id: `R16-${i}`, phase: "r16", round: 5,
    homePlaceholder: `G R32-${i*2}`, awayPlaceholder: `G R32-${i*2+1}`,
    home: null, away: null,
  }));
  const qf = Array.from({length:4}, (_, i) => ({
    id: `QF-${i}`, phase: "qf", round: 6,
    homePlaceholder: `G R16-${i*2}`, awayPlaceholder: `G R16-${i*2+1}`,
    home: null, away: null,
  }));
  const sf = Array.from({length:2}, (_, i) => ({
    id: `SF-${i}`, phase: "sf", round: 7,
    homePlaceholder: `G QF-${i*2}`, awayPlaceholder: `G QF-${i*2+1}`,
    home: null, away: null,
  }));
  const third = [{
    id: "3RD-0", phase: "third", round: 8,
    homePlaceholder: "P SF-0", awayPlaceholder: "P SF-1",
    home: null, away: null,
  }];
  const final = [{
    id: "FINAL-0", phase: "final", round: 9,
    homePlaceholder: "G SF-0", awayPlaceholder: "G SF-1",
    home: null, away: null,
  }];

  const all = [...r32, ...r16, ...qf, ...sf, ...third, ...final];
  // Assign kickoff dates spread across late June and July 2026
  const schedule = {
    r32:   { startDay: 18, perDay: 4 },   // 18–21 jun
    r16:   { startDay: 23, perDay: 2 },   // 23–26 jun (8 matches in 4 days)
    qf:    { startDay: 28, perDay: 2 },   // 28–29 jun
    sf:    { startDay: 1,  perDay: 1, month: 6 }, // 1–2 jul
    third: { startDay: 5,  perDay: 1, month: 6 },
    final: { startDay: 6,  perDay: 1, month: 6 },
  };
  const byPhase = {};
  all.forEach(m => { (byPhase[m.phase] ||= []).push(m); });
  Object.entries(byPhase).forEach(([phase, list]) => {
    const s = schedule[phase];
    list.forEach((m, i) => {
      const month = s.month != null ? s.month : 5; // 5 = jun (0-indexed)
      const day = s.startDay + Math.floor(i / s.perDay);
      const hour = 14 + (i % s.perDay) * 4;
      m.kickoffMs = Date.UTC(2026, month, day, hour, 0, 0);
      m.kickoffISO = new Date(m.kickoffMs).toISOString();
      const d = new Date(m.kickoffMs);
      m.date = `${d.getUTCDate()} ${monthsEs[d.getUTCMonth()]}`;
      m.time = `${String(hour).padStart(2,"0")}:00`;
    });
  });
  return all;
}

const MATCHES_KO = buildKnockout();
const MATCHES = [...MATCHES_GROUPS, ...MATCHES_KO];

// Phases meta — used by predictions screen + admin phase controls
const PHASES = [
  { id: "groups", label: "Grupos",         count: 72, defaultOpen: true },
  { id: "r32",    label: "Dieciseisavos",  count: 16, defaultOpen: false },
  { id: "r16",    label: "Octavos",        count: 8,  defaultOpen: false },
  { id: "qf",     label: "Cuartos",        count: 4,  defaultOpen: false },
  { id: "sf",     label: "Semifinales",    count: 2,  defaultOpen: false },
  { id: "third",  label: "3er puesto",     count: 1,  defaultOpen: false },
  { id: "final",  label: "Final",          count: 1,  defaultOpen: false },
];

// Helper: derive phase of any match
function matchPhase(m) { return m.phase || "groups"; }

// Mock players for bonus (originales/genéricos, top scorers de la era)
const TOP_SCORERS = [
  "Kylian Mbappé (FRA)", "Erling Haaland (NOR)", "Vinícius Jr (BRA)",
  "Lionel Messi (ARG)", "Harry Kane (ING)", "Lautaro Martínez (ARG)",
  "Bukayo Saka (ING)", "Julián Álvarez (ARG)", "Cristiano Ronaldo (POR)",
  "Rodrygo (BRA)", "Cody Gakpo (NED)", "Florian Wirtz (ALE)",
];

const MVP_CANDIDATES = [
  "Lionel Messi (ARG)", "Kylian Mbappé (FRA)", "Jude Bellingham (ING)",
  "Vinícius Jr (BRA)", "Rodri (ESP)", "Pedri (ESP)",
  "Lamine Yamal (ESP)", "Erling Haaland (NOR)", "Florian Wirtz (ALE)",
];

const GOALKEEPERS = [
  "Thibaut Courtois (BEL)", "Gianluigi Donnarumma (ITA)",
  "Emiliano Martínez (ARG)", "Mike Maignan (FRA)",
  "Alisson Becker (BRA)", "Unai Simón (ESP)",
  "Jordan Pickford (ING)", "Yann Sommer (SUI)",
];

const ALL_TEAMS = Object.values(GROUPS).flat();

// Mock participants — each has a username, email, and a seed of predictions
const PARTICIPANTS_RAW = [
  { name: "Laura Ramírez",      user: "laura.ramirez",    email: "laura.ramirez@email.com",    seed: 11 },
  { name: "Diego Morales",      user: "diego.morales",    email: "diego.morales@email.com",    seed: 22 },
  { name: "Andrea Pérez",       user: "andrea.perez",     email: "andrea.perez@email.com",     seed: 33 },
  { name: "Carlos Vega",        user: "carlos.vega",      email: "carlos.vega@email.com",      seed: 44 },
  { name: "Sofía López",        user: "sofia.lopez",      email: "sofia.lopez@email.com",      seed: 55 },
  { name: "Mateo Gómez",        user: "mateo.gomez",      email: "mateo.gomez@email.com",      seed: 66 },
  { name: "Valentina Núñez",    user: "valentina.nunez",  email: "valentina.nunez@email.com",  seed: 77 },
  { name: "Tú",                 user: "tu.usuario",       email: "tu@email.com",               seed: 88, isMe: true },
  { name: "Joaquín Torres",     user: "joaquin.torres",   email: "joaquin.torres@email.com",   seed: 99 },
  { name: "Camila Bravo",       user: "camila.bravo",     email: "camila.bravo@email.com",     seed: 110 },
  { name: "Felipe Soto",        user: "felipe.soto",      email: "felipe.soto@email.com",      seed: 121 },
  { name: "Renata Ortiz",       user: "renata.ortiz",     email: "renata.ortiz@email.com",     seed: 132 },
  { name: "Bruno Álvarez",      user: "bruno.alvarez",    email: "bruno.alvarez@email.com",    seed: 143 },
  { name: "Isabella Fernández", user: "isabella.fern",    email: "isabella.fernandez@email.com", seed: 154 },
];

// Seeded RNG for reproducible predictions
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Build participant predictions: each has predictions[matchId] = { home, away }
function buildParticipantPredictions() {
  const result = {};
  PARTICIPANTS_RAW.forEach(p => {
    const rng = mulberry32(p.seed);
    const preds = {};
    MATCHES.forEach((m, i) => {
      if (m.phase !== "groups") return; // KO matches: no historic mock predictions
      // Each participant has filled ~30-40 of the 72 matches
      const fillRate = 0.45 + (rng() * 0.35);
      if (rng() < fillRate) {
        preds[m.id] = {
          home: String(Math.floor(rng() * 4)),
          away: String(Math.floor(rng() * 4)),
        };
      }
    });
    result[p.user] = preds;
  });
  return result;
}

const PARTICIPANT_PREDICTIONS = buildParticipantPredictions();

const PARTICIPANTS = PARTICIPANTS_RAW.map(p => ({
  ...p,
  initials: initials(p.name),
  predictions: PARTICIPANT_PREDICTIONS[p.user],
}));

// Mock users for admin (the same participants, with passwords)
const PASS_WORDS = [
  "Gol7Mundial", "TiroPenalti26", "ArqueroMx99", "PaseMagico14",
  "FaltaDirecta8", "ArcoLibre22", "GolazoArg10", "PicaPiedra33",
  "JogoBonito77", "TacoCorto55", "EleganteFin", "DerbiClasico",
  "GolFinal2026", "PenaltiArquero",
];

const MOCK_USERS = PARTICIPANTS_RAW.map((p, i) => ({
  id: i + 1,
  user: p.user,
  name: p.name,
  email: p.email,
  pass: PASS_WORDS[i],
  initials: initials(p.name),
}));

window.QUINIELA_DATA = {
  GROUPS, FLAGS, FLAG_CODES, MATCHES, MATCHES_GROUPS, MATCHES_KO, PHASES,
  TOP_SCORERS, MVP_CANDIDATES, GOALKEEPERS,
  ALL_TEAMS, PARTICIPANTS, MOCK_USERS, initials, matchPhase,
};

// =============================================================
// Time helpers — "now" can be overridden via a demo phase tweak
// =============================================================
const DEMO_PHASES = {
  // Antes de que empiece el torneo y antes del cierre de bonus
  pre:    Date.UTC(2026, 5, 10, 12, 0, 0),
  // Mid-tournament: bonus cerrado, ~36 partidos finalizados, otros próximos
  curso:  Date.UTC(2026, 5, 17, 15, 30, 0),
  // Post-torneo: todos los partidos finalizados, listo para confirmar bonus oficiales
  post:   Date.UTC(2026, 5, 25, 12, 0, 0),
};
window.DEMO_PHASES = DEMO_PHASES;

// Bonus deadline = inicio del primer partido (11 jun 2026 13:00 UTC)
const BONUS_DEADLINE_MS = Date.UTC(2026, 5, 11, 13, 0, 0);
window.BONUS_DEADLINE_MS = BONUS_DEADLINE_MS;
window.BONUS_DEADLINE_LABEL = "11 de junio, 13:00 UTC";

let _nowOverride = DEMO_PHASES.curso; // default demo phase
window.setSimNow = (ms) => { _nowOverride = ms; };
window.getNow = () => _nowOverride != null ? _nowOverride : Date.now();

window.matchStatus = (m) => {
  const now = window.getNow();
  const start = m.kickoffMs;
  const end = start + 2 * 60 * 60 * 1000; // matches last ~2h
  if (now < start) return "upcoming";
  if (now < end) return "live";
  return "finished";
};

// Bonus closed when first match has started
window.bonusClosed = () => window.getNow() >= BONUS_DEADLINE_MS;

window.formatRelative = (iso) => {
  const now = window.getNow();
  const target = new Date(iso).getTime();
  const diff = target - now;
  const absMin = Math.abs(diff) / 60000;
  const absHr = absMin / 60;
  const absDay = absHr / 24;
  const past = diff < 0;
  if (absMin < 1) return past ? "Recién ahora" : "En instantes";
  if (absMin < 60) {
    const m = Math.round(absMin);
    return past ? `Hace ${m} min` : `En ${m} min`;
  }
  if (absHr < 24) {
    const h = Math.floor(absHr);
    return past ? `Hace ${h}h` : `En ${h}h`;
  }
  if (absDay < 2) return past ? "Ayer" : "Mañana";
  if (absDay < 7) {
    const d = Math.floor(absDay);
    return past ? `Hace ${d} días` : `En ${d} días`;
  }
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const date = new Date(iso);
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]}`;
};

// Scoring: exacto = 3, parcial (acierta diferencia de goles) = 2, signo (gana/empata) = 1
// Devuelve { type: 'exacto' | 'parcial' | 'signo' | 'fallo' | null, pts: 0-3 }
window.scorePrediction = function(pred, real) {
  if (!pred || !real) return { type: null, pts: 0 };
  if (pred.home === "" || pred.away === "" || pred.home == null || pred.away == null) return { type: null, pts: 0 };
  if (real.home === "" || real.away === "" || real.home == null || real.away == null) return { type: null, pts: 0 };
  const ph = +pred.home, pa = +pred.away, rh = +real.home, ra = +real.away;
  if (ph === rh && pa === ra) return { type: "exacto", pts: 3 };
  const diffP = ph - pa, diffR = rh - ra;
  if (diffP === diffR) return { type: "parcial", pts: 2 };
  if (Math.sign(diffP) === Math.sign(diffR)) return { type: "signo", pts: 1 };
  return { type: "fallo", pts: 0 };
};

// Aggregate stats for a participant
window.aggregateStats = function(predictions, realResults) {
  let exactos = 0, parciales = 0, signos = 0, fallos = 0, completados = 0, pts = 0;
  MATCHES.forEach(m => {
    const p = predictions[m.id];
    if (p && p.home !== "" && p.away !== "") completados++;
    const s = window.scorePrediction(p, realResults[m.id]);
    if (s.type === "exacto") exactos++;
    else if (s.type === "parcial") parciales++;
    else if (s.type === "signo") signos++;
    else if (s.type === "fallo") fallos++;
    pts += s.pts;
  });
  return { exactos, parciales, signos, fallos, completados, pts };
};
