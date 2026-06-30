import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  match_id: z.number().int().positive(),
  home_score: z.number().int().min(0),
  away_score: z.number().int().min(0),
  penalty_winner: z.string().nullable().optional(),
});

// Bracket map: external_id → { next_external_id, slot: "home"|"away" }
// Derived from migration_knockout_2026.sql bracket structure
const BRACKET_MAP: Record<number, { next: number; slot: "home" | "away" }> = {
  // r32 → r16
  1001: { next: 1017, slot: "home" }, 1004: { next: 1017, slot: "away" },
  1003: { next: 1018, slot: "home" }, 1006: { next: 1018, slot: "away" },
  1002: { next: 1019, slot: "home" }, 1005: { next: 1019, slot: "away" },
  1007: { next: 1020, slot: "home" }, 1008: { next: 1020, slot: "away" },
  1012: { next: 1021, slot: "home" }, 1011: { next: 1021, slot: "away" },
  1010: { next: 1022, slot: "home" }, 1009: { next: 1022, slot: "away" },
  1015: { next: 1023, slot: "home" }, 1014: { next: 1023, slot: "away" },
  1013: { next: 1024, slot: "home" }, 1016: { next: 1024, slot: "away" },
  // r16 → qf
  1017: { next: 1025, slot: "home" }, 1018: { next: 1025, slot: "away" },
  1019: { next: 1026, slot: "home" }, 1020: { next: 1026, slot: "away" },
  1021: { next: 1027, slot: "home" }, 1022: { next: 1027, slot: "away" },
  1023: { next: 1028, slot: "home" }, 1024: { next: 1028, slot: "away" },
  // qf → sf
  1025: { next: 1029, slot: "home" }, 1026: { next: 1029, slot: "away" },
  1027: { next: 1030, slot: "home" }, 1028: { next: 1030, slot: "away" },
  // sf → final (winners) and third place (losers handled separately below)
  1029: { next: 1032, slot: "home" }, 1030: { next: 1032, slot: "away" },
};

// sf losers → third place
const THIRD_PLACE_MAP: Record<number, "home" | "away"> = {
  1029: "home",
  1030: "away",
};

async function advanceBracket(
  supabase: ReturnType<typeof createServiceClient>,
  currentExternalId: number,
  homeScore: number,
  awayScore: number,
  homeTeam: string,
  awayTeam: string,
  homeFlag: string | null,
  awayFlag: string | null,
  penaltyWinner: string | null = null
) {
  // Draw requires penalty_winner to advance bracket
  if (homeScore === awayScore && !penaltyWinner) return;

  const winnerTeam = homeScore !== awayScore
    ? (homeScore > awayScore ? homeTeam : awayTeam)
    : penaltyWinner!;
  const loserTeam = homeScore !== awayScore
    ? (homeScore < awayScore ? homeTeam : awayTeam)
    : (penaltyWinner === homeTeam ? awayTeam : homeTeam);

  const winnerFlag = winnerTeam === homeTeam ? homeFlag : awayFlag;
  const loserFlag = loserTeam === homeTeam ? homeFlag : awayFlag;

  const winner = { team: winnerTeam, flag: winnerFlag };
  const loser  = { team: loserTeam,  flag: loserFlag  };

  const next = BRACKET_MAP[currentExternalId];
  if (next) {
    const update = next.slot === "home"
      ? { home: winner.team, home_flag: winner.flag }
      : { away: winner.team, away_flag: winner.flag };
    await supabase.from("matches").update(update).eq("external_id", next.next);
  }

  // Also advance loser to third place if this is a sf match
  const thirdSlot = THIRD_PLACE_MAP[currentExternalId];
  if (thirdSlot) {
    const update = thirdSlot === "home"
      ? { home: loser.team, home_flag: loser.flag }
      : { away: loser.team, away_flag: loser.flag };
    await supabase.from("matches").update(update).eq("external_id", 1031);
  }
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Fetch the match to get team names, flags and external_id
  const { data: match } = await supabase
    .from("matches")
    .select("external_id, home, away, home_flag, away_flag")
    .eq("id", parsed.data.match_id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: dbError } = await (supabase.from("results") as any)
    .upsert(
      {
        match_id: parsed.data.match_id,
        home_score: parsed.data.home_score,
        away_score: parsed.data.away_score,
        penalty_winner: parsed.data.penalty_winner ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "match_id" }
    );

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  // Advance bracket if this match has a defined next round
  if (match?.external_id && match.home && match.away) {
    await advanceBracket(
      supabase,
      match.external_id,
      parsed.data.home_score,
      parsed.data.away_score,
      match.home,
      match.away,
      match.home_flag ?? null,
      match.away_flag ?? null,
      parsed.data.penalty_winner ?? null
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { match_id } = await req.json().catch(() => ({}));
  if (!match_id) return NextResponse.json({ error: "match_id requerido" }, { status: 400 });

  const supabase = createServiceClient();
  const { error: dbError } = await supabase.from("results").delete().eq("match_id", match_id);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
