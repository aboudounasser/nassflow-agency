import { SectionShell } from '@/components/SectionShell';
import { Button } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { homepageContent } from '@/lib/content/homepage';

/**
 * Le Hero de la direction éditoriale : papier, encre, un seul accent.
 *
 * Ce qui a disparu, et pourquoi : la maquette « LIVE SYSTEM » montrait un
 * produit qui n'existe pas — des barres grises tenant lieu de contenu. La
 * pastille « ● VOS OUTILS, RELIÉS » redisait le titre en plus petit. Le
 * titre porte seul, sur toute la largeur.
 *
 * Les quatre mentions ne sont plus des pastilles flottantes mais un
 * bandeau de pied : quatre colonnes séparées au filet, un filet pleine
 * largeur au-dessus. En mobile elles s'empilent, séparées de la même
 * façon. Aucun arrondi, aucun halo, aucune ombre — voir l'en-tête de
 * `app/globals.css`.
 */

const MENTIONS = [
  'Plus de demandes',
  'Réponses immédiates',
  'Zéro double saisie',
  'Un seul tableau de bord',
];

export function Hero() {
  return (
    <div className="bg-paper text-ink">
      <SectionShell className="pt-14 pb-0 sm:pt-20 lg:pt-24">
        <div>
          <div>
            {/* La seconde phrase bascule dans la voix, en vermillon. */}
            <SectionTitle
              as="h1"
              size="display"
              voiceTone="accent"
              lead={homepageContent.hero.lead}
              voice={homepageContent.hero.accent}
            />
          </div>

          <div>
            <p className="mt-8 max-w-[58ch] text-body text-ink-body sm:text-lead">
              Nous relions vos logiciels entre eux et automatisons ce qui vous
              fait perdre du temps. L’IA intervient là où elle sert vraiment.
            </p>
          </div>

          <div>
            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
              {/* Aplat vermillon, angles vifs : pas de `rounded-*`, pas
                  d'ombre. Le seul mouvement est un assombrissement. */}
              <Button href="/demarrer-un-projet" className="w-full sm:w-auto">
                Démarrer un projet
              </Button>

              {/* Le secondaire n'est plus un bouton : un lien souligné
                  d'un filet 1px, qui passe à l'encre au survol. */}
              <Button href="#solutions" variant="secondary">
                Découvrir les solutions
              </Button>
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ─────────────────────────────
          BANDEAU DES MENTIONS
          Filet pleine largeur au-dessus, puis quatre colonnes séparées
          par un filet vertical. En mobile, la pile reprend le même filet
          à l'horizontale, d'où le `border-t` sur chaque cellule sauf la
          première et le passage en `sm:border-l`.
      ───────────────────────────── */}
      <div className="mt-16 border-t border-rule sm:mt-20">
        <div className="mx-auto max-w-site">
          <ul className="grid grid-cols-1 sm:grid-cols-4">
            {MENTIONS.map((mention, index) => (
              <li
                key={mention}
                className={[
                  'px-4 py-5 font-sans text-label uppercase tracking-tag text-ink-muted sm:px-6 sm:py-6',
                  index === 0 ? '' : 'border-t border-rule sm:border-t-0',
                  index === 0 ? 'sm:border-l-0' : 'sm:border-l sm:border-rule',
                ].join(' ')}
              >
                {mention}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
