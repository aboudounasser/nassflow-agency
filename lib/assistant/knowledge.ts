import { solutions } from '@/lib/content/solutions';
import { builtWith, connectedTools } from '@/lib/content/tools';
import { homepageContent } from '@/lib/content/homepage';
import { BOOKING_URL, CONTACT_EMAIL } from '@/lib/content/contact';

/**
 * Ce que l'assistant sait de NASSFLOW, dérivé du contenu du site.
 *
 * Rien n'est recopié ici : tout est lu dans `lib/content`. C'est la
 * condition pour que l'assistant ne mente pas — une fiche solution
 * réécrite, une intégration ajoutée, et il le sait au déploiement
 * suivant, sans que personne ait à se souvenir de ce fichier.
 *
 * Le texte produit est du Markdown simple : c'est ce que les modèles
 * lisent le mieux, et ça reste lisible quand on le journalise pour
 * comprendre une réponse étrange.
 */

function listeSolutions(): string {
  return solutions
    .map((solution) => {
      const questions = solution.questions
        .map((question) => question.label)
        .join(' / ');

      return [
        `### ${solution.title}`,
        `- Catégorie : ${solution.categoryLabel}`,
        `- Page : https://www.nassflow.com/solutions/${solution.slug}`,
        `- La situation du client : « ${solution.problem} »`,
        `- Ce qu'on installe : ${solution.delivers}`,
        `- Ce que ça comprend : ${solution.includes.join(' ; ')}`,
        `- Ce qu'on demande avant de chiffrer : ${questions}`,
      ].join('\n');
    })
    .join('\n\n');
}

function listeOutils(outils: { name: string; role: string }[]): string {
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

Le titre de l'accueil : « ${homepageContent.hero.lead} ${homepageContent.hero.accent} »

## Ce que fait l'agence

Elle relie entre eux les logiciels que l'entreprise utilise déjà, et
automatise les tâches répétitives. Elle ne vend pas un outil de plus :
elle branche ceux qui sont en place. L'IA intervient là où elle sert.

## Les six solutions

${listeSolutions()}

## Les outils qu'on relie

Connecteurs déjà en place : ${listeOutils(connectedTools)}.

Plateformes sur lesquelles on construit : ${listeOutils(builtWith)}.

Un outil absent de cette liste n'est pas un refus : s'il expose une API,
il se branche — et la plupart en exposent une. Mais il faut le vérifier
au cas par cas, jamais l'affirmer d'avance.

## Comment on travaille

Chaque solution est un point de départ qu'on adapte, pas un produit
figé. Avant de chiffrer quoi que ce soit, on pose les questions
listées plus haut pour la solution concernée : le prix et le délai
dépendent des réponses.

## Prendre contact

- Réserver un appel de 30 minutes : ${BOOKING_URL}
- Écrire : ${CONTACT_EMAIL}
- Formulaire détaillé : https://www.nassflow.com/demarrer-un-projet
- Chaque fiche solution a son propre formulaire, plus court.
`.trim();
