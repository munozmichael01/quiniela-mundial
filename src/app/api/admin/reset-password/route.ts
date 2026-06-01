import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Endpoint temporal para resetear contraseñas via Admin API
// Llamar con: POST /api/admin/reset-password { userId, password }
export async function POST(req: NextRequest) {
  const { userId, password } = await req.json().catch(() => ({}));
  if (!userId || !password) {
    return NextResponse.json({ error: "userId y password requeridos" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, { password });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Sync display password in public.users
  await supabase.from("users").update({ password }).eq("id", userId);

  return NextResponse.json({ ok: true });
}
