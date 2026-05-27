import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { calcularPuntosBonus } from "@/lib/points";
import { z } from "zod";

const schema = z.object({
  campeon: z.string().min(1).nullable(),
  subcampeon: z.string().min(1).nullable(),
  goleador: z.string().min(1).nullable(),
  mvp: z.string().min(1).nullable(),
  portero: z.string().min(1).nullable(),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("bonus_results")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({ bonus_results: data ?? null });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error: dbError } = await supabase
    .from("bonus_results")
    .upsert({ id: 1, ...parsed.data, updated_at: new Date().toISOString() });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  // Recalcular puntos bonus de todos los participantes y devolverlos
  const { data: bonuses } = await supabase
    .from("bonuses")
    .select("user_id, campeon, subcampeon, goleador, mvp, portero");

  const { data: users } = await supabase
    .from("users")
    .select("id, nombre, alias")
    .eq("role", "user");

  const bonusResults = parsed.data as Record<string, string | null>;

  const breakdown = (users ?? []).map((user) => {
    const userBonus = (bonuses ?? []).find((b) => b.user_id === user.id);
    const puntos = userBonus
      ? calcularPuntosBonus(
          userBonus as Record<string, string | null>,
          bonusResults
        )
      : 0;
    return { user_id: user.id, nombre: user.nombre, alias: user.alias, puntos_bonus: puntos };
  });

  breakdown.sort((a, b) => b.puntos_bonus - a.puntos_bonus);

  return NextResponse.json({ ok: true, breakdown });
}
