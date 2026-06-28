import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createServiceClient, fetchAllRows } from "@/lib/supabase/server";
import { calcularPuntos, calcularPuntosBonus } from "@/lib/points";

interface LeaderboardEntry {
  user_id: string;
  nombre: string;
  alias: string;
  puntos: number;
  exactos: number;
  completados: number;
  posicion?: number;
}

// Which two matches (by external_id) feed into each knockout match as winner
// Mirrors the bracket structure in migration_knockout_2026.sql
const PREDECESSORS: Record<number, { home: number; away: number }> = {
  1017: { home: 1001, away: 1004 },
  1018: { home: 1003, away: 1006 },
  1019: { home: 1002, away: 1005 },
  1020: { home: 1007, away: 1008 },
  1021: { home: 1012, away: 1011 },
  1022: { home: 1010, away: 1009 },
  1023: { home: 1015, away: 1014 },
  1024: { home: 1013, away: 1016 },
  1025: { home: 1017, away: 1018 },
  1026: { home: 1019, away: 1020 },
  1027: { home: 1021, away: 1022 },
  1028: { home: 1023, away: 1024 },
  1029: { home: 1025, away: 1026 },
  1030: { home: 1027, away: 1028 },
  1031: { home: 1029, away: 1030 }, // third place uses losers
  1032: { home: 1029, away: 1030 },
};

type MatchRow = { id: number; group: string; external_id: number | null; home: string; away: string };
type ResultRow = { match_id: number; home_score: number; away_score: number };
type PredRow = { user_id: string; match_id: number; home_score: number; away_score: number };

function winner(home: string, away: string, homeScore: number, awayScore: number): string | null {
  if (homeScore === awayScore) return null;
  return homeScore > awayScore ? home : away;
}

function loser(home: string, away: string, homeScore: number, awayScore: number): string | null {
  if (homeScore === awayScore) return null;
  return homeScore < awayScore ? home : away;
}

// Returns { home, away } team names that a player's bracket predicts for a given match (by external_id).
// For r32 matches (no predecessors) returns the real team names from the DB since they're fixed.
function playerBracketTeams(
  extId: number,
  matchByExtId: Map<number, MatchRow>,
  resultByMatchId: Map<number, ResultRow>,
  predByMatchId: Map<number, PredRow>,
  isThirdPlace: boolean
): { home: string | null; away: string | null } {
  const pred = PREDECESSORS[extId];
  if (!pred) {
    // r32: teams are fixed, return from match row
    const m = matchByExtId.get(extId);
    return { home: m?.home ?? null, away: m?.away ?? null };
  }

  const homeMatch = matchByExtId.get(pred.home);
  const awayMatch = matchByExtId.get(pred.away);
  if (!homeMatch || !awayMatch) return { home: null, away: null };

  const homePred = predByMatchId.get(homeMatch.id);
  const awayPred = predByMatchId.get(awayMatch.id);

  // Recurse to get predicted teams for predecessor matches
  const homePreds = playerBracketTeams(pred.home, matchByExtId, resultByMatchId, predByMatchId, false);
  const awayPreds = playerBracketTeams(pred.away, matchByExtId, resultByMatchId, predByMatchId, false);

  let homeTeam: string | null = null;
  let awayTeam: string | null = null;

  if (homePred && homePreds.home && homePreds.away) {
    homeTeam = isThirdPlace
      ? loser(homePreds.home, homePreds.away, homePred.home_score, homePred.away_score)
      : winner(homePreds.home, homePreds.away, homePred.home_score, homePred.away_score);
  }
  if (awayPred && awayPreds.home && awayPreds.away) {
    awayTeam = isThirdPlace
      ? loser(awayPreds.home, awayPreds.away, awayPred.home_score, awayPred.away_score)
      : winner(awayPreds.home, awayPreds.away, awayPred.home_score, awayPred.away_score);
  }

  return { home: homeTeam, away: awayTeam };
}

