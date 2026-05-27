import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const upsertSchema = z.object({
  match_id: z.number().int().positive(),
  home_score: z.number().int().min(0),
  away_score: z.number().int().min(0),
});

const batchSchema = z.array(upsertSchema).min(1).max(100);

export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get("match_id");

  let query = supabase
    .from("predictions")
    .select("*")
    .eq("user_id", user!.id);

  if (matchId) query = query.eq("match_id", parseInt(matchId));

  const { data, error: dbError } = await query;
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ predictions: data });
}

export async function PUT(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await req.json().catch(() => null);

  const isBatch = Array.isArray(body);
  const parsed = isBatch
    ? batchSchema.safeParse(body)
    : batchSchema.safeParse([body]);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  const now = new Date().toISOString();

  const matchIds = parsed.data.map((p) => p.match_id);
  const { data: matches } = await supabase
    .from("matches")
    .select("id, date")
    .in("id", matchIds);

  const locked = (matches ?? []).filter((m) => new Date(m.date) <= new Date());
  if (locked.length > 0) {
    return NextResponse.json(
      { error: "Uno o más partidos ya han comenzado y no pueden editarse" },
      { status: 409 }
    );
  }

  const rows = parsed.data.map((p) => ({
    user_id: user!.id,
    match_id: p.match_id,
    home_score: p.home_score,
    away_score: p.away_score,
    updated_at: now,
  }));

  const { error: dbError } = await supabase
    .from("predictions")
    .upsert(rows, { onConflict: "user_id,match_id" });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ ok: true, saved: rows.length });
}
