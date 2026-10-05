'use client';

import { useState } from 'react';
import { formatDay, relativeDay } from '@/lib/crm/dates';
import { suggestSubject } from '@/lib/crm/message';
import type { ProspectView, StepAction } from '@/lib/crm/prospect';
import { STAGE_LABELS, STAGES, type Stage } from '@/lib/crm/types';

/**
 * Une fiche prospect : qui, comment le joindre, son score et pourquoi,
 * puis l'action recommandée et ses trois boutons. Le détail (premier
 * message, plan daté, historique) se déplie.
 */

const ACTIVITY_VERBS = {
  cree: 'Créée',
  fait: 'Fait',
  ignore: 'Ignoré',
  reporte: 'Reporté',
  deplace: 'Déplacée',
  exclu: 'Exclue',
  reintegre: 'Réintégrée',
  modifie: 'Modifiée',
} as const;

const CHANNEL_LABELS = {
  email: 'E-mail',
  telephone: 'Téléphone',
  linkedin: 'LinkedIn',
  'rendez-vous': 'Rendez-vous',
  interne: 'Interne',
} as const;

const smallButton =
  'min-h-9 border px-3 font-sans text-[0.8125rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50';

function ScoreBadge({ score, relevant }: { score: number; relevant: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 flex-col items-end font-mono text-[0.75rem] leading-none ${relevant ? 'text-ink' : 'text-ink-muted'}`}
      title={`Score ${score}/10`}
    >
      <span>
        <strong className="text-[1rem] font-normal">{score}</strong>/10
      </span>
      <span aria-hidden="true" className="mt-1 flex gap-px">
        {Array.from({ length: 10 }, (_, index) => (
          <span key={index} className={`h-1 w-1.5 ${index < score ? (relevant ? 'bg-ink' : 'bg-ink-muted') : 'bg-rule'}`} />
        ))}
      </span>
    </span>
  );
}

export function ProspectCard({
  view,
  today,
  onStep,
  onMove,
  onEdit,
  onDelete,
}: {
  view: ProspectView;
  today: string;
  onStep: (action: StepAction) => Promise<void>;
  onMove: (stage: Stage) => Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { prospect, scoring, firstMessage, plan } = view;
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [current, ...upcoming] = plan;
  const overdue = current.overdueBy > 0;
  const due = prospect.dueOn <= today;
  const excluded = prospect.stage === 'non_pertinent';

  const title = scoring.company.name ?? prospect.contactName ?? prospect.email ?? 'Sans nom';
  const emailOk = scoring.contact.email === 'pro' || scoring.contact.email === 'webmail';
  const mailto = emailOk
    ? `mailto:${prospect.email}?subject=${encodeURIComponent(suggestSubject(prospect, scoring))}&body=${encodeURIComponent(firstMessage)}`
    : null;

  // Pas de startTransition : la fiche s'affiche à sa nouvelle place tout
  // de suite (mise à jour optimiste du tableau), pas au retour du serveur.
  // `pending` n'empêche que le double clic.
  async function act(work: () => Promise<void>) {
    setPending(true);

    try {
      await work();
    } finally {
      setPending(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(firstMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', prospect.id);
        event.dataTransfer.effectAllowed = 'move';
      }}
      aria-busy={pending}
      className={`cursor-grab border bg-paper p-3 transition-opacity active:cursor-grabbing ${
        overdue && !excluded ? 'border-accent' : 'border-rule'
      } ${pending ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-[0.9375rem] font-bold leading-snug text-ink [overflow-wrap:anywhere]">{title}</h3>
          {(prospect.contactName || prospect.contactRole) && (
            <p className="text-[0.8125rem] leading-5 text-ink-body">
              {[prospect.contactName, prospect.contactRole].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <ScoreBadge score={scoring.score} relevant={scoring.relevant} />
      </div>

      <ul className="mt-2 space-y-0.5 text-[0.8125rem] leading-5 [overflow-wrap:anywhere]">
        {prospect.email && (
          <li>
            {emailOk ? (
              <a href={`mailto:${prospect.email}`} className="text-ink link-underline">
                {prospect.email}
              </a>
            ) : (
              <span className="text-ink-muted line-through decoration-accent">{prospect.email}</span>
            )}
          </li>
        )}
        {prospect.phone && (
          <li>
            {scoring.contact.phoneValid ? (
              <a href={`tel:${prospect.phone.replace(/[^\d+]/g, '')}`} className="text-ink link-underline">
                {prospect.phone}
              </a>
            ) : (
              <span className="text-ink-muted line-through decoration-accent">{prospect.phone}</span>
            )}
          </li>
        )}
        {!prospect.email && !prospect.phone && <li className="text-ink-muted">Aucune coordonnée</li>}
      </ul>

      <p className="mt-2 text-[0.8125rem] leading-5 text-ink-body">{scoring.reason}</p>

      <div className="mt-3 border-t border-rule pt-3">
        <p className="flex items-baseline justify-between gap-2 font-sans text-micro uppercase text-ink-muted">
          <span>Action recommandée</span>
          <span className="font-mono font-normal normal-case tracking-normal">{CHANNEL_LABELS[current.channel]}</span>
        </p>
        <p className="mt-1 text-[0.875rem] font-semibold leading-5 text-ink">{current.label}</p>
        <p className={`mt-0.5 font-mono text-[0.75rem] ${overdue ? 'text-accent' : due ? 'text-ink' : 'text-ink-muted'}`}>
          <time dateTime={prospect.dueOn}>{formatDay(prospect.dueOn)}</time> · {relativeDay(prospect.dueOn, today)}
        </p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            type="button"
            disabled={pending}
            onClick={() => act(() => onStep({ type: 'fait' }))}
            className={`${smallButton} border-ink bg-ink text-paper hover:bg-ink-body`}
          >
            Fait
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => act(() => onStep({ type: 'ignore' }))}
            className={`${smallButton} border-rule text-ink hover:border-ink`}
            title={current.retry ? 'L’action reviendra demain' : 'Passer à l’action suivante, plus tôt'}
          >
            Ignorer
          </button>
          <label className="sr-only" htmlFor={`reporter-${prospect.id}`}>
            Reporter l’action
          </label>
          <select
            id={`reporter-${prospect.id}`}
            disabled={pending}
            value=""
            onChange={(event) => {
              const days = Number(event.target.value);
              if (days > 0) act(() => onStep({ type: 'reporter', days }));
            }}
            className={`${smallButton} border-rule bg-paper text-ink hover:border-ink`}
          >
            <option value="" disabled>
              Reporter…
            </option>
            <option value="1">+1 jour</option>
            <option value="3">+3 jours</option>
            <option value="7">+1 semaine</option>
            <option value="30">+1 mois</option>
          </select>
        </div>
      </div>

      <details className="group mt-3 border-t border-rule pt-2">
        <summary className="cursor-pointer list-none font-sans text-[0.8125rem] font-semibold text-ink-body hover:text-ink [&::-webkit-details-marker]:hidden">
          <span className="inline-block transition-transform group-open:rotate-90" aria-hidden="true">
            ›
          </span>{' '}
          Message, plan, historique
        </summary>

        <div className="mt-3 space-y-4 text-[0.8125rem] leading-5">
          <section>
            <h4 className="font-sans text-micro uppercase text-ink-muted">Premier message suggéré</h4>
            <p className="mt-1 whitespace-pre-line border-l-2 border-rule pl-3 text-ink-body">{firstMessage}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <button type="button" onClick={copy} className="font-semibold text-ink link-underline">
                {copied ? 'Copié' : 'Copier'}
              </button>
              {mailto && (
                <a href={mailto} className="font-semibold text-ink link-underline">
                  Ouvrir dans la messagerie
                </a>
              )}
            </div>
          </section>

          <section>
            <h4 className="font-sans text-micro uppercase text-ink-muted">À faire</h4>
            <p className="mt-1 text-ink-body">{current.hint}</p>
          </section>

          <section>
            <h4 className="font-sans text-micro uppercase text-ink-muted">Ensuite, si tout est fait à temps</h4>
            <ol className="mt-1 space-y-1">
              {upcoming.map((step, index) => (
                <li key={`${step.id}-${index}`} className="flex justify-between gap-3">
                  <span className="text-ink-body">
                    {step.label}
                    {step.stage !== prospect.stage && (
                      <span className="text-ink-muted"> ({STAGE_LABELS[step.stage]})</span>
                    )}
                  </span>
                  <time dateTime={step.dueOn} className="shrink-0 font-mono text-[0.75rem] text-ink-muted">
                    {formatDay(step.dueOn)}
                  </time>
                </li>
              ))}
            </ol>
          </section>

          {prospect.need && (
            <section>
              <h4 className="font-sans text-micro uppercase text-ink-muted">Besoin, notes</h4>
              <p className="mt-1 whitespace-pre-line text-ink-body [overflow-wrap:anywhere]">{prospect.need}</p>
            </section>
          )}

          <section>
            <h4 className="font-sans text-micro uppercase text-ink-muted">Historique</h4>
            <ol className="mt-1 space-y-0.5">
              {prospect.activity
                .slice(-6)
                .reverse()
                .map((entry, index) => (
                  <li key={index} className="flex gap-2 text-ink-body">
                    <time dateTime={entry.on} className="shrink-0 font-mono text-[0.75rem] text-ink-muted">
                      {formatDay(entry.on)}
                    </time>
                    <span>
                      <span className="text-ink">{ACTIVITY_VERBS[entry.kind]}</span> — {entry.label}
                    </span>
                  </li>
                ))}
            </ol>
            <p className="mt-1 text-[0.75rem] text-ink-muted">Source : {prospect.source}</p>
          </section>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule pt-3">
            <label className="flex items-center gap-2">
              <span className="text-ink-muted">Déplacer vers</span>
              <select
                value={prospect.stage}
                disabled={pending}
                onChange={(event) => act(() => onMove(event.target.value as Stage))}
                className="min-h-9 border-b border-rule bg-paper text-ink outline-none focus:border-accent"
              >
                {STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {STAGE_LABELS[stage]}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={onEdit} className="font-semibold text-ink link-underline">
              Modifier
            </button>
            <button type="button" onClick={onDelete} className="font-semibold text-accent link-underline">
              Supprimer
            </button>
          </div>
        </div>
      </details>
    </article>
  );
}
