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

const ALL_TEAMS = [];

// Participantes de prueba — usados SOLO en modo Full Preview, nunca como datos reales
const PREVIEW_PARTICIPANTS_DEFAULT = [
  { name: "Laura Ramírez",      user: "laura.ramirez",   initials: "LR" },
  { name: "Diego Morales",      user: "diego.morales",   initials: "DM" },
  { name: "Andrea Pérez",       user: "andrea.perez",    initials: "AP" },
  { name: "Carlos Vega",        user: "carlos.vega",     initials: "CV" },
  { name: "Sofía López",        user: "sofia.lopez",     initials: "SL" },
  { name: "Mateo Gómez",        user: "mateo.gomez",     initials: "MG" },
  { name: "Valentina Núñez",    user: "valentina.nunez", initials: "VN" },
  { name: "Joaquín Torres",     user: "joaquin.torres",  initials: "JT" },
  { name: "Camila Bravo",       user: "camila.bravo",    initials: "CB" },
  { name: "Felipe Soto",        user: "felipe.soto",     initials: "FS" },
];

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
  PREVIEW_PARTICIPANTS_RAW: PREVIEW_PARTICIPANTS_DEFAULT,
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


// Reusable icons + utility components

const Icon = {
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
};

// Flag image — flagcdn.com with hi-DPI srcset
function FlagImg({ team, size = 24 }) {
  const code = (window.QUINIELA_DATA?.FLAG_CODES || {})[team];
  const h = Math.round(size * 0.75);
  if (!code) {
    return <span className="flag-img flag-fallback" style={{width: size, height: h}}/>;
  }
  return (
    <img
      className="flag-img"
      src={`https://flagcdn.com/${size}x${h}/${code}.png`}
      srcSet={`https://flagcdn.com/${size*2}x${h*2}/${code}.png 2x, https://flagcdn.com/${size*3}x${h*3}/${code}.png 3x`}
      width={size}
      height={h}
      alt={team}
      loading="lazy"
    />
  );
}
window.FlagImg = FlagImg;

window.Icon = Icon;



// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function DesignedOriginalApp() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" data-omelette-chrome=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">
          {children}
        </div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = (o) => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({ 2: 16, 3: 10 }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = (s) => {
      const m = options.find((o) => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return <TweakSelect label={label} value={value} options={options}
                        onChange={(s) => onChange(resolve(s))} />;
  }
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

const __TwkCheck = ({ light }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
  </svg>
);

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({ label, value, options, onChange }) {
  if (!options || !options.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value}
               onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = (o) => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const colors = Array.isArray(o) ? o : [o];
          const [hero, ...rest] = colors;
          const sup = rest.slice(0, 4);
          const on = key(o) === cur;
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    aria-label={colors.join(', ')} title={colors.join(' · ')}
                    style={{ background: hero }}
                    onClick={() => onChange(o)}>
              {sup.length > 0 && (
                <span>
                  {sup.map((c, j) => <i key={j} style={{ background: c }} />)}
                </span>
              )}
              {on && <__TwkCheck light={__twkIsLight(hero)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}

Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
});


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
  const { GROUPS, MATCHES, PHASES, matchPhase } = window.QUINIELA_DATA;
  const [openGroups, setOpenGroups] = React.useState(() => ({ A: true }));
  const [phaseTab, setPhaseTab] = React.useState("groups");
  const [toast, setToast] = React.useState("");

  const totalMatches = MATCHES.length;
  const completed = MATCHES.filter(m => {
    const p = predictions[m.id];
    return p && p.home !== "" && p.away !== "" && p.home != null && p.away != null;
  }).length;

  const points = React.useMemo(() => {
    let pts = 0;
    MATCHES.forEach(m => {
      pts += window.scorePrediction(predictions[m.id], realResults[m.id]).pts;
    });
    return pts;
  }, [predictions, realResults]);

  function setScore(matchId, side, value) {
    const clean = value.replace(/[^0-9]/g, "").slice(0, 2);
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...(prev[matchId] || {home:"",away:""}), [side]: clean }
    }));
  }

  function toggleGroup(g) {
    setOpenGroups(prev => ({ ...prev, [g]: !prev[g] }));
  }

  function save() {
    setToast("Pronósticos guardados");
    setTimeout(() => setToast(""), 1800);
  }

  function groupProgress(g) {
    const inGroup = MATCHES.filter(m => m.group === g);
    const done = inGroup.filter(m => {
      const p = predictions[m.id];
      return p && p.home !== "" && p.away !== "";
    }).length;
    return { done, total: inGroup.length };
  }

  // Phase tab counts
  const phaseCounts = PHASES.map(ph => {
    const inPhase = MATCHES.filter(m => matchPhase(m) === ph.id);
    const done = inPhase.filter(m => {
      const p = predictions[m.id];
      return p && p.home !== "" && p.away !== "";
    }).length;
    return { ...ph, done, total: inPhase.length, open: phaseOpen[ph.id] };
  });

  const activePhase = PHASES.find(p => p.id === phaseTab) || PHASES[0];
  const phaseUnlocked = phaseOpen[phaseTab];

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
              Exacto +3 · Parcial +2 · Signo +1
            </div>
          </div>
        </div>
      </div>

      {/* Phase tabs */}
      <div className="section" style={{paddingTop: 4, paddingBottom: 8}}>
        <div className="phase-tabs">
          {phaseCounts.map(ph => (
            <button
              key={ph.id}
              className={`phase-tab ${phaseTab === ph.id ? "active" : ""} ${!ph.open ? "locked" : ""}`}
              onClick={() => setPhaseTab(ph.id)}
            >
              <span className="phase-tab-label">
                {!ph.open && <Icon.Lock size={10}/>}
                {ph.label}
              </span>
              <span className="phase-tab-count">{ph.done}/{ph.total}</span>
            </button>
          ))}
        </div>
      </div>

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
      {phaseTab === "groups" && (
        <div className="section" style={{paddingTop: 0}}>
          <div className="section-title">Grupos · 12 grupos · 72 partidos</div>
          {Object.keys(GROUPS).map(g => {
            const open = !!openGroups[g];
            const groupMatches = MATCHES.filter(m => m.group === g);
            const prog = groupProgress(g);
            return (
              <div className="card group-card" key={g}>
                <button className={`group-head ${open ? "open" : ""}`} onClick={() => toggleGroup(g)}>
                  <div className="group-badge">{g}</div>
                  <div>
                    <div className="group-title">Grupo {g}</div>
                    <div className="muted-2" style={{fontSize: 11, marginTop: 1}}>
                      {GROUPS[g].slice(0,2).join(" · ")} · {GROUPS[g].slice(2).join(" · ")}
                    </div>
                  </div>
                  <div className="group-progress">{prog.done}/{prog.total}</div>
                  <span className={`group-chevron ${open ? "open" : ""}`}>
                    <Icon.Chevron size={16}/>
                  </span>
                </button>

                {open && groupMatches.map(m => (
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
      {phaseTab !== "groups" && (
        <div className="section" style={{paddingTop: 0}}>
          <div className="section-title">{activePhase.label} · {activePhase.count} {activePhase.count === 1 ? "partido" : "partidos"}</div>
          <div className="card">
            {MATCHES.filter(m => matchPhase(m) === phaseTab).map(m => (
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
        </div>
      )}

      <div className="save-bar">
        <button className="btn btn-primary btn-block" onClick={save} disabled={!phaseUnlocked}>
          <Icon.Check size={18}/>
          Guardar pronósticos
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
  const { MATCHES } = window.QUINIELA_DATA;
  const [filter, setFilter] = React.useState("all"); // all | acertados | pendientes

  // Build entries for predictions the user has made
  const entries = React.useMemo(() => {
    return MATCHES
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
      .sort((a, b) => b.match.kickoffMs - a.match.kickoffMs);
  }, [predictions, realResults]);

  const filtered = entries.filter(e => {
    if (filter === "acertados") return ["exacto","parcial","signo"].includes(e.score.type);
    if (filter === "pendientes") return !e.hasReal;
    return true;
  });

  const totals = entries.reduce((acc, e) => {
    if (e.score.type) acc[e.score.type] = (acc[e.score.type] || 0) + 1;
    acc.pts += e.score.pts;
    return acc;
  }, { exacto:0, parcial:0, signo:0, fallo:0, pts:0 });

  return (
    <>
      <div className="topbar">
        <div className="topbar-logo">Q26</div>
        <div>
          <div className="topbar-title">Mis aciertos</div>
          <div className="topbar-sub">{entries.length} pronósticos registrados</div>
        </div>
      </div>

      <div className="section" style={{paddingBottom: 8}}>
        <div className="stat-row" style={{gridTemplateColumns: "1.4fr 1fr 1fr 1fr"}}>
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
          <div className="stat">
            <div className="stat-label">Signos</div>
            <div className="stat-value" style={{color: "#8A4A0E"}}>{totals.signo || 0}</div>
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
        <div className="pill-tabs">
          <button className={`pill-tab ${filter==="all"?"active":""}`} onClick={() => setFilter("all")}>Todos · {entries.length}</button>
          <button className={`pill-tab ${filter==="acertados"?"active":""}`} onClick={() => setFilter("acertados")}>Acertados</button>
          <button className={`pill-tab ${filter==="pendientes"?"active":""}`} onClick={() => setFilter("pendientes")}>Pendientes</button>
        </div>
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
  return (
    <div className="aciertos-row">
      <div style={{minWidth: 0}}>
        <div className="aciertos-meta">
          <span>G{m.group}</span>
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
            <FlagImg team={m.home}/>
            <span className="name">{m.home}</span>
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
            <span className="name">{m.away}</span>
            <FlagImg team={m.away}/>
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
    signo: "Signo",
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

function LeaderboardScreen({ currentUser, realResults }) {
  const { PARTICIPANTS, MATCHES } = window.QUINIELA_DATA;
  const [sortBy, setSortBy] = React.useState("pts");

  // Compute live stats for each participant using their seed predictions
  const enriched = React.useMemo(() => {
    return PARTICIPANTS.map(p => {
      const stats = window.aggregateStats(p.predictions, realResults);
      const isMe = currentUser && currentUser.user === p.user;
      return { ...p, ...stats, isMe };
    });
  }, [realResults, currentUser]);

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
          <div className="topbar-title">Clasificación</div>
          <div className="topbar-sub">{PARTICIPANTS.length} participantes</div>
        </div>
      </div>

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
              {leader.pts} pts · {leader.exactos} exactos · {leader.parciales} parciales
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
        <div className="pill-tabs" style={{display: "flex", overflowX: "auto", maxWidth: "100%"}}>
          <button className={`pill-tab ${sortBy === "pts" ? "active" : ""}`} onClick={() => setSortBy("pts")}>Puntos</button>
          <button className={`pill-tab ${sortBy === "exactos" ? "active" : ""}`} onClick={() => setSortBy("exactos")}>Exactos</button>
          <button className={`pill-tab ${sortBy === "parciales" ? "active" : ""}`} onClick={() => setSortBy("parciales")}>Parciales</button>
          <button className={`pill-tab ${sortBy === "completados" ? "active" : ""}`} onClick={() => setSortBy("completados")}>Completos</button>
        </div>
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="lb-wide">
          <div className="lb-wide-head">
            <div className="cw-pos">Pos</div>
            <div className="cw-name">Participante</div>
            <div className="cw-pts">Pts</div>
            <div className="cw-stat">Ex</div>
            <div className="cw-stat">Pc</div>
            <div className="cw-stat">Sg</div>
            <div className="cw-comp">Comp</div>
          </div>
          {sorted.map((p, i) => (
            <div key={p.user} className={`lb-wide-row ${p.isMe ? "me" : ""}`}>
              <div className="cw-pos">
                <span className={`pos-chip ${i < 3 ? `top-${i+1}` : ""} ${p.isMe ? "me" : ""}`}>
                  {i + 1}
                </span>
              </div>
              <div className="cw-name">
                <div className="user-avatar small">{p.initials}</div>
                <div className="cw-name-text">
                  <div className={`cw-name-main ${p.isMe ? "me" : ""}`}>
                    {p.name}
                    {i === 0 && <span className="crown">👑</span>}
                  </div>
                  <div className="cw-name-sub">@{p.user}</div>
                </div>
              </div>
              <div className="cw-pts">{p.pts}</div>
              <div className="cw-stat ex">{p.exactos}</div>
              <div className="cw-stat pc">{p.parciales}</div>
              <div className="cw-stat sg">{p.signos}</div>
              <div className="cw-comp">{p.completados}/{MATCHES.length}</div>
            </div>
          ))}
        </div>

        <div className="muted-2" style={{marginTop: 14, fontSize: 11, textAlign: "center", lineHeight: 1.6}}>
          <strong>Exacto</strong> +3 pts · <strong>Parcial</strong> +2 pts · <strong>Signo</strong> +1 pt<br/>
          Los puntos bonus se suman al final del torneo
        </div>
      </div>
    </>
  );
}

window.LeaderboardScreen = LeaderboardScreen;


// Bonus — 5 selectores con cierre automático el 11 de junio

function BonusScreen({ bonus, setBonus }) {
  const { ALL_TEAMS, TOP_SCORERS, MVP_CANDIDATES, GOALKEEPERS } = window.QUINIELA_DATA;
  const [toast, setToast] = React.useState("");
  const closed = window.bonusClosed();

  const fields = [
    { key: "campeon", label: "Campeón", icon: "Trophy", options: ALL_TEAMS, withFlags: true },
    { key: "subcampeon", label: "Subcampeón", icon: "Shield", options: ALL_TEAMS, withFlags: true },
    { key: "goleador", label: "Goleador del Mundial", icon: "Ball", options: TOP_SCORERS },
    { key: "mvp", label: "MVP / Balón de Oro", icon: "Star", options: MVP_CANDIDATES },
    { key: "portero", label: "Mejor Portero", icon: "Glove", options: GOALKEEPERS },
  ];

  const completed = fields.filter(f => bonus[f.key]).length;

  function set(key, val) {
    if (closed) return;
    setBonus(prev => ({ ...prev, [key]: val }));
  }

  function save() {
    setToast("Bonus guardados");
    setTimeout(() => setToast(""), 1800);
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
              <strong>Periodo de predicciones cerrado.</strong><br/>
              El cierre fue el {window.BONUS_DEADLINE_LABEL}. Tus picks quedaron como los guardaste.
            </div>
          </div>
        ) : (
          <div className="notice">
            <Icon.Alert size={18}/>
            <div>
              <strong>Cierre: {window.BONUS_DEADLINE_LABEL}.</strong><br/>
              Tras el primer partido del Mundial no podrás modificar tus bonus.
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
                <select
                  className="select"
                  value={value}
                  disabled={closed}
                  onChange={e => set(f.key, e.target.value)}
                  style={{height: 38, fontSize: 14, fontWeight: 600, padding: "0 32px 0 0", border: 0, background: "transparent", color: value ? "var(--ink)" : "var(--ink-3)", backgroundPosition: "right 4px center"}}
                >
                  <option value="">Selecciona…</option>
                  {f.options.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
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
            <div>Campeón correcto</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+15</div>
            <div>Subcampeón correcto</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+8</div>
            <div>Goleador correcto</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+10</div>
            <div>MVP correcto</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+10</div>
            <div>Mejor portero</div><div style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>+7</div>
          </div>
        </div>
      </div>

      {!closed && (
        <div className="save-bar">
          <button className="btn btn-primary btn-block" onClick={save}>
            <Icon.Check size={18}/>
            Guardar bonus
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


// Admin panel: resumen, usuarios (con credenciales+pago), resultados, fases, matriz, bonus

function AdminScreen({
  realResults, setRealResults,
  users, setUsers,
  officialBonus, setOfficialBonus,
  participantBonus,
  phaseOpen, setPhaseOpen,
}) {
  const [tab, setTab] = React.useState("summary");
  const [mode, setMode] = React.useState("live");
  const [toast, setToast] = React.useState("");

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  const liveMatches = window.QUINIELA_DATA.MATCHES;
  const previewMatches = React.useMemo(() => {
    const ids = new Set(liveMatches.map(m => m.id));
    const ko = (window.QUINIELA_DATA.MATCHES_KO || []).filter(m => !ids.has(m.id));
    return [...liveMatches, ...ko];
  }, [liveMatches]);
  const previewResults = React.useMemo(() => makePreviewRealResults(previewMatches), [previewMatches]);
  const previewParticipants = React.useMemo(() => makePreviewParticipants(previewMatches), [previewMatches]);
  const previewUsers = React.useMemo(() => previewParticipants.map((p, i) => ({
    id: i + 1,
    user: p.user,
    name: p.name,
    email: p.email || `${p.user}@preview.local`,
    pass: "preview",
    initials: p.initials,
    paid: i % 5 !== 0,
  })), [previewParticipants]);
  const previewOfficialBonus = React.useMemo(() => ({
    campeon: "Argentina",
    subcampeon: "Francia",
    goleador: "Kylian Mbappé (FRA)",
    mvp: "Lionel Messi (ARG)",
    portero: "Emiliano Martínez (ARG)",
  }), []);
  const previewParticipantBonus = React.useMemo(() => makePreviewParticipantBonus(previewParticipants), [previewParticipants]);
  const previewPhaseOpen = React.useMemo(() => Object.fromEntries(window.QUINIELA_DATA.PHASES.map(p => [p.id, true])), []);

  const isPreview = mode === "preview";
  const viewMatches = isPreview ? previewMatches : liveMatches;
  const viewParticipants = isPreview ? previewParticipants : window.QUINIELA_DATA.PARTICIPANTS;
  const viewResults = isPreview ? previewResults : realResults;
  const viewUsers = isPreview ? previewUsers : users;
  const viewOfficialBonus = isPreview ? previewOfficialBonus : officialBonus;
  const viewParticipantBonus = isPreview ? previewParticipantBonus : participantBonus;
  const viewPhaseOpen = isPreview ? previewPhaseOpen : phaseOpen;

  const tabs = [
    { id: "summary",   label: "Resumen" },
    { id: "users",     label: "Usuarios" },
    { id: "groups",    label: "Grupos" },
    { id: "phases",    label: "Fases" },
    { id: "results",   label: "Resultados" },
    { id: "matrix",    label: "Por jugador" },
    { id: "bonus",     label: "Bonus oficiales" },
    { id: "pbonus",    label: "Bonus jugadores" },
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

      <div className="section" style={{paddingBottom: 8}}>
        <div className="admin-mode-row">
          <div className="pill-tabs">
            <button className={`pill-tab ${mode === "live" ? "active" : ""}`} onClick={() => setMode("live")}>Live</button>
            <button className={`pill-tab ${mode === "preview" ? "active" : ""}`} onClick={() => setMode("preview")}>Full Preview</button>
          </div>
          <div className="muted-2" style={{fontSize: 11.5}}>
            {isPreview ? "Visualización completa con datos de prueba. No edita datos reales." : "Datos reales de producción."}
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
        <div className="pill-tabs" style={{display: "flex", overflowX: "auto", maxWidth: "100%"}}>
          {tabs.map(t => (
            <button key={t.id}
              className={`pill-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isPreview && (
        <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
          <div className="notice closed">
            <Icon.Eye size={16}/>
            <div><strong>Full Preview.</strong><br/>Modo solo lectura para visualizar fases completas, usuarios de prueba, resultados, ranking y bonus sin tocar Live.</div>
          </div>
        </div>
      )}

      {tab === "summary" && <SummaryTab users={viewUsers} realResults={viewResults} phaseOpen={viewPhaseOpen} matches={viewMatches} participants={viewParticipants}/>}
      {tab === "users"   && <UsersTab users={viewUsers} setUsers={setUsers} flash={flash} readOnly={isPreview}/>} 
      {tab === "groups"  && <GroupsTab matches={viewMatches} realResults={viewResults}/>} 
      {tab === "phases"  && <PhasesTab phaseOpen={viewPhaseOpen} setPhaseOpen={setPhaseOpen} flash={flash} readOnly={isPreview} matches={viewMatches}/>} 
      {tab === "results" && <ResultsTab realResults={viewResults} setRealResults={setRealResults} readOnly={isPreview} matches={viewMatches}/>} 
      {tab === "matrix"  && <MatrixTab realResults={viewResults} participants={viewParticipants} matches={viewMatches}/>} 
      {tab === "bonus"   && <OfficialBonusTab officialBonus={viewOfficialBonus} setOfficialBonus={setOfficialBonus} flash={flash} readOnly={isPreview}/>} 
      {tab === "pbonus"  && <ParticipantBonusTab participantBonus={viewParticipantBonus} officialBonus={viewOfficialBonus} participants={viewParticipants}/>} 

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
    const fasesAbiertas = PHASES.filter(p => phaseOpen[p.id]).length;
    return {
      participantes, pagados, partidosJugados, partidosPendientes,
      pronosticosRegistrados, pointsAvg, leader, upcoming, fasesAbiertas,
    };
  }, [users, realResults, phaseOpen]);

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 4}}>
        <div className="section-title">Estado del torneo</div>
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
            <div className="dash-value">${stats.pagados * 10}</div>
            <div className="dash-sub">{stats.pagados}× $10 · meta ${stats.participantes * 10}</div>
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
                {stats.leader.s.pts} pts · {stats.leader.s.exactos} exactos · {stats.leader.s.parciales} parciales · {stats.leader.s.signos} signos
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
              <div className="dash-h-label">{window.formatRelative(stats.upcoming.kickoffISO)} · Grupo {stats.upcoming.group}</div>
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
      const res = await api("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({
          nombre: fullName.trim(),
          alias: username.trim().toLowerCase(),
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
      flash(`Usuario creado · Contraseña: ${res.password}`);
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
    return `Hola ${u.name || u.user}, tu acceso a la Quiniela Mundial 2026:\n\nUsuario: ${u.user}\nContraseña: ${u.pass}\n\nMucha suerte. ⚽`;
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
          <div className="pill-tabs" style={{padding: 3}}>
            <button className={`pill-tab ${filter==="all"?"active":""}`} onClick={() => setFilter("all")} style={{padding:"5px 9px",fontSize:11}}>Todos</button>
            <button className={`pill-tab ${filter==="paid"?"active":""}`} onClick={() => setFilter("paid")} style={{padding:"5px 9px",fontSize:11}}>Pagados</button>
            <button className={`pill-tab ${filter==="unpaid"?"active":""}`} onClick={() => setFilter("unpaid")} style={{padding:"5px 9px",fontSize:11}}>Pendientes</button>
          </div>
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
                <div className={`user-avatar ${u.paid ? "" : ""}`}>{u.initials || u.user.slice(0,2).toUpperCase()}</div>
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
                  <button className="btn btn-sm btn-secondary" onClick={() => shareCreds(u)} style={{display:"flex",alignItems:"center",gap:5}}>
                    <Icon.Share2 size={13}/>Enviar
                  </button>
                </div>
                <button
                  className={`paid-toggle ${u.paid ? "on" : "off"}`}
                  disabled={readOnly}
                  onClick={() => togglePaid(u.id)}
                  title={u.paid ? "Marcar como no pagado" : "Marcar como pagado"}
                >
                  <span className="paid-toggle-knob"/>
                  <span className="paid-toggle-label">{u.paid ? "Pagado" : "Sin pagar"}</span>
                </button>
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


function GroupsTab({ matches, realResults }) {
  const groupMatches = matches.filter(m => (m.phase || "groups") === "groups" && m.group);
  const groups = Array.from(new Set(groupMatches.map(m => m.group))).sort();
  const knockout = (window.QUINIELA_DATA.MATCHES_KO || []);

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 4}}>
        <div className="section-title">Tablas de grupos</div>
        <div className="groups-grid">
          {groups.map(group => (
            <GroupTable key={group} group={group} matches={groupMatches.filter(m => m.group === group)} realResults={realResults}/>
          ))}
        </div>
      </div>
      <div className="section" style={{paddingTop: 8}}>
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
      </div>
    </>
  );
}

function GroupTable({ group, matches, realResults }) {
  const rows = computeGroupStandings(matches, realResults);
  return (
    <div className="group-standings card">
      <div className="group-standings-head">Grupo {group}</div>
      <table>
        <thead>
          <tr><th>País</th><th>Pts</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DF</th></tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.team}>
              <td><FlagImg team={row.team} size={18}/><span>{row.team}</span></td>
              <td>{row.pts}</td><td>{row.pj}</td><td>{row.g}</td><td>{row.e}</td><td>{row.p}</td><td>{row.gf}</td><td>{row.gc}</td><td>{row.df}</td>
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

  function toggle(phaseId) {
    const next = !phaseOpen[phaseId];
    setPhaseOpen(prev => ({ ...prev, [phaseId]: next }));
    flash(`Fase ${PHASES.find(p => p.id === phaseId).label} ${next ? "abierta" : "cerrada"}`);
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
                    <span className="muted-2" style={{fontSize: 11, fontWeight: 500, marginLeft: 8}}>
                      · {ph.count} {ph.count === 1 ? "partido" : "partidos"}
                    </span>
                  </div>
                  <div className="phase-row-sub">
                    {firstKickoff
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
  const [phaseFilter, setPhaseFilter] = React.useState("groups");
  const [resGroup, setResGroup] = React.useState("A");

  const inPhase = MATCHES.filter(m => matchPhase(m) === phaseFilter);
  const resMatches = phaseFilter === "groups"
    ? inPhase.filter(m => m.group === resGroup)
    : inPhase;
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
        <label className="label" style={{marginBottom: 6, display: "block"}}>Fase</label>
        <select className="select" value={phaseFilter} onChange={e => setPhaseFilter(e.target.value)}>
          {PHASES.map(p => <option key={p.id} value={p.id}>{p.label} · {p.count} partidos</option>)}
        </select>
      </div>

      {phaseFilter === "groups" && (
        <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
          <label className="label" style={{marginBottom: 6, display: "block"}}>Grupo</label>
          <select className="select" value={resGroup} onChange={e => setResGroup(e.target.value)}>
            {Object.keys(GROUPS).map(g => <option key={g} value={g}>Grupo {g}</option>)}
          </select>
        </div>
      )}

      <div className="section" style={{paddingTop: 8}}>
        <div className="card">
          {resMatches.map(m => {
            const r = realResults[m.id] || {home:"",away:""};
            const status = window.matchStatus(m);
            const canEdit = status !== "upcoming";
            const isPlaceholder = m.home == null;
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
                <div className="match-meta">
                  {!canEdit
                    ? <span className="status-badge status-upcoming"><Icon.Clock size={9}/>Próximo</span>
                    : (r.home !== ""
                        ? <span className="status-badge status-finished"><Icon.Check size={9}/>Cargado</span>
                        : <span className="status-badge status-soon"><Icon.Clock size={9}/>Por cargar</span>)}
                  <span style={{marginLeft: 6}}>{m.date} · {m.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ---------- Matriz por jugador ----------
function MatrixTab({ realResults, participants, matches: viewMatches }) {
  const { PHASES, matchPhase } = window.QUINIELA_DATA;
  const MATCHES = viewMatches || window.QUINIELA_DATA.MATCHES;
  const PARTICIPANTS = participants || window.QUINIELA_DATA.PARTICIPANTS;
  const [phaseFilter, setPhaseFilter] = React.useState("groups");
  const [groupFilter, setGroupFilter] = React.useState("ALL");

  const matches = MATCHES.filter(m => {
    if (matchPhase(m) !== phaseFilter) return false;
    if (phaseFilter === "groups" && groupFilter !== "ALL" && m.group !== groupFilter) return false;
    return true;
  });

  const rows = React.useMemo(() => {
    return PARTICIPANTS.map(p => ({
      ...p,
      stats: window.aggregateStats(p.predictions, realResults),
    })).sort((a, b) => b.stats.pts - a.stats.pts);
  }, [realResults]);

  return (
    <>
      <div className="section" style={{paddingTop: 8, paddingBottom: 8}}>
        <div className="legend">
          <span className="legend-item"><span className="legend-dot cell-exacto"></span>Exacto · +3</span>
          <span className="legend-item"><span className="legend-dot cell-parcial"></span>Parcial · +2</span>
          <span className="legend-item"><span className="legend-dot cell-signo"></span>Signo · +1</span>
          <span className="legend-item"><span className="legend-dot cell-fallo"></span>Fallo · 0</span>
          <span className="legend-item"><span className="legend-dot cell-pending"></span>Pendiente</span>
        </div>
      </div>

      <div className="section" style={{paddingTop: 0, paddingBottom: 8}}>
        <div style={{display: "grid", gridTemplateColumns: phaseFilter === "groups" ? "1fr 1fr" : "1fr", gap: 8}}>
          <div>
            <label className="label" style={{marginBottom: 6, display: "block"}}>Fase</label>
            <select className="select" value={phaseFilter} onChange={e => setPhaseFilter(e.target.value)}>
              {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          {phaseFilter === "groups" && (
            <div>
              <label className="label" style={{marginBottom: 6, display: "block"}}>Grupo</label>
              <select className="select" value={groupFilter} onChange={e => setGroupFilter(e.target.value)}>
                <option value="ALL">Todos · 72</option>
                {Object.keys(window.QUINIELA_DATA.GROUPS).map(g =>
                  <option key={g} value={g}>Grupo {g}</option>
                )}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="section" style={{paddingTop: 8}}>
        <div className="matrix-wrap">
          <div className="matrix-scroll">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="head-player">Participante</th>
                  {matches.map(m => {
                    const r = realResults[m.id];
                    const hasReal = r && r.home !== "" && r.away !== "";
                    return (
                      <th key={m.id} title={`${m.home || m.homePlaceholder} vs ${m.away || m.awayPlaceholder} — ${m.date} ${m.time}`}>
                        <div className="match-pair">
                          <span className="match-grp">{m.group ? `G${m.group}` : m.phase.toUpperCase()}</span>
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
                        <div className="user-avatar small">{p.initials}</div>
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
    // TODO backend: PUT /api/admin/bonus-results
    flash("Bonus oficiales guardados");
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
                  <th style={{minWidth: 70, fontSize: 10.5, color: "var(--ink-3)", letterSpacing: ".06em", textTransform: "uppercase", fontWeight: 700}}>Aciertos</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(p => (
                  <tr key={p.user} className={p.isMe ? "me" : ""}>
                    <td className="cell-player">
                      <div className="cell-player-inner">
                        <div className="user-avatar small">{p.initials}</div>
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
                    <td className="matrix-cell" style={{textAlign: "center", padding: "8px 12px", fontWeight: 800, fontSize: 15, fontVariantNumeric: "tabular-nums", color: p.aciertos > 0 ? "var(--primary-dark)" : "var(--ink-3)"}}>
                      {p.aciertos}<small style={{fontSize: 10, color: "var(--ink-3)", fontWeight: 600}}>/5</small>
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

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#1D9E75",
  "font": "manrope",
  "demoPhase": "curso"
}/*EDITMODE-END*/;

const FONTS = {
  manrope: '"Manrope", system-ui, sans-serif',
  jakarta: '"Plus Jakarta Sans", system-ui, sans-serif',
  geist:   '"Geist", system-ui, sans-serif',
};

function shade(hex, mix, against) {
  return `color-mix(in srgb, ${hex} ${100 - mix}%, ${against} ${mix}%)`;
}

function DesignedOriginalApp() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply theme tokens
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", tweaks.primary);
    root.style.setProperty("--primary-dark", shade(tweaks.primary, 25, "black"));
    root.style.setProperty("--primary-soft", shade(tweaks.primary, 88, "white"));
    root.style.setProperty("--font", FONTS[tweaks.font] || FONTS.manrope);
  }, [tweaks.primary, tweaks.font]);

  // Apply simulated "now" for demo phases
  const [, setNowTick] = React.useState(0);
  React.useEffect(() => {
    const ph = window.DEMO_PHASES[tweaks.demoPhase];
    window.setSimNow(ph);
    setNowTick(t => t + 1); // force re-render of children that read getNow()
  }, [tweaks.demoPhase]);

  const [user, setUser] = React.useState(null);
  const [tab, setTab] = React.useState("predictions");

  // Shared app state
  const [predictions, setPredictions] = React.useState(() => buildSeedPredictions());
  const [realResults, setRealResults] = React.useState(() => buildSeedReal());
  const [bonus, setBonus] = React.useState({
    campeon: "Argentina",
    subcampeon: "",
    goleador: "",
    mvp: "",
    portero: "",
  });
  const [officialBonus, setOfficialBonus] = React.useState({
    campeon: "",
    subcampeon: "",
    goleador: "",
    mvp: "",
    portero: "",
  });
  // Bonus picks de cada participante (seed mock — el suyo se mantiene en `bonus`)
  const [participantBonus] = React.useState(() => buildParticipantBonusSeed());
  // Phase open state — admin controla cuándo se abren
  const [phaseOpen, setPhaseOpen] = React.useState(() => {
    const initial = {};
    window.QUINIELA_DATA.PHASES.forEach(p => { initial[p.id] = p.defaultOpen; });
    return initial;
  });
  const [users, setUsers] = React.useState(() =>
    window.QUINIELA_DATA.MOCK_USERS.map(u => ({ ...u }))
  );

  // Pending predictions count (upcoming matches without a prediction)
  const pendingPreds = React.useMemo(() => {
    return window.QUINIELA_DATA.MATCHES.filter(m => {
      if (window.matchStatus(m) !== "upcoming") return false;
      const p = predictions[m.id];
      return !p || p.home === "" || p.away === "";
    }).length;
  }, [predictions, tweaks.demoPhase]); // demoPhase shifts which matches are upcoming

  if (!user) {
    return (
      <>
        <LoginScreen onLogin={setUser}/>
        <TweaksPanelUI tweaks={tweaks} setTweak={setTweak}/>
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
            {tab === "leaderboard" && <LeaderboardScreen currentUser={user} realResults={realResults}/>}
            {tab === "bonus" && <BonusScreen bonus={bonus} setBonus={setBonus}/>}
            {tab === "profile" && <ProfileScreen user={user} onLogout={() => setUser(null)}/>}
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
        <div className="bottomnav" style={{gridTemplateColumns: "repeat(5, 1fr)"}}>
          <button className={tab === "predictions" ? "active" : ""} onClick={() => setTab("predictions")}>
            <span className="nav-icon">
              <Icon.List size={20}/>
              {pendingPreds > 0 && <span className="nav-badge">{pendingPreds > 99 ? "99+" : pendingPreds}</span>}
            </span>
            Pronósticos
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
          <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>
            <span className="nav-icon"><Icon.Shield size={20}/></span>
            Perfil
          </button>
        </div>
      )}

      <TweaksPanelUI tweaks={tweaks} setTweak={setTweak}/>
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

// Tweaks panel UI
function OriginalTweaksPanelUI({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Fase del torneo (demo)"/>
      <TweakRadio
        label="Estado"
        value={tweaks.demoPhase}
        onChange={(v) => setTweak("demoPhase", v)}
        options={["pre", "curso", "post"]}
      />
      <TweakSection label="Tema"/>
      <TweakColor
        label="Color principal"
        value={tweaks.primary}
        onChange={(v) => setTweak("primary", v)}
        options={["#1D9E75", "#0E8C66", "#3F7A4F", "#2B7A3D"]}
      />
      <TweakSection label="Tipografía"/>
      <TweakRadio
        label="Fuente"
        value={tweaks.font}
        onChange={(v) => setTweak("font", v)}
        options={["manrope", "jakarta", "geist"]}
      />
    </TweaksPanel>
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

function makePreviewPredictions(matches, seedOffset = 0) {
  const predictions = {};
  matches.forEach((m, i) => {
    if (i % 7 === 0) return;
    predictions[m.id] = {
      home: String((i + seedOffset) % 4),
      away: String((i * 2 + seedOffset) % 3),
    };
  });
  return predictions;
}

function makePreviewRealResults(matches) {
  const results = {};
  matches.forEach((m, i) => {
    results[m.id] = {
      home: String((i + 1) % 4),
      away: String((i * 2 + 1) % 3),
    };
  });
  return results;
}

function makePreviewParticipants(matches) {
  const base = window.QUINIELA_DATA.PREVIEW_PARTICIPANTS_RAW || window.QUINIELA_DATA.PARTICIPANTS || [];
  return base.map((p, i) => ({
    ...p,
    predictions: makePreviewPredictions(matches, i + 1),
  }));
}

function makePreviewParticipantBonus(participants) {
  const { ALL_TEAMS, TOP_SCORERS, MVP_CANDIDATES, GOALKEEPERS } = window.QUINIELA_DATA;
  const picks = {};
  participants.forEach((p, i) => {
    picks[p.user] = {
      campeon: ALL_TEAMS[(i + 1) % ALL_TEAMS.length],
      subcampeon: ALL_TEAMS[(i + 4) % ALL_TEAMS.length],
      goleador: TOP_SCORERS[i % TOP_SCORERS.length],
      mvp: MVP_CANDIDATES[(i + 2) % MVP_CANDIDATES.length],
      portero: GOALKEEPERS[(i + 3) % GOALKEEPERS.length],
    };
  });
  return picks;
}




function toInitials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "--";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const KO_PHASES = new Set(["r32", "r16", "qf", "sf", "third", "final"]);
const KO_ROUND = { r32: 4, r16: 5, qf: 6, sf: 7, third: 8, final: 9 };

function mapMatchFromApi(match) {
  const date = new Date(match.date);
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const isKO = KO_PHASES.has(match.group);
  const mapped = {
    id: match.id,
    phase: isKO ? match.group : "groups",
    group: match.group,
    round: isKO ? (KO_ROUND[match.group] ?? 4) : 1,
    home: match.home || null,
    away: match.away || null,
    kickoffMs: date.getTime(),
    kickoffISO: match.date,
    date: `${date.getUTCDate()} ${months[date.getUTCMonth()]}`,
    time: `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`,
  };
  if (match.home_flag) window.QUINIELA_DATA.FLAG_CODES[match.home] = match.home_flag;
  if (match.away_flag) window.QUINIELA_DATA.FLAG_CODES[match.away] = match.away_flag;
  return mapped;
}

function applyBackendData({ matches = [], leaderboard = [], users = [] }) {
  if (!window.QUINIELA_DATA) return;

  if (matches.length) {
    const mappedMatches = matches.map(mapMatchFromApi);
    const groupMatches = mappedMatches.filter(m => m.phase === "groups");
    const koMatches = mappedMatches.filter(m => m.phase !== "groups");

    window.QUINIELA_DATA.MATCHES_GROUPS = groupMatches;
    if (koMatches.length) window.QUINIELA_DATA.MATCHES_KO = koMatches;
    window.QUINIELA_DATA.MATCHES = [
      ...window.QUINIELA_DATA.MATCHES_GROUPS,
      ...window.QUINIELA_DATA.MATCHES_KO,
    ];
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
    window.QUINIELA_DATA.PARTICIPANTS = leaderboard.map((row, index) => ({
      id: index + 1,
      name: row.nombre,
      user: row.alias,
      email: "",
      initials: toInitials(row.nombre),
      predictions: {},
      backendStats: row,
    }));
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
        pass: "********",
        paid: user.paid ?? false,
        initials: toInitials(user.nombre),
      }));
    // Preview siempre usa participantes ficticios — no se toca PREVIEW_PARTICIPANTS_RAW
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
      <div className="login-brand">
        <div className="topbar-logo" style={{width: 40, height: 40, borderRadius: 11, fontSize: 16}}>Q26</div>
        <div><div className="topbar-title" style={{fontSize: 15}}>Quiniela</div><div className="topbar-sub" style={{fontSize: 10}}>Mundial 2026</div></div>
      </div>
      <div className="login-hero"><h1>Acierta. Suma.<br/>Quédate arriba.</h1><p>Predice los resultados del Mundial 2026 y compite con tus amigos.</p></div>
      <div className="login-form-side">
        <div className="login-form-card">
          <form className="login-card" onSubmit={submit}>
            {err && <div className="error-msg"><Icon.Alert size={14}/><span>{err}</span></div>}
            <div className="field" style={{marginBottom: 14}}><label className="label">Usuario</label><input className={`input ${err ? "error" : ""}`} type="text" placeholder="admin" value={user} onChange={e => setUser(e.target.value)} autoCapitalize="none" autoCorrect="off"/></div>
            <div className="field" style={{marginBottom: 20}}><label className="label">Contraseña</label><input className={`input ${err ? "error" : ""}`} type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)}/></div>
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? "Entrando…" : "Entrar"}</button>
            <div className="login-hint">¿No tienes cuenta? Pide al admin que te dé acceso.</div>
          </form>
        </div>
      </div>
    </div>
  );
}

function TweaksPanelUI() {
  return null;
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
    ]).then((results) => {
      const matches = results[0].status === "fulfilled" ? results[0].value.matches : [];
      const leaderboard = results[1].status === "fulfilled" ? results[1].value.leaderboard : [];
      const users = results[2].status === "fulfilled" ? results[2].value.users : [];
      applyBackendData({ matches, leaderboard, users });
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
