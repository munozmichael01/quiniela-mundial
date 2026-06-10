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

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = createServiceClient();

  const [
    { data: users },
    { data: predictions },
    { data: results },
    { data: bonuses },
    { data: bonusResults },
  ] = await Promise.all([
    supabase.from("users").select("id, nombre, alias").eq("role", "user"),
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

  const resultsMap = new Map(
    (results ?? []).map((r) => [r.match_id, r])
  );

  const leaderboard: LeaderboardEntry[] = users.map((user) => {
    const userPreds = (predictions ?? []).filter((p) => p.user_id === user.id);
    let puntosTotales = 0;
    let exactos = 0;
    let completados = 0;

    for (const pred of userPreds) {
      const result = resultsMap.get(pred.match_id);
      if (!result) continue;
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
