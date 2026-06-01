import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { generatePassword } from "@/lib/auth";
import { z } from "zod";

const createUserSchema = z.object({
  nombre: z.string().min(1).max(100),
  alias: z.string().min(2).max(30).regex(/^[a-zA-Z0-9_.]+$/, "Solo letras, números, punto y guión bajo"),
  email: z.string().email(),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createServiceClient();
  const { data, error: dbError } = await supabase
    .from("users")
    .select("id, nombre, alias, role, email, paid, created_at")
    .order("created_at", { ascending: true });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ users: data });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { nombre, alias, email } = parsed.data;
  const supabase = createServiceClient();

  // Check alias uniqueness
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("alias", alias)
    .single();

  if (existing) {
    return NextResponse.json({ error: "El alias ya está en uso" }, { status: 409 });
  }

  const password = generatePassword();

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  // Create profile
  const { error: profileError } = await supabase.from("users").insert({
    id: authData.user.id,
    nombre,
    alias,
    email,
    role: "user",
  });

  if (profileError) {
    // Rollback auth user
    await supabase.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, userId: authData.user.id, password }, { status: 201 });
}
