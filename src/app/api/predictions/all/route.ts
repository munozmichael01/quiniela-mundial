import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createServiceClient, fetchAllRows } from "@/lib/supabase/server";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = createServiceClient();
  const { data, error: dbError } = await fetchAllRows((from, to) =>
    supabase
      .from("predictions")
      .select("user_id, match_id, home_score, away_score")
      .range(from, to)
  );

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ predictions: data });
}
