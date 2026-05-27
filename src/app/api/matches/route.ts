import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = await createClient();
  const { data, error: dbError } = await supabase
    .from("matches")
    .select(`
      *,
      results (home_score, away_score, updated_at)
    `)
    .order("date", { ascending: true });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ matches: data });
}
