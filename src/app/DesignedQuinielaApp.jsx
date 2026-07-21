/* eslint-disable */
"use client";

import React from "react";

// World Cup 2026 mock data — 48 teams, 12 groups A-L

// GROUPS se construye dinámicamente desde el backend — este objeto es solo fallback vacío
const GROUPS = {};

const FLAGS = {
  // Grupo A
  "México":"🇲🇽","Sudáfrica":"🇿🇦","Corea del Sur":"🇰🇷","República Checa":"🇨🇿",
  // Grupo B
  "Canadá":"🇨🇦","Bosnia y Herzegovina":"🇧🇦","Catar":"🇶🇦","Suiza":"🇨🇭",
  // Grupo C
  "Brasil":"🇧🇷","Marruecos":"🇲🇦","Haití":"🇭🇹","Escocia":"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  // Grupo D
  "Estados Unidos":"🇺🇸","Paraguay":"🇵🇾","Australia":"🇦🇺","Turquía":"🇹🇷",
  // Grupo E
  "Alemania":"🇩🇪","Curazao":"🇨🇼","Costa de Marfil":"🇨🇮","Ecuador":"🇪🇨",
  // Grupo F
  "Países Bajos":"🇳🇱","Japón":"🇯🇵","Suecia":"🇸🇪","Túnez":"🇹🇳",
  // Grupo G
  "Bélgica":"🇧🇪","Egipto":"🇪🇬","Irán":"🇮🇷","Nueva Zelanda":"🇳🇿",
  // Grupo H
  "España":"🇪🇸","Cabo Verde":"🇨🇻","Arabia Saudita":"🇸🇦","Uruguay":"🇺🇾",
  // Grupo I
  "Francia":"🇫🇷","Senegal":"🇸🇳","Irak":"🇮🇶","Noruega":"🇳🇴",
  // Grupo J
  "Argentina":"🇦🇷","Argelia":"🇩🇿","Austria":"🇦🇹","Jordania":"🇯🇴",
  // Grupo K
  "Portugal":"🇵🇹","RD Congo":"🇨🇩","Uzbekistán":"🇺🇿","Colombia":"🇨🇴",
  // Grupo L
  "Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croacia":"🇭🇷","Ghana":"🇬🇭","Panamá":"🇵🇦",
};

// ISO-2 codes for flagcdn.com (gb-eng / gb-wls for home nations)
const FLAG_CODES = {
  "México":"mx","Canadá":"ca","Croacia":"hr","Marruecos":"ma",
  "EE.UU.":"us","Estados Unidos":"us","Argentina":"ar","Japón":"jp","Senegal":"sn",
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
  // Equipos nuevos Mundial 2026
  "Sudáfrica":"za","República Checa":"cz","Bosnia y Herzegovina":"ba",
  "Haití":"ht","Escocia":"gb-sct","Paraguay":"py","Turquía":"tr",
  "Curazao":"cw","Costa de Marfil":"ci","Cabo Verde":"cv",
  "RD Congo":"cd","Uzbekistán":"uz",
};

const MATCHES_GROUPS = [];

function formatMatchDateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return {
    date: `${date.getDate()} ${months[date.getMonth()]}`,
    time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
  };
}

function venezuelaISO(year, month, day, hour, minute = 0) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-04:00`;
}

// Eliminatorias — cruces definidos con horarios EDT / Venezuela
function buildKnockout() {
  const make = (id, phase, round, home, away, iso) => {
    const kickoff = new Date(iso);
    const formatted = formatMatchDateTime(kickoff);
    return {
      id, phase, round, home, away,
      kickoffMs: kickoff.getTime(),
      kickoffISO: iso,
      date: formatted.date,
      time: formatted.time,
    };
  };

  const r32Data = [
    ["R32-0", "Sudáfrica", "Canadá", venezuelaISO(2026, 6, 28, 15)],
    ["R32-1", "Brasil", "Japón", venezuelaISO(2026, 6, 29, 13)],
    ["R32-2", "Alemania", "Paraguay", venezuelaISO(2026, 6, 29, 16, 30)],
    ["R32-3", "Países Bajos", "Marruecos", venezuelaISO(2026, 6, 29, 21)],
    ["R32-4", "Costa de Marfil", "Noruega", venezuelaISO(2026, 6, 30, 13)],
    ["R32-5", "Francia", "Suecia", venezuelaISO(2026, 6, 30, 17)],
    ["R32-6", "México", "Ecuador", venezuelaISO(2026, 6, 30, 21)],
    ["R32-7", "Inglaterra", "RD Congo", venezuelaISO(2026, 7, 1, 12)],
    ["R32-8", "Bélgica", "Senegal", venezuelaISO(2026, 7, 1, 16)],
    ["R32-9", "Estados Unidos", "Bosnia y Herzegovina", venezuelaISO(2026, 7, 1, 20)],
    ["R32-10", "España", "Austria", venezuelaISO(2026, 7, 2, 15)],
    ["R32-11", "Portugal", "Croacia", venezuelaISO(2026, 7, 2, 19)],
    ["R32-12", "Suiza", "Argelia", venezuelaISO(2026, 7, 2, 23)],
    ["R32-13", "Australia", "Egipto", venezuelaISO(2026, 7, 3, 14)],
    ["R32-14", "Argentina", "Cabo Verde", venezuelaISO(2026, 7, 3, 18)],
    ["R32-15", "Colombia", "Ghana", venezuelaISO(2026, 7, 3, 21, 30)],
  ];

  const r32 = r32Data.map(([id, home, away, iso]) => make(id, "r32", 4, home, away, iso));
  const r16 = Array.from({length:8}, (_, i) => ({
    id: `R16-${i}`, phase: "r16", round: 5,
    homePlaceholder: [
      "Ganador Sudáfrica/Canadá", "Ganador Alemania/Paraguay", "Ganador Brasil/Japón", "Ganador México/Ecuador",
      "Ganador Portugal/Croacia", "Ganador EE. UU./Bosnia", "Ganador Argentina/Cabo Verde", "Ganador Suiza/Argelia",
    ][i],
    awayPlaceholder: [
      "Ganador Países Bajos/Marruecos", "Ganador Francia/Suecia", "Ganador Costa de Marfil/Noruega", "Ganador Inglaterra/RD Congo",
      "Ganador España/Austria", "Ganador Bélgica/Senegal", "Ganador Australia/Egipto", "Ganador Colombia/Ghana",
    ][i],
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
  const phaseDates = {
    r16: [venezuelaISO(2026, 7, 4, 12), venezuelaISO(2026, 7, 4, 16), venezuelaISO(2026, 7, 5, 12), venezuelaISO(2026, 7, 5, 16), venezuelaISO(2026, 7, 6, 12), venezuelaISO(2026, 7, 6, 16), venezuelaISO(2026, 7, 7, 12), venezuelaISO(2026, 7, 7, 16)],
    qf: [venezuelaISO(2026, 7, 9, 15), venezuelaISO(2026, 7, 10, 15), venezuelaISO(2026, 7, 11, 12), venezuelaISO(2026, 7, 11, 16)],
    sf: [venezuelaISO(2026, 7, 14, 15), venezuelaISO(2026, 7, 15, 15)],
    third: [venezuelaISO(2026, 7, 18, 15)],
    final: [venezuelaISO(2026, 7, 19, 15)],
  };
  all.forEach((m) => {
    if (m.kickoffISO) return;
    const phaseList = all.filter(match => match.phase === m.phase);
    const phaseIndex = phaseList.findIndex(match => match.id === m.id);
    const iso = phaseDates[m.phase]?.[phaseIndex] || venezuelaISO(2026, 7, 19, 15);
    const kickoff = new Date(iso);
    const formatted = formatMatchDateTime(kickoff);
    m.kickoffMs = kickoff.getTime();
    m.kickoffISO = iso;
    m.date = formatted.date;
    m.time = formatted.time;
  });
  return all;
}

const MATCHES_KO = buildKnockout();
const MATCHES = [...MATCHES_GROUPS, ...MATCHES_KO];

// Phases meta — used by predictions screen + admin phase controls
const PHASES = [
  { id: "bonus",  label: "Bonus",          count: null, defaultOpen: true },
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
function matchBucket(m) { return matchPhase(m) === "groups" ? "groups" : "knockout"; }
function bucketLabel(bucket) { return bucket === "groups" ? "Fase de grupos" : "Eliminatorias"; }
function compactPhaseLabel(phase) {
  const labels = {
    r32: "16avos",
    r16: "8vos",
    qf: "4tos",
    sf: "SF",
    third: "3er",
    final: "Final",
  };
  return labels[phase] || "KO";
}
function matchInBucket(m, bucket) { return bucket === "all" || matchBucket(m) === bucket; }

// Mock players for bonus (originales/genéricos, top scorers de la era)
const TOP_SCORERS = [
  "Kylian Mbappé", "Erling Haaland", "Vinícius Jr",
  "Lionel Messi", "Harry Kane", "Lautaro Martínez",
  "Bukayo Saka", "Julián Álvarez", "Cristiano Ronaldo",
  "Rodrygo", "Cody Gakpo", "Florian Wirtz",
  "Alexandre Olise", "Ferran Torres", "Lamine Yamal",
  "Mikel Oyarzabal",
];

const MVP_CANDIDATES = [
  "Lionel Messi", "Kylian Mbappé", "Jude Bellingham",
  "Vinícius Jr", "Rodri", "Pedri",
  "Lamine Yamal", "Erling Haaland", "Florian Wirtz",
  "Vitinha", "Bruno Fernandes", "Ousmane Dembélé",
  "Cristiano Ronaldo", "Harry Kane", "Vinicius Jr",
  "Leo Messi", "Cherki",
];

const GOALKEEPERS = [
  "Thibaut Courtois", "Gianluigi Donnarumma",
  "Emiliano Martínez", "Mike Maignan",
  "Alisson Becker", "Unai Simón",
  "Jordan Pickford", "Yann Sommer",
  "Diogo Costa", "Yassine Bounou",
  "Zion Suzuki", "Manuel Neuer",
];

const ALL_TEAMS = [];

function initials(name) {
  const parts = String(name || "").trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const PARTICIPANTS = [];
const MOCK_USERS = [];

window.QUINIELA_DATA = {
  GROUPS, FLAGS, FLAG_CODES, MATCHES, MATCHES_GROUPS, MATCHES_KO, PHASES,
  TOP_SCORERS, MVP_CANDIDATES, GOALKEEPERS,
  ALL_TEAMS, PARTICIPANTS, MOCK_USERS, initials, matchPhase,
  matchBucket, bucketLabel, matchInBucket,
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

let _nowOverride = null; // null = use real time
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
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

function compareMatchesByKickoff(a, b) {
  const aTime = Number.isFinite(a.kickoffMs) ? a.kickoffMs : new Date(a.kickoffISO || a.date).getTime();
  const bTime = Number.isFinite(b.kickoffMs) ? b.kickoffMs : new Date(b.kickoffISO || b.date).getTime();
  return aTime - bTime || String(a.id).localeCompare(String(b.id));
}

function sortMatchesByKickoff(matches) {
  return [...matches].sort(compareMatchesByKickoff);
}

function dayKeyFromDate(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function dayKeyFromMatch(match) {
  return dayKeyFromDate(new Date(Number.isFinite(match.kickoffMs) ? match.kickoffMs : match.kickoffISO));
}

function dayMsFromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month, day).getTime();
}

function dateFilterLabel(day) {
  const todayKey = dayKeyFromDate(new Date(window.getNow()));
  const tomorrowKey = dayKeyFromDate(new Date(window.getNow() + 24 * 60 * 60 * 1000));
  const yesterdayKey = dayKeyFromDate(new Date(window.getNow() - 24 * 60 * 60 * 1000));
  if (day.key === todayKey) return "Hoy";
  if (day.key === tomorrowKey) return "Mañana";
  if (day.key === yesterdayKey) return "Ayer";
  const date = new Date(dayMsFromKey(day.key));
  const days = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
}

function groupMatchesByDay(matches) {
  const days = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return sortMatchesByKickoff(matches).reduce((acc, match) => {
    const date = new Date(Number.isFinite(match.kickoffMs) ? match.kickoffMs : match.kickoffISO);
    const key = dayKeyFromDate(date);
    let day = acc.find(item => item.key === key);
    if (!day) {
      day = {
        key,
        label: `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`,
        matches: [],
      };
      acc.push(day);
    }
    day.matches.push(match);
    return acc;
  }, []);
}

function winnerLabel(match, prediction) {
  if (!match || !prediction || prediction.home === "" || prediction.away === "") return "";
  const homeScore = Number(prediction.home);
  const awayScore = Number(prediction.away);
  if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore) || homeScore === awayScore) return "";
  return homeScore > awayScore
    ? (match.home || match.homePlaceholder || "")
    : (match.away || match.awayPlaceholder || "");
}

function winnerTeam(match, result) {
  if (!match || !result || result.home === "" || result.away === "") return null;
  const homeScore = Number(result.home);
  const awayScore = Number(result.away);
  if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore) || homeScore === awayScore) return null;
  if (homeScore > awayScore) return { name: match.home || match.homePlaceholder || "", flagSource: match.home || null };
  return { name: match.away || match.awayPlaceholder || "", flagSource: match.away || null };
}

function withPredictedKnockoutLabels(matches, predictions) {
  const copies = sortMatchesByKickoff(matches).map(m => ({ ...m }));
  const byPhase = (phase) => copies.filter(m => matchPhase(m) === phase);
  const setFromWinners = (targetPhase, sourcePhase, pairs) => {
    const targets = byPhase(targetPhase);
    const sources = byPhase(sourcePhase);
    targets.forEach((target, index) => {
      const [homeIndex, awayIndex] = pairs[index] || [];
      const homeWinner = winnerLabel(sources[homeIndex], predictions[sources[homeIndex]?.id]);
      const awayWinner = winnerLabel(sources[awayIndex], predictions[sources[awayIndex]?.id]);
      if (homeWinner) {
        target.home = null;
        target.homePlaceholder = homeWinner;
      }
      if (awayWinner) {
        target.away = null;
        target.awayPlaceholder = awayWinner;
      }
    });
  };

  setFromWinners("r16", "r32", [[0,3],[2,5],[1,4],[6,7],[11,10],[9,8],[14,13],[12,15]]);
  setFromWinners("qf", "r16", [[0,1],[2,3],[4,5],[6,7]]);
  setFromWinners("sf", "qf", [[0,2],[1,3]]);
  setFromWinners("final", "sf", [[0,1]]);

  const third = byPhase("third")[0];
  const sf = byPhase("sf");
  if (third) {
    const loser = (match) => {
      const p = predictions[match?.id];
      if (!match || !p || p.home === "" || p.away === "") return "";
      const homeScore = Number(p.home);
      const awayScore = Number(p.away);
      if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore) || homeScore === awayScore) return "";
      return homeScore < awayScore
        ? (match.home || match.homePlaceholder || "")
        : (match.away || match.awayPlaceholder || "");
    };
    third.homePlaceholder = loser(sf[0]) || third.homePlaceholder;
    third.awayPlaceholder = loser(sf[1]) || third.awayPlaceholder;
  }

  return copies;
}

// Scoring: exacto = 3, parcial (mismo signo ganador/empate) = 1, fallo = 0
// Devuelve { type: 'exacto' | 'parcial' | 'fallo' | null, pts: 0-3 }
window.scorePrediction = function(pred, real) {
  if (!pred || !real) return { type: null, pts: 0 };
  if (pred.home === "" || pred.away === "" || pred.home == null || pred.away == null) return { type: null, pts: 0 };
  if (real.home === "" || real.away === "" || real.home == null || real.away == null) return { type: null, pts: 0 };
  const ph = +pred.home, pa = +pred.away, rh = +real.home, ra = +real.away;
  if (ph === rh && pa === ra) return { type: "exacto", pts: 3 };
  if (Math.sign(ph - pa) === Math.sign(rh - ra)) return { type: "parcial", pts: 1 };
  return { type: "fallo", pts: 0 };
};

// Aggregate stats for a participant
window.aggregateStats = function(predictions, realResults, options = {}) {
  const bucket = options.bucket || "all";
  const matches = (window.QUINIELA_DATA?.MATCHES || MATCHES).filter(m => matchInBucket(m, bucket));
  let exactos = 0, parciales = 0, fallos = 0, completados = 0, pts = 0;
  matches.forEach(m => {
    const p = predictions[m.id];
    if (p && p.home !== "" && p.away !== "") completados++;
    const s = window.scorePrediction(p, realResults[m.id]);
    if (s.type === "exacto") exactos++;
    else if (s.type === "parcial") parciales++;
    else if (s.type === "fallo") fallos++;
    pts += s.pts;
  });
  return { exactos, parciales, fallos, completados, pts, total: matches.length };
};

// 5 pts por cada bonus correcto
const BONUS_PTS_PER_HIT = 5;
window.BONUS_PTS_PER_HIT = BONUS_PTS_PER_HIT;
const BONUS_FIELDS = ["campeon", "subcampeon", "goleador", "mvp", "portero"];
window.calcBonusPts = function(picks, officialBonus) {
  if (!picks || !officialBonus) return 0;
  return BONUS_FIELDS.reduce((sum, key) => {
    return sum + (picks[key] && officialBonus[key] && picks[key] === officialBonus[key] ? BONUS_PTS_PER_HIT : 0);
  }, 0);
};


// Reusable icons + utility components

const Icon = {
  Download: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12"/>
      <path d="M7 10l5 5 5-5"/>
      <path d="M5 21h14"/>
    </svg>
  ),
  Trophy: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v4a6 6 0 0 1-12 0V3z"/>
      <path d="M18 5h2a2 2 0 0 1 0 4h-2"/>
      <path d="M6 5H4a2 2 0 0 0 0 4h2"/>
      <path d="M10 14h4v3h-4z"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  List: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13"/>
      <circle cx="4" cy="6" r="1.4"/><circle cx="4" cy="12" r="1.4"/><circle cx="4" cy="18" r="1.4"/>
    </svg>
  ),
  Rank: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V10M12 21V4M20 21v-7"/>
    </svg>
  ),
  Star: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"/>
    </svg>
  ),
  Settings: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
    </svg>
  ),
  Check: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12l5 5L20 6"/>
    </svg>
  ),
  Copy: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="11" height="11" rx="2"/>
      <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
    </svg>
  ),
  Trash: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    </svg>
  ),
  Plus: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Chevron: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
  Search: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <path d="M21 21l-4.3-4.3"/>
    </svg>
  ),
  Alert: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 8v4M12 16h.01"/>
    </svg>
  ),
  Whistle: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="13" r="6"/>
      <path d="M14 7V5h6M3 13h4"/>
    </svg>
  ),
  Ball: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 3l3 4-1.5 4.5L12 12 10.5 11.5 9 7l3-4z M3 12l4 1 3 3-1 4-3-1M21 12l-4 1-3 3 1 4 3-1"/>
    </svg>
  ),
  Glove: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 21v-7a2 2 0 0 1 2-2h1V5a2 2 0 1 1 4 0v5h1a3 3 0 0 1 3 3v8z"/>
      <path d="M7 16h11"/>
    </svg>
  ),
  LogOut: (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
  ),
  Shield: (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/>
    </svg>
  ),
  Lock: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2"/>
      <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
    </svg>
  ),
  Clock: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3.5 2"/>
    </svg>
  ),
  Live: (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
      <circle cx="12" cy="12" r="9" opacity=".25"/>
    </svg>
  ),
  Bar: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18M7 14v4M12 9v9M17 4v14"/>
    </svg>
  ),
  Users: (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Eye: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
      <path d="M1 1l22 22"/>
    </svg>
  ),
  Share2: (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"/>
    </svg>
  ),
  Matrix: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
};

// Flag image — flagcdn.com w{width} format (soporta 20, 40, 80, 160…)
function FlagImg({ team, size = 24 }) {
  const code = (window.QUINIELA_DATA?.FLAG_CODES || {})[team];
  const h = Math.round(size * 0.75);
  // Snap to the nearest supported width bucket
  const w = size <= 20 ? 20 : size <= 40 ? 40 : 80;
  if (!code) {
    return <span className="flag-img flag-fallback" style={{width: size, height: h}}/>;
  }
  return (
    <img
      className="flag-img"
      src={`https://flagcdn.com/w${w}/${code}.png`}
      srcSet={`https://flagcdn.com/w${w * 2}/${code}.png 2x`}
      width={size}
      height={h}
      alt={team}
      loading="lazy"
    />
  );
}
window.FlagImg = FlagImg;

