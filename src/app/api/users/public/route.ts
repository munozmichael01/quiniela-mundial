import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = createServiceClient();
  const { data, error: dbError } = await supabase
    .from("users")
    .select("id, alias, nombre")
    .neq("role", "admin")
    .order("created_at", { ascending: true });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ users: data ?? [] });
}
