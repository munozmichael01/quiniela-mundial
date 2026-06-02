import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

const nullableStr = z.string().max(200).transform(v => v.trim() || null).nullable().optional();

const schema = z.object({
  campeon:    nullableStr,
  subcampeon: nullableStr,
  goleador:   nullableStr,
  mvp:        nullableStr,
  portero:    nullableStr,
});

async function isBonusOpen(): Promise<boolean> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("phase_settings")
    .select("is_open")
    .eq("id", "bonus")
    .single();
  return data?.is_open ?? false;
}

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  const supabase = await createClient();
  const { data } = await supabase
    .from("bonuses")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const open = await isBonusOpen();

  return NextResponse.json({ bonus: data ?? null, closed: !open });
}

export async function PUT(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const open = await isBonusOpen();
  if (!open) {
    return NextResponse.json({ error: "Los bonus están cerrados" }, { status: 409 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();
  const { error: dbError } = await supabase.from("bonuses").upsert(
    {
      user_id:    user!.id,
      campeon:    parsed.data.campeon    ?? null,
      subcampeon: parsed.data.subcampeon ?? null,
      goleador:   parsed.data.goleador   ?? null,
      mvp:        parsed.data.mvp        ?? null,
      portero:    parsed.data.portero    ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