// Returns { home, away } real teams for a match based on real results chain
function realBracketTeams(
  extId: number,
  matchByExtId: Map<number, MatchRow>,
  resultByMatchId: Map<number, ResultRow>,
  isThirdPlace: boolean
): { home: string | null; away: string | null } {
  const pred = PREDECESSORS[extId];
  if (!pred) {
    const m = matchByExtId.get(extId);
    return { home: m?.home ?? null, away: m?.away ?? null };
  }

  const homeMatch = matchByExtId.get(pred.home);
  const awayMatch = matchByExtId.get(pred.away);
  if (!homeMatch || !awayMatch) return { home: null, away: null };

  const homeResult = resultByMatchId.get(homeMatch.id);
  const awayResult = resultByMatchId.get(awayMatch.id);

  const homeTeams = realBracketTeams(pred.home, matchByExtId, resultByMatchId, false);
  const awayTeams = realBracketTeams(pred.away, matchByExtId, resultByMatchId, false);

  let homeTeam: string | null = null;
  let awayTeam: string | null = null;

  if (homeResult && homeTeams.home && homeTeams.away) {
    homeTeam = isThirdPlace
      ? loser(homeTeams.home, homeTeams.away, homeResult.home_score, homeResult.away_score)
      : winner(homeTeams.home, homeTeams.away, homeResult.home_score, homeResult.away_score);
  }
  if (awayResult && awayTeams.home && awayTeams.away) {
    awayTeam = isThirdPlace
      ? loser(awayTeams.home, awayTeams.away, awayResult.home_score, awayResult.away_score)
      : winner(awayTeams.home, awayTeams.away, awayResult.home_score, awayResult.away_score);
  }

  return { home: homeTeam, away: awayTeam };
}

const KO_PHASES = new Set(["r32", "r16", "qf", "sf", "third", "final"]);

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = createServiceClient();

  const [
    { data: users },
    { data: matches },
    { data: predictions },
    { data: results },
    { data: bonuses },
    { data: bonusResults },
  ] = await Promise.all([
    supabase.from("users").select("id, nombre, alias").eq("role", "user"),
    supabase.from("matches").select("id, group, external_id, home, away"),
    fetchAllRows((from, to) =>
      supabase
        .from("predictions")
        .select("user_id, match_id, home_score, away_score")
        .range(from, to)
    ),
    supabase.from("results").select("match_id, home_score, away_score"),
    supabase.from("bonuses").select("user_id, campeon, subcampeon, goleador, mvp, portero"),
    supabase
      .from("bonus_results")
      .select("campeon, subcampeon, goleador, mvp, portero")
      .order("id", { ascending: false })
      .limit(1)
      .single(),
  ]);

  if (!users) return NextResponse.json({ leaderboard: [] });

  const allMatches = (matches ?? []) as MatchRow[];
  const allResults = (results ?? []) as ResultRow[];
  const allPredictions = (predictions ?? []) as PredRow[];

  const resultByMatchId = new Map(allResults.map((r) => [r.match_id, r]));
  const matchByExtId = new Map(
    allMatches
      .filter((m): m is MatchRow & { external_id: number } => m.external_id !== null)
      .map((m) => [m.external_id, m])
  );

  const knockoutMatches = allMatches.filter((m) => KO_PHASES.has(m.group));

  const leaderboard: LeaderboardEntry[] = users.map((user) => {
    const predByMatchId = new Map(
      allPredictions
        .filter((p) => p.user_id === user.id)
        .map((p) => [p.match_id, p])
    );

    let puntosTotales = 0;
    let exactos = 0;
    let completados = 0;

    for (const match of knockoutMatches) {
      const result = resultByMatchId.get(match.id);
      if (!result) continue;

      const pred = predByMatchId.get(match.id);
      if (!pred) continue;

      // For r32 matches: always eligible (teams are fixed)
      // For later rounds: only score if player's bracket predicted the same matchup
      if (match.group !== "r32" && match.external_id) {
        const isThirdPlace = match.group === "third";
        const realTeams = realBracketTeams(match.external_id, matchByExtId, resultByMatchId, isThirdPlace);
        const playerTeams = playerBracketTeams(match.external_id, matchByExtId, resultByMatchId, predByMatchId, isThirdPlace);

        const bracketMatches =
          realTeams.home !== null &&
          realTeams.away !== null &&
          playerTeams.home === realTeams.home &&
          playerTeams.away === realTeams.away;

        if (!bracketMatches) continue;
      }

      completados++;
      const pts = calcularPuntos(
        pred.home_score,
        pred.away_score,
        result.home_score,
        result.away_score
      );
      puntosTotales += pts;
      if (pts === 3) exactos++;
    }

    const userBonus = (bonuses ?? []).find((b) => b.user_id === user.id);
    if (userBonus && bonusResults) {
      puntosTotales += calcularPuntosBonus(
        userBonus as Record<string, string | null>,
        bonusResults as Record<string, string | null>
      );
    }

    return {
      user_id: user.id,
      nombre: user.nombre,
      alias: user.alias,
      puntos: puntosTotales,
      exactos,
      completados,
    };
  });

  leaderboard.sort((a, b) => b.puntos - a.puntos || b.exactos - a.exactos);
  leaderboard.forEach((row, i) => {
    row.posicion = i + 1;
  });

  return NextResponse.json({ leaderboard });
}
