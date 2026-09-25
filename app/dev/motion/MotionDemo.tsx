'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { SectionShell } from '@/components/SectionShell';
import { Signal } from '@/components/motion/Signal';
import { Status, type StatusState } from '@/components/motion/Status';
import { Trace } from '@/components/motion/Trace';
import { Typewriter } from '@/components/motion/Typewriter';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { useMotionEnabled } from '@/lib/in-view';

/**
 * La démonstration des primitives. L'interrupteur simule « réduire les
 * animations » en retirant `data-motion` de <html>, exactement ce que
 * fait lib/motion-boot.ts quand le système le demande : chaque primitive
 * doit alors montrer son état final, immédiatement.
 *
 * « Rejouer » remonte les démonstrations : les filets redeviennent de
 * nouveaux éléments, que l'observateur partagé reprend à zéro.
 */

const requestStates: StatusState[] = [
  { label: 'Demande reçue', tone: 'idle' },
  { label: 'Lecture en cours', tone: 'active' },
  { label: 'Devis prêt', tone: 'done' },
];

function Demo({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-rule py-8">
      <p className="font-heading text-body font-bold text-ink">{title}</p>
      <p className="mt-1 max-w-[62ch] text-small text-ink-muted">{note}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Primitive({
  name,
  lead,
  children,
}: {
  name: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-16">
      <Eyebrow>{name}</Eyebrow>
      <p className="mt-3 max-w-[62ch] text-body text-ink-body">{lead}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function MotionDemo() {
  const enabled = useMotionEnabled();
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);

  // L'interrupteur reflète l'attribut réel (celui du système au départ)
  // et ne le modifie qu'au clic. La valeur d'origine est rendue en
  // quittant la page.
  const original = useRef<string | null | undefined>(undefined);

  function simulateReduced(reduce: boolean) {
    const html = document.documentElement;

    if (original.current === undefined) {
      original.current = html.getAttribute('data-motion');
    }

    if (reduce) html.removeAttribute('data-motion');
    else html.setAttribute('data-motion', 'on');
  }

  useEffect(
    () => () => {
      const html = document.documentElement;
      const value = original.current;

      if (value === undefined) return;
      if (value) html.setAttribute('data-motion', value);
      else html.removeAttribute('data-motion');
    },
    [],
  );

  return (
    <main id="contenu" className="flex-1">
      <SectionShell className="pt-14 pb-24 sm:pt-16 lg:pt-20">
        <Eyebrow as="p" tone="muted">
          Interne · /dev/motion
        </Eyebrow>

        <h1 className="mt-5 font-heading text-title text-ink">
          Primitives de mouvement
        </h1>

        <p className="mt-6 max-w-[62ch] text-body text-ink-body">
          Le vermillon en mouvement signifie toujours « la machine
          travaille ». Chaque primitive s&apos;arrête hors du viewport et
          quand l&apos;onglet passe en arrière-plan.
        </p>

        <div className="sticky top-(--header-h) z-10 mt-10 flex flex-wrap items-center gap-6 border-y border-rule bg-paper py-4 lg:top-(--header-h-lg)">
          <label className="flex cursor-pointer items-center gap-3 font-sans text-small text-ink">
            <input
              type="checkbox"
              checked={!enabled}
              onChange={(event) => simulateReduced(event.target.checked)}
              className="size-4 accent-accent"
            />
            Simuler « réduire les animations »
          </label>

          <Button
            variant="secondary"
            onClick={() => {
              setRun((value) => value + 1);
              setStep(0);
            }}
          >
            Rejouer
          </Button>
        </div>

        <div key={run}>
          <Primitive
            name="Trace"
            lead="Un filet de 1 px qui se trace de gauche à droite à son entrée dans le viewport (900 ms). Il remplace une bordure, au même pixel."
          >
            <Demo title="Filet par défaut" note="Couleur rule.">
              <Trace />
            </Demo>
            <Demo
              title="Filet vermillon"
              note="tone=&quot;accent&quot; : la machine a travaillé."
            >
              <Trace tone="accent" />
            </Demo>
            <Demo
              title="En cascade"
              note="order = 1 à 4 : chaque filet part 60 ms après le précédent."
            >
              <div className="space-y-6">
                {[1, 2, 3, 4].map((order) => (
                  <Trace key={order} order={order} />
                ))}
              </div>
            </Demo>
          </Primitive>

          <Primitive
            name="Signal"
            lead="Un carré vermillon de 6 px qui parcourt un chemin, à vitesse constante : une donnée qui passe d'un outil à l'autre. Masqué aux lecteurs d'écran ; le texte voisin porte le sens."
          >
            <Demo
              title="Un seul passage"
              note="S'arrête à l'arrivée. Avec « réduire les animations », il y est d'emblée."
            >
              <div className="flex items-center gap-4 font-mono text-label uppercase text-ink-muted">
                <span>Formulaire</span>
                <Signal path="M0 3H240" width={240} height={6} />
                <span>CRM</span>
              </div>
            </Demo>
            <Demo
              title="En boucle, avec pause"
              note="loop, pause 1 120 ms. Chemin coudé : e-mail → lecture → devis."
            >
              <Signal
                path="M3 3H120V60H300V117H420"
                width={423}
                height={120}
                loop
              />
            </Demo>
            <Demo title="Sans chemin tracé" note="showPath={false} : le carré seul.">
              <Signal
                path="M3 20C80 -10 160 50 240 20S400 -10 420 20"
                width={423}
                height={40}
                loop
                showPath={false}
              />
            </Demo>
          </Primitive>

          <Primitive
            name="Typewriter"
            lead="Un texte mono écrit caractère par caractère, derrière un curseur carré. Le texte complet est dans le DOM dès le départ : l'animation n'est que visuelle."
          >
            <Demo title="Vitesse par défaut" note="45 ms par caractère.">
              <Typewriter
                as="p"
                text="Nouvelle demande : rénovation salle de bain, 12 m², Poitiers."
                className="text-small text-ink"
              />
            </Demo>
            <Demo title="Rapide" note="speed = 20 ms.">
              <Typewriter
                as="p"
                speed={20}
                text="Devis pré-rempli avec vos tarifs 2026. En attente de votre validation."
                className="text-small text-ink"
              />
            </Demo>
            <Demo
              title="Curseur conservé"
              note="keepCursor : le curseur clignote une fois le texte écrit."
            >
              <Typewriter
                as="p"
                speed={70}
                keepCursor
                text="Réponse envoyée."
                className="text-small text-ink"
              />
            </Demo>
          </Primitive>

          <Primitive
            name="Status"
            lead="Une étiquette mono et un indicateur carré qui passent par des états nommés. Seul « en cours » pulse, en vermillon."
          >
            <Demo
              title="Autonome, une fois"
              note="autoplay : en attente → en cours → fait, puis s'arrête."
            >
              <Status autoplay />
            </Demo>
            <Demo title="Autonome, en boucle" note="autoplay loop, états propres.">
              <Status autoplay loop states={requestStates} />
            </Demo>
            <Demo
              title="Piloté, annoncé"
              note="value, live : chaque changement est annoncé aux lecteurs d'écran."
            >
              <div className="flex flex-wrap items-center gap-6">
                <Status value={step} live states={requestStates} />
                <Button
                  variant="secondary"
                  onClick={() => setStep((value) => (value + 1) % 3)}
                >
                  État suivant
                </Button>
              </div>
            </Demo>
          </Primitive>
        </div>
      </SectionShell>
    </main>
  );
}
