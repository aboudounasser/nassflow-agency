type NotificationType = 'contact' | 'project';

/**
 * Prévient l'agence qu'un formulaire vient d'être soumis.
 *
 * Ne lève jamais : à ce stade la demande est déjà enregistrée en base,
 * un échec d'e-mail ne doit donc pas se traduire par un message d'erreur
 * côté visiteur. Il est journalisé pour être repris côté serveur.
 */
export async function sendNotification(
  type: NotificationType,
  data: Record<string, unknown>,
): Promise<boolean> {
  try {
    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) {
      console.error(
        'Notification e-mail non envoyée:',
        await response.text(),
      );

      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la notification e-mail:', error);

    return false;
  }
}
