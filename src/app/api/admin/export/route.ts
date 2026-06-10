import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServiceClient, fetchAllRows } from "@/lib/supabase/server";

function csvEscape(value: string): string {
  if (/[",\n;]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createServiceClient();

  const [
    { data: users },
    { data: matches },
    { data: predictions },
  ] = await Promise.all([
    supabase.from("users").select("id, nombre, alias").eq("role", "user").order("alias"),
    supabase.from("matches").select("id, group, home, away, date").order("date"),
    fetchAllRows((from, to) =>
      supabase
        .from("predictions")
        .select("user_id, match_id, home_score, away_score")
        .range(from, to)
    ),
  ]);

  if (!users || !matches) {
    return NextResponse.json({ error: "No se pudieron cargar los datos" }, { status: 500 });
  }

  const predsMap = new Map(
    (predictions ?? []).map((p) => [`${p.user_id}-${p.match_id}`, p])
  );

  const header = [
    "Jugador",
    "Alias",
    ...matches.map((m) => `${m.group} - ${m.home} vs ${m.away}`),
  ];

  const rows: string[][] = [header];

  for (const user of users) {
    rows.push([
      user.nombre,
      user.alias,
      ...matches.map((m) => {
        const p = predsMap.get(`${user.id}-${m.id}`);
        return p ? `${p.home_score}-${p.away_score}` : "";
      }),
    ]);
  }

  const csv = rows.map((r) => r.map((cell) => csvEscape(String(cell))).join(";")).join("\n");
  const bom = "﻿"; // for Excel UTF-8

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="quiniela-resultados.csv"`,
    },
  });
}
