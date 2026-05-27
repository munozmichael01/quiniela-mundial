import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  alias: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Alias y contraseña requeridos" }, { status: 400 });
  }

  const { alias, password } = parsed.data;
  const supabase = await createClient();

  // Lookup email by alias
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("email")
    .eq("alias", alias)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Alias o contraseña incorrectos" }, { status: 401 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: "Alias o contraseña incorrectos" }, { status: 401 });
  }

  return NextResponse.json({ user: data.user, session: data.session });
}
