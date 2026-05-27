import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const API_FOOTBALL_URL = "https://v3.football.api-sports.io";
const LEAGUE_ID = 1;   // FIFA World Cup
const SEASON = 2026;

interface APIFixture {
  fixture: {
    id: number;
    status: { short: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

interface APIFootballResponse {
  response: APIFixture[];
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API_FOOTBALL_KEY" }, { status: 500 });
  }

  const today = new Date().toISOString().split("T")[0];
  const response = await fetch(
    `${API_FOOTBALL_URL}/fixtures?league=${LEAGUE_ID}&season=${SEASON}&date=${today}`,
    {
      headers: {
        "x-apisports-key": apiKey,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: `api-football error: ${response.status}`, detail: text },
      { status: 502 }
    );
  }

  const json: APIFootballResponse = await response.json();
  const fixtures: APIFixture[] = json.response ?? [];

  // Only finished matches with valid scores
  const finished = fixtures.filter(
    (f) =>
      f.fixture.status.short === "FT" &&
      f.goals.home !== null &&
      f.goals.away !== null
  );

  if (finished.length === 0) {
    return NextResponse.json({ ok: true, updated: 0 });
  }

  const supabase = createServiceClient();

  const externalIds = finished.map((f) => f.fixture.id);
  const { data: internalMatches } = await supabase
    .from("matches")
    .select("id, external_id")
    .in("external_id", externalIds);

  if (!internalMatches || internalMatches.length === 0) {
    return NextResponse.json({ ok: true, updated: 0, note: "No matching internal matches" });
  }

  const externalToInternal = new Map(
    internalMatches
      .filter((m): m is typeof m & { external_id: number } => m.external_id !== null)
      .map((m) => [m.external_id, m.id])
  );

  const upserts = finished
    .map((f) => {
      const internalId = externalToInternal.get(f.fixture.id);
      if (!internalId) return null;
      return {
        match_id: internalId,
        home_score: f.goals.home!,
        away_score: f.goals.away!,
        updated_at: new Date().toISOString(),
      };
    })
    .filter((u): u is NonNullable<typeof u> => u !== null);

  if (upserts.length === 0) {
    return NextResponse.json({ ok: true, updated: 0 });
  }

  const { error } = await supabase
    .from("results")
    .upsert(upserts, { onConflict: "match_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("matches")
    .update({ status: "finished" })
    .in("external_id", externalIds);

  return NextResponse.json({ ok: true, updated: upserts.length });
}
