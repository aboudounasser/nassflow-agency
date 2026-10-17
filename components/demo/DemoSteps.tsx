'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Signal } from '@/components/motion/Signal';
import { Status, StatusView, type StatusState } from '@/components/motion/Status';
import { Rise } from '@/components/motion/Rise';
import { demoContent } from '@/lib/content/demo';
import type { DemoAnalysis } from '@/lib/demo/analysis';
import { channelLabels, type DemoChannel } from '@/lib/demo/channels';
import { motionTokens } from '@/lib/motion';

/**
 * Les quatre étapes de la démonstration — Réception → Analyse → Actions
 * → Résultat — dans le dessin du flux du Hero (components/hero/HeroFlow.tsx) :
 * un carré par étape, un filet entre deux, et un Signal vermillon qui
 * descend le filet quand l'étape suivante s'allume.
 *
 * Purement d'affichage : DemoConsole décide de l'étape en cours (`stage`)
 * et du nombre d'actions déjà montrées. Au repos, chaque étape dit ce
 * qu'elle montrera. Tout le texte de la fiche est rendu en texte brut.
 *
 * Sur WhatsApp, le message reçu et la réponse immédiate s'affichent en
 * bulles sobres, dans nos couleurs — aucune imitation de l'application.
 *
 * Aucune colonne ne doit déborder (WCAG 1.4.10, zoom à 200 %) : les
 * pistes de grille sont en `minmax(0, 1fr)` et le texte venu du visiteur
 * ou du modèle passe à la ligne n'importe où (`wrap-anywhere`) — une
 * adresse ou une référence sans espace ne pousse plus la colonne.
 */

const { steps, fields, draftLabel, draftNote, instantLabel, receivedVia } = demoContent;

/** Une bulle de conversation, sans imitation d'aucune application. */
const bubble =
  'max-w-[34rem] rounded-card border px-4 py-3 text-small wrap-anywhere whitespace-pre-line';

type Marker = 'pending' | 'working' | 'done';

const markers: Record<Marker, string> = {
  pending: 'border border-ink-muted',
  working: 'bg-accent',
  done: 'bg-ink',
};

const workingState: StatusState = { label: 'En cours', tone: 'active' };

function Step({
  index,
  label,
  marker,
  signal,
  motion,
  last = false,
  children,
}: {
  index: number;
  label: string;
  marker: Marker;
  /** Un Signal descend vers l'étape suivante (clé de remontage). */
  signal: string | null;
  motion: boolean;
  last?: boolean;
  children: ReactNode;
}) {
  const connector = useRef<HTMLSpanElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = connector.current;

    if (!el || !motion) return;

    const observer = new ResizeObserver(([entry]) =>
      setHeight(Math.round(entry.contentRect.height)),
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [motion]);

  return (
    <li
      className={['relative grid grid-cols-[1.5rem_minmax(0,1fr)]', last ? '' : 'pb-8'].join(' ')}
    >
      <span aria-hidden="true" className="relative">
        <span
          data-status={marker === 'working' ? 'active' : undefined}
          data-playing={marker === 'working' ? '' : undefined}
          className="absolute top-[0.3rem] left-0"
        >
          <span
            data-status-dot
            className={['block size-1.5 transition-colors', markers[marker]].join(' ')}
          />
        </span>

        {!last && (
          <span
            ref={connector}
            className="absolute top-[1.1rem] bottom-0 left-[2.5px] w-px bg-rule"
          >
            {signal && motion && height > 0 && (
              <Signal
                key={signal}
                path={`M3 0V${height}`}
                width={6}
                height={height}
                duration={motionTokens.duration.slow}
                showPath={false}
                className="absolute top-0 -left-[2.5px]"
              />
            )}
          </span>
        )}
      </span>

      <div className="min-w-0">
        <p className="font-mono text-label font-normal uppercase text-ink">
          <span className="text-ink-muted">{String(index).padStart(2, '0')}</span>{' '}
          {label}
        </p>
        <div className="mt-3">{children}</div>
      </div>
    </li>
  );
}

function Idle({ children }: { children: ReactNode }) {
  return <p className="text-small text-ink-muted">{children}</p>;
}

function Working({ children }: { children: ReactNode }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-small text-ink-body">
      <Status states={[workingState]} value={0} />
      {children}
    </p>
  );
}

