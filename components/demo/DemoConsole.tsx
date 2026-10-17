'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Button } from '@/components/ui/Button';
import { Rise } from '@/components/motion/Rise';
import { formStyles } from '@/components/forms/form-ui';
import { demoContent } from '@/lib/content/demo';
import type { DemoAnalysis } from '@/lib/demo/analysis';
import { useMotionEnabled } from '@/lib/in-view';
import { motionTokens } from '@/lib/motion';
import { DemoSteps } from './DemoSteps';

/**
 * La démonstration interactive : le visiteur écrit (ou choisit un
 * exemple), l'agent (app/api/chat/demo) traite, et les quatre étapes
 * s'allument l'une après l'autre (DemoSteps).
 *
 * Le rythme : Réception s'allume, puis Analyse attend la vraie réponse
 * du modèle ; ensuite seulement les actions apparaissent une à une et le
 * brouillon s'affiche. Ces délais sont des temps de lecture, pas une
 * performance : avec « réduire les animations », tout s'affiche dès que
 * la réponse arrive.
 *
 * Sans JS (et jusqu'à l'hydratation), le champ est désactivé et dit que
 * la démonstration nécessite JavaScript : la section reste lisible.
 *
 * Accessibilité : une région aria-live annonce le début du traitement,
 * puis le résumé de la fiche ; à la fin, le focus passe sur le titre du
 * résultat pour qu'un utilisateur au clavier le lise dans l'ordre.
 */

const { anchor, field, notice, examples, examplesLabel, submit, submitting, followUp, errors } =
  demoContent;

type Phase = 'idle' | 'running' | 'done' | 'error';

const subscribeNothing = () => () => {};

/** `true` une fois hydraté : faux au rendu serveur et sans JS. */
function useHydrated() {
  return useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
}

const { duration } = motionTokens;

