import {
  esc,
  oneLine,
  sendAgencyNotification,
} from '@/lib/notifications';

/**
 * Notification d'une demande déposée depuis /demarrer-un-projet.
 *
 * La route reste appelée depuis le navigateur, après que ProjectForm a
 * écrit dans `project_requests` : c'est le seul formulaire du site qui
 * insère lui-même, et la notification suit le même chemin. Les fiches
 * solution, elles, notifient depuis leur propre route serveur.
 *
 * La branche « contact » est partie avec le formulaire qu'elle servait :
 * `ContactForm` n'existe plus, et plus rien n'appelait le type 'contact'.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data } = body ?? {};

    if (!data) {
      return Response.json({ error: 'Données manquantes.' }, { status: 400 });
    }

    const html = `
        <h2>Nouvelle demande de projet NASSFLOW</h2>

        <h3>👤 Contact</h3>
        <p><strong>Prénom :</strong> ${esc(data.first_name)}</p>
        <p><strong>Nom :</strong> ${esc(data.last_name)}</p>
        <p><strong>Entreprise :</strong> ${esc(data.company)}</p>
        <p><strong>Email :</strong> ${esc(data.professional_email)}</p>
        <p><strong>Téléphone :</strong> ${esc(data.phone)}</p>
        <p><strong>Site web :</strong> ${esc(data.website)}</p>

        <h3>⚙️ Projet</h3>
        <p><strong>Solution :</strong> ${esc(data.solution)}</p>
        <p><strong>Besoin principal :</strong> ${esc(data.main_need)}</p>
        <p><strong>Outils actuels :</strong> ${esc(data.current_tools)}</p>
        <p><strong>Budget :</strong> ${esc(data.budget)}</p>
        <p><strong>Délai souhaité :</strong> ${esc(data.timeline)}</p>

        <h3>📝 Demande</h3>
        <p><strong>Description :</strong></p>
        <p>${esc(data.project_description)}</p>

        <p><strong>Comment a-t-il connu NASSFLOW :</strong> ${esc(data.source)}</p>
      `;

    const result = await sendAgencyNotification({
      subject: `🚀 Nouvelle demande de projet — ${oneLine(data.company, 'Entreprise')}`,
      html,
      replyTo: data.professional_email,
    });

    if (!result.ok) {
      console.error('Notification projet non envoyée :', result.message);

      return Response.json(
        {
          error:
            result.reason === 'missing-key'
              ? "Service d'envoi indisponible."
              : "Impossible d'envoyer l'e-mail.",
        },
        { status: result.reason === 'missing-key' ? 503 : 500 },
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Erreur API notification :', error);

    return Response.json(
      { error: 'Une erreur est survenue.' },
      { status: 500 },
    );
  }
}