export function DemoSteps({
  stage,
  submitted,
  analysis,
  actionsShown,
  run,
  motion,
}: {
  /** L'étape en cours : 0 à 3 ; 4 quand tout est fait ; -1 au repos. */
  stage: number;
  /** Le texte envoyé et son canal, ou `null` au repos. */
  submitted: { text: string; channel: DemoChannel } | null;
  analysis: DemoAnalysis | null;
  /** Combien d'actions sont déjà apparues. */
  actionsShown: number;
  /** Identifiant du passage en cours, pour remonter les Signal. */
  run: number;
  motion: boolean;
}) {
  const marker = (index: number): Marker =>
    stage > index ? 'done' : stage === index ? 'working' : 'pending';

  const signal = (index: number) => (stage === index + 1 ? `${run}-${index}` : null);

  const whatsapp = submitted?.channel === 'whatsapp';

  return (
    <ol>
      <Step index={1} label={steps.reception.label} marker={marker(0)} signal={signal(0)} motion={motion}>
        {submitted === null ? (
          <Idle>{steps.reception.idle}</Idle>
        ) : (
          <>
            <p className="font-mono text-label font-normal uppercase text-ink-muted">
              {receivedVia} {channelLabels[submitted.channel]}
            </p>
            {whatsapp ? (
              <p className={['mt-3 rounded-bl-sm border-rule bg-surface text-ink', bubble].join(' ')}>
                {submitted.text}
              </p>
            ) : (
              <p className="mt-2 font-mono text-small wrap-anywhere whitespace-pre-line text-ink">
                {submitted.text}
              </p>
            )}
          </>
        )}
      </Step>

      <Step index={2} label={steps.analysis.label} marker={marker(1)} signal={signal(1)} motion={motion}>
        {stage < 1 ? (
          <Idle>{steps.analysis.idle}</Idle>
        ) : stage === 1 || !analysis ? (
          <Working>L’agent lit la demande.</Working>
        ) : (
          <Rise>
            <dl className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-small sm:grid-cols-[7.5rem_minmax(0,1fr)]">
              <dt className="text-ink-muted">{fields.type}</dt>
              <dd className="font-semibold wrap-anywhere text-ink">{analysis.type}</dd>

              <dt className="text-ink-muted">{fields.company}</dt>
              <dd className="wrap-anywhere text-ink">{analysis.entreprise}</dd>

              <dt className="text-ink-muted">{fields.contact}</dt>
              <dd className="wrap-anywhere text-ink">{analysis.contact}</dd>

              <dt className="text-ink-muted">{fields.need}</dt>
              <dd className="wrap-anywhere text-ink">{analysis.besoin}</dd>

              <dt className="text-ink-muted">{fields.deadline}</dt>
              <dd className="wrap-anywhere text-ink">{analysis.echeance}</dd>

              <dt className="text-ink-muted">{fields.priority}</dt>
              <dd className="wrap-anywhere text-ink">
                <span className="font-semibold">{analysis.priorite}</span>
                <span className="text-ink-body"> — {analysis.raison_priorite}</span>
              </dd>
            </dl>
          </Rise>
        )}
      </Step>

      <Step index={3} label={steps.actions.label} marker={marker(2)} signal={signal(2)} motion={motion}>
        {stage < 2 || !analysis ? (
          <Idle>{steps.actions.idle}</Idle>
        ) : (
          <ul className="space-y-2">
            {analysis.actions.map((action, index) => {
              const shown = index < actionsShown;
              const working = stage === 2 && index === actionsShown - 1;

              return (
                <li
                  key={action}
                  className={[
                    'grid grid-cols-[1rem_minmax(0,1fr)] items-baseline text-small text-ink',
                    shown ? '' : 'invisible',
                  ].join(' ')}
                >
                  <span aria-hidden="true">
                    <span
                      className={[
                        'inline-block size-1.5 -translate-y-px transition-colors',
                        working ? markers.working : markers.done,
                      ].join(' ')}
                    />
                  </span>
                  <span className="wrap-anywhere">{action}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Step>

      <Step index={4} label={steps.result.label} marker={marker(3)} signal={null} motion={motion} last>
        {stage < 3 || !analysis ? (
          <Idle>{steps.result.idle}</Idle>
        ) : stage === 3 ? (
          <Working>{whatsapp ? 'Rédaction de la réponse.' : 'Rédaction du brouillon.'}</Working>
        ) : whatsapp ? (
          <Rise>
            <p className="font-mono text-label font-normal uppercase text-ink-muted">
              {instantLabel}
            </p>
            {/* La réponse part de l'entreprise : bulle à droite, filet plus
                marqué que celle du prospect. */}
            <p
              className={[
                'mt-3 ml-auto rounded-br-sm border-rule-strong bg-surface text-ink',
                bubble,
              ].join(' ')}
            >
              {analysis.reponse}
            </p>
          </Rise>
        ) : (
          <Rise>
            <p className="font-mono text-label font-normal uppercase text-ink-muted">
              {draftLabel}
            </p>
            <p className="mt-3 max-w-[60ch] rounded-card border border-rule bg-surface p-5 text-small wrap-anywhere whitespace-pre-line text-ink-body">
              {analysis.reponse}
            </p>
            <p className="mt-3">
              <StatusView state={{ label: draftNote, tone: 'idle' }} />
            </p>
          </Rise>
        )}
      </Step>
    </ol>
  );
}