export function DemoConsole({ header }: { header: ReactNode }) {
  const hydrated = useHydrated();
  const motion = useMotionEnabled();

  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [stage, setStage] = useState(-1);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DemoAnalysis | null>(null);
  const [actionsShown, setActionsShown] = useState(0);
  const [error, setError] = useState<{ message: string; cta: boolean } | null>(null);
  const [hint, setHint] = useState('');
  const [announce, setAnnounce] = useState('');
  const [run, setRun] = useState(0);

  const field_ = useRef<HTMLTextAreaElement>(null);
  const resultTitle = useRef<HTMLHeadingElement>(null);
  // Le passage en cours : un passage annulé (« Essayer une autre
  // demande ») ne doit plus rien afficher.
  const current = useRef(0);
  const motionRef = useRef(motion);

  useEffect(() => {
    motionRef.current = motion;
  }, [motion]);

  // Le CTA « Voir une démonstration » du Hero : le défilement doux est
  // celui du navigateur (scroll-behavior), le focus suit sur le titre.
  useEffect(() => {
    const title = document.getElementById(`${anchor}-titre`);

    if (!title) return;

    const focusTitle = () => title.focus({ preventScroll: true });

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href]');

      // Après la navigation vers l'ancre, qui réinitialise le focus.
      if (link?.getAttribute('href') === `#${anchor}`) window.setTimeout(focusTitle, 0);
    };

    if (window.location.hash === `#${anchor}`) focusTitle();

    document.addEventListener('click', onClick);

    return () => document.removeEventListener('click', onClick);
  }, []);

  /** Un temps de lecture, annulé sans mouvement. */
  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) =>
        window.setTimeout(resolve, motionRef.current ? ms : 0),
      ),
    [],
  );

  function reset() {
    current.current += 1;
    setText('');
    setPhase('idle');
    setStage(-1);
    setSubmitted(null);
    setAnalysis(null);
    setActionsShown(0);
    setError(null);
    setHint('');
    setAnnounce('');
    field_.current?.focus();
  }

  function choose(example: string) {
    if (phase === 'running') return;

    setText(example);
    setHint('');
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (phase === 'running') return;

    const value = text.trim();

    if (value.length < field.min) {
      setHint(errors.tooShort);
      field_.current?.focus();
      return;
    }

    const id = ++current.current;
    const alive = () => current.current === id;

    setHint('');
    setError(null);
    setAnalysis(null);
    setActionsShown(0);
    setSubmitted(value);
    setPhase('running');
    setStage(0);
    setRun(id);
    setAnnounce('Traitement de la demande en cours.');

    // En mobile, le traitement est sous le champ : on l'amène à l'écran.
    const title = resultTitle.current;

    if (title && title.getBoundingClientRect().top > window.innerHeight * 0.6) {
      title.scrollIntoView({ block: 'start', behavior: motionRef.current ? 'smooth' : 'auto' });
    }

    const request = fetch('/api/chat/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: value }),
    })
      .then(async (response) => ({
        status: response.status,
        data: (await response.json().catch(() => null)) as
          | (DemoAnalysis & { error?: undefined })
          | { error: string }
          | null,
      }))
      .catch(() => ({ status: 0, data: null }));

    await wait(duration.slow);
    if (!alive()) return;
    setStage(1);

    const [{ status, data }] = await Promise.all([request, wait(duration.slow * 2)]);
    if (!alive()) return;

    if (status !== 200 || !data || 'error' in data) {
      const message =
        status === 429
          ? errors.rateLimited
          : status === 400 && data && 'error' in data && data.error
            ? data.error
            : errors.unavailable;

      setPhase('error');
      setStage(-1);
      setError({ message, cta: status !== 429 && status !== 400 });
      setAnnounce(message);
      return;
    }

    const result = data as DemoAnalysis;

    setAnalysis(result);
    setStage(2);

    for (let index = 1; index <= result.actions.length; index += 1) {
      await wait(index === 1 ? duration.slow : duration.base + duration.fast);
      if (!alive()) return;
      setActionsShown(index);
    }

    await wait(duration.slow);
    if (!alive()) return;
    setStage(3);

    await wait(duration.slow);
    if (!alive()) return;
    setStage(4);
    setPhase('done');
    setAnnounce(
      `Analyse terminée. Type : ${result.type}. Priorité : ${result.priorite}. ${result.actions.length} actions simulées et un brouillon de réponse.`,
    );

    // Après le rendu du résultat.
    window.requestAnimationFrame(() => resultTitle.current?.focus({ preventScroll: false }));
  }

  const running = phase === 'running';
  const counterId = `${anchor}-compteur`;
  const noticeId = `${anchor}-mention`;
  const hintId = `${anchor}-erreur`;

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
      {/* Le titre de la section, le champ et les exemples */}
      <div className="lg:col-span-5">
      {header}

      <form onSubmit={onSubmit} noValidate className="mt-12">
        <div role="group" aria-labelledby={`${anchor}-exemples`}>
          <p
            id={`${anchor}-exemples`}
            className="font-mono text-label font-normal uppercase text-ink-muted"
          >
            {examplesLabel}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example.id}
                type="button"
                disabled={!hydrated}
                aria-disabled={running || undefined}
                onClick={() => choose(example.text)}
                className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-control px-4 text-[0.8125rem] font-semibold text-ink-body transition-[color,border-color,transform] hover:-translate-y-px hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <span className="font-mono text-micro font-normal uppercase text-ink-muted">
                  Exemple
                </span>
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div className={['mt-8', formStyles.fieldWrap].join(' ')}>
          <label htmlFor={`${anchor}-champ`} className={formStyles.label}>
            {field.label}
          </label>
          <textarea
            ref={field_}
            id={`${anchor}-champ`}
            name="demande"
            rows={6}
            maxLength={field.max}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              if (hint) setHint('');
            }}
            readOnly={running}
            disabled={!hydrated}
            placeholder={hydrated ? field.placeholder : field.noScript}
            aria-invalid={hint ? true : undefined}
            aria-describedby={[hint ? hintId : '', counterId, noticeId].filter(Boolean).join(' ')}
            className={[formStyles.textarea, 'min-h-40 disabled:cursor-not-allowed'].join(' ')}
          />
          <p id={counterId} className="mt-2 text-right font-mono text-label font-normal text-ink-muted">
            {text.length} / {field.max}
            <span className="sr-only"> caractères</span>
          </p>
        </div>

        {hint && (
          <p id={hintId} className="mt-4 text-small text-accent">
            {hint}
          </p>
        )}

        <p id={noticeId} className={['mt-4', formStyles.note].join(' ')}>
          {notice}
        </p>

        <Button
          type="submit"
          disabled={!hydrated}
          aria-disabled={running || undefined}
          className="mt-8 w-full sm:w-auto"
        >
          {running ? submitting : submit}
        </Button>
      </form>
      </div>

      {/* Le traitement */}
      <div className="mt-16 lg:col-span-7 lg:mt-0 lg:pl-8">
        <h3
          ref={resultTitle}
          tabIndex={-1}
          className="scroll-mt-28 font-mono text-label font-normal uppercase text-ink-muted outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {phase === 'done' ? 'Résultat du traitement' : 'Traitement par l’agent'}
        </h3>

        <div className="mt-6 border-t border-rule pt-8">
          <DemoSteps
            stage={stage}
            submitted={submitted}
            analysis={analysis}
            actionsShown={actionsShown}
            run={run}
            motion={motion}
          />
        </div>

        {error && (
          <Rise className="mt-10 border-t border-rule pt-8">
            <p className="text-body text-ink">{error.message}</p>
            {error.cta && (
              <Button href={followUp.cta.href} className="mt-6">
                {followUp.cta.label}
              </Button>
            )}
          </Rise>
        )}

        {(phase === 'done' || phase === 'error') && (
          <Rise className={phase === 'done' ? 'mt-12 border-t border-rule pt-8' : 'mt-6'}>
            {phase === 'done' && (
              <>
                <p className="font-heading text-subtitle text-ink">{followUp.question}</p>
                <Button href={followUp.cta.href} className="mt-6 w-full sm:w-auto">
                  {followUp.cta.label}
                </Button>
              </>
            )}
            <div className={phase === 'done' ? 'mt-6' : ''}>
              <Button variant="secondary" tone="strong" onClick={reset}>
                {followUp.retry}
              </Button>
            </div>
          </Rise>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}
