import { Resend } from "resend";

interface WelcomeEmailParams {
  to: string;
  nombre: string;
  alias: string;
  password: string;
  appUrl: string;
}

export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY no configurada — email no enviado");
    return { ok: false, error: "RESEND_API_KEY no configurada" };
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "quiniela@mundial2026.app";

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "¡Bienvenido a la Quiniela Mundial 2026!",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1d4ed8;">Quiniela Mundial 2026 ⚽</h2>
        <p>Hola <strong>${params.nombre}</strong>, ya tienes acceso a la quiniela.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Alias:</td>
            <td style="padding: 8px;">${params.alias}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">Contraseña:</td>
            <td style="padding: 8px; font-family: monospace; font-size: 16px;">${params.password}</td>
          </tr>
        </table>
        <a href="${params.appUrl}" style="display: inline-block; background: #1d4ed8; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 8px;">
          Entrar a la Quiniela
        </a>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">
          Puedes cambiar tu contraseña desde tu perfil una vez que entres.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