window.Icon = Icon;

function SegmentedControl({ options, value, onChange, ariaLabel, className = "", compact = false }) {
  return (
    <div className={`segmented-control ${compact ? "compact" : ""} ${className}`} role="tablist" aria-label={ariaLabel}>
      {options.map(option => (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={value === option.id}
          className={`segmented-option ${value === option.id ? "active" : ""} ${option.disabled ? "disabled" : ""}`}
          disabled={option.disabled}
          onClick={() => onChange(option.id)}
        >
          <span className="segmented-label">
            {option.icon}
            {option.label}
          </span>
          {option.meta != null && <span className="segmented-meta">{option.meta}</span>}
        </button>
      ))}
    </div>
  );
}

function AdminNav({ tabs, value, onChange }) {
  return (
    <nav className="admin-nav" aria-label="Sección admin">
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          className={`admin-nav-item ${value === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

function SelectControl({ label, value, onChange, options, className = "" }) {
  return (
    <div className={`control-field ${className}`}>
      {label && <label className="label">{label}</label>}
      <select className="select" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}





// Login screen

function OriginalLoginScreen({ onLogin }) {
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  function submit(e) {
    e.preventDefault();
    setErr("");
    if (!user || !pass) {
      setErr("Introduce usuario y contraseña.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Admin shortcut
      if (user.toLowerCase() === "admin" && pass === "admin") {
        onLogin({ name: "Admin", role: "admin", initials: "AD", user: "admin" });
        return;
      }
      // Lookup in seeded users
      const MU = window.QUINIELA_DATA.MOCK_USERS;
      const found = MU.find(u => u.user.toLowerCase() === user.trim().toLowerCase());
      if (found && (pass === found.pass || pass.length >= 4)) {
        onLogin({
          name: found.name, role: "user",
          initials: found.initials, user: found.user, email: found.email,
        });
        return;
      }
      if (pass.length < 4) {
        setErr("Usuario o contraseña incorrectos.");
        setLoading(false);
      } else {
        // Allow any account in demo mode
        const initialsStr = user.slice(0, 2).toUpperCase();
        const displayName = user.split(".").map(p => p[0].toUpperCase() + p.slice(1)).join(" ");
        onLogin({ name: displayName, role: "user", initials: initialsStr, user });
      }
    }, 450);
  }

  return (
    <div className="login-shell">
      {/* Desktop-only hero panel (hidden on mobile via CSS) */}
      <div className="login-hero-side">
        <div className="login-brand-desktop">
          <div className="topbar-logo" style={{width: 40, height: 40, borderRadius: 11, fontSize: 16}}>Q26</div>
          <div>
            <div className="topbar-title" style={{fontSize: 15, color: "white"}}>Quiniela</div>
            <div className="topbar-sub" style={{fontSize: 10, color: "rgba(255,255,255,0.7)"}}>Mundial 2026</div>
          </div>
        </div>
        <div className="login-pitch">
          <h1>Acierta.<br/>Suma.<br/>Quédate arriba.</h1>
          <p>Predice los resultados de los 104 partidos del Mundial 2026 y compite con tus amigos.</p>
        </div>
        <div className="login-stats-row">
          <div>
            <div className="stat-num">48</div>
            <div className="stat-cap">Selecciones</div>
          </div>
          <div>
            <div className="stat-num">104</div>
            <div className="stat-cap">Partidos</div>
          </div>
          <div>
            <div className="stat-num">12</div>
            <div className="stat-cap">Grupos · A–L</div>
          </div>
        </div>
      </div>

      {/* Mobile brand bar */}
      <div className="login-brand">
        <div className="topbar-logo" style={{width: 40, height: 40, borderRadius: 11, fontSize: 16}}>Q26</div>
        <div>
          <div className="topbar-title" style={{fontSize: 15}}>Quiniela</div>
          <div className="topbar-sub" style={{fontSize: 10}}>Mundial 2026</div>
        </div>
      </div>

      <div className="login-hero">
        <h1>Acierta. Suma.<br/>Quédate arriba.</h1>
        <p>Predice los resultados de los 104 partidos del Mundial 2026 y compite con tus amigos.</p>
      </div>

      <div className="login-form-side">
        <div className="login-form-card">
          <form className="login-card" onSubmit={submit}>
        {err && (
          <div className="error-msg">
            <Icon.Alert size={14}/>
            <span>{err}</span>
          </div>
        )}

        <div className="field" style={{marginBottom: 14}}>
          <label className="label">Usuario</label>
          <input
            className={`input ${err ? "error" : ""}`}
            type="text"
            placeholder="tu.usuario"
            value={user}
            onChange={e => setUser(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>

        <div className="field" style={{marginBottom: 20}}>
          <label className="label">Contraseña</label>
          <input
            className={`input ${err ? "error" : ""}`}
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>

        <div className="login-hint">
          ¿No tienes cuenta? Pide al admin que te dé acceso.<br/>
          <span style={{opacity: .7}}>Demo: <code>admin</code> / <code>admin</code> para panel admin</span>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;


// Mis Pronósticos — pestañas por fase, bloqueo por kickoff + por fase cerrada

function PredictionsScreen({ predictions, setPredictions, realResults, phaseOpen }) {
  const { MATCHES, PHASES, matchPhase } = window.QUINIELA_DATA;
  const [bucketTab, setBucketTab] = React.useState("knockout");
  const [activeDayKey, setActiveDayKey] = React.useState("");
  const dateTabsRef = React.useRef(null);
  const activeDateRef = React.useRef(null);
  const [toast, setToast] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const knockoutOpen = PHASES.some(ph => ph.id !== "bonus" && ph.id !== "groups" && phaseOpen[ph.id]);
  const bucketUnlocked = bucketTab === "groups" ? phaseOpen.groups : knockoutOpen;
  const displayMatches = React.useMemo(() => MATCHES, [MATCHES]);
  const bucketMatches = displayMatches.filter(m => matchInBucket(m, bucketTab));
  const totalMatches = bucketMatches.length;
  const completed = bucketMatches.filter(m => {
    const p = predictions[m.id];
    return p && p.home !== "" && p.away !== "" && p.home != null && p.away != null;
  }).length;

  const points = React.useMemo(() => {
    let pts = 0;
    bucketMatches.forEach(m => {
      pts += window.scorePrediction(predictions[m.id], realResults[m.id]).pts;
    });
    return pts;
  }, [bucketMatches, predictions, realResults]);

  function setScore(matchId, side, value) {
    const clean = value.replace(/[^0-9]/g, "").slice(0, 2);
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...(prev[matchId] || {home:"",away:""}), [side]: clean }
    }));
  }

  async function save() {
    const matchById = new Map(MATCHES.map(m => [String(m.id), m]));
    const rows = Object.entries(predictions)
      .filter(([matchId, p]) => {
        const match = matchById.get(matchId);
        return match
          && (matchInBucket(match, "groups") ? phaseOpen.groups : knockoutOpen)
          && window.matchStatus(match) === "upcoming"
          && p.home !== ""
          && p.away !== "";
      })
      .map(([matchId, p]) => ({
        match_id: Number(matchId),
        home_score: Number(p.home),
        away_score: Number(p.away),
      }));
    if (rows.length === 0) return;
    setSaving(true);
    try {
      await api("/api/predictions", { method: "PUT", body: JSON.stringify(rows) });
      setToast("Pronósticos guardados");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Error al guardar. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(""), 2500);
    }
  }

  const bucketCounts = ["groups", "knockout"].map(bucket => {
    const inPhase = displayMatches.filter(m => matchInBucket(m, bucket));
    const done = inPhase.filter(m => {
      const p = predictions[m.id];
      return p && p.home !== "" && p.away !== "";
    }).length;
    return {
      id: bucket,
      label: bucketLabel(bucket),
      done,
      total: inPhase.length,
      open: bucket === "groups" ? phaseOpen.groups : knockoutOpen,
    };
  });

  const activePhase = bucketCounts.find(p => p.id === bucketTab) || bucketCounts[0];
  const phaseUnlocked = bucketUnlocked;
  const phaseMatches = sortMatchesByKickoff(bucketMatches);
  const availableDays = groupMatchesByDay(phaseMatches);
  const availableDayKeys = availableDays.map(day => day.key).join("|");
  const selectedDayKey = availableDays.some(day => day.key === activeDayKey)
    ? activeDayKey
    : "";
  const visibleMatches = selectedDayKey
    ? phaseMatches.filter(m => dayKeyFromMatch(m) === selectedDayKey)
    : phaseMatches;
  const visibleDays = groupMatchesByDay(visibleMatches);

  React.useEffect(() => {
    if (availableDays.length === 0) {
      setActiveDayKey("");
      return;
    }
    const todayKey = dayKeyFromDate(new Date(window.getNow()));
    if (availableDays.some(day => day.key === activeDayKey)) return;
    const todayMs = dayMsFromKey(todayKey);
    const todayDay = availableDays.find(day => day.key === todayKey);
    const nextDay = availableDays.find(day => dayMsFromKey(day.key) >= todayMs);
    setActiveDayKey((todayDay || nextDay || availableDays[0]).key);
  }, [bucketTab, activeDayKey, availableDayKeys]);

  React.useLayoutEffect(() => {
    if (!selectedDayKey) return;
    const scroller = dateTabsRef.current;
    const active = activeDateRef.current;
    if (!scroller || !active) return;
    const alignActiveDate = () => {
      const styles = window.getComputedStyle(scroller);
      const inset = parseFloat(styles.paddingLeft) || 0;
      const scrollerRect = scroller.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const left = scroller.scrollLeft + activeRect.left - scrollerRect.left - inset;
      scroller.scrollTo({ left: Math.max(0, left), behavior: "auto" });
    };
    alignActiveDate();
    const frame1 = window.requestAnimationFrame(alignActiveDate);
    const frame2 = window.requestAnimationFrame(() => window.requestAnimationFrame(alignActiveDate));
    return () => {
      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);
    };
  }, [selectedDayKey, availableDayKeys, bucketTab]);

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">Mis Pronósticos</div>
          <div className="topbar-sub">{activePhase.label} · {phaseUnlocked ? "Abierta" : "Cerrada"}</div>
        </div>
        <div className="topbar-right">
          <span className="tag">{completed}/{totalMatches}</span>
        </div>
      </div>

      <div className="section" style={{paddingBottom: 8}}>
        <div className="stat-row">
          <div className="stat">
            <div className="stat-label">Completados</div>
            <div className="stat-value">
              {completed}<small>/ {totalMatches}</small>
            </div>
            <div className="progress"><div style={{width: `${(completed/totalMatches)*100}%`}}/></div>
          </div>
          <div className="stat">
            <div className="stat-label">Puntos</div>
            <div className="stat-value">
              {points}<small>pts</small>
            </div>
            <div className="muted-2" style={{marginTop: 8, fontSize: 11}}>
              Exacto +3 · Parcial +1
            </div>
          </div>
        </div>
      </div>

      {/* Bucket tabs */}
      <div className="section" style={{paddingTop: 4, paddingBottom: 8}}>
        <SegmentedControl
          ariaLabel="Bloque de pronósticos"
          value={bucketTab}
          onChange={(id) => {
            if (bucketTab !== id) setActiveDayKey("");
            setBucketTab(id);
          }}
          options={bucketCounts.map(ph => ({
            id: ph.id,
            label: ph.label,
            meta: `${ph.done}/${ph.total}`,
            icon: !ph.open ? <Icon.Lock size={10}/> : null,
          }))}
        />
      </div>

      {availableDays.length > 0 && (
        <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
          <div className="date-tabs" ref={dateTabsRef} aria-label="Filtrar por fecha">
            {availableDays.map(day => (
              <button
                key={day.key}
                ref={selectedDayKey === day.key ? activeDateRef : null}
                className={`date-tab ${selectedDayKey === day.key ? "active" : ""}`}
                onClick={() => setActiveDayKey(day.key)}
              >
                <span>{dateFilterLabel(day)}</span>
                <small>{day.matches.length} {day.matches.length === 1 ? "partido" : "partidos"}</small>
              </button>
            ))}
          </div>
        </div>
      )}

      {!phaseUnlocked && (
        <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
          <div className="notice closed">
            <Icon.Lock size={16}/>
            <div>
              <strong>Fase de {activePhase.label.toLowerCase()} aún no abierta.</strong><br/>
              Los partidos estarán disponibles para pronosticar cuando el admin la habilite.
            </div>
          </div>
        </div>
      )}

      {/* Group view */}
      {bucketTab === "groups" && (
        <div className="section" style={{paddingTop: 0}}>
          <div className="section-title">{selectedDayKey ? "Partidos del día" : "Grupos · 12 grupos · 72 partidos"}</div>
          {visibleDays.map(day => {
            const done = day.matches.filter(m => {
              const p = predictions[m.id];
              return p && p.home !== "" && p.away !== "";
            }).length;
            return (
              <div className="card group-card" key={day.key}>
                <div className="group-head open">
                  <div className="group-badge">{day.matches.length}</div>
                  <div>
                    <div className="group-title">{day.label}</div>
                    <div className="muted-2" style={{fontSize: 11, marginTop: 1}}>
                      {day.matches.map(m => `G${m.group}`).filter((g, i, arr) => arr.indexOf(g) === i).join(" · ")}
                    </div>
                  </div>
                  <div className="group-progress">{done}/{day.matches.length}</div>
                </div>

                {day.matches.map(m => (
                  <MatchRow
                    key={m.id}
                    match={m}
                    prediction={predictions[m.id]}
                    real={realResults[m.id]}
                    onScore={setScore}
                    phaseOpen={phaseUnlocked}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Knockout view */}
      {bucketTab !== "groups" && (
        <div className="section" style={{paddingTop: 0}}>
          <div className="section-title">Eliminatorias · {bucketMatches.length} partidos</div>
          {visibleDays.map(day => (
            <div className="card group-card" key={day.key}>
              <div className="group-head open">
                <div className="group-badge">{day.matches.length}</div>
                <div>
                  <div className="group-title">{day.label}</div>
                  <div className="muted-2" style={{fontSize: 11, marginTop: 1}}>
                    {day.matches.map(m => PHASES.find(p => p.id === matchPhase(m))?.label || "Eliminatorias").filter((label, i, arr) => arr.indexOf(label) === i).join(" · ")}
                  </div>
                </div>
              </div>
              {day.matches.map(m => (
                <MatchRow
                  key={m.id}
                  match={m}
                  prediction={predictions[m.id]}
                  real={realResults[m.id]}
                  onScore={setScore}
                  phaseOpen={phaseUnlocked}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="save-bar">
        <button className="btn btn-primary btn-block" onClick={save} disabled={!phaseUnlocked || saving}>
          <Icon.Check size={18}/>
          {saving ? "Guardando…" : "Guardar pronósticos"}
        </button>
        <div className="save-status">
          {phaseUnlocked
            ? "Puedes modificar tus pronósticos hasta el inicio de cada partido"
            : "Esta fase está cerrada. Espera a que el admin la abra."}
        </div>
      </div>

      {toast && <div className="copied-flash">{toast}</div>}
    </>
  );
}

// One match row — handles its own lock state + status badge
function MatchRow({ match, prediction, real, onScore, phaseOpen = true }) {
  const status = window.matchStatus(match);
  const kickoffLocked = status !== "upcoming";
  const locked = kickoffLocked || !phaseOpen;
  const hasReal = real && real.home !== "" && real.away !== "";
  const p = prediction || { home: "", away: "" };

  const minutesUntil = (match.kickoffMs - window.getNow()) / 60000;
  const soon = status === "upcoming" && minutesUntil <= 60 * 24;

  const inputCls = (val) => {
    if (locked && val !== "") return "score-input filled-locked";
    if (val !== "") return "score-input filled";
    return "score-input";
  };

  const isPlaceholder = match.home == null || match.away == null;
  const homeLabel = isPlaceholder ? match.homePlaceholder : match.home;
  const awayLabel = isPlaceholder ? match.awayPlaceholder : match.away;
  const matchLabel = (match.phase || "groups") === "groups" && match.group ? `Grupo ${match.group}` : null;

  return (
    <div className={`match-row ${hasReal ? "has-real" : ""} ${isPlaceholder ? "placeholder" : ""}`}>
      <div className="match-team home">
        {isPlaceholder
          ? <span className="placeholder-pill">{homeLabel}</span>
          : <><FlagImg team={match.home}/><span className="name">{match.home}</span></>}
      </div>
      <div className="match-score">
        <input
          className={inputCls(p.home)}
          type="number" min="0" inputMode="numeric"
          value={p.home}
          onChange={e => onScore(match.id, "home", e.target.value)}
          placeholder="–"
          disabled={locked}
        />
        <span className="score-sep">:</span>
        <input
          className={inputCls(p.away)}
          type="number" min="0" inputMode="numeric"
          value={p.away}
          onChange={e => onScore(match.id, "away", e.target.value)}
          placeholder="–"
          disabled={locked}
        />
      </div>
      <div className="match-team away">
        {isPlaceholder
          ? <span className="placeholder-pill">{awayLabel}</span>
          : <><span className="name">{match.away}</span><FlagImg team={match.away}/></>}
      </div>
      <div className="match-meta">
        {!phaseOpen
          ? <span className="status-badge status-locked"><Icon.Lock size={9}/>Fase cerrada</span>
          : <StatusBadge status={status} soon={soon} hasReal={hasReal}/>}
        {matchLabel && <span style={{marginLeft: 6}}>{matchLabel}</span>}
        <span style={{marginLeft: 6}}>{match.date} · {match.time}</span>
        <span style={{marginLeft: "auto", display: "flex", gap: 6, alignItems: "center"}}>
          {!locked && <span className="muted-2" style={{fontSize: 10.5}}>{window.formatRelative(match.kickoffISO)}</span>}
          {hasReal && (
            <span className="real-result">Real {real.home}–{real.away}</span>
          )}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status, soon, hasReal }) {
  if (status === "live") {
    return <span className="status-badge status-live"><Icon.Live size={9}/>En juego</span>;
  }
  if (status === "finished") {
    if (hasReal) return <span className="status-badge status-finished"><Icon.Check size={9}/>Finalizado</span>;
    return <span className="status-badge status-locked"><Icon.Lock size={9}/>Bloqueado</span>;
  }
  if (soon) return <span className="status-badge status-soon"><Icon.Clock size={9}/>Próximo</span>;
  return <span className="status-badge status-upcoming"><Icon.Clock size={9}/>Pendiente</span>;
}

window.PredictionsScreen = PredictionsScreen;


// Mis aciertos — vista personal del usuario autenticado

function MisAciertosScreen({ predictions, realResults }) {
  const [filter, setFilter] = React.useState("all"); // all | acertados | pendientes
  const [bucket, setBucket] = React.useState("knockout");

  const entries = React.useMemo(() => {
    return (window.QUINIELA_DATA.MATCHES || [])
      .filter(m => matchInBucket(m, bucket))
      .filter(m => {
        const p = predictions[m.id];
        return p && p.home !== "" && p.away !== "";
      })
      .map(m => {
        const p = predictions[m.id];
        const r = realResults[m.id];
        const hasReal = r && r.home !== "" && r.away !== "";
        const score = window.scorePrediction(p, r);
        return { match: m, pred: p, real: r, hasReal, score };
      })
      .sort((a, b) => compareMatchesByKickoff(a.match, b.match));
  }, [predictions, realResults, bucket]);

  const filtered = entries.filter(e => {
    if (filter === "acertados") return ["exacto","parcial"].includes(e.score.type);
    if (filter === "pendientes") return !e.hasReal;
    return true;
  });

  const totals = entries.reduce((acc, e) => {
    if (e.score.type) acc[e.score.type] = (acc[e.score.type] || 0) + 1;
    acc.pts += e.score.pts;
    return acc;
  }, { exacto:0, parcial:0, fallo:0, pts:0 });

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">Mis aciertos</div>
          <div className="topbar-sub">{bucketLabel(bucket)} · {entries.length} pronósticos registrados</div>
        </div>
      </div>

      <div className="section" style={{paddingBottom: 8}}>
        <div className="stat-row" style={{gridTemplateColumns: "1.4fr 1fr 1fr"}}>
          <div className="stat">
            <div className="stat-label">Puntos</div>
            <div className="stat-value">{totals.pts}<small>pts</small></div>
          </div>
          <div className="stat">
            <div className="stat-label">Exactos</div>
            <div className="stat-value" style={{color: "var(--primary-dark)"}}>{totals.exacto || 0}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Parciales</div>
            <div className="stat-value" style={{color: "#7A5C0A"}}>{totals.parcial || 0}</div>
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
        <SegmentedControl
          ariaLabel="Bloque de aciertos"
          value={bucket}
          onChange={setBucket}
          className="stacked-control"
          options={[
            { id: "groups", label: "Fase de grupos" },
            { id: "knockout", label: "Eliminatorias" },
          ]}
        />
        <SegmentedControl
          ariaLabel="Filtro de aciertos"
          value={filter}
          onChange={setFilter}
          compact
          options={[
            { id: "all", label: "Todos", meta: entries.length },
            { id: "acertados", label: "Acertados" },
            { id: "pendientes", label: "Pendientes" },
          ]}
        />
      </div>

      <div className="section" style={{paddingTop: 8}}>
        {entries.length === 0 ? (
          <div className="card">
            <div className="empty">
              <div className="empty-icon"><Icon.List size={24}/></div>
              <div className="empty-title">No has registrado pronósticos</div>
              <div className="empty-hint">Ve a la pestaña Pronósticos y rellena los marcadores de los próximos partidos.</div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <div className="empty">
              <div className="empty-icon"><Icon.Search size={24}/></div>
              <div className="empty-title">No hay coincidencias</div>
              <div className="empty-hint">Cambia el filtro para ver otros pronósticos.</div>
            </div>
          </div>
        ) : (
          <div className="aciertos-list">
            {filtered.map(e => <AciertoRow key={e.match.id} entry={e}/>)}
          </div>
        )}
      </div>
    </>
  );
}

function AciertoRow({ entry }) {
  const { match: m, pred, real, hasReal, score } = entry;
  const phaseLabel = matchPhase(m) === "groups" ? `G${m.group}` : (window.QUINIELA_DATA.PHASES.find(p => p.id === matchPhase(m))?.label || "Eliminatorias");
  const homeLabel = m.home || m.homePlaceholder;
  const awayLabel = m.away || m.awayPlaceholder;
  return (
    <div className="aciertos-row">
      <div style={{minWidth: 0}}>
        <div className="aciertos-meta">
          <span>{phaseLabel}</span>
          <span>·</span>
          <span>{m.date} · {m.time}</span>
          <span style={{marginLeft: "auto"}}>
            {hasReal
              ? <ResultPill type={score.type}/>
              : <span className="status-badge status-pending"><Icon.Clock size={9}/>Esperando resultado</span>}
          </span>
        </div>
        <div className="aciertos-teams">
          <div className="aciertos-team">
            {m.home && <FlagImg team={m.home}/>}
            <span className="name">{homeLabel}</span>
          </div>
          <div className="aciertos-scores">
            <div className="aciertos-score-row">
              <span className="score-num">{pred.home}</span>
              <span className="score-sep">:</span>
              <span className="score-num">{pred.away}</span>
              <span className="score-label">tú</span>
            </div>
            {hasReal && (
              <div className="aciertos-score-row" style={{opacity: .7, fontSize: 12}}>
                <span className="score-num">{real.home}</span>
                <span className="score-sep">:</span>
                <span className="score-num">{real.away}</span>
                <span className="score-label">real</span>
              </div>
            )}
          </div>
          <div className="aciertos-team away">
            <span className="name">{awayLabel}</span>
            {m.away && <FlagImg team={m.away}/>}
          </div>
        </div>
      </div>
      <div className="aciertos-result">
        {hasReal && (
          <div className={`cell-inner cell-${score.type}`} style={{minWidth: 36, padding: "4px 10px", margin: 0}}>
            <span style={{fontWeight: 800, fontFamily: "var(--mono)", fontSize: 13}}>+{score.pts}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultPill({ type }) {
  const labels = {
    exacto: "Exacto",
    parcial: "Parcial",

    fallo: "Fallaste",
  };
  return (
    <span className={`status-badge status-${type === "exacto" ? "finished" : type === "fallo" ? "live" : "soon"}`}>
      {labels[type] || "—"}
    </span>
  );
}

window.MisAciertosScreen = MisAciertosScreen;


// Tabla de clasificación — accesible para todos los usuarios

function LeaderboardScreen({ currentUser, realResults, participantsKey, participantBonus, officialBonus }) {
  const [sortBy, setSortBy] = React.useState("pts");
  const [view, setView] = React.useState("players");
  const scoreBucket = "all";
  const scoredTotal = (window.QUINIELA_DATA.MATCHES || MATCHES).length;
  const participantCount = (window.QUINIELA_DATA.PARTICIPANTS || []).length;

  const enriched = React.useMemo(() => {
    const PARTICIPANTS = window.QUINIELA_DATA.PARTICIPANTS;
    const pb = participantBonus || window.QUINIELA_DATA.PARTICIPANT_BONUS || {};
    const ob = officialBonus || window.QUINIELA_DATA.OFFICIAL_BONUS || {};
    return PARTICIPANTS.map(p => {
      const stats = window.aggregateStats(p.predictions, realResults, { bucket: "all" });
      const bonPts = window.calcBonusPts(pb[p.user], ob);
      const isMe = currentUser && currentUser.user === p.user;
      return { ...p, ...stats, matchPts: stats.pts, bonPts, pts: stats.pts + bonPts, isMe };
    });
  }, [realResults, currentUser, participantsKey, participantBonus, officialBonus]);

  const sorted = React.useMemo(() => {
    const arr = [...enriched];
    const cmp = {
      pts:         (a,b) => b.pts - a.pts || b.exactos - a.exactos,
      exactos:     (a,b) => b.exactos - a.exactos || b.pts - a.pts,
      parciales:   (a,b) => b.parciales - a.parciales || b.pts - a.pts,
      completados: (a,b) => b.completados - a.completados || b.pts - a.pts,
    };
    arr.sort(cmp[sortBy] || cmp.pts);
    return arr;
  }, [enriched, sortBy]);

  const meIdx = sorted.findIndex(p => p.isMe);
  const me = meIdx >= 0 ? sorted[meIdx] : null;
  const leader = sorted[0];

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">{view === "players" ? "Clasificación" : view === "knockouts" ? "Knockouts" : "Grupos"}</div>
          <div className="topbar-sub">Mundial 2026 · {participantCount} participantes</div>
        </div>
      </div>

      <div className="section" style={{paddingBottom: 8}}>
        <SegmentedControl
          ariaLabel="Vista de tabla"
          value={view}
          onChange={setView}
          options={[
            { id: "players", label: "Jugadores" },
            { id: "knockouts", label: "Knockouts" },
          ]}
        />
      </div>

      {view === "knockouts" ? (
        <KnockoutsTab matches={window.QUINIELA_DATA.MATCHES || MATCHES} realResults={realResults}/>
      ) : (
        <>
      <div className="section" style={{paddingBottom: 10}}>
        <div className="card" style={{padding: "14px 16px", display: "flex", alignItems: "center", gap: 12}}>
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            background: "var(--primary)", color: "white",
            display: "grid", placeItems: "center", flexShrink: 0
          }}>
            <Icon.Trophy size={20}/>
          </div>
          <div style={{flex: 1, minWidth: 0}}>
            <div className="muted-2" style={{fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700}}>
              Líder actual
            </div>
            <div style={{fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em", marginTop: 2}}>
              {leader.name}
            </div>
            <div className="muted-2" style={{marginTop: 2}}>
              {leader.pts} pts · {leader.exactos} ex · {leader.parciales} pc
            </div>
          </div>
          {me && (
            <div style={{textAlign: "right"}}>
              <div className="muted-2" style={{fontSize: 10.5, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700}}>
                Tu pos.
              </div>
              <div style={{fontWeight: 800, fontSize: 22, color: "var(--primary-dark)", marginTop: 2, fontVariantNumeric: "tabular-nums"}}>
                #{meIdx + 1}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section" style={{paddingTop: 4, paddingBottom: 8}}>
        <SegmentedControl
          ariaLabel="Orden de tabla"
          value={sortBy}
          onChange={setSortBy}
          compact
          options={[
            { id: "pts", label: "Puntos" },
            { id: "exactos", label: "Exactos" },
            { id: "parciales", label: "Parciales" },
            { id: "completados", label: "Completos" },
          ]}
        />
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="lb-wide">
          <div className="lb-scroll">
            <div className="lb-wide-head">
              <div className="cw-identity">Participante</div>
              <div className="cw-pts">Pts</div>
              <div className="cw-bon">Bon</div>
              <div className="cw-stat">Ex</div>
              <div className="cw-stat">Pc</div>
              <div className="cw-comp">Comp</div>
            </div>
            {sorted.map((p, i) => (
              <div key={p.user} className={`lb-wide-row ${p.isMe ? "me" : ""}`}>
                <div className="cw-identity">
                  <span className={`pos-chip ${i < 3 ? `top-${i+1}` : ""} ${p.isMe ? "me" : ""}`}>{i + 1}</span>
                  <div className="cw-name-text">
                    <div className={`cw-name-main ${p.isMe ? "me" : ""}`}>
                      {p.name}
                      {i === 0 && <span className="crown">👑</span>}
                    </div>
                    <div className="cw-name-sub">@{p.user}</div>
                  </div>
                </div>
                <div className="cw-pts">{p.pts}</div>
                <div className="cw-bon">{p.bonPts > 0 ? `+${p.bonPts}` : "—"}</div>
                <div className="cw-stat ex">{p.exactos}</div>
                <div className="cw-stat pc">{p.parciales}</div>
                <div className="cw-comp">{p.completados}/{scoredTotal}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="muted-2" style={{marginTop: 14, fontSize: 11, textAlign: "center", lineHeight: 1.6}}>
          <strong>Exacto</strong> +3 pts · <strong>Parcial</strong> +1 pt · <strong>Bonus</strong> +5 pts c/u<br/>
          Puntuación acumulada de toda la quiniela.
        </div>
      </div>
        </>
      )}
    </>
  );
}

window.LeaderboardScreen = LeaderboardScreen;


// Bonus — 5 selectores con cierre automático el 11 de junio

function BonusScreen({ bonus, setBonus, phaseOpen }) {
  const { ALL_TEAMS, TOP_SCORERS, MVP_CANDIDATES, GOALKEEPERS } = window.QUINIELA_DATA;
  const [toast, setToast] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const closed = phaseOpen != null ? !phaseOpen["bonus"] : window.bonusClosed();

  const fields = [
    { key: "campeon",    label: "Campeón",            icon: "Trophy", type: "select", options: ALL_TEAMS },
    { key: "subcampeon", label: "Subcampeón",         icon: "Shield", type: "select", options: ALL_TEAMS },
    { key: "goleador",  label: "Goleador del Mundial", icon: "Ball",  type: "text", placeholder: "Nombre del jugador" },
    { key: "mvp",       label: "MVP / Balón de Oro",  icon: "Star",  type: "text", placeholder: "Nombre del jugador" },
    { key: "portero",   label: "Mejor Portero",       icon: "Glove", type: "text", placeholder: "Nombre del jugador" },
  ];

  const completed = fields.filter(f => bonus[f.key]).length;

  function set(key, val) {
    if (closed) return;
    setBonus(prev => ({ ...prev, [key]: val }));
  }

  async function save() {
    setSaving(true);
    try {
      await api("/api/bonus", { method: "PUT", body: JSON.stringify(bonus) });
      setToast("Bonus guardados");
    } catch {
      setToast("Error al guardar. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(""), 2500);
    }
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">Bonus</div>
          <div className="topbar-sub">5 predicciones especiales</div>
        </div>
        <div className="topbar-right">
          {closed
            ? <span className="tag" style={{background:"#ECEFEB", color:"var(--ink-2)"}}><Icon.Lock size={9}/> Cerrado</span>
            : <span className="tag">{completed}/5</span>}
        </div>
      </div>

      <div className="section" style={{paddingBottom: 8}}>
        {closed ? (
          <div className="notice closed">
            <Icon.Lock size={16}/>
            <div>
              <strong>Periodo de bonus cerrado.</strong><br/>
              Tus picks quedaron guardados como los dejaste.
            </div>
          </div>
        ) : (
          <div className="notice">
            <Icon.Alert size={18}/>
            <div>
              <strong>Bonus abiertos.</strong><br/>
              Cada acierto vale <strong>+5 pts</strong>. El admin cerrará el periodo antes del primer partido.
            </div>
          </div>
        )}
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="section-title">Tus picks</div>

        <div className="bonus-grid">
        {fields.map(f => {
          const IconComp = Icon[f.icon];
          const value = bonus[f.key] || "";
          return (
            <div className={`bonus-card ${closed ? "locked" : ""}`} key={f.key}>
              <div className="bonus-icon">
                <IconComp size={20}/>
              </div>
              <div className="bonus-body">
                <div className="bonus-label">{f.label}</div>
                {f.type === "select" ? (
                  <select
                    className="select"
                    value={value}
                    disabled={closed}
                    onChange={e => set(f.key, e.target.value)}
                    style={{height: 38, fontSize: 14, fontWeight: 600, padding: "0 32px 0 0", border: 0, background: "transparent", color: value ? "var(--ink)" : "var(--ink-3)", backgroundPosition: "right 4px center"}}
                  >
                    <option value="">Selecciona selección…</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    className="input"
                    type="text"
                    value={value}
                    disabled={closed}
                    placeholder={f.placeholder}
                    onChange={e => set(f.key, e.target.value)}
                    style={{border: 0, background: "transparent", fontSize: 14, fontWeight: 600, padding: "0", height: 38}}
                  />
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <div className="section" style={{paddingTop: 0}}>
        <div className="card" style={{padding: "14px 16px"}}>
          <div className="section-title" style={{margin: 0, marginBottom: 8}}>Puntos bonus</div>
          <div style={{display: "grid", gridTemplateColumns: "1fr auto", gap: 4, fontSize: 13}}>
            <div>Campeón correcto</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+5</div>
            <div>Subcampeón correcto</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+5</div>
            <div>Goleador correcto</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+5</div>
            <div>MVP correcto</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+5</div>
            <div>Mejor portero</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+5</div>
          </div>
        </div>
      </div>

      {!closed && (
        <div className="save-bar">
          <button className="btn btn-primary btn-block" onClick={save} disabled={saving}>
            <Icon.Check size={18}/>
            {saving ? "Guardando…" : "Guardar bonus"}
          </button>
          <div className="save-status">
            {completed < 5
              ? `Te faltan ${5 - completed} ${5 - completed === 1 ? "predicción" : "predicciones"}`
              : "Bonus completos ✓"}
          </div>
        </div>
      )}

      {toast && <div className="copied-flash">{toast}</div>}
    </>
  );
}

window.BonusScreen = BonusScreen;


// Admin: tabla de clasificación (misma lógica que LeaderboardScreen, sin isMe)
function AdminLeaderboardTab({ participants, matches, realResults, participantBonus, officialBonus }) {
  const MATCHES = matches || window.QUINIELA_DATA.MATCHES;
  const [sortBy, setSortBy] = React.useState("pts");
  const scoredTotal = MATCHES.length;

  const enriched = React.useMemo(() => {
    const pb = participantBonus || window.QUINIELA_DATA.PARTICIPANT_BONUS || {};
    const ob = officialBonus || window.QUINIELA_DATA.OFFICIAL_BONUS || {};
    return participants.map(p => {
      const stats = window.aggregateStats(p.predictions, realResults, { bucket: "all" });
      const bonPts = window.calcBonusPts(pb[p.user], ob);
      return { ...p, ...stats, matchPts: stats.pts, bonPts, pts: stats.pts + bonPts };
    });
  }, [participants, realResults, participantBonus, officialBonus]);

  const sorted = React.useMemo(() => {
    const arr = [...enriched];
    const cmp = {
      pts:         (a,b) => b.pts - a.pts || b.exactos - a.exactos,
      exactos:     (a,b) => b.exactos - a.exactos || b.pts - a.pts,
      parciales:   (a,b) => b.parciales - a.parciales || b.pts - a.pts,
      completados: (a,b) => b.completados - a.completados || b.pts - a.pts,
    };
    arr.sort(cmp[sortBy] || cmp.pts);
    return arr;
  }, [enriched, sortBy]);

  const leader = sorted[0];

  return (
    <>
      {leader && (
        <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
          <div className="card" style={{padding: "14px 16px", display:"flex", alignItems:"center", gap: 12}}>
            <div style={{width:44,height:44,borderRadius:11,background:"var(--primary)",color:"white",display:"grid",placeItems:"center",flexShrink:0}}>
              <Icon.Trophy size={20}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="muted-2" style={{fontSize:10.5,letterSpacing:".08em",textTransform:"uppercase",fontWeight:700}}>Líder general</div>
              <div style={{fontWeight:800,fontSize:16,marginTop:2}}>{leader.name}</div>
              <div className="muted-2" style={{marginTop:2}}>{leader.pts} pts · {leader.exactos} exactos · {leader.parciales} parciales</div>
            </div>
          </div>
        </div>
      )}

      <div className="section" style={{paddingTop: 4, paddingBottom: 8}}>
        <SegmentedControl
          ariaLabel="Orden de tabla admin"
          value={sortBy}
          onChange={setSortBy}
          compact
          options={[
            { id: "pts", label: "Puntos" },
            { id: "exactos", label: "Exactos" },
            { id: "parciales", label: "Parciales" },
            { id: "completados", label: "Completos" },
          ]}
        />
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="lb-wide">
          <div className="lb-scroll">
            <div className="lb-wide-head">
              <div className="cw-identity">Participante</div>
              <div className="cw-pts">Pts</div>
              <div className="cw-bon">Bon</div>
              <div className="cw-stat">Ex</div>
              <div className="cw-stat">Pc</div>
              <div className="cw-comp">Comp</div>
            </div>
            {sorted.map((p, i) => (
              <div key={p.user} className="lb-wide-row">
                <div className="cw-identity">
                  <span className={`pos-chip ${i < 3 ? `top-${i+1}` : ""}`}>{i+1}</span>
                  <div className="cw-name-text">
                    <div className="cw-name-main">{p.name}</div>
                    <div className="cw-name-sub">@{p.user}</div>
                  </div>
                </div>
                <div className="cw-pts">{p.pts}</div>
                <div className="cw-bon">{p.bonPts > 0 ? `+${p.bonPts}` : "—"}</div>
                <div className="cw-stat ex">{p.exactos}</div>
                <div className="cw-stat pc">{p.parciales}</div>
                <div className="cw-comp">{p.completados}/{scoredTotal}</div>
              </div>
            ))}
          </div>
        </div>
        {enriched.length === 0 && (
          <div className="empty"><div className="empty-icon"><Icon.Rank size={24}/></div><div className="empty-title">Sin participantes aún</div></div>
        )}
      </div>
    </>
  );
}

// Admin panel: resumen, usuarios (con credenciales+pago), resultados, fases, matriz, bonus

function AdminScreen({
  realResults, setRealResults,
  users, setUsers,
  officialBonus, setOfficialBonus,
  participantBonus,
  phaseOpen, setPhaseOpen,
}) {
  const [tab, setTab] = React.useState("summary");
  const [toast, setToast] = React.useState("");

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  const viewMatches = window.QUINIELA_DATA.MATCHES;
  const viewParticipants = window.QUINIELA_DATA.PARTICIPANTS;

  const tabs = [
    { id: "summary",     label: "Resumen" },
    { id: "users",       label: "Usuarios" },
    { id: "leaderboard", label: "Tabla" },
    { id: "phases",      label: "Fases" },
    { id: "results",     label: "Resultados" },
    { id: "matrix",      label: "Por jugador" },
    { id: "bonus",       label: "Bonus oficiales" },
    { id: "pbonus",      label: "Bonus jugadores" },
  ];

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo" style={{background: "var(--ink)"}}>Q26</div>
        <div>
          <div className="topbar-title">Panel admin</div>
          <div className="topbar-sub">Gestión de la quiniela</div>
        </div>
        <div className="topbar-right">
          <span className="tag" style={{background: "#0F1715", color: "white"}}>ADMIN</span>
        </div>
      </div>

      <div className="section admin-nav-section">
        <AdminNav
          tabs={tabs}
          value={tab}
          onChange={setTab}
        />
      </div>

      {tab === "summary"     && <SummaryTab users={users} realResults={realResults} phaseOpen={phaseOpen} matches={viewMatches} participants={viewParticipants}/>}
      {tab === "users"       && <UsersTab users={users} setUsers={setUsers} flash={flash}/>}
      {tab === "leaderboard" && <AdminLeaderboardTab participants={viewParticipants} matches={viewMatches} realResults={realResults} participantBonus={participantBonus} officialBonus={officialBonus}/>}
      {tab === "phases"      && <PhasesTab phaseOpen={phaseOpen} setPhaseOpen={setPhaseOpen} flash={flash} matches={viewMatches}/>}
      {tab === "results"     && <ResultsTab realResults={realResults} setRealResults={setRealResults} matches={viewMatches}/>}
      {tab === "matrix"      && <MatrixTab realResults={realResults} participants={viewParticipants} matches={viewMatches}/>}
      {tab === "bonus"       && <OfficialBonusTab officialBonus={officialBonus} setOfficialBonus={setOfficialBonus} flash={flash}/>}
      {tab === "pbonus"      && <ParticipantBonusTab participantBonus={participantBonus} officialBonus={officialBonus} participants={viewParticipants}/>}

      {toast && <div className="copied-flash">{toast}</div>}
    </>
  );
}

// ---------- Resumen / Dashboard ----------
function SummaryTab({ users, realResults, phaseOpen, matches, participants }) {
  const { PHASES } = window.QUINIELA_DATA;
  const MATCHES = matches || window.QUINIELA_DATA.MATCHES;
  const PARTICIPANTS = participants || window.QUINIELA_DATA.PARTICIPANTS;
  const stats = React.useMemo(() => {
    const participantes = users.length;
    const pagados = users.filter(u => u.paid).length;
    const partidosJugados = MATCHES.filter(m => {
      const r = realResults[m.id];
      return r && r.home !== "" && r.away !== "";
    }).length;
    const partidosPendientes = MATCHES.length - partidosJugados;
    const pronosticosRegistrados = PARTICIPANTS.reduce((s, p) =>
      s + Object.values(p.predictions).filter(pr => pr.home !== "").length, 0);
    const allStats = PARTICIPANTS.map(p => ({ p, s: window.aggregateStats(p.predictions, realResults) }));
    const totalPts = allStats.reduce((s, x) => s + x.s.pts, 0);
    const pointsAvg = allStats.length ? Math.round(totalPts / allStats.length * 10) / 10 : 0;
    const leader = allStats.slice().sort((a,b) => b.s.pts - a.s.pts || b.s.exactos - a.s.exactos)[0];
    const upcoming = MATCHES
      .filter(m => m.kickoffMs > window.getNow() && m.home != null)
      .sort((a,b) => a.kickoffMs - b.kickoffMs)[0];
    const upcomingPhase = upcoming
      ? (matchPhase(upcoming) === "groups" ? `Grupo ${upcoming.group}` : (PHASES.find(p => p.id === matchPhase(upcoming))?.label || "Eliminatorias"))
      : "";
    const fasesAbiertas = PHASES.filter(p => phaseOpen[p.id]).length;
    return {
      participantes, pagados, partidosJugados, partidosPendientes,
      pronosticosRegistrados, pointsAvg, leader, upcoming, upcomingPhase, fasesAbiertas,
    };
  }, [users, realResults, phaseOpen]);

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 4}}>
        <div className="section-title" style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap: 8}}>
          Estado del torneo
          <div style={{display:"flex", gap: 8}}>
            <a href="/api/admin/export" className="btn btn-secondary" style={{fontSize: 12, padding: "6px 10px"}}>
              <Icon.Download size={14}/> Pronósticos
            </a>
            <a href="/api/admin/export?type=bonus" className="btn btn-secondary" style={{fontSize: 12, padding: "6px 10px"}}>
              <Icon.Download size={14}/> Bonus
            </a>
          </div>
        </div>
        <div className="dash-grid">
          <div className="dash-card">
            <div className="dash-card-head">
              <span className="dash-icon"><Icon.Users size={14}/></span>
              Participantes
            </div>
            <div className="dash-value">{stats.participantes}</div>
            <div className="dash-sub">{stats.pagados} pagados · {stats.participantes - stats.pagados} pendientes</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-head">
              <span className="dash-icon"><Icon.Check size={14}/></span>
              Jugados
            </div>
            <div className="dash-value">{stats.partidosJugados}<small>/ {MATCHES.length}</small></div>
            <div className="dash-sub">{stats.partidosPendientes} pendientes</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-head">
              <span className="dash-icon"><Icon.List size={14}/></span>
              Pronósticos
            </div>
            <div className="dash-value">{stats.pronosticosRegistrados}</div>
            <div className="dash-sub">marcadores registrados</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-head">
              <span className="dash-icon"><Icon.Bar size={14}/></span>
              Promedio
            </div>
            <div className="dash-value">{stats.pointsAvg}<small>pts</small></div>
            <div className="dash-sub">por participante</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-head">
              <span className="dash-icon"><Icon.Lock size={14}/></span>
              Fases abiertas
            </div>
            <div className="dash-value">{stats.fasesAbiertas}<small>/ {PHASES.length}</small></div>
            <div className="dash-sub">disponibles para pronosticar</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-head">
              <span className="dash-icon"><Icon.Star size={14}/></span>
              Recaudado
            </div>
            <div className="dash-value">€{stats.pagados * 20}</div>
            <div className="dash-sub">{stats.pagados}× €20 · meta €{stats.participantes * 20}</div>
          </div>
        </div>
      </div>

      {stats.leader && (
        <div className="section" style={{paddingTop: 4, paddingBottom: 4}}>
          <div className="section-title">Líder</div>
          <div className="dash-highlight">
            <div className="dash-icon-lg"><Icon.Trophy size={22}/></div>
            <div style={{flex: 1, minWidth: 0}}>
              <div className="dash-h-label">Va primero con</div>
              <div className="dash-h-title">{stats.leader.p.name}</div>
              <div className="dash-h-sub">
                {stats.leader.s.pts} pts · {stats.leader.s.exactos} exactos · {stats.leader.s.parciales} parciales
              </div>
            </div>
          </div>
        </div>
      )}

      {stats.upcoming && (
        <div className="section" style={{paddingTop: 4}}>
          <div className="section-title">Próximo partido</div>
          <div className="dash-highlight">
            <div className="dash-icon-lg" style={{background: "var(--primary-soft)", color: "var(--primary-dark)"}}>
              <Icon.Clock size={22}/>
            </div>
            <div style={{flex: 1, minWidth: 0}}>
              <div className="dash-h-label">{window.formatRelative(stats.upcoming.kickoffISO)} · {stats.upcomingPhase}</div>
              <div className="dash-h-title" style={{display: "flex", alignItems: "center", gap: 10}}>
                <FlagImg team={stats.upcoming.home}/>
                {stats.upcoming.home}
                <span style={{color: "var(--ink-3)", fontWeight: 600}}>vs</span>
                <FlagImg team={stats.upcoming.away}/>
                {stats.upcoming.away}
              </div>
              <div className="dash-h-sub">{stats.upcoming.date} · {stats.upcoming.time}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---------- Usuarios (fusionada con credenciales y estado de pago) ----------
function UsersTab({ users, setUsers, flash, readOnly = false }) {
  const { initials } = window.QUINIELA_DATA;
  const [fullName, setFullName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [confirming, setConfirming] = React.useState(null);
  const [showPassFor, setShowPassFor] = React.useState({});
  const [filter, setFilter] = React.useState("all"); // all | paid | unpaid

  function genPass() {
    const adj = ["Gol", "Tiro", "Penal", "Arco", "Pase", "Tarjeta", "Falta", "Tiki", "Volea"];
    const animal = ["Halcón", "León", "Lobo", "Águila", "Tigre", "Cobra"];
    const num = Math.floor(Math.random() * 99) + 10;
    return adj[Math.floor(Math.random()*adj.length)] +
           animal[Math.floor(Math.random()*animal.length)] + num;
  }

  function validate() {
    if (!fullName.trim()) return "Introduce el nombre completo.";
    if (!username.trim()) return "Introduce el alias.";
    if (!/^[a-z]+\.[a-z]+$/.test(username.trim().toLowerCase()))
      return "El alias debe tener formato nombre.apellido.";
    if (!email.trim()) return "Introduce el email del participante.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "El email no es válido.";
    if (users.some(u => u.user === username.trim().toLowerCase())) return "Ese alias ya existe.";
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) return "Ese email ya está registrado.";
    return "";
  }

  async function submit() {
    if (readOnly) return;
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setSending(true);
    try {
      const newAlias = username.trim().toLowerCase();
      const res = await api("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({
          nombre: fullName.trim(),
          alias: newAlias,
          email: email.trim(),
        }),
      });
      if (!res.ok) throw new Error(res.error || "Error al crear usuario");
      const refreshed = await api("/api/admin/users");
      if (refreshed.users) {
        applyBackendData({ users: refreshed.users });
        setUsers(window.QUINIELA_DATA.MOCK_USERS);
      }
      setFullName(""); setUsername(""); setEmail("");
      flash(`✓ Usuario creado · Contraseña: ${res.password}`);
    } catch (e) {
      setError(e.message || "No se pudo crear el usuario. Inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  }

  function delUser(id) {
    if (readOnly) return;
    const u = users.find(x => x.id === id);
    setUsers(users.filter(x => x.id !== id));
    setConfirming(null);
    flash(`Usuario ${u?.user || ""} eliminado`);
  }

  async function togglePaid(id) {
    if (readOnly) return;
    const u = users.find(x => x.id === id);
    if (!u?.uuid) return;
    const newPaid = !u.paid;
    setUsers(users.map(x => x.id === id ? { ...x, paid: newPaid } : x));
    try {
      await api(`/api/admin/users/${u.uuid}/paid`, { method: "PATCH", body: JSON.stringify({ paid: newPaid }) });
    } catch {
      setUsers(users.map(x => x.id === id ? { ...x, paid: u.paid } : x));
      flash("Error al guardar el estado de pago");
    }
  }

  function togglePass(id) {
    setShowPassFor(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function credsText(u) {
    const url = process.env.NEXT_PUBLIC_APP_URL
      ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
      : (typeof window !== "undefined" ? window.location.origin : "");
    return `Hola ${u.name || u.user}, tu acceso a la Quiniela Mundial 2026:\n\nUsuario: ${u.user}\nContraseña: ${u.pass}\n\n🔗 ${url}\n\nMucha suerte. ⚽`;
  }

  function copyCreds(u) {
    navigator.clipboard?.writeText(credsText(u)).catch(() => {});
    flash(`Credenciales de ${u.user} copiadas`);
  }

  async function shareCreds(u) {
    const text = credsText(u);
    if (navigator.share) {
      try { await navigator.share({ text }); } catch {}
    } else {
      // fallback: abrir WhatsApp Web
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  }

  React.useEffect(() => {
    if (!fullName.trim() || username) return;
    const parts = fullName.trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .split(/\s+/);
    if (parts.length >= 2) setUsername(`${parts[0]}.${parts[parts.length - 1]}`);
  }, [fullName]);

  const filtered = users.filter(u => {
    if (filter === "paid") return u.paid;
    if (filter === "unpaid") return !u.paid;
    return true;
  });

  const paidCount = users.filter(u => u.paid).length;

  return (
    <>
      {!readOnly && <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="section-title">Crear usuario</div>
        <div className="card" style={{padding: 14}}>
          {error && (
            <div className="error-msg" style={{marginBottom: 12}}>
              <Icon.Alert size={14}/><span>{error}</span>
            </div>
          )}
          <div className="field" style={{marginBottom: 10}}>
            <label className="label">Nombre completo</label>
            <input className="input" placeholder="Ana García"
              value={fullName} onChange={e => setFullName(e.target.value)}/>
          </div>
          <div className="field" style={{marginBottom: 10}}>
            <label className="label">Alias</label>
            <input className="input" placeholder="ana.garcia"
              value={username} onChange={e => setUsername(e.target.value.toLowerCase())}
              autoCapitalize="none" autoCorrect="off"/>
            <div className="muted-2" style={{fontSize: 10.5, marginTop: 4}}>
              Formato: <code style={{fontFamily: "var(--mono)"}}>nombre.apellido</code>
            </div>
          </div>
          <div className="field" style={{marginBottom: 14}}>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="ana.garcia@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              autoCapitalize="none" autoCorrect="off"/>
          </div>
          <button className="btn btn-primary btn-block" onClick={submit} disabled={sending}>
            <Icon.Plus size={16}/>
            {sending ? "Creando usuario…" : "Crear usuario"}
          </button>
          <div className="muted-2" style={{fontSize: 11, marginTop: 10, textAlign: "center", lineHeight: 1.5}}>
            La contraseña se genera automáticamente. Cópiala y compártela por WhatsApp.
          </div>
        </div>
      </div>}

      <div className="section" style={{paddingTop: 8, paddingBottom: 4}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 8}}>
          <div className="section-title" style={{margin: 0}}>
            Participantes · {users.length} <span style={{color: "var(--primary-dark)"}}>· {paidCount} pagados</span>
          </div>
          <SegmentedControl
            ariaLabel="Filtro de participantes"
            value={filter}
            onChange={setFilter}
            compact
            className="admin-inline-control"
            options={[
              { id: "all", label: "Todos" },
              { id: "paid", label: "Pagados" },
              { id: "unpaid", label: "Pendientes" },
            ]}
          />
        </div>

        <div className="card">
          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><Icon.Users size={24}/></div>
              <div className="empty-title">{users.length === 0 ? "Aún no hay participantes" : "Sin resultados"}</div>
              <div className="empty-hint">{users.length === 0 ? "Crea el primer usuario para empezar." : "Cambia el filtro para ver otros usuarios."}</div>
            </div>
          ) : filtered.map(u => (
            <div className="user-card" key={u.id}>
              <div className="user-card-head">

                <div className="user-card-info">
                  <div className="user-card-name">
                    {u.name || u.user}
                    <PaidBadge paid={u.paid}/>
                  </div>
                  <div className="user-card-meta">@{u.user} · {u.email}</div>
                </div>
                {!readOnly && (confirming === u.id ? (
                  <div className="confirm-row">
                    <span className="confirm-text">¿Eliminar?</span>
                    <button className="btn btn-sm btn-secondary" onClick={() => setConfirming(null)}>Cancelar</button>
                    <button className="btn btn-sm btn-danger-solid" onClick={() => delUser(u.id)}>Eliminar</button>
                  </div>
                ) : (
                  <button className="icon-btn danger" onClick={() => setConfirming(u.id)} title="Eliminar usuario">
                    <Icon.Trash size={15}/>
                  </button>
                ))}
              </div>
              <div className="user-card-body">
                <div className="user-pass-row">
                  <div className="user-pass-label">Contraseña</div>
                  <code className="user-pass-value">
                    {showPassFor[u.id] ? u.pass : "•".repeat(Math.max(u.pass?.length || 8, 8))}
                  </code>
                  <button className="icon-btn" onClick={() => togglePass(u.id)} title={showPassFor[u.id] ? "Ocultar" : "Mostrar"}>
                    {showPassFor[u.id] ? <Icon.EyeOff size={14}/> : <Icon.Eye size={14}/>}
                  </button>
                  <button className="icon-btn" onClick={() => copyCreds(u)} title="Copiar credenciales">
                    <Icon.Copy size={14}/>
                  </button>
                </div>
                <div className="user-pass-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => shareCreds(u)} style={{display:"flex",alignItems:"center",gap:5,flex:1}}>
                    <Icon.Share2 size={13}/>Enviar por WhatsApp
                  </button>
                  <button
                    className={`paid-toggle ${u.paid ? "on" : "off"}`}
                    disabled={readOnly}
                    onClick={() => togglePaid(u.id)}
                    title={u.paid ? "Marcar como no pagado" : "Marcar como pagado"}
                    style={{flex:1}}
                  >
                    <span className="paid-toggle-knob"/>
                    <span className="paid-toggle-label">{u.paid ? "Pagado" : "Sin pagar"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PaidBadge({ paid }) {
  return paid
    ? <span className="tag" style={{marginLeft: 6, padding: "2px 7px", fontSize: 9.5}}>Pagado</span>
    : <span className="tag" style={{marginLeft: 6, padding: "2px 7px", fontSize: 9.5, background: "#FFF1CC", color: "#7A5C0A"}}>Sin pagar</span>;
}


function GroupsTab({ matches, realResults, showKnockout = true }) {
  const groupMatches = matches.filter(m => (m.phase || "groups") === "groups" && m.group);
  const groups = Array.from(new Set(groupMatches.map(m => m.group))).sort();
  const knockout = (window.QUINIELA_DATA.MATCHES_KO || []);

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 4}}>
        <div className="section-title">Tablas de grupos</div>
        <div className="groups-grid">
          {groups.map(group => (
            <GroupTable key={group} group={group} matches={groupMatches.filter(m => m.group === group)} realResults={realResults} compact={!showKnockout}/>
          ))}
        </div>
      </div>
      {showKnockout && <div className="section" style={{paddingTop: 8}}>
        <div className="section-title">Llaves y siguientes fases</div>
        <div className="bracket-grid">
          {["r32", "r16", "qf", "sf", "third", "final"].map(phase => (
            <div className="bracket-column" key={phase}>
              <div className="bracket-title">{phaseLabel(phase)}</div>
              {(knockout.filter(m => m.phase === phase)).map(match => (
                <div className="bracket-match" key={match.id}>
                  <div>{match.home || match.homePlaceholder}</div>
                  <span>vs</span>
                  <div>{match.away || match.awayPlaceholder}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>}
    </>
  );
}

function KnockoutsTab({ matches, realResults }) {
  const bracket = buildRealBracket(matches, realResults);

  return (
    <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
      <div className="knockout-board card">
        <div className="knockout-board-head">
          <div>
            <div className="knockout-kicker">2026 FIFA World Cup</div>
            <div className="knockout-title">Knockouts</div>
          </div>
          <div className="knockout-round-chip">Round of 32</div>
        </div>
        <div className="knockout-scroll" aria-label="Llave de eliminatorias">
          <div className="knockout-canvas">
            <BracketHalf side="left" slots={bracket.left}/>
            <div className="knockout-final">
              <div className="knockout-final-match">
                <FlagSlot team={bracket.final.home} size={42}/>
                <div className="knockout-cup"><Icon.Trophy size={34}/><span>Final</span></div>
                <FlagSlot team={bracket.final.away} size={42}/>
              </div>
              <div className="knockout-champion">
                <FlagSlot team={bracket.champion} size={52}/>
                <span>Campeón</span>
              </div>
            </div>
            <BracketHalf side="right" slots={bracket.right}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildRealBracket(matches, realResults) {
  const byPhase = (phase) => sortMatchesByKickoff(matches.filter(m => matchPhase(m) === phase));
  const r32 = byPhase("r32");
  const r16 = byPhase("r16");
  const qf = byPhase("qf");
  const sf = byPhase("sf");
  const final = byPhase("final")[0];

  const teamFromMatch = (match, side) => {
    if (!match) return null;
    const name = side === "home" ? (match.home || match.homePlaceholder) : (match.away || match.awayPlaceholder);
    const flagSource = side === "home" ? match.home : match.away;
    return { name, flagSource };
  };
  const resultWinner = (match) => winnerTeam(match, realResults[match?.id]);
  const r32Winner = r32.map(resultWinner);
  const r16Pairs = [[0,3],[2,5],[1,4],[6,7],[11,10],[9,8],[14,13],[12,15]];
  const r16Teams = r16Pairs.map(([home, away], index) => ({
    home: r32Winner[home] || teamFromMatch(r16[index], "home"),
    away: r32Winner[away] || teamFromMatch(r16[index], "away"),
  }));
  const r16Winner = r16Teams.map((slot, index) => resultWinner({ ...r16[index], home: slot.home?.name, away: slot.away?.name }) || winnerTeamFromSlot(slot, realResults[r16[index]?.id]));
  const qfTeams = [[0,1],[2,3],[4,5],[6,7]].map(([home, away], index) => ({
    home: r16Winner[home] || teamFromMatch(qf[index], "home"),
    away: r16Winner[away] || teamFromMatch(qf[index], "away"),
  }));
  const qfWinner = qfTeams.map((slot, index) => winnerTeamFromSlot(slot, realResults[qf[index]?.id]));
  const sfTeams = [[0,2],[1,3]].map(([home, away], index) => ({
    home: qfWinner[home] || teamFromMatch(sf[index], "home"),
    away: qfWinner[away] || teamFromMatch(sf[index], "away"),
  }));
  const sfWinner = sfTeams.map((slot, index) => winnerTeamFromSlot(slot, realResults[sf[index]?.id]));
  const finalSlot = {
    home: sfWinner[0] || teamFromMatch(final, "home"),
    away: sfWinner[1] || teamFromMatch(final, "away"),
  };

  return {
    left: {
      r32: r32.slice(0, 8).flatMap(match => [teamFromMatch(match, "home"), teamFromMatch(match, "away")]),
      r16: r16Teams.slice(0, 4).flatMap(slot => [slot.home, slot.away]),
      qf: qfTeams.slice(0, 2).flatMap(slot => [slot.home, slot.away]),
      sf: [sfTeams[0]?.home, sfTeams[0]?.away],
    },
    right: {
      r32: r32.slice(8).flatMap(match => [teamFromMatch(match, "home"), teamFromMatch(match, "away")]),
      r16: r16Teams.slice(4).flatMap(slot => [slot.home, slot.away]),
      qf: qfTeams.slice(2).flatMap(slot => [slot.home, slot.away]),
      sf: [sfTeams[1]?.home, sfTeams[1]?.away],
    },
    final: finalSlot,
    champion: winnerTeamFromSlot(finalSlot, realResults[final?.id]),
  };
}

function winnerTeamFromSlot(slot, result) {
  if (!slot || !result || result.home === "" || result.away === "") return null;
  const homeScore = Number(result.home);
  const awayScore = Number(result.away);
  if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore) || homeScore === awayScore) return null;
  return homeScore > awayScore ? slot.home : slot.away;
}

function BracketHalf({ side, slots }) {
  const rounds = [
    { key: "r32", label: "32" },
    { key: "r16", label: "16" },
    { key: "qf", label: "4tos" },
    { key: "sf", label: "Semi" },
  ];
  return (
    <div className={`bracket-half ${side}`}>
      {rounds.map(round => (
        <div className={`bracket-round bracket-round-${round.key}`} key={round.key}>
          <div className="bracket-round-label">{round.label}</div>
          {(slots[round.key] || []).map((team, index) => (
            <div className={`bracket-node bracket-node-${round.key}`} key={`${round.key}-${index}`}>
              <FlagSlot team={team} size={round.key === "r32" ? 34 : 38}/>
            </div>
          ))}
        </div>
      ))}
      <div className="bracket-lines" aria-hidden="true">
        <span className="line r16 a"/><span className="line r16 b"/><span className="line r16 c"/><span className="line r16 d"/>
        <span className="line qf a"/><span className="line qf b"/>
        <span className="line sf a"/>
      </div>
    </div>
  );
}

function FlagSlot({ team, size = 34 }) {
  const label = team?.name || "";
  const flagTeam = team?.flagSource || team?.name;
  return (
    <div className={`flag-slot ${!flagTeam ? "empty" : ""}`} title={label} aria-label={label || "Pendiente"}>
      {flagTeam ? <FlagImg team={flagTeam} size={size}/> : <span/>}
    </div>
  );
}

function GroupTable({ group, matches, realResults, compact = false }) {
  const rows = computeGroupStandings(matches, realResults);
  return (
    <div className={`group-standings card ${compact ? "compact" : ""}`}>
      <div className="group-standings-head">Grupo {group}</div>
      <table>
        <thead>
          {compact
            ? <tr><th>#</th><th>País</th><th>PJ</th><th>DF</th><th>Pts</th></tr>
            : <tr><th>País</th><th>Pts</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DF</th></tr>}
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.team}>
              {compact ? (
                <>
                  <td>{index + 1}</td>
                  <td><FlagImg team={row.team} size={18}/><span>{row.team}</span></td>
                  <td>{row.pj}</td><td>{row.df > 0 ? `+${row.df}` : row.df}</td><td>{row.pts}</td>
                </>
              ) : (
                <>
                  <td><FlagImg team={row.team} size={18}/><span>{row.team}</span></td>
                  <td>{row.pts}</td><td>{row.pj}</td><td>{row.g}</td><td>{row.e}</td><td>{row.p}</td><td>{row.gf}</td><td>{row.gc}</td><td>{row.df}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function computeGroupStandings(matches, realResults) {
  const table = {};
  function ensure(team) {
    if (!table[team]) table[team] = { team, pts: 0, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, df: 0 };
    return table[team];
  }
  matches.forEach(m => {
    ensure(m.home); ensure(m.away);
    const r = realResults[m.id];
    if (!r || r.home === "" || r.away === "") return;
    const home = ensure(m.home), away = ensure(m.away);
    const hg = +r.home, ag = +r.away;
    home.pj++; away.pj++;
    home.gf += hg; home.gc += ag;
    away.gf += ag; away.gc += hg;
    home.df = home.gf - home.gc;
    away.df = away.gf - away.gc;
    if (hg > ag) { home.g++; home.pts += 3; away.p++; }
    else if (hg < ag) { away.g++; away.pts += 3; home.p++; }
    else { home.e++; away.e++; home.pts++; away.pts++; }
  });
  return Object.values(table).sort((a, b) => b.pts - a.pts || b.df - a.df || b.gf - a.gf || a.team.localeCompare(b.team));
}

function phaseLabel(phase) {
  return ({ r32: "Dieciseisavos", r16: "Octavos", qf: "Cuartos", sf: "Semifinales", third: "3er puesto", final: "Final" })[phase] || phase;
}

// ---------- Fases ----------
function PhasesTab({ phaseOpen, setPhaseOpen, flash, readOnly = false, matches }) {
  const { PHASES, matchPhase } = window.QUINIELA_DATA;
  const MATCHES = matches || window.QUINIELA_DATA.MATCHES;

  async function toggle(phaseId) {
    if (readOnly) return;
    const next = !phaseOpen[phaseId];
    setPhaseOpen(prev => ({ ...prev, [phaseId]: next })); // optimistic
    try {
      await api("/api/admin/phases", {
        method: "PATCH",
        body: JSON.stringify({ id: phaseId, is_open: next }),
      });
      flash(`Fase ${PHASES.find(p => p.id === phaseId).label} ${next ? "abierta ✓" : "cerrada ✓"}`);
    } catch {
      setPhaseOpen(prev => ({ ...prev, [phaseId]: !next })); // rollback
      flash("Error al guardar el estado de la fase");
    }
  }

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="notice">
          <Icon.Alert size={18}/>
          <div>
            Abre cada fase cuando quieras que los participantes puedan pronosticar sus partidos. Las fases cerradas se ven con candado y no se pueden editar.
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="section-title">Control de fases</div>
        <div className="card">
          {PHASES.map((ph, i) => {
            const open = phaseOpen[ph.id];
            const inPhase = MATCHES.filter(m => matchPhase(m) === ph.id);
            const firstKickoff = inPhase[0]?.kickoffISO;
            return (
              <div className="phase-row" key={ph.id}>
                <div className="phase-row-icon">
                  {open ? <Icon.Check size={16}/> : <Icon.Lock size={14}/>}
                </div>
                <div className="phase-row-info">
                  <div className="phase-row-title">
                    {ph.label}
                    {ph.count != null && (
                      <span className="muted-2" style={{fontSize: 11, fontWeight: 500, marginLeft: 8}}>
                        · {ph.count} {ph.count === 1 ? "partido" : "partidos"}
                      </span>
                    )}
                  </div>
                  <div className="phase-row-sub">
                    {ph.id === "bonus"
                      ? <>5 predicciones especiales</>
                      : firstKickoff
                        ? <>Inicio: {window.formatRelative(firstKickoff)} · {new Date(firstKickoff).toUTCString().slice(5, 11)}</>
                        : <>Sin partidos programados</>}
                  </div>
                </div>
                <button
                  className={`paid-toggle ${open ? "on" : "off"}`}
                  onClick={() => toggle(ph.id)}
                >
                  <span className="paid-toggle-knob"/>
                  <span className="paid-toggle-label">{open ? "Abierta" : "Cerrada"}</span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="muted-2" style={{marginTop: 12, textAlign: "center", fontSize: 11.5, lineHeight: 1.5}}>
          Recuerda: una fase cerrada bloquea los pronósticos de esos partidos para todos los usuarios.
        </div>
      </div>
    </>
  );
}

// ---------- Resultados ----------
function ResultsTab({ realResults, setRealResults, readOnly = false, matches }) {
  const { GROUPS, PHASES, matchPhase } = window.QUINIELA_DATA;
  const MATCHES = matches || window.QUINIELA_DATA.MATCHES;
  const [bucketFilter, setBucketFilter] = React.useState("knockout");
  const [resGroup, setResGroup] = React.useState("ALL");
  const [saving, setSaving] = React.useState(false);
  const [penaltyWinners, setPenaltyWinners] = React.useState({});

  const inBucket = MATCHES.filter(m => matchInBucket(m, bucketFilter));
  const resMatches = sortMatchesByKickoff(bucketFilter === "groups" && resGroup !== "ALL"
    ? inBucket.filter(m => m.group === resGroup)
    : inBucket);
  const resultDays = groupMatchesByDay(resMatches);
  const resDone = MATCHES.filter(m => {
    const r = realResults[m.id];
    return r && r.home !== "" && r.away !== "";
  }).length;

  function setReal(matchId, side, value) {
    if (readOnly) return;
    const clean = value.replace(/[^0-9]/g, "").slice(0, 2);
    setRealResults(prev => ({
      ...prev,
      [matchId]: { ...(prev[matchId] || {home:"",away:""}), [side]: clean }
    }));
  }

  async function saveGroup() {
    if (readOnly || saving) return;
    setSaving(true);
    const calls = resMatches.map(m => {
      const r = realResults[m.id] || {home:"",away:""};
      if (r.home !== "" && r.away !== "") {
        const isDraw = Number(r.home) === Number(r.away);
        const isKO = matchBucket(m) === "knockout";
        // Block save if KO draw without penalty winner selected
        if (isDraw && isKO && !penaltyWinners[m.id]) return Promise.resolve();
        return api("/api/admin/results", {
          method: "PUT",
          body: JSON.stringify({
            match_id: m.id,
            home_score: Number(r.home),
            away_score: Number(r.away),
            penalty_winner: (isDraw && isKO) ? penaltyWinners[m.id] : null,
          }),
        });
      } else if (r.home === "" && r.away === "") {
        return api("/api/admin/results", {
          method: "DELETE",
          body: JSON.stringify({ match_id: m.id }),
        });
      }
      return Promise.resolve();
    });
    await Promise.all(calls).catch(() => {});
    setSaving(false);
  }

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="stat" style={{padding: "12px 14px"}}>
          <div className="stat-label">Resultados cargados</div>
          <div className="stat-value">
            {resDone}<small>/ {MATCHES.length}</small>
          </div>
          <div className="progress"><div style={{width: `${(resDone/MATCHES.length)*100}%`}}/></div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 4, paddingBottom: 8}}>
        <SegmentedControl
          ariaLabel="Bloque de resultados"
          value={bucketFilter}
          onChange={setBucketFilter}
          options={[
            { id: "groups", label: "Fase de grupos", meta: "Histórico" },
            { id: "knockout", label: "Eliminatorias", meta: `${MATCHES.filter(m => matchInBucket(m, "knockout")).length} partidos` },
          ]}
        />
      </div>

      {bucketFilter === "groups" && (
        <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
          <SelectControl
            label="Grupo"
            value={resGroup}
            onChange={setResGroup}
            options={[
              { value: "ALL", label: "Todos los grupos" },
              ...Object.keys(GROUPS).map(g => ({ value: g, label: `Grupo ${g}` })),
            ]}
          />
        </div>
      )}

      {!readOnly && (
        <div className="section admin-results-savebar">
          <button className="btn btn-primary" style={{width:"100%"}} onClick={saveGroup} disabled={saving}>
            {saving ? "Guardando…" : "Guardar resultados visibles"}
          </button>
        </div>
      )}

      <div className="section" style={{paddingTop: 8}}>
        {resultDays.map(day => (
          <div className="card group-card" key={day.key}>
            <div className="group-head open">
              <div className="group-badge">{day.matches.length}</div>
              <div>
                <div className="group-title">{day.label}</div>
                <div className="muted-2" style={{fontSize: 11, marginTop: 1}}>
                  {day.matches.map(m => (m.phase || "groups") === "groups" ? `G${m.group}` : (PHASES.find(p => p.id === matchPhase(m))?.label || "Eliminatorias")).filter((label, i, arr) => arr.indexOf(label) === i).join(" · ")}
                </div>
              </div>
            </div>
            {day.matches.map(m => {
              const r = realResults[m.id] || {home:"",away:""};
              const isPlaceholder = m.home == null;
              const canEdit = !isPlaceholder;
              const matchLabel = (m.phase || "groups") === "groups" && m.group ? `Grupo ${m.group}` : null;
              const isKO = matchBucket(m) === "knockout";
              const isDraw = r.home !== "" && r.away !== "" && Number(r.home) === Number(r.away);
              const needsPenalty = isKO && isDraw && !readOnly;
              const penWinner = penaltyWinners[m.id];
              return (
                <div className={`match-row ${isPlaceholder ? "placeholder" : ""}`} key={m.id}>
                  <div className="match-team home">
                    {isPlaceholder
                      ? <span className="placeholder-pill">{m.homePlaceholder}</span>
                      : <><FlagImg team={m.home}/><span className="name">{m.home}</span></>}
                  </div>
                  <div className="match-score">
                    <input className={`score-input ${r.home !== "" ? "filled" : ""}`}
                      type="number" inputMode="numeric" min="0"
                      value={r.home} onChange={e => setReal(m.id, "home", e.target.value)}
                      placeholder="–" disabled={readOnly || !canEdit || isPlaceholder}/>
                    <span className="score-sep">:</span>
                    <input className={`score-input ${r.away !== "" ? "filled" : ""}`}
                      type="number" inputMode="numeric" min="0"
                      value={r.away} onChange={e => setReal(m.id, "away", e.target.value)}
                      placeholder="–" disabled={readOnly || !canEdit || isPlaceholder}/>
                  </div>
                  <div className="match-team away">
                    {isPlaceholder
                      ? <span className="placeholder-pill">{m.awayPlaceholder}</span>
                      : <><span className="name">{m.away}</span><FlagImg team={m.away}/></>}
                  </div>
                  {needsPenalty && (
                    <div className="match-penalty-row">
                      <span className="muted-2" style={{fontSize:11,marginRight:8}}>Ganador penales:</span>
                      <button
                        className={`pen-btn ${penWinner === m.home ? "pen-btn-active" : ""}`}
                        onClick={() => setPenaltyWinners(prev => ({...prev, [m.id]: m.home}))}
                      ><FlagImg team={m.home}/>{m.home}</button>
                      <button
                        className={`pen-btn ${penWinner === m.away ? "pen-btn-active" : ""}`}
                        onClick={() => setPenaltyWinners(prev => ({...prev, [m.id]: m.away}))}
                      >{m.away}<FlagImg team={m.away}/></button>
                    </div>
                  )}
                  <div className="match-meta">
                    {r.home !== ""
                      ? needsPenalty && !penWinner
                        ? <span className="status-badge status-live"><Icon.Clock size={9}/>Elige ganador penales</span>
                        : <span className="status-badge status-finished"><Icon.Check size={9}/>Cargado</span>
                      : <span className="status-badge status-soon"><Icon.Clock size={9}/>Por cargar</span>}
                    {matchLabel && <span style={{marginLeft: 6}}>{matchLabel}</span>}
                    <span style={{marginLeft: 6}}>{m.date} · {m.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

// ---------- Matriz por jugador ----------
function MatrixTab({ realResults, participants, matches: viewMatches, canSeeKnockout = true }) {
  const { PHASES, matchPhase } = window.QUINIELA_DATA;
  const MATCHES = viewMatches || window.QUINIELA_DATA.MATCHES;
  const PARTICIPANTS = participants || window.QUINIELA_DATA.PARTICIPANTS;
  const [bucketFilter, setBucketFilter] = React.useState("knockout");
  const matrixScrollRef = React.useRef(null);
  const matrixTodayRef = React.useRef(null);

  const matches = sortMatchesByKickoff(MATCHES.filter(m => {
    if (!matchInBucket(m, bucketFilter)) return false;
    return true;
  }));
  const todayKey = dayKeyFromDate(new Date(window.getNow()));
  const todayMs = dayMsFromKey(todayKey);
  const matrixFocusMatch = matches.find(m => dayKeyFromMatch(m) === todayKey)
    || matches.find(m => m.kickoffMs >= todayMs)
    || matches[0];

  const rows = React.useMemo(() => {
    return PARTICIPANTS.map(p => ({
      ...p,
      stats: window.aggregateStats(p.predictions, realResults, { bucket: bucketFilter }),
    })).sort((a, b) => b.stats.pts - a.stats.pts);
  }, [realResults, bucketFilter]);

  React.useEffect(() => {
    const scroller = matrixScrollRef.current;
    const target = matrixTodayRef.current;
    if (!scroller || !target) return;
    requestAnimationFrame(() => {
      const sticky = scroller.querySelector(".head-player");
      const stickyRight = sticky?.getBoundingClientRect().right ?? scroller.getBoundingClientRect().left;
      const targetLeft = target.getBoundingClientRect().left;
      const delta = targetLeft - stickyRight;
      scroller.scrollTo({ left: Math.max(0, scroller.scrollLeft + delta), behavior: "smooth" });
    });
  }, [bucketFilter, matrixFocusMatch?.id]);

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">Jugadores</div>
          <div className="topbar-sub">{bucketLabel(bucketFilter)} · {PARTICIPANTS.length} participantes</div>
        </div>
      </div>
      <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="legend">
          <span className="legend-item"><span className="legend-dot cell-exacto"></span>Exacto · +3</span>
          <span className="legend-item"><span className="legend-dot cell-parcial"></span>Parcial · +1</span>
          <span className="legend-item"><span className="legend-dot cell-fallo"></span>Fallo · 0</span>
          <span className="legend-item"><span className="legend-dot cell-pending"></span>Pendiente</span>
        </div>
      </div>

      <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
        <SegmentedControl
          ariaLabel="Bloque de matriz"
          value={bucketFilter}
          onChange={setBucketFilter}
          options={[
            { id: "groups", label: "Fase de grupos" },
            { id: "knockout", label: "Eliminatorias" },
          ]}
        />
      </div>

      {bucketFilter === "knockout" && !canSeeKnockout ? (
        <LockedView message="Completa tus pronósticos de Eliminatorias para ver las predicciones de los demás en esta fase. Grupos queda disponible como histórico."/>
      ) : (
      <div className="section" style={{paddingTop: 8}}>
        <div className="matrix-wrap">
          <div className="matrix-scroll" ref={matrixScrollRef}>
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="head-player">Participante</th>
                  {matches.map(m => {
                    const r = realResults[m.id];
                    const hasReal = r && r.home !== "" && r.away !== "";
                    return (
                      <th
                        key={m.id}
                        ref={matrixFocusMatch?.id === m.id ? matrixTodayRef : null}
                        className={matrixFocusMatch?.id === m.id ? "matrix-focus-match" : ""}
                        title={`${m.home || m.homePlaceholder} vs ${m.away || m.awayPlaceholder} — ${m.date} ${m.time}`}
                      >
                        <div className="match-pair">
                          <span className="match-grp">{matchPhase(m) === "groups" ? `G${m.group}` : compactPhaseLabel(matchPhase(m))}</span>
                          {m.home
                            ? <span style={{display: "flex", gap: 3, alignItems: "center"}}>
                                <FlagImg team={m.home} size={16}/>
                                <FlagImg team={m.away} size={16}/>
                              </span>
                            : <span style={{fontSize: 9.5, color: "var(--ink-3)", fontFamily: "var(--mono)"}}>{m.homePlaceholder}/{m.awayPlaceholder}</span>}
                          {hasReal
                            ? <span className="real-score">{r.home}–{r.away}</span>
                            : <span className="real-score" style={{color: "var(--ink-3)"}}>—</span>}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map(p => (
                  <tr key={p.user} className={p.isMe ? "me" : ""}>
                    <td className="cell-player">
                      <div className="cell-player-inner">

                        <div style={{minWidth: 0}}>
                          <div className="pname">{p.name}</div>
                          <div className="ppts">
                            {p.stats.pts} pts · {p.stats.exactos}E · {p.stats.parciales}P
                          </div>
                        </div>
                      </div>
                    </td>
                    {matches.map(m => {
                      const pred = p.predictions[m.id];
                      const real = realResults[m.id];
                      const hasPred = pred && pred.home !== "" && pred.away !== "";
                      const hasReal = real && real.home !== "" && real.away !== "";
                      if (!hasPred) {
                        return <td key={m.id} className="matrix-cell"><div className="cell-inner cell-empty">—</div></td>;
                      }
                      const label = `${pred.home}-${pred.away}`;
                      if (!hasReal) {
                        return <td key={m.id} className="matrix-cell"><div className="cell-inner cell-pending">{label}</div></td>;
                      }
                      const score = window.scorePrediction(pred, real);
                      return <td key={m.id} className="matrix-cell"><div className={`cell-inner cell-${score.type}`}>{label}</div></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
    </>
  );
}

// ---------- Bonus oficiales ----------
function OfficialBonusTab({ officialBonus, setOfficialBonus, flash, readOnly = false }) {
  const { ALL_TEAMS, TOP_SCORERS, MVP_CANDIDATES, GOALKEEPERS } = window.QUINIELA_DATA;
  const fields = [
    { key: "campeon", label: "Campeón oficial", icon: "Trophy", options: ALL_TEAMS },
    { key: "subcampeon", label: "Subcampeón oficial", icon: "Shield", options: ALL_TEAMS },
    { key: "goleador", label: "Goleador del Mundial", icon: "Ball", options: TOP_SCORERS },
    { key: "mvp", label: "MVP / Balón de Oro", icon: "Star", options: MVP_CANDIDATES },
    { key: "portero", label: "Mejor Portero", icon: "Glove", options: GOALKEEPERS },
  ];
  const completed = fields.filter(f => officialBonus[f.key]).length;
  function set(key, val) { if (readOnly) return; setOfficialBonus(prev => ({ ...prev, [key]: val })); }
  async function save() {
    const res = await api("/api/admin/bonus-results", { method: "PUT", body: JSON.stringify(officialBonus) });
    if (res?.ok) flash("Bonus oficiales guardados");
    else flash("Error al guardar bonus oficiales");
  }

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="notice">
          <Icon.Alert size={18}/>
          <div>
            Confirma los resultados reales de los 5 bonus al final del torneo. Los puntos se sumarán automáticamente a los participantes que hayan acertado.
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="section-title">Resultados oficiales · {completed}/5</div>
        <div className="bonus-grid">
          {fields.map(f => {
            const IconComp = Icon[f.icon];
            const value = officialBonus[f.key] || "";
            return (
              <div className="bonus-card" key={f.key}>
                <div className="bonus-icon" style={{background: value ? "var(--primary)" : "var(--primary-soft)", color: value ? "white" : "var(--primary-dark)"}}>
                  <IconComp size={20}/>
                </div>
                <div className="bonus-body">
                  <div className="bonus-label">{f.label}</div>
                  <select
                    className="select"
                    value={value}
                    disabled={readOnly}
                    onChange={e => set(f.key, e.target.value)}
                    style={{height: 38, fontSize: 14, fontWeight: 600, padding: "0 32px 0 0", border: 0, background: "transparent", color: value ? "var(--ink)" : "var(--ink-3)", backgroundPosition: "right 4px center"}}
                  >
                    <option value="">Sin confirmar</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!readOnly && <div className="save-bar">
        <button className="btn btn-primary btn-block" onClick={save}>
          <Icon.Check size={18}/>
          Confirmar bonus oficiales
        </button>
      </div>}
    </>
  );
}

// ---------- Bonus por participante ----------
function ParticipantBonusTab({ participantBonus, officialBonus, participants }) {
  const PARTICIPANTS = participants || window.QUINIELA_DATA.PARTICIPANTS;
  const fields = [
    { key: "campeon", label: "Campeón", icon: "Trophy" },
    { key: "subcampeon", label: "Subcampeón", icon: "Shield" },
    { key: "goleador", label: "Goleador", icon: "Ball" },
    { key: "mvp", label: "MVP", icon: "Star" },
    { key: "portero", label: "Portero", icon: "Glove" },
  ];

  function match(key, value) {
    if (!officialBonus[key] || !value) return null;
    return officialBonus[key] === value;
  }

  // Aciertos totales por usuario
  const rows = PARTICIPANTS.map(p => {
    const picks = participantBonus[p.user] || {};
    const aciertos = fields.filter(f => match(f.key, picks[f.key]) === true).length;
    const completados = fields.filter(f => picks[f.key]).length;
    return { ...p, picks, aciertos, completados };
  }).sort((a,b) => b.aciertos - a.aciertos || a.name.localeCompare(b.name));

  const totalAciertos = rows.reduce((s, r) => s + r.aciertos, 0);
  const confirmadas = fields.filter(f => officialBonus[f.key]).length;

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">Bonus jugadores</div>
          <div className="topbar-sub">5 predicciones especiales</div>
        </div>
      </div>
      <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="notice">
          <Icon.Star size={18}/>
          <div>
            Bonus elegidos por cada participante. {confirmadas > 0
              ? <>Las celdas verdes son aciertos contra los <strong>bonus oficiales</strong> ya confirmados.</>
              : <>Confirma los bonus oficiales para ver los aciertos.</>}
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="section-title">Picks de bonus · {rows.length} participantes · {totalAciertos} aciertos totales</div>
        <div className="matrix-wrap">
          <div className="matrix-scroll">
            <table className="matrix-table pbonus-table">
              <thead>
                <tr>
                  <th className="head-player">Participante</th>
                  {fields.map(f => {
                    const IconComp = Icon[f.icon];
                    return (
                      <th key={f.key} style={{minWidth: 160}}>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 4}}>
                          <span style={{color: "var(--primary-dark)"}}><IconComp size={14}/></span>
                          <span style={{fontSize: 10.5, color: "var(--ink-2)", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase"}}>{f.label}</span>
                          {officialBonus[f.key] && (
                            <span style={{fontSize: 10, color: "var(--primary-dark)", fontFamily: "var(--mono)", fontWeight: 600, marginTop: 2, maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                              {officialBonus[f.key]}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                  <th style={{minWidth: 70, fontSize: 10.5, color: "var(--ink-3)", letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 700}}>Bon pts</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(p => (
                  <tr key={p.user} className={p.isMe ? "me" : ""}>
                    <td className="cell-player">
                      <div className="cell-player-inner">

                        <div style={{minWidth: 0}}>
                          <div className="pname">{p.name}</div>
                          <div className="ppts">@{p.user} · {p.completados}/5 elegidos</div>
                        </div>
                      </div>
                    </td>
                    {fields.map(f => {
                      const pick = p.picks[f.key];
                      const m = match(f.key, pick);
                      let cls = "cell-empty";
                      if (pick) cls = m === true ? "cell-exacto" : m === false ? "cell-fallo" : "cell-pending";
                      return (
                        <td key={f.key} className="matrix-cell pbonus-cell">
                          <div className={`cell-inner ${cls}`} style={{minWidth: 140, padding: "8px 10px", textAlign: "left", justifyContent: "flex-start", fontFamily: "var(--font)", fontSize: 11.5, fontWeight: 600}}>
                            {pick || <span style={{color: "var(--ink-3)", fontWeight: 500}}>—</span>}
                          </div>
                        </td>
                      );
                    })}
                    <td className="matrix-cell" style={{textAlign: "center", padding: "8px 12px", fontVariantNumeric: "tabular-nums", color: p.aciertos > 0 ? "var(--primary-dark)" : "var(--ink-3)"}}>
                      <div style={{fontWeight: 800, fontSize: 15}}>{p.aciertos}<small style={{fontSize: 10, color: "var(--ink-3)", fontWeight: 600}}>/5</small></div>
                      <div style={{fontSize: 10, fontWeight: 700, color: p.aciertos > 0 ? "var(--primary-dark)" : "var(--ink-3)"}}>+{p.aciertos * BONUS_PTS_PER_HIT} pts</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

window.AdminScreen = AdminScreen;


// Main app shell

function DesignedOriginalApp() {
  const [user, setUser] = React.useState(null);
  const [sessionChecked, setSessionChecked] = React.useState(false);
  const [tab, setTab] = React.useState("predictions");

  // Shared app state
  const [predictions, setPredictions] = React.useState(() => buildSeedPredictions());
  const [realResults, setRealResults] = React.useState(() => window.QUINIELA_DATA.REAL_RESULTS || buildSeedReal());
  const [bonus, setBonus] = React.useState({
    campeon: "", subcampeon: "", goleador: "", mvp: "", portero: "",
  });
  const [officialBonus, setOfficialBonus] = React.useState({
    campeon: "",
    subcampeon: "",
    goleador: "",
    mvp: "",
    portero: "",
  });
  // Bonus picks de cada participante — datos reales del backend
  const [participantBonus, setParticipantBonus] = React.useState(() => window.QUINIELA_DATA.PARTICIPANT_BONUS || {});
  // Phase open state — usa valores del backend si están disponibles, si no defaultOpen
  const [phaseOpen, setPhaseOpen] = React.useState(() => {
    const fromBackend = window.QUINIELA_DATA.PHASE_OPEN || {};
    const initial = {};
    window.QUINIELA_DATA.PHASES.forEach(p => {
      initial[p.id] = p.id in fromBackend ? fromBackend[p.id] : p.defaultOpen;
    });
    return initial;
  });
  const [users, setUsers] = React.useState(() =>
    window.QUINIELA_DATA.MOCK_USERS.map(u => ({ ...u }))
  );

  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const refreshPhases = () => {
      api("/api/phases").then(({ phases = [] }) => {
        if (cancelled || !phases.length) return;
        const next = Object.fromEntries(phases.map(p => [p.id, p.is_open]));
        window.QUINIELA_DATA.PHASE_OPEN = next;
        setPhaseOpen(prev => ({ ...prev, ...next }));
      }).catch(() => {});
    };
    const refreshPredictions = () => {
      const idToAlias = window.QUINIELA_DATA.ID_TO_ALIAS;
      if (!idToAlias) return;
      api("/api/predictions/all").then(({ predictions: allPreds = [] }) => {
        if (cancelled) return;
        const predsByAlias = {};
        allPreds.forEach(p => {
          const alias = idToAlias[p.user_id];
          if (!alias) return;
          if (!predsByAlias[alias]) predsByAlias[alias] = {};
          predsByAlias[alias][p.match_id] = { home: String(p.home_score), away: String(p.away_score) };
        });
        window.QUINIELA_DATA.PARTICIPANTS = (window.QUINIELA_DATA.PARTICIPANTS || []).map(p => ({
          ...p,
          predictions: predsByAlias[p.user] || {},
        }));
        setParticipantsLoaded(t => !t);
      }).catch(() => {});
    };
    const refresh = () => { refreshPhases(); refreshPredictions(); };
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    refresh();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", refresh);
    const interval = window.setInterval(refresh, 30000);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", refresh);
      window.clearInterval(interval);
    };
  }, [user]);

  // Restore session on page refresh
  React.useEffect(() => {
    api("/api/auth/me").then(({ user: profile }) => {
      if (profile) {
        const restored = {
          id: profile.id, name: profile.nombre, role: profile.role,
          initials: toInitials(profile.nombre), user: profile.alias, email: profile.email,
        };
        if (profile.role === "admin") {
          api("/api/admin/users").then(({ users: list }) => {
            if (list?.length) {
              window.QUINIELA_DATA.MOCK_USERS = list.filter(u => u.role !== "admin").map((u, i) => ({
                id: i + 1, uuid: u.id, user: u.alias, name: u.nombre,
                email: u.email, pass: u.password || "—", paid: u.paid ?? false,
                initials: toInitials(u.nombre),
              }));
              setUsers(window.QUINIELA_DATA.MOCK_USERS.map(u => ({ ...u })));
            }
          }).catch(() => {});
        }
        setUser(restored);
      }
    }).catch(() => {}).finally(() => setSessionChecked(true));
  }, []);

  // Load user data after login (needs auth session)
  const [participantsLoaded, setParticipantsLoaded] = React.useState(false);
  React.useEffect(() => {
    if (!user) return;
    const calls = [
      api("/api/predictions/all"),
      api("/api/bonus/all"),
      api("/api/matches"),
      api("/api/phases"),
    ];
    if (user.role === "admin") {
      calls.push(api("/api/admin/users"));         // index 4
      calls.push(api("/api/admin/bonus-results")); // index 5
    } else {
      calls.push(api("/api/users/public")); // index 4
      calls.push(api("/api/predictions"));  // index 5
      calls.push(api("/api/bonus"));        // index 6
      calls.push(api("/api/bonus/results")); // index 7
    }
    Promise.allSettled(calls).then((results) => {
      const allPreds   = results[0].status === "fulfilled" ? results[0].value.predictions : [];
      const allBonuses = results[1].status === "fulfilled" ? results[1].value.bonuses : [];
      const matches    = results[2].status === "fulfilled" ? results[2].value.matches : [];
      const phases     = results[3].status === "fulfilled" ? results[3].value.phases : [];
      applyBackendData({ matches, phases, allPreds, allBonuses });
      if (phases.length) {
        setPhaseOpen(prev => ({ ...prev, ...Object.fromEntries(phases.map(p => [p.id, p.is_open])) }));
      }

      const idToAlias = {};
      if (user.role === "admin") {
        const adminUsers = results[4]?.status === "fulfilled" ? results[4].value.users : [];
        const nonAdmins = adminUsers.filter(u => u.role !== "admin");
        window.QUINIELA_DATA.MOCK_USERS = nonAdmins.map((u, i) => ({
          id: i + 1, uuid: u.id, user: u.alias, name: u.nombre,
          email: u.email, pass: u.password || "—", paid: u.paid ?? false,
          initials: toInitials(u.nombre),
        }));
        setUsers(window.QUINIELA_DATA.MOCK_USERS.map(u => ({ ...u })));
        window.QUINIELA_DATA.MOCK_USERS.forEach(u => { idToAlias[u.uuid] = u.user; });
        const officialBonusData = results[5]?.status === "fulfilled" ? results[5].value.bonus_results : null;
        if (officialBonusData) {
          const ob = { campeon: officialBonusData.campeon || "", subcampeon: officialBonusData.subcampeon || "", goleador: officialBonusData.goleador || "", mvp: officialBonusData.mvp || "", portero: officialBonusData.portero || "" };
          setOfficialBonus(ob);
        }
      } else {
        const publicUsers = results[4]?.status === "fulfilled" ? results[4].value.users : [];
        publicUsers.forEach(u => { idToAlias[u.id] = u.alias; });
        window.QUINIELA_DATA.PARTICIPANTS = publicUsers.map(u => ({
          name: u.nombre, user: u.alias,
          initials: toInitials(u.nombre), predictions: {},
        }));
      }
      window.QUINIELA_DATA.ID_TO_ALIAS = idToAlias;

      const predsByAlias = {};
      allPreds.forEach(p => {
        const alias = idToAlias[p.user_id];
        if (!alias) return;
        if (!predsByAlias[alias]) predsByAlias[alias] = {};
        predsByAlias[alias][p.match_id] = { home: String(p.home_score), away: String(p.away_score) };
      });
      window.QUINIELA_DATA.PARTICIPANTS = (window.QUINIELA_DATA.PARTICIPANTS || []).map(p => ({
        ...p,
        predictions: predsByAlias[p.user] || {},
      }));

      const bonusMap = {};
      allBonuses.forEach(b => {
        const alias = idToAlias[b.user_id];
        if (!alias) return;
        bonusMap[alias] = {
          campeon: b.campeon || "", subcampeon: b.subcampeon || "",
          goleador: b.goleador || "", mvp: b.mvp || "", portero: b.portero || "",
        };
      });
      window.QUINIELA_DATA.PARTICIPANT_BONUS = bonusMap;
      setParticipantBonus(bonusMap);
      setParticipantsLoaded(t => !t);

      if (user.role !== "admin") {
        const predsRes  = results[5];
        const bonusRes  = results[6];
        const ownPredictionsFromAll = predsByAlias[user.user] || {};
        if (predsRes?.status === "fulfilled") {
          const rows = predsRes.value.predictions || [];
          const map = {};
          rows.forEach(r => { map[r.match_id] = { home: String(r.home_score), away: String(r.away_score) }; });
          setPredictions({ ...ownPredictionsFromAll, ...map });
        } else if (Object.keys(ownPredictionsFromAll).length) {
          setPredictions(prev => ({ ...prev, ...ownPredictionsFromAll }));
        }
        if (bonusRes?.status === "fulfilled" && bonusRes.value.bonus) {
          const b = bonusRes.value.bonus;
          setBonus({ campeon: b.campeon || "", subcampeon: b.subcampeon || "", goleador: b.goleador || "", mvp: b.mvp || "", portero: b.portero || "" });
        }
        const bonusResultsRes = results[7];
        if (bonusResultsRes?.status === "fulfilled" && bonusResultsRes.value.bonus_results) {
          const br = bonusResultsRes.value.bonus_results;
          setOfficialBonus({ campeon: br.campeon || "", subcampeon: br.subcampeon || "", goleador: br.goleador || "", mvp: br.mvp || "", portero: br.portero || "" });
        }
      }
    });
  }, [user]);

  // Pending predictions count (upcoming matches without a prediction)
  const pendingPreds = React.useMemo(() => {
    return window.QUINIELA_DATA.MATCHES.filter(m => {
      if (window.matchStatus(m) !== "upcoming") return false;
      const p = predictions[m.id];
      return !p || p.home === "" || p.away === "";
    }).length;
  }, [predictions]);

  // Unlock logic: Grupos always visible (closed phase). Eliminatorias visible when
  // all matches of the currently open knockout phase are filled by the player.
  const canSeeKnockoutMatrix = React.useMemo(() => {
    const { MATCHES } = window.QUINIELA_DATA;
    const openKOPhases = PHASES.filter(ph => ph.id !== "bonus" && ph.id !== "groups" && phaseOpen[ph.id]);
    if (openKOPhases.length === 0) return true;
    const openKnockoutMatches = MATCHES.filter(m =>
      openKOPhases.some(ph => ph.id === matchPhase(m)) &&
      window.matchStatus(m) === "upcoming"
    );
    return openKnockoutMatches.every(m => {
      const p = predictions[m.id];
      return p && p.home !== "" && p.away !== "";
    });
  }, [predictions, phaseOpen]);

  const canSeeBonus = bonus.campeon !== "" && bonus.subcampeon !== "" &&
    bonus.goleador !== "" && bonus.mvp !== "" && bonus.portero !== "";

  if (!sessionChecked) {
    return <div className="app-shell" style={{display:"grid",placeItems:"center",minHeight:"100dvh"}}><div className="topbar-logo" style={{width:48,height:48,fontSize:18}}>Q26</div></div>;
  }

  if (!user) {
    return (
      <>
        <LoginScreen onLogin={setUser}/>
      </>
    );
  }

  return (
    <div className="app-shell" data-screen-label={user.role === "admin" ? "Admin" : tab}>
      <button
        className="topbar-logout"
        onClick={() => setUser(null)}
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
      >
        <Icon.LogOut size={15}/>
        <span className="topbar-logout-text">Salir</span>
      </button>
      <div className="app-main">
        {user.role === "admin" ? (
          <AdminScreen
            realResults={realResults} setRealResults={setRealResults}
            users={users} setUsers={setUsers}
            officialBonus={officialBonus} setOfficialBonus={setOfficialBonus}
            participantBonus={participantBonus}
            phaseOpen={phaseOpen} setPhaseOpen={setPhaseOpen}
          />
        ) : (
          <>
            {tab === "predictions" && (
              <PredictionsScreen
                predictions={predictions} setPredictions={setPredictions}
                realResults={realResults}
                phaseOpen={phaseOpen}
              />
            )}
            {tab === "aciertos" && (
              <MisAciertosScreen
                predictions={predictions}
                realResults={realResults}
              />
            )}
            {tab === "leaderboard" && <LeaderboardScreen currentUser={user} realResults={realResults} participantsKey={participantsLoaded} participantBonus={participantBonus} officialBonus={officialBonus}/>}
            {tab === "bonus" && <BonusScreen bonus={bonus} setBonus={setBonus} phaseOpen={phaseOpen}/>}
            {tab === "matrix" && (
              <MatrixTab
                realResults={realResults}
                participants={window.QUINIELA_DATA.PARTICIPANTS}
                matches={window.QUINIELA_DATA.MATCHES}
                canSeeKnockout={canSeeKnockoutMatrix}
              />
            )}
            {tab === "pbonus" && (canSeeBonus
              ? <ParticipantBonusTab participantBonus={participantBonus} officialBonus={officialBonus} participants={window.QUINIELA_DATA.PARTICIPANTS}/>
              : <LockedView message="Guarda todos tus picks de bonus para ver los del resto."/>
            )}
          </>
        )}
      </div>

      {user.role === "admin" ? (
        <div className="bottomnav" style={{gridTemplateColumns: "1fr 1fr"}}>
          <button className="active">
            <span className="nav-icon"><Icon.Settings size={20}/></span>
            Admin
          </button>
          <button onClick={() => setUser(null)}>
            <span className="nav-icon"><Icon.LogOut size={20}/></span>
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="bottomnav bottomnav-user">
          <button className={tab === "predictions" ? "active" : ""} onClick={() => setTab("predictions")}>
            <span className="nav-icon">
              <Icon.List size={20}/>
              {pendingPreds > 0 && <span className="nav-badge">{pendingPreds > 99 ? "99+" : pendingPreds}</span>}
            </span>
            Pronóst.
          </button>
          <button className={tab === "aciertos" ? "active" : ""} onClick={() => setTab("aciertos")}>
            <span className="nav-icon"><Icon.Check size={20}/></span>
            Aciertos
          </button>
          <button className={tab === "leaderboard" ? "active" : ""} onClick={() => setTab("leaderboard")}>
            <span className="nav-icon"><Icon.Rank size={20}/></span>
            Tabla
          </button>
          <button className={tab === "bonus" ? "active" : ""} onClick={() => setTab("bonus")}>
            <span className="nav-icon"><Icon.Star size={20}/></span>
            Bonus
          </button>
          <button className={tab === "matrix" ? "active" : ""} onClick={() => setTab("matrix")}>
            <span className="nav-icon"><Icon.Matrix size={20}/></span>
            Jugadores
          </button>
          <button className={tab === "pbonus" ? "active" : ""} onClick={() => setTab("pbonus")}>
            <span className="nav-icon" style={{position:"relative"}}>
              <Icon.Star size={20}/>
              {!canSeeBonus && <span style={{position:"absolute",bottom:-2,right:-4,lineHeight:1}}><Icon.Lock size={10}/></span>}
            </span>
            B. otros
          </button>
        </div>
      )}

    </div>
  );
}

function LockedView({ message }) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh",gap:16,padding:"0 32px",textAlign:"center"}}>
      <div style={{width:56,height:56,borderRadius:16,background:"var(--primary-soft)",display:"grid",placeItems:"center"}}>
        <Icon.Lock size={24}/>
      </div>
      <div style={{fontWeight:700,fontSize:16}}>Contenido bloqueado</div>
      <div className="muted-2" style={{fontSize:14,maxWidth:280}}>{message}</div>
    </div>
  );
}

function ProfileScreen({ user, onLogout }) {
  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">Perfil</div>
          <div className="topbar-sub">Tu cuenta</div>
        </div>
      </div>
      <div className="section">
        <div className="card" style={{padding: 18, display: "flex", alignItems: "center", gap: 14}}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "var(--primary)", color: "white",
            display: "grid", placeItems: "center",
            fontWeight: 800, fontSize: 18
          }}>{user.initials}</div>
          <div>
            <div style={{fontWeight: 800, fontSize: 17}}>{user.name}</div>
            <div className="muted-2" style={{marginTop: 2}}>Participante</div>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="card">
          <div className="creds-row">
            <div className="creds-text" style={{fontFamily: "var(--font)", fontSize: 13}}>
              <strong>Recibe avisos</strong><br/>
              <span style={{color: "var(--ink-3)"}}>Avisos antes de cada partido</span>
            </div>
            <div style={{width: 36, height: 22, background: "var(--primary)", borderRadius: 999, position: "relative"}}>
              <div style={{position: "absolute", right: 2, top: 2, width: 18, height: 18, background: "white", borderRadius: "50%"}}/>
            </div>
          </div>
          <div className="creds-row">
            <div className="creds-text" style={{fontFamily: "var(--font)", fontSize: 13}}>
              <strong>Reglamento</strong><br/>
              <span style={{color: "var(--ink-3)"}}>Cómo se calculan los puntos</span>
            </div>
            <Icon.Chevron size={16}/>
          </div>
        </div>
      </div>
      <div className="section">
        <button className="btn btn-secondary btn-block" onClick={onLogout}>
          <Icon.LogOut size={16}/>
          Cerrar sesión
        </button>
      </div>
    </>
  );
}


function buildParticipantBonusSeed() {
  const { PARTICIPANTS, ALL_TEAMS, TOP_SCORERS, MVP_CANDIDATES, GOALKEEPERS } = window.QUINIELA_DATA;
  const seed = {};
  PARTICIPANTS.forEach((p, i) => {
    const rng = (n, off) => {
      const x = Math.sin(p.seed + off) * 10000;
      const f = x - Math.floor(x);
      return Math.floor(f * n);
    };
    seed[p.user] = {
      campeon:    ALL_TEAMS[rng(ALL_TEAMS.length, 1)],
      subcampeon: ALL_TEAMS[rng(ALL_TEAMS.length, 2)],
      goleador:   TOP_SCORERS[rng(TOP_SCORERS.length, 3)],
      mvp:        MVP_CANDIDATES[rng(MVP_CANDIDATES.length, 4)],
      portero:    GOALKEEPERS[rng(GOALKEEPERS.length, 5)],
    };
    // Some participants leave some picks empty
    if (i % 4 === 0) seed[p.user].mvp = "";
    if (i % 5 === 0) seed[p.user].portero = "";
  });
  return seed;
}

// Live state must not invent match picks or results.
function buildSeedPredictions() {
  return window.QUINIELA_DATA.USER_PREDICTIONS || {};
}
function buildSeedReal() {
  return window.QUINIELA_DATA.MATCH_RESULTS || {};
}

function toInitials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "--";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const KO_PHASES = new Set(["r32", "r16", "qf", "sf", "third", "final"]);
const KO_ROUND = { r32: 4, r16: 5, qf: 6, sf: 7, third: 8, final: 9 };

function isKnockoutPlaceholderName(name) {
  return /^(Ganador|Perdedor|G |P )/i.test(String(name || "").trim());
}

function mapMatchFromApi(match) {
  const date = new Date(match.date);
  const formatted = formatMatchDateTime(date);
  const isKO = KO_PHASES.has(match.group);
  const homeIsPlaceholder = isKO && isKnockoutPlaceholderName(match.home);
  const awayIsPlaceholder = isKO && isKnockoutPlaceholderName(match.away);
  const mapped = {
    id: match.id,
    phase: isKO ? match.group : "groups",
    group: match.group,
    round: isKO ? (KO_ROUND[match.group] ?? 4) : 1,
    home: homeIsPlaceholder ? null : (match.home || null),
    away: awayIsPlaceholder ? null : (match.away || null),
    homePlaceholder: homeIsPlaceholder ? match.home : undefined,
    awayPlaceholder: awayIsPlaceholder ? match.away : undefined,
    kickoffMs: date.getTime(),
    kickoffISO: match.date,
    date: formatted.date,
    time: formatted.time,
  };
  if (match.home_flag) window.QUINIELA_DATA.FLAG_CODES[match.home] = match.home_flag;
  if (match.away_flag) window.QUINIELA_DATA.FLAG_CODES[match.away] = match.away_flag;
  return mapped;
}

function applyBackendData({ matches = [], leaderboard = [], users = [], phases = [], allPreds = [], allBonuses = [] }) {
  if (!window.QUINIELA_DATA) return;

  if (matches.length) {
    const mappedMatches = sortMatchesByKickoff(matches.map(mapMatchFromApi));
    const groupMatches = sortMatchesByKickoff(mappedMatches.filter(m => m.phase === "groups"));
    const koMatches = sortMatchesByKickoff(mappedMatches.filter(m => m.phase !== "groups"));

    window.QUINIELA_DATA.MATCHES_GROUPS = groupMatches;
    if (koMatches.length) window.QUINIELA_DATA.MATCHES_KO = koMatches;
    window.QUINIELA_DATA.MATCHES = sortMatchesByKickoff([
      ...window.QUINIELA_DATA.MATCHES_GROUPS,
      ...window.QUINIELA_DATA.MATCHES_KO,
    ]);
    window.QUINIELA_DATA.GROUPS = groupMatches.reduce((acc, match) => {
      const teams = acc[match.group] || [];
      if (match.home && !teams.includes(match.home)) teams.push(match.home);
      if (match.away && !teams.includes(match.away)) teams.push(match.away);
      acc[match.group] = teams;
      return acc;
    }, {});
    window.QUINIELA_DATA.ALL_TEAMS = Array.from(new Set(groupMatches.flatMap(m => [m.home, m.away]).filter(Boolean))).sort();
  }

  if (leaderboard.length) {
    // Build per-user predictions map: { alias -> { match_id -> {home, away} } }
    const predsByAlias = {};
    if (allPreds.length && users.length) {
      const idToAlias = {};
      users.forEach(u => { idToAlias[u.id] = u.alias; });
      allPreds.forEach(p => {
        const alias = idToAlias[p.user_id];
        if (!alias) return;
        if (!predsByAlias[alias]) predsByAlias[alias] = {};
        predsByAlias[alias][p.match_id] = { home: String(p.home_score), away: String(p.away_score) };
      });
    }

    window.QUINIELA_DATA.PARTICIPANTS = leaderboard.map((row, index) => ({
      id: index + 1,
      name: row.nombre,
      user: row.alias,
      email: "",
      initials: toInitials(row.nombre),
      predictions: predsByAlias[row.alias] || {},
      backendStats: row,
    }));
  }

  // Build participantBonus: { alias -> { campeon, subcampeon, ... } }
  if (allBonuses.length && users.length) {
    const idToAlias = {};
    users.forEach(u => { idToAlias[u.id] = u.alias; });
    const bonusMap = {};
    allBonuses.forEach(b => {
      const alias = idToAlias[b.user_id];
      if (!alias) return;
      bonusMap[alias] = {
        campeon: b.campeon || "",
        subcampeon: b.subcampeon || "",
        goleador: b.goleador || "",
        mvp: b.mvp || "",
        portero: b.portero || "",
      };
    });
    window.QUINIELA_DATA.PARTICIPANT_BONUS = bonusMap;
  } else {
    window.QUINIELA_DATA.PARTICIPANT_BONUS = {};
  }

  if (users.length) {
    window.QUINIELA_DATA.MOCK_USERS = users
      .filter(user => user.role !== "admin")
      .map((user, index) => ({
        id: index + 1,
        uuid: user.id,
        user: user.alias,
        name: user.nombre,
        email: user.email,
        pass: user.password || "—",
        paid: user.paid ?? false,
        initials: toInitials(user.nombre),
      }));
  }

  if (phases.length) {
    window.QUINIELA_DATA.PHASE_OPEN = Object.fromEntries(phases.map(p => [p.id, p.is_open]));
  }

  // Build real results map from matches.results join
  if (matches.length) {
    const realMap = {};
    matches.forEach(m => {
      if (m.results && m.results.home_score != null) {
        realMap[m.id] = { home: String(m.results.home_score), away: String(m.results.away_score) };
      }
    });
    window.QUINIELA_DATA.REAL_RESULTS = realMap;
  }
}

async function api(path, init) {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data.error;
    const msg = typeof err === "string" ? err : Object.values(err || {}).flat().join(" · ") || "No se pudo completar la acción";
    throw new Error(msg);
  }
  return data;
}

function LoginScreen({ onLogin }) {
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!user || !pass) {
      setErr("Introduce usuario y contraseña.");
      return;
    }
    setLoading(true);
    try {
      await api("/api/auth/login", { method: "POST", body: JSON.stringify({ alias: user, password: pass }) });
      const { user: profile } = await api("/api/auth/me");
      onLogin({
        id: profile.id,
        name: profile.nombre,
        role: profile.role,
        initials: toInitials(profile.nombre),
        user: profile.alias,
        email: profile.email,
      });
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      {/* Desktop left panel */}
      <div className="login-hero-side">
        <div className="login-brand-desktop">
          <div className="topbar-logo" style={{width: 40, height: 40, borderRadius: 11, fontSize: 16}}>Q26</div>
          <div>
            <div className="topbar-title" style={{fontSize: 15, color: "white"}}>Quiniela</div>
            <div className="topbar-sub" style={{fontSize: 10, color: "rgba(255,255,255,0.7)"}}>Mundial 2026</div>
          </div>
        </div>
        <div className="login-pitch">
          <h1>Acierta.<br/>Suma.<br/>Quédate arriba.</h1>
          <p>Predice los resultados de los partidos del Mundial 2026 y compite con tus amigos.</p>
        </div>
        <div className="login-stats-row">
          <div><div className="stat-num">48</div><div className="stat-cap">Selecciones</div></div>
          <div><div className="stat-num">104</div><div className="stat-cap">Partidos</div></div>
          <div><div className="stat-num">12</div><div className="stat-cap">Grupos</div></div>
        </div>
      </div>

      {/* Mobile: full-screen stadium background + form */}
      <div className="login-mobile-bg"/>
      <div className="login-mobile-content">
        <div className="login-mobile-brand">
          <div className="topbar-logo" style={{width: 44, height: 44, borderRadius: 13, fontSize: 17}}>Q26</div>
          <div>
            <div style={{fontWeight: 800, fontSize: 16, color: "white"}}>Quiniela</div>
            <div style={{fontSize: 11, color: "rgba(255,255,255,0.7)"}}>Mundial 2026</div>
          </div>
        </div>
        <div className="login-mobile-hero">
          <h1>Acierta.<br/>Suma.<br/>Quédate arriba.</h1>
          <p>Predice los resultados del Mundial 2026 y compite con tus amigos.</p>
        </div>
        <form className="login-mobile-form" onSubmit={submit}>
          {err && <div className="error-msg"><Icon.Alert size={14}/><span>{err}</span></div>}
          <div className="field" style={{marginBottom: 12}}>
            <label className="label" style={{color: "rgba(255,255,255,0.8)"}}>Usuario</label>
            <input className={`input ${err ? "error" : ""}`} type="text" placeholder="tu.usuario"
              value={user} onChange={e => setUser(e.target.value)} autoCapitalize="none" autoCorrect="off"/>
          </div>
          <div className="field" style={{marginBottom: 20}}>
            <label className="label" style={{color: "rgba(255,255,255,0.8)"}}>Contraseña</label>
            <input className={`input ${err ? "error" : ""}`} type="password" placeholder="••••••••"
              value={pass} onChange={e => setPass(e.target.value)}/>
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
          <div className="login-hint" style={{color: "rgba(255,255,255,0.55)", textAlign: "center", marginTop: 14}}>
            ¿No tienes cuenta? Pide al admin acceso.
          </div>
        </form>
      </div>

      {/* Desktop right panel form */}
      <div className="login-form-side">
        <div className="login-form-card">
          <form className="login-card" onSubmit={submit}>
            {err && <div className="error-msg"><Icon.Alert size={14}/><span>{err}</span></div>}
            <div className="field" style={{marginBottom: 14}}>
              <label className="label">Usuario</label>
              <input className={`input ${err ? "error" : ""}`} type="text" placeholder="tu.usuario"
                value={user} onChange={e => setUser(e.target.value)} autoCapitalize="none" autoCorrect="off"/>
            </div>
            <div className="field" style={{marginBottom: 20}}>
              <label className="label">Contraseña</label>
              <input className={`input ${err ? "error" : ""}`} type="password" placeholder="••••••••"
                value={pass} onChange={e => setPass(e.target.value)}/>
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </button>
            <div className="login-hint">¿No tienes cuenta? Pide al admin que te dé acceso.</div>
          </form>
        </div>
      </div>
    </div>
  );
}


function App() {
  const [loaded, setLoaded] = React.useState(false);
  const [loadKey, setLoadKey] = React.useState(0);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", "#1D9E75");
    root.style.setProperty("--primary-dark", "#167a5a");
    root.style.setProperty("--primary-soft", "#E6F4EE");
    root.style.setProperty("--font", '"Manrope", system-ui, sans-serif');
    window.setSimNow(null);

    Promise.allSettled([
      api("/api/matches"),
      api("/api/leaderboard"),
      api("/api/admin/users"),
      api("/api/phases"),
      api("/api/predictions/all"),
      api("/api/bonus/all"),
    ]).then((results) => {
      const matches      = results[0].status === "fulfilled" ? results[0].value.matches : [];
      const leaderboard  = results[1].status === "fulfilled" ? results[1].value.leaderboard : [];
      const users        = results[2].status === "fulfilled" ? results[2].value.users : [];
      const phases       = results[3].status === "fulfilled" ? results[3].value.phases : [];
      const allPreds     = results[4].status === "fulfilled" ? results[4].value.predictions : [];
      const allBonuses   = results[5].status === "fulfilled" ? results[5].value.bonuses : [];
      applyBackendData({ matches, leaderboard, users, phases, allPreds, allBonuses });
      setLoadKey((key) => key + 1);
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return <div className="login-shell" style={{display: "grid", placeItems: "center"}}><div className="topbar-logo" style={{width: 48, height: 48}}>Q26</div></div>;
  }

  return <DesignedOriginalApp key={loadKey}/>;
}

export default App;
