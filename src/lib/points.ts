export function calcularPuntos(
  predHome: number,
  predAway: number,
  realHome: number,
  realAway: number
): number {
  // Resultado exacto
  if (predHome === realHome && predAway === realAway) return 3;

  const predSign = Math.sign(predHome - predAway);
  const realSign = Math.sign(realHome - realAway);

  if (predSign !== realSign) return 0;

  // Signo correcto + diferencia exacta
  if (predHome - predAway === realHome - realAway) return 2;

  // Solo signo correcto
  return 1;
}

export function calcularPuntosBonus(
  userBonus: Record<string, string | null>,
  bonusResults: Record<string, string | null>
): number {
  const campos = ["campeon", "subcampeon", "goleador", "mvp", "portero"] as const;
  return campos.reduce((acc, campo) => {
    const user = userBonus[campo]?.trim().toLowerCase();
    const real = bonusResults[campo]?.trim().toLowerCase();
    if (user && real && user === real) return acc + 5;
    return acc;
  }, 0);
}
