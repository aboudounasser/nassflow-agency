import Link from 'next/link';
import { SectionShell } from '@/components/SectionShell';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
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
    <div className="bg-[var(--paper)] text-[var(--ink)]">
      <SectionShell className="pt-14 pb-0 sm:pt-20 lg:pt-24">
        <Stagger onMount gap={0.085}>
          <StaggerItem preset="soft">
            {/* 88px desktop / 39px mobile · lh 0.95 · tracking -0.038em · 800.
                La seconde phrase bascule dans la voix : Instrument Serif
                italique vermillon, à 1.07em — le serif porte plus petit à
                taille égale, l'écart le remet à la ligne du reste. */}
            <h1 className="font-[family-name:var(--font-archivo)] text-[clamp(2.4375rem,8.2vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.038em] text-[var(--ink)]">
              {homepageContent.hero.lead}
              <span className="mt-1 block font-[family-name:var(--font-serif)] text-[1.07em] font-normal italic tracking-[-0.02em] text-[var(--accent)]">
                {homepageContent.hero.accent}
              </span>
            </h1>
          </StaggerItem>

          <StaggerItem preset="soft">
            <p className="mt-8 max-w-[58ch] text-[1.125rem] leading-[1.6] text-[var(--ink-body)] sm:text-[1.25rem] sm:leading-[1.55]">
              Nous relions vos logiciels entre eux et automatisons ce qui vous
              fait perdre du temps. L’IA intervient là où elle sert vraiment.
            </p>
          </StaggerItem>

          <StaggerItem preset="soft">
            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
              {/* Aplat vermillon, angles vifs : pas de `rounded-*`, pas
                  d'ombre. Le seul mouvement est un assombrissement. */}
              <Link
                href="/demarrer-un-projet"
                className="inline-flex min-h-12 w-full items-center justify-center bg-[var(--accent)] px-7 font-[family-name:var(--font-archivo)] text-[0.9375rem] font-semibold text-[var(--on-accent)] transition-colors duration-200 ease-out hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] sm:w-auto"
              >
                Démarrer un projet
              </Link>

              {/* Le secondaire n'est plus un bouton : un lien souligné
                  d'un filet 1px, qui passe à l'encre au survol. */}
              <a
                href="#solutions"
                className="inline-flex items-center border-b border-[var(--ink)] pb-1 font-[family-name:var(--font-archivo)] text-[0.9375rem] font-semibold text-[var(--ink-body)] transition-colors duration-200 ease-out hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
              >
                Découvrir les solutions
              </a>
            </div>
          </StaggerItem>
        </Stagger>
      </SectionShell>

      {/* ─────────────────────────────
          BANDEAU DES MENTIONS
          Filet pleine largeur au-dessus, puis quatre colonnes séparées
          par un filet vertical. En mobile, la pile reprend le même filet
          à l'horizontale, d'où le `border-t` sur chaque cellule sauf la
          première et le passage en `sm:border-l`.
      ───────────────────────────── */}
      <div className="mt-16 border-t border-[var(--rule)] sm:mt-20">
        <div className="mx-auto max-w-[1280px]">
          <ul className="grid grid-cols-1 sm:grid-cols-4">
            {MENTIONS.map((mention, index) => (
              <li
                key={mention}
                className={[
                  'px-4 py-5 font-[family-name:var(--font-archivo)] text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)] sm:px-6 sm:py-6',
                  index === 0 ? '' : 'border-t border-[var(--rule)] sm:border-t-0',
                  index === 0 ? 'sm:border-l-0' : 'sm:border-l sm:border-[var(--rule)]',
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
