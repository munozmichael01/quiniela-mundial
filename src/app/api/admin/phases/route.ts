import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

const VALID_PHASES = ["groups", "r32", "r16", "qf", "sf", "third", "final"] as const;

const patchSchema = z.object({
  id: z.enum(VALID_PHASES),
  is_open: z.boolean(),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createServiceClient();
  const { data, error: dbError } = await supabase
    .from("phase_settings")
    .select("id, is_open")
    .order("id");

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ phases: data });
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const { id, is_open } = parsed.data;
  const supabase = createServiceClient();

  const { error: dbError } = await supabase
    .from("phase_settings")
    .upsert({ id, is_open, updated_at: new Date().toISOString() });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
