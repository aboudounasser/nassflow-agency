import { esc, oneLine } from '@/lib/notifications';
import type { DiagnosticRequest } from '@/lib/diagnostic/validate';

/**
 * Ce que la route écrit dans `project_requests` et ce qu'elle envoie par
 * e-mail, à partir d'une demande déjà validée.
 *
 * Les nouvelles colonnes (supabase/diagnostic.sql) portent la demande ;
 * les anciennes colonnes utiles sont remplies aussi (`main_need`,
 * `current_tools`, `project_description`) : une vue ou un export qui les
 * lit continue de fonctionner, et `project_description` n'est jamais
 * vide, au cas où la colonne serait NOT NULL.
 */
export function buildRow(
  request: DiagnosticRequest,
  submissionId: string,
  now: Date,
) {
  return {
    submission_id: submissionId,
    source: 'diagnostic',
    consent_at: now.toISOString(),

    company: request.company,
    sector: request.sector,
    company_size: request.companySize,
    problem: request.problem,
    problem_details: request.problemDetails,
    tools: request.tools.length > 0 ? request.tools : null,
    monthly_volume: request.monthlyVolume,
    expected_outcome: request.expectedOutcome,

    first_name: request.firstName,
    last_name: request.lastName,
    professional_email: request.email,
    phone: request.phone,

    main_need: request.problem,
    current_tools: request.tools.length > 0 ? request.tools.join(', ') : null,
    project_description: request.problemDetails ?? request.problem,
  };
}

/** Tous les champs, chacun échappé : un visiteur ne place aucune balise. */
export function buildEmail(request: DiagnosticRequest, now: Date) {
  const line = (label: string, value: unknown) =>
    `<p><strong>${label} :</strong> ${esc(value)}</p>`;

  const html = `
        <h2>Nouvelle demande de diagnostic</h2>

        <h3>Entreprise</h3>
        ${line('Entreprise', request.company)}
        ${line('Secteur', request.sector)}
        ${line('Taille', request.companySize)}

        <h3>Problème</h3>
        ${line('Problème principal', request.problem)}
        ${line('Précisions', request.problemDetails)}

        <h3>Outils et volume</h3>
        ${line('Outils', request.tools.join(', '))}
        ${line('Demandes par mois', request.monthlyVolume)}
        ${line('Priorité', request.expectedOutcome)}

        <h3>Contact</h3>
        ${line('Prénom', request.firstName)}
        ${line('Nom', request.lastName)}
        ${line('E-mail', request.email)}
        ${line('Téléphone', request.phone)}
        ${line('Consentement donné le', now.toISOString())}
      `;

  return {
    subject: `Nouvelle demande de diagnostic — ${oneLine(request.company, 'Entreprise')}`,
    html,
    replyTo: request.email,
  };
}
