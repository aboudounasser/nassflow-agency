import { MIN_SCORE, type ProspectInput } from './types';

/**
 * Le score d'un prospect, de 1 à 10, et la phrase qui le justifie.
 *
 * Trois critères, chacun noté sur 3, plus 1 point de base :
 *
 * 1. Joignable : un e-mail ou un téléphone valide. Un e-mail
 *    professionnel vaut plus qu'une messagerie grand public.
 * 2. Une entreprise : un nom, et des signes qu'elle existe (forme
 *    juridique, site, domaine e-mail propre, secteur, effectif, fonction
 *    du contact).
 * 3. Un besoin d'agent IA autonome : des tâches que nos agents prennent
 *    en charge (service client, demandes entrantes, rendez-vous, devis,
 *    e-mails, ressaisie), une douleur exprimée, une taille et un secteur
 *    où l'agent paie. Une demande venue du site compte comme un besoin
 *    exprimé.
 *
 * Deux plafonds, parce qu'aucun total ne les compense :
 * - injoignable → 3 au plus : on ne peut rien en faire ;
 * - pas une entreprise → 4 au plus : nous ne vendons pas aux particuliers.
 * Les deux sont sous MIN_SCORE : ces fiches partent en « Non pertinent ».
 *
 * Le calcul est déterministe et sans réseau : la même fiche donne
 * toujours le même score, et on peut toujours dire pourquoi.
 */

export type NeedCategory =
  | 'support'
  | 'leads'
  | 'rendez-vous'
  | 'devis'
  | 'emails'
  | 'outils';

export const NEED_LABELS: Record<NeedCategory, string> = {
  support: 'service client',
  leads: 'demandes entrantes et relances',
  'rendez-vous': 'prise de rendez-vous',
  devis: 'devis et facturation',
  emails: 'tri des e-mails',
  outils: 'ressaisie entre outils',
};

export type Criterion = {
  /** Points obtenus, sur 3. */
  points: number;
  /** Ce qui a été retenu, en quelques mots. */
  detail: string;
};

export type Scoring = {
  score: number;
  relevant: boolean;
  /** Une phrase : pourquoi le profil est pertinent, ou non. */
  reason: string;
  contact: Criterion & { email: EmailCheck; phoneValid: boolean };
  company: Criterion & { isCompany: boolean; name: string | null };
  need: Criterion & { categories: NeedCategory[] };
};

/* ───────────── Normalisation ───────────── */

