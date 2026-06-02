import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  match_id: z.number().int().positive(),
  home_score: z.number().int().min(0),
  away_score: z.number().int().min(0),
});

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error: dbError } = await supabase
    .from("results")
    .upsert(
      { ...parsed.data, updated_at: new Date().toISOString() },
      { onConflict: "match_id" }
    );

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

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
