import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { userId, password } = await req.json().catch(() => ({}));
  if (!userId || !password) {
    return NextResponse.json({ error: "userId y password requeridos" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Get current user data from public.users
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("email, nombre, alias, role, paid")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Usuario no encontrado en public.users" }, { status: 404 });
  }

  // Delete existing auth user
  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
  if (deleteError) {
    console.error("deleteUser error:", deleteError.message);
    // Continue anyway — might already be deleted
  }

  // Recreate auth user with same email, new password, confirmed
  const { data: newAuth, error: createError } = await supabase.auth.admin.createUser({
    email: profile.email,
    password,
    email_confirm: true,
  });

  if (createError || !newAuth?.user) {
    return NextResponse.json({ error: createError?.message || "Error creando auth user" }, { status: 500 });
  }

  const newId = newAuth.user.id;

  // Update public.users with new UUID and password
  await supabase.from("users").delete().eq("id", userId);
  const { error: insertError } = await supabase.from("users").insert({
    id: newId,
    nombre: profile.nombre,
    alias: profile.alias,
    email: profile.email,
    role: profile.role,
    paid: profile.paid,
    password,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message, newId }, { status: 500 });
  }

  return NextResponse.json({ ok: true, newId });
}
