/* CEPA · datos institucionales reales (fuente única de verdad).
 * Tomados del sitio oficial: https://www.cepaciamaria.cl
 */

export const INSTITUTION = {
  name: 'CEPA',
  fullName: 'Centro de Padres y Apoderados',
  colegio: 'Colegio Compañía de María Apoquindo',
  rut: '70.698.300-7',
  email: 'cepa@cepaciamaria.cl',
  phone: '+56 22 211 6166',
  address: 'Manquehue Sur 116, Las Condes',
  web: 'www.cepaciamaria.cl',
  instagram: '@cepacma',
  lema: 'Juntos Somos Comunidad',
  bank: {
    name: 'Banco Santander',
    accountType: 'Cuenta Corriente',
    accountNumber: '03-99008-7',
    holder: 'CEPA Colegio Compañía de María',
  },
} as const;

/** Dominio real para los correos del equipo (reemplaza el placeholder @cepa.cl). */
export const CEPA_EMAIL_DOMAIN = 'cepaciamaria.cl';

/** Plantilla de recordatorio por defecto (con datos reales de pago y contacto). */
export const DEFAULT_REMINDER_EMAIL = {
  subject: 'Recordatorio de pago — Cuota CEPA 2026',
  body: [
    'Estimada familia {familia}:',
    '',
    'Te recordamos que tienes pendiente el pago de {concepto} por {monto}. Puedes pagarlo en línea con Web Pay (hasta 3 cuotas) desde la plataforma, por transferencia a la cuenta del CEPA, o directamente en la oficina.',
    '',
    `Transferencias: ${INSTITUTION.bank.name} · ${INSTITUTION.bank.accountType} ${INSTITUTION.bank.accountNumber} · RUT ${INSTITUTION.rut} · ${INSTITUTION.email}`,
    '',
    'Gracias,',
    `${INSTITUTION.name} · ${INSTITUTION.fullName}`,
    INSTITUTION.colegio,
    `${INSTITUTION.email} · ${INSTITUTION.phone}`,
    `"${INSTITUTION.lema}"`,
  ].join('\n'),
};
