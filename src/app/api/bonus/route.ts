import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Bonuses close June 11, 2026 at 20:00 Spain (UTC+2) = 18:00 UTC
const BONUS_DEADLINE = new Date("2026-06-11T18:00:00Z");

const schema = z.object({
  campeon: z.string().min(1).max(100).nullish(),
  subcampeon: z.string().min(1).max(100).nullish(),
  goleador: z.string().min(1).max(100).nullish(),
  mvp: z.string().min(1).max(100).nullish(),
  portero: z.string().min(1).max(100).nullish(),
});

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  const supabase = await createClient();
  const { data } = await supabase
    .from("bonuses")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  return NextResponse.json({
    bonus: data ?? null,
    deadline: BONUS_DEADLINE.toISOString(),
    closed: new Date() >= BONUS_DEADLINE,
  });
}

export async function PUT(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  if (new Date() >= BONUS_DEADLINE) {
    return NextResponse.json(
      { error: "Los bonus ya están cerrados" },
      { status: 409 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  const { error: dbError } = await supabase.from("bonuses").upsert(
    {
      user_id: user!.id,
      campeon: parsed.data.campeon ?? null,
      subcampeon: parsed.data.subcampeon ?? null,
      goleador: parsed.data.goleador ?? null,
      mvp: parsed.data.mvp ?? null,
      portero: parsed.data.portero ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
