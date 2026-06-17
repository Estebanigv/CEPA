/* CEPA · helpers de formato (es-CL) */

/** Formatea un monto en pesos chilenos: 50000 -> "$50.000" */
export function clp(n: number | null | undefined): string {
  return '$' + (n ?? 0).toLocaleString('es-CL');
}

/** Versión compacta para ejes/etiquetas: 6200000 -> "$6.2M", 680000 -> "$680K" */
export function clpK(n: number): string {
  return n >= 1_000_000
    ? '$' + (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
    : '$' + Math.round(n / 1000) + 'K';
}

/** Iniciales a partir de un nombre: "María José Pérez" -> "MJ" */
export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}
