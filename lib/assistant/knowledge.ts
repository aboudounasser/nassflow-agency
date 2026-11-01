import { builtWith, connectedTools } from '@/lib/content/tools';
import { homepageContent } from '@/lib/content/homepage';
import { heroContent } from '@/lib/content/hero';
import { problemsContent } from '@/lib/content/problems';
import { methodContent } from '@/lib/content/method';
import { BOOKING_URL, CONTACT_EMAIL } from '@/lib/content/contact';

/**
 * Ce que l'assistant sait de NASSFLOW, dérivé du contenu du site.
 *
 * Rien n'est recopié ici : tout est lu dans `lib/content`. C'est la
 * condition pour que l'assistant ne mente pas — une carte réécrite,
 * une intégration ajoutée, et il le sait au déploiement
 * suivant, sans que personne ait à se souvenir de ce fichier.
 *
 * Le texte produit est du Markdown simple : c'est ce que les modèles
 * lisent le mieux, et ça reste lisible quand on le journalise pour
 * comprendre une réponse étrange.
 */

function listeProblemes(): string {
  return problemsContent.items
    .map(
      (item) =>
        `- ${item.title} : ${item.description}\n  ${problemsContent.agentLabel} : ${item.agent}`,
    )
    .join('\n');
}

function listeEtapes(): string {
  return methodContent.steps
    .map(
      (step, index) =>
        `${index + 1}. ${step.title} — ${step.summary} (${step.points.join(' ; ')})`,
    )
    .join('\n');
}

function listeOutils(outils: readonly { name: string; role: string }[]): string {
  return outils.map((outil) => `${outil.name} (${outil.role})`).join(', ');
}

/**
 * Assemblé à l'import du module, donc une seule fois par instance de
 * serveur : le contenu est statique, le recalculer à chaque message
 * serait payer le même travail à chaque visiteur.
 */
export const knowledge = `
# NASSFLOW AGENCY

${homepageContent.navigation.brand} — ${homepageContent.navigation.signature}.
${homepageContent.layout.description}

Le titre de l'accueil : « ${heroContent.title.lead} ${heroContent.title.voice} »

## Pour qui

${heroContent.eyebrow}. La cible : les dirigeants de PME B2B qui ont une
équipe commerciale et perdent des opportunités à cause de processus
manuels mal organisés.

## Ce qui leur coûte des ventes

« ${problemsContent.title.lead} ${problemsContent.title.voice} »

${listeProblemes()}

## Ce que fait l'agence

${heroContent.intro}

Elle ne vend pas un outil de plus : elle relie ceux qui sont en place.
L'IA intervient là où elle sert.

Premier contact : ${heroContent.ctaNote}

## Les outils qu'on relie

Les outils que NASSFLOW relie habituellement : ${listeOutils(connectedTools)}.
Sur le site : « ${methodContent.tools.note} »

Plateformes sur lesquelles on construit : ${listeOutils(builtWith)}.

Cette liste n'est pas un catalogue fermé : ce sont les outils cités sur
le site, pas les seuls qu'on sache relier. Un outil absent n'est donc
pas un refus — s'il expose une API, il se relie, et la plupart en
exposent une. Mais ça se vérifie au cas par cas, jamais d'avance.

## Comment on travaille

« ${methodContent.title.lead} ${methodContent.title.voice} »

${listeEtapes()}

Pour commencer : ${methodContent.cta.label.toLowerCase()}, via
https://www.nassflow.com${methodContent.cta.href}.

${methodContent.collaboration.title} :
${methodContent.collaboration.items.map((item) => `- ${item.title} : ${item.text}`).join('\n')}

Chaque projet part de la situation du client, pas d'un produit figé.
Le prix et le délai dépendent du diagnostic : on ne les donne jamais
d'avance.

Le site n'a que quatre pages : l'accueil, le formulaire
/demarrer-un-projet, la politique de confidentialité et les mentions
légales. Il n'existe pas de page par solution : ne renvoie jamais vers
une autre adresse du site que celles listées dans « Prendre contact ».

## Prendre contact

- Réserver un appel de 15 minutes : ${BOOKING_URL}
- Écrire : ${CONTACT_EMAIL}
- Demander un diagnostic (formulaire) : https://www.nassflow.com/demarrer-un-projet
- Voir la démonstration en direct : https://www.nassflow.com/#demonstration
`.trim();
