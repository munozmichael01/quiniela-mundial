import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { calcularPuntos, calcularPuntosBonus } from "@/lib/points";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createServiceClient();

  const [
    { count: totalUsers },
    { count: totalPredictions },
    { count: matchesFinished },
    { count: matchesTotal },
    { data: predictions },
    { data: results },
    { data: bonuses },
    { data: bonusResults },
    { data: users },
    { data: proximoPartido },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "user"),
    supabase.from("predictions").select("*", { count: "exact", head: true }),
    supabase.from("results").select("*", { count: "exact", head: true }),
    supabase.from("matches").select("*", { count: "exact", head: true }),
    supabase.from("predictions").select("user_id, match_id, home_score, away_score"),
    supabase.from("results").select("match_id, home_score, away_score"),
    supabase.from("bonuses").select("user_id, campeon, subcampeon, goleador, mvp, portero"),
    supabase
      .from("bonus_results")
      .select("campeon, subcampeon, goleador, mvp, portero")
      .order("id", { ascending: false })
      .limit(1)
      .single(),
    supabase.from("users").select("id, nombre, alias").eq("role", "user"),
    // Próximo partido sin resultado: join via NOT IN sobre match_ids con resultado
    supabase
      .from("matches")
      .select("id, home, away, date, home_flag, away_flag")
      .not("id", "in", `(select match_id from results)`)
      .gte("date", new Date().toISOString())
      .order("date", { ascending: true })
      .limit(1)
      .single(),
  ]);

  // Calcular puntos por usuario para obtener promedio y líder
  const resultsMap = new Map((results ?? []).map((r) => [r.match_id, r]));

  let totalPuntos = 0;
  let lider: { nombre: string; alias: string; puntos: number } | null = null;

  for (const user of users ?? []) {
    const userPreds = (predictions ?? []).filter((p) => p.user_id === user.id);
    let puntos = 0;

    for (const pred of userPreds) {
      const result = resultsMap.get(pred.match_id);
      if (!result) continue;
      puntos += calcularPuntos(
        pred.home_score,
        pred.away_score,
        result.home_score,
        result.away_score
      );
    }

    const userBonus = (bonuses ?? []).find((b) => b.user_id === user.id);
    if (userBonus && bonusResults) {
      puntos += calcularPuntosBonus(
        userBonus as Record<string, string | null>,
        bonusResults as Record<string, string | null>
      );
    }

    totalPuntos += puntos;

    if (!lider || puntos > lider.puntos) {
      lider = { nombre: user.nombre, alias: user.alias, puntos };
    }
  }

  const nParticipantes = totalUsers ?? 0;
  const puntosPromedio =
    nParticipantes > 0 ? Math.round((totalPuntos / nParticipantes) * 10) / 10 : 0;

  return NextResponse.json({
    totalParticipantes: nParticipantes,
    totalPronosticos: totalPredictions ?? 0,
    partidosJugados: matchesFinished ?? 0,
    partidosPendientes: (matchesTotal ?? 0) - (matchesFinished ?? 0),
    puntosPromedio,
    lider,
    proximoPartido: proximoPartido
      ? {
          id: proximoPartido.id,
          home: proximoPartido.home,
          away: proximoPartido.away,
          home_flag: proximoPartido.home_flag,
          away_flag: proximoPartido.away_flag,
          date: proximoPartido.date,
        }
      : null,
  });
}
