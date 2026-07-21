import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("bonus_results")
    .select("campeon, subcampeon, goleador, mvp, portero")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({ bonus_results: data ?? null });
}
