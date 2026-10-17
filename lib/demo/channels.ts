/**
 * Les canaux par lesquels une demande arrive dans la démonstration.
 *
 * Liste fermée, partagée par l'interface (lib/content/demo.ts) et la
 * route (lib/demo/analysis.ts), qui refuse toute autre valeur. Ce
 * fichier reste minuscule à dessein : le navigateur l'importe, il ne
 * doit pas embarquer les consignes de l'agent avec lui.
 */

export const DEMO_CHANNELS = ['whatsapp', 'email', 'formulaire'] as const;

export type DemoChannel = (typeof DEMO_CHANNELS)[number];

export const DEFAULT_CHANNEL: DemoChannel = 'formulaire';

/** Le nom affiché, et celui que lit l'agent. */
export const channelLabels: Record<DemoChannel, string> = {
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  formulaire: 'Formulaire du site',
};

export function isDemoChannel(value: unknown): value is DemoChannel {
  return DEMO_CHANNELS.includes(value as DemoChannel);
}