/** Minuscules, sans accents, espaces simples : pour chercher des mots. */
export function normalize(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Le texte réduit à des mots séparés d'une espace, avec une espace à
 * chaque bout : un mot-clé écrit « ' sav ' » ne trouve que le mot entier
 * (pas « savoir »), et « 'factur' » trouve toutes ses formes.
 */
export function words(value: string | null | undefined): string {
  return ` ${normalize(value).replace(/[^a-z0-9-]+/g, ' ').trim()} `;
}

function has(text: string, words: readonly string[]): string[] {
  return words.filter((word) => text.includes(word));
}

/* ───────────── 1. Joignable ───────────── */

export type EmailCheck = 'pro' | 'webmail' | 'invalid' | 'missing';

/** Messageries grand public : valides, mais ne disent rien de l'entreprise. */
const WEBMAIL = new Set([
  'gmail.com', 'googlemail.com', 'hotmail.com', 'hotmail.fr', 'outlook.com',
  'outlook.fr', 'live.com', 'live.fr', 'msn.com', 'yahoo.com', 'yahoo.fr',
  'icloud.com', 'me.com', 'aol.com', 'gmx.com', 'gmx.fr', 'protonmail.com',
  'proton.me', 'orange.fr', 'wanadoo.fr', 'free.fr', 'sfr.fr', 'neuf.fr',
  'laposte.net', 'bbox.fr', 'numericable.fr', 'aliceadsl.fr', 'club-internet.fr',
]);

/** Adresses jetables ou d'exemple : on ne joindra personne. */
const DISPOSABLE = new Set([
  'yopmail.com', 'yopmail.fr', 'mailinator.com', 'guerrillamail.com',
  '10minutemail.com', 'tempmail.com', 'temp-mail.org', 'trashmail.com',
  'jetable.org', 'example.com', 'example.org', 'exemple.com', 'exemple.fr',
  'test.com', 'domain.com',
]);

const PLACEHOLDER_LOCAL = /^(test|noreply|no-reply|nepasrepondre|ne-pas-repondre|xxx+|aaa+|nom|email|mail)$/;

export function checkEmail(raw: string | null): EmailCheck {
  const email = (raw ?? '').trim().toLowerCase();

  if (!email) return 'missing';

  const match = /^([a-z0-9._%+-]+)@((?:[a-z0-9-]+\.)+[a-z]{2,})$/.exec(email);

  if (!match) return 'invalid';

  const [, local, domain] = match;

  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return 'invalid';
  if (domain.split('.').some((part) => part.startsWith('-') || part.endsWith('-'))) return 'invalid';
  if (DISPOSABLE.has(domain) || PLACEHOLDER_LOCAL.test(local)) return 'invalid';

  return WEBMAIL.has(domain) ? 'webmail' : 'pro';
}

/**
 * Un numéro composable : français (fixe ou mobile, avec ou sans +33)
 * ou international au format +XX. Les numéros factices les plus courants
 * (0000000000, 0123456789…) sont refusés.
 */
export function isValidPhone(raw: string | null): boolean {
  const compact = (raw ?? '').replace(/[\s.\-()/]/g, '');

  if (!compact) return false;

  let national: string;

  if (/^0[1-9]\d{8}$/.test(compact)) national = compact.slice(1);
  else if (/^(\+33|0033)[1-9]\d{8}$/.test(compact)) national = compact.slice(-9);
  else if (/^\+[1-9]\d{7,14}$/.test(compact)) national = compact.slice(3);
  else return false;

  if (/^(\d)\1+$/.test(national)) return false;
  if ('1234567890123456789'.includes(national)) return false;
  if (national.endsWith('12345678') || national.endsWith('00000000')) return false;

  return true;
}

function scoreContact(input: ProspectInput): Scoring['contact'] {
  const email = checkEmail(input.email);
  const phoneValid = isValidPhone(input.phone);

  const emailPoints = email === 'pro' ? 2 : email === 'webmail' ? 1 : 0;
  const points = Math.min(3, emailPoints + (phoneValid ? 1 : 0));

  let detail: string;

  if (email === 'pro' && phoneValid) detail = 'joignable par e-mail pro et téléphone';
  else if (email === 'pro') detail = 'joignable par e-mail pro';
  else if (email === 'webmail' && phoneValid) detail = 'joignable par téléphone et e-mail personnel';
  else if (email === 'webmail') detail = 'joignable seulement par un e-mail personnel';
  else if (phoneValid) detail = 'joignable seulement par téléphone';
  else if (email === 'invalid' || (input.phone ?? '').trim()) detail = 'coordonnées invalides';
  else detail = 'aucun e-mail ni téléphone';

  return { points, detail, email, phoneValid };
}

/* ───────────── 2. Une entreprise ───────────── */

const LEGAL_FORMS =
  /\b(sas|sasu|sarl|eurl|sa|sci|snc|scop|selarl|selas|sca|gie|ei|eirl|gmbh|ltd|llc|inc|bv|srl|sl|sprl)\b/;

/**
 * Des tournures qui disent qu'on parle à un particulier. Ce sont des
 * phrases et non des mots : « particulier » ou « étudiant » seuls se
 * lisent aussi chez une entreprise (« nos clients particuliers », « nos
 * étudiants »). Le mot seul ne compte que dans le nom de l'entreprise.
 */
const PRIVATE_PERSON = [
  'je suis un particulier',
  'je suis particulier',
  'en tant que particulier',
  'usage personnel',
  'pour moi meme',
  'projet perso',
  'je suis etudiant',
  'candidature',
  'recherche d emploi',
];

const EMPTY_NAMES = new Set(['', '-', 'n/a', 'na', 'nc', 'n c', 'aucun', 'aucune', 'inconnu', 'perso', 'personnel', 'particulier', 'x', 'test']);

const ROLES = [
  'gerant', 'dirigeant', 'directeur', 'directrice', ' ceo ', ' coo ', ' cto ',
  ' cfo ', 'fondat', 'associe', 'president', 'responsable', 'manager',
  'head of', 'owner', 'proprietaire', ' chef ', ' dg ', ' daf ', ' drh ',
];

/** « acme-immobilier.fr » → « Acme Immobilier » : un nom à défaut de mieux. */
export function companyFromEmail(email: string | null): string | null {
  if (checkEmail(email) !== 'pro') return null;

  const domain = (email ?? '').trim().toLowerCase().split('@')[1];
  const parts = domain.split('.');
  const label = parts.length > 2 && parts[0] === 'mail' ? parts[1] : parts[0];

  return label
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function looksLikeWebsite(raw: string | null): boolean {
  return /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test((raw ?? '').trim());
}

function scoreCompany(input: ProspectInput, email: EmailCheck): Scoring['company'] {
  const rawName = (input.company ?? '').trim();
  const name = normalize(rawName);
  const context = words(`${input.company ?? ''} ${input.need ?? ''} ${input.contactRole ?? ''}`);

  const privatePerson =
    has(context, PRIVATE_PERSON).length > 0 || /\b(particulier|etudiant|etudiante)\b/.test(name);
  const inferred = EMPTY_NAMES.has(name) ? companyFromEmail(input.email) : null;
  const displayName = EMPTY_NAMES.has(name) ? inferred : rawName;

  if (privatePerson) {
    return { points: 0, detail: 'un particulier, pas une entreprise', isCompany: false, name: displayName };
  }

  if (!displayName) {
    return { points: 0, detail: 'aucune entreprise identifiée', isCompany: false, name: null };
  }

  const signals: string[] = [];

  const legalForm = LEGAL_FORMS.exec(name);
  if (legalForm) signals.push(legalForm[1].toUpperCase());
  if (looksLikeWebsite(input.website)) signals.push('site web');
  if (email === 'pro') signals.push('domaine propre');
  if ((input.sector ?? '').trim()) signals.push(input.sector!.trim().toLowerCase());
  if (input.employees !== null && input.employees >= 2) signals.push(`${input.employees} salariés`);
  if (has(words(input.contactRole), ROLES).length > 0) signals.push('décideur identifié');

  // Un nom déduit du domaine vaut un peu moins qu'un nom donné.
  const base = inferred ? 0.5 : 1;
  const points = Math.min(3, base + Math.min(2, signals.length * 0.5));

  const detail =
    signals.length === 0
      ? 'entreprise peu documentée'
      : `entreprise identifiée (${signals.slice(0, 3).join(', ')})`;

  return { points, detail, isCompany: true, name: displayName };
}

/* ───────────── 3. Un besoin d'agent IA autonome ───────────── */

/**
 * Les mots qui trahissent chaque besoin, sans accents ni majuscules.
 * Ils recouvrent aussi les `categoryLabel` du catalogue
 * (lib/content/solutions.ts), d'où viennent les demandes du site — un
 * test le vérifie.
 */
const NEED_KEYWORDS: Record<NeedCategory, string[]> = {
  support: [
    'service client', ' sav ', 'questions', ' faq ', 'whatsapp', ' chat',
    'repondre aux clients', 'support', 'reclamation', 'standard telephonique',
    'appels entrants', 'hotline',
  ],
  leads: [
    'demandes entrantes', 'leads', 'prospect', 'qualification', 'qualifier',
    'formulaire', 'relance', ' crm ', 'pipeline', 'prospection', 'commerciaux',
  ],
  'rendez-vous': [
    'rendez-vous', 'rendez vous', ' rdv', 'agenda', 'planning', 'reservation',
    'creneau', 'prise de rendez',
  ],
  devis: ['devis', 'factur', 'chiffrage', 'commande', 'bon de commande', 'tarif'],
  emails: [
    'e-mails', ' emails ', ' mails ', 'boite mail', 'boite de reception',
    'inbox', 'courriels', 'courrier',
  ],
  outils: [
    'saisie', 'ressaisie', 'excel', 'tableur', 'copier-coller', 'copier coller',
    'synchronis', 'integration', ' erp ', 'logiciel', 'reporting', 'donnees',
    'back-office', 'back office', 'outils',
  ],
};

const PAIN = [
  'perd', 'perte de temps', 'temps', 'manuel', 'a la main', 'repetitif',
  'deborde', 'submerge', 'trop de', 'chaque jour', 'tous les jours',
  'automatis', 'agent ia', 'agents ia', 'agent autonome', 'assistant virtuel',
  'chatbot', ' ia ', 'intelligence artificielle', 'chatgpt',
  'volume', 'oubli', 'retard', 'recruter', 'embaucher', 'sans reponse',
];

const NO_NEED = [
  'pas de budget', 'pas besoin', 'pas interesse', 'deja equipe',
  'deja un agent', 'deja automatise', 'juste curieux', 'aucun besoin',
  'ne souhaite pas', 'pas pour le moment',
];

/** Les secteurs où un agent autonome se rentabilise vite. */
const GOOD_SECTORS = [
  'immobili', 'e-commerce', 'ecommerce', 'commerce', 'agence', 'cabinet',
  'comptab', 'avocat', 'notaire', 'sante', 'clinique', 'medical', 'dentaire',
  'btp', 'artisan', 'renovation', 'hotel', 'restaura', 'tourisme', 'formation',
  'assurance', 'courtage', 'banque', 'logistique', 'transport', 'automobile',
  'garage', 'saas', 'logiciel', 'services', 'conseil', 'recrutement',
  'distribution', 'industrie',
];

function scoreNeed(input: ProspectInput): Scoring['need'] {
  const text = words(input.need);
  const sector = words(input.sector);

  const categories = (Object.keys(NEED_KEYWORDS) as NeedCategory[]).filter(
    (category) => has(text, NEED_KEYWORDS[category]).length > 0,
  );
  const pains = has(text, PAIN);
  const refusals = has(text, NO_NEED);
  const inbound = input.source.startsWith('site:');
  const sizeFit = input.employees !== null && input.employees >= 2 && input.employees <= 250;
  const sectorFit = has(sector + text, GOOD_SECTORS).length > 0;

  let points = 0;

  if (categories.length > 0) points += 1 + Math.min(0.5, (categories.length - 1) * 0.5);
  points += Math.min(1, pains.length * 0.5);
  if (inbound) points += 1;
  if (sizeFit) points += 0.5;
  if (sectorFit) points += 0.5;
  points -= refusals.length * 1.5;
  points = Math.max(0, Math.min(3, points));

  let detail: string;

  if (refusals.length > 0) {
    detail = 'pas de besoin ou pas de budget exprimé';
  } else if (categories.length > 0) {
    const labels = categories.slice(0, 2).map((category) => NEED_LABELS[category]);
    detail = `${inbound ? 'demande entrante' : 'besoin repéré'} : ${labels.join(', ')}`;
  } else if (inbound) {
    detail = 'demande entrante, besoin à préciser';
  } else if (sectorFit || sizeFit) {
    detail = 'besoin probable vu son profil, à confirmer';
  } else {
    detail = 'aucun besoin d’agent IA identifié';
  }

  return { points, detail, categories };
}

/* ───────────── Le score ───────────── */

export function scoreProspect(input: ProspectInput): Scoring {
  const contact = scoreContact(input);
  const company = scoreCompany(input, contact.email);
  const need = scoreNeed(input);

  let score = Math.round(1 + contact.points + company.points + need.points);

  if (contact.points === 0) score = Math.min(score, 3);
  if (!company.isCompany) score = Math.min(score, 4);
  score = Math.max(1, Math.min(10, score));

  const relevant = score >= MIN_SCORE;

  return { score, relevant, reason: buildReason(relevant, contact, company, need), contact, company, need };
}

/**
 * Une phrase. Pertinent : les trois critères, du plus parlant au moins
 * parlant. Non pertinent : ce qui bloque d'abord, puisque c'est ce
 * qu'il faudrait changer pour réintégrer la fiche.
 */
function buildReason(
  relevant: boolean,
  contact: Criterion,
  company: Criterion & { isCompany: boolean },
  need: Criterion,
): string {
  const parts = [
    { ...company, weak: !company.isCompany || company.points < 1.5 },
    { ...need, weak: need.points < 1 },
    { ...contact, weak: contact.points === 0 },
  ];

  if (relevant) {
    return capitalize(`${parts.map((part) => part.detail).join(', ')}.`);
  }

  const blocking = parts.filter((part) => part.weak).map((part) => part.detail);
  const rest = parts.filter((part) => !part.weak).map((part) => part.detail);
  const sentence = rest.length > 0 ? `${blocking.join(', ')} — malgré : ${rest.join(', ')}` : blocking.join(', ');

  return capitalize(`${sentence || 'profil trop incomplet pour être qualifié'}.`);
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
