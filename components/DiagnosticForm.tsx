'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { formStyles } from '@/components/forms/form-ui';
import { BOOKING_URL, CONTACT_EMAIL } from '@/lib/content/contact';
import {
  companySizes,
  diagnosticContent,
  expectedOutcomes,
  limits,
  monthlyVolumes,
  problemChoices,
  sectors,
  tools,
  type Choice,
} from '@/lib/content/diagnostic';
import {
  emptyFields,
  stepFields,
  stepOf,
  TOTAL_STEPS,
  validateStep,
  type DiagnosticFields,
  type FieldErrors,
  type FieldName,
} from '@/lib/diagnostic/validate';

/**
 * Le formulaire de diagnostic, en quatre étapes.
 *
 * - Les réponses vivent en mémoire (état React), d'une étape à l'autre :
 *   rien dans localStorage. Une erreur d'envoi ne les efface pas.
 * - Chaque étape est validée avant la suivante, avec les règles mêmes du
 *   serveur (lib/diagnostic/validate.ts). Un message d'erreur est relié
 *   à son champ (`aria-describedby`), et le focus va au premier champ
 *   fautif.
 * - À chaque changement d'étape, le focus va sur le titre de l'étape, et
 *   une région polie annonce « Étape X sur 4 ».
 * - Pas de Motion ici : la barre de progression est une transition CSS
 *   (neutralisée par « réduire les animations », app/globals.css).
 *
 * Envoi : POST /api/diagnostic, qui insère côté serveur. L'identifiant
 * d'envoi est tiré une fois et réutilisé à chaque nouvel essai : si une
 * première tentative a abouti sans que la réponse revienne, la seconde
 * est reconnue comme un doublon au lieu de créer une autre ligne.
 */

const content = diagnosticContent;

const fieldId = (name: FieldName) => `diag-${name}`;
const errorId = (name: FieldName) => `diag-${name}-error`;

export function DiagnosticForm() {
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<DiagnosticFields>(emptyFields);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'failed' | 'done'>('idle');
  const [honeypot, setHoneypot] = useState('');
  const [announcement, setAnnouncement] = useState('');

  const shownAt = useRef(0);
  const submissionId = useRef<string | null>(null);
  const sending = useRef(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const confirmationHeading = useRef<HTMLHeadingElement>(null);
  /** Après un rendu : le titre de l'étape, ou un champ en erreur. */
  const pendingFocus = useRef<'heading' | FieldName | null>(null);

  useEffect(() => {
    shownAt.current = performance.now();
  }, []);

  useEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;

    if (target === 'heading') stepHeading.current?.focus();
    else if (target) document.getElementById(fieldId(target))?.focus();
  });

  useEffect(() => {
    if (status === 'done') confirmationHeading.current?.focus();
  }, [status]);

  function update<K extends FieldName>(name: K, value: DiagnosticFields[K]) {
    setFields((current) => ({ ...current, [name]: value }));

    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  }

  function goTo(next: number) {
    setStep(next);
    setErrors({});
    setAnnouncement(`${content.progress(next + 1, TOTAL_STEPS)} : ${content.steps[next].title}`);
    pendingFocus.current = 'heading';
  }

  /** Vrai si l'étape passe ; sinon affiche ses erreurs et y met le focus. */
  function checkStep(): boolean {
    const stepErrors = validateStep(step, fields);
    const first = stepFields[step].find((name) => stepErrors[name]);

    setErrors(stepErrors);

    if (first) {
      pendingFocus.current = first;
      return false;
    }

    return true;
  }

  async function submit() {
    if (sending.current) return;

    sending.current = true;
    setStatus('submitting');

    submissionId.current ??= crypto.randomUUID();

    try {
      const response = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          reference: honeypot,
          submissionId: submissionId.current,
          elapsedMs: Math.round(performance.now() - shownAt.current),
        }),
      });

      if (response.ok) {
        setStatus('done');
        return;
      }

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        field?: FieldName;
      };

      // Le serveur a refusé un champ précis : on y ramène le visiteur.
      if (response.status === 400 && data.field && data.error && stepOf(data.field) >= 0) {
        setStatus('idle');
        setStep(stepOf(data.field));
        setErrors({ [data.field]: data.error });
        pendingFocus.current = data.field;
        return;
      }

      setStatus('failed');
    } catch {
      setStatus('failed');
    } finally {
      sending.current = false;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === 'submitting' || !checkStep()) return;

    if (step < TOTAL_STEPS - 1) goTo(step + 1);
    else void submit();
  }

  if (status === 'done') {
    return (
      <div className={formStyles.success}>
        <h2
          ref={confirmationHeading}
          tabIndex={-1}
          className="font-heading text-subtitle text-ink outline-none"
        >
          {content.confirmation.title(fields.firstName.trim())}
        </h2>

        <p className="mt-4 max-w-measure text-body text-ink-body">{content.confirmation.text}</p>

        <Button
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8"
        >
          {content.confirmation.booking}
          <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
        </Button>
      </div>
    );
  }

  const field = (name: FieldName) => ({
    id: fieldId(name),
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? errorId(name) : undefined,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="border-t border-rule pt-8 sm:pt-10">
      {/* Progression : le texte fait foi, la barre n'est qu'un repère. */}
      <div>
        <p className="font-sans text-label uppercase tracking-tag text-ink-muted">
          {content.progress(step + 1, TOTAL_STEPS)}
        </p>

        <div aria-hidden="true" className="mt-3 h-px w-full bg-rule">
          <div
            className="h-px origin-left bg-accent transition-transform duration-(--motion-duration-base)"
            style={{ transform: `scaleX(${(step + 1) / TOTAL_STEPS})` }}
          />
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <h2
        ref={stepHeading}
        tabIndex={-1}
        className="mt-8 font-heading text-subtitle text-ink outline-none sm:mt-10"
      >
        {content.steps[step].title}
      </h2>

      {/* Le champ piège : hors de l'écran, hors de la tabulation, ignoré
          des lecteurs d'écran. Seul un robot le remplit. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="diag-reference">Référence</label>
        <input
          id="diag-reference"
          name="reference"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="mt-4">
        {step === 0 && (
          <>
            <TextField
              {...field('company')}
              label={content.fields.company}
              value={fields.company}
              onChange={(value) => update('company', value)}
              error={errors.company}
              autoComplete="organization"
              maxLength={limits.company}
            />

            <div className={formStyles.fieldWrap}>
              <label htmlFor={fieldId('sector')} className={formStyles.label}>
                {content.fields.sector}{' '}
                <span className={formStyles.optional}>{content.fields.optional}</span>
              </label>

              <select
                {...field('sector')}
                value={fields.sector}
                onChange={(event) => update('sector', event.target.value)}
                className={formStyles.select}
              >
                <option value="" className={formStyles.option}>
                  {content.fields.sectorPlaceholder}
                </option>
                {sectors.map((choice) => (
                  <option key={choice.value} value={choice.value} className={formStyles.option}>
                    {choice.label}
                  </option>
                ))}
              </select>

              <FieldError name="sector" error={errors.sector} />
            </div>

            <ChoiceGroup
              name="companySize"
              legend={content.fields.companySize}
              optional
              choices={companySizes}
              selected={[fields.companySize]}
              onToggle={(value) => update('companySize', value)}
              error={errors.companySize}
            />
          </>
        )}

        {step === 1 && (
          <>
            <fieldset
              className="min-w-0 py-5"
              aria-describedby={errors.problem ? errorId('problem') : undefined}
            >
              <legend className={formStyles.label}>{content.fields.problem}</legend>

              <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                {problemChoices.map((choice, index) => (
                  <label
                    key={choice.value}
                    className="flex min-h-11 cursor-pointer gap-4 rounded-card border border-control bg-surface p-5 transition-colors hover:border-ink has-checked:border-accent has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
                  >
                    <input
                      type="radio"
                      id={index === 0 ? fieldId('problem') : undefined}
                      name="problem"
                      value={choice.value}
                      checked={fields.problem === choice.value}
                      onChange={() => update('problem', choice.value)}
                      aria-describedby={errors.problem ? errorId('problem') : undefined}
                      className="mt-1 size-4 shrink-0 accent-(--accent)"
                    />
                    <span>
                      <span className="block font-sans text-base font-semibold text-ink">
                        {choice.label}
                      </span>
                      {choice.description && (
                        <span className="mt-1.5 block text-[0.875rem] leading-[1.5] text-ink-muted">
                          {choice.description}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>

              <FieldError name="problem" error={errors.problem} />
            </fieldset>

            <div className={formStyles.fieldWrap}>
              <label htmlFor={fieldId('problemDetails')} className={formStyles.label}>
                {content.fields.problemDetails}{' '}
                <span className={formStyles.optional}>{content.fields.optional}</span>
              </label>

              <p id="diag-problemDetails-hint" className="mb-2 text-[0.875rem] text-ink-muted">
                {content.fields.problemDetailsHint}
              </p>

              <textarea
                {...field('problemDetails')}
                aria-describedby={[
                  'diag-problemDetails-hint',
                  'diag-problemDetails-count',
                  errors.problemDetails ? errorId('problemDetails') : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                value={fields.problemDetails}
                onChange={(event) => update('problemDetails', event.target.value)}
                maxLength={limits.problemDetails}
                rows={4}
                className={formStyles.textarea}
              />

              <p id="diag-problemDetails-count" className="mt-1 text-right text-[0.75rem] text-ink-muted">
                {fields.problemDetails.length} / {limits.problemDetails} caractères
              </p>

              <FieldError name="problemDetails" error={errors.problemDetails} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <ChoiceGroup
              name="tools"
              type="checkbox"
              legend={content.fields.tools}
              hint={content.fields.toolsHint}
              optional
              choices={tools}
              selected={fields.tools}
              onToggle={(value) =>
                update(
                  'tools',
                  fields.tools.includes(value)
                    ? fields.tools.filter((tool) => tool !== value)
                    : [...fields.tools, value],
                )
              }
              error={errors.tools}
            />

            <ChoiceGroup
              name="monthlyVolume"
              legend={content.fields.monthlyVolume}
              optional
              choices={monthlyVolumes}
              selected={[fields.monthlyVolume]}
              onToggle={(value) => update('monthlyVolume', value)}
              error={errors.monthlyVolume}
            />

            <ChoiceGroup
              name="expectedOutcome"
              legend={content.fields.expectedOutcome}
              optional
              choices={expectedOutcomes}
              selected={[fields.expectedOutcome]}
              onToggle={(value) => update('expectedOutcome', value)}
              error={errors.expectedOutcome}
            />
          </>
        )}

        {step === 3 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
              <TextField
                {...field('firstName')}
                label={content.fields.firstName}
                value={fields.firstName}
                onChange={(value) => update('firstName', value)}
                error={errors.firstName}
                autoComplete="given-name"
                maxLength={limits.firstName}
              />

              <TextField
                {...field('lastName')}
                label={content.fields.lastName}
                optional
                value={fields.lastName}
                onChange={(value) => update('lastName', value)}
                error={errors.lastName}
                autoComplete="family-name"
                maxLength={limits.lastName}
              />

              <TextField
                {...field('email')}
                label={content.fields.email}
                type="email"
                value={fields.email}
                onChange={(value) => update('email', value)}
                error={errors.email}
                autoComplete="email"
                maxLength={limits.email}
              />

              <TextField
                {...field('phone')}
                label={content.fields.phone}
                optional
                type="tel"
                value={fields.phone}
                onChange={(value) => update('phone', value)}
                error={errors.phone}
                autoComplete="tel"
                maxLength={limits.phone}
              />
            </div>

            <div className="py-6">
              <label className="flex min-h-11 cursor-pointer items-start gap-3 text-[0.9375rem] leading-[1.55] text-ink-body">
                <input
                  type="checkbox"
                  {...field('consent')}
                  checked={fields.consent}
                  onChange={(event) => update('consent', event.target.checked)}
                  className="mt-1 size-5 shrink-0 accent-(--accent)"
                />
                <span>{content.fields.consent}</span>
              </label>

              <p className="mt-2 pl-8 text-[0.875rem]">
                <Link
                  href="/confidentialite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-ink-body underline underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {content.fields.consentLink}
                  <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                </Link>
              </p>

              <FieldError name="consent" error={errors.consent} className="pl-8" />
            </div>
          </>
        )}
      </div>

      {status === 'failed' && (
        <p role="alert" className="mt-6 max-w-measure text-small text-accent">
          {content.failure.text}{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}

      <div className="mt-10 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => goTo(step - 1)}
            disabled={status === 'submitting'}
            className="self-start"
          >
            {content.actions.back}
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}

        <Button type="submit" disabled={status === 'submitting'} className="w-full sm:w-auto">
          {step < TOTAL_STEPS - 1
            ? content.actions.next
            : status === 'submitting'
              ? content.actions.submitting
              : content.actions.submit}
        </Button>
      </div>
    </form>
  );
}

function FieldError({
  name,
  error,
  className,
}: {
  name: FieldName;
  error?: string;
  className?: string;
}) {
  if (!error) return null;

  return (
    <p id={errorId(name)} className={['mt-2 text-small text-accent', className].filter(Boolean).join(' ')}>
      {error}
    </p>
  );
}

function TextField({
  id,
  name,
  label,
  optional,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  maxLength,
  ...aria
}: {
  id: string;
  name: FieldName;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  maxLength?: number;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}) {
  return (
    <div className={formStyles.fieldWrap}>
      <label htmlFor={id} className={formStyles.label}>
        {label}
        {optional && (
          <>
            {' '}
            <span className={formStyles.optional}>{diagnosticContent.fields.optional}</span>
          </>
        )}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={formStyles.input}
        {...aria}
      />

      <FieldError name={name} error={error} />
    </div>
  );
}

/** Des radios ou des cases natives, en pastilles : les flèches et l'espace marchent. */
function ChoiceGroup({
  name,
  legend,
  hint,
  optional,
  choices,
  selected,
  onToggle,
  error,
  type = 'radio',
}: {
  name: FieldName;
  legend: string;
  hint?: ReactNode;
  optional?: boolean;
  choices: readonly Choice[];
  selected: string[];
  onToggle: (value: string) => void;
  error?: string;
  type?: 'radio' | 'checkbox';
}) {
  const describedBy = error ? errorId(name) : undefined;

  return (
    <fieldset className="min-w-0 border-b border-control py-5" aria-describedby={describedBy}>
      <legend className={`${formStyles.label} float-left w-full`}>
        {legend}
        {optional && (
          <>
            {' '}
            <span className={formStyles.optional}>{diagnosticContent.fields.optional}</span>
          </>
        )}
      </legend>

      {hint && <p className="clear-both mb-3 text-[0.875rem] text-ink-muted">{hint}</p>}

      <div className="clear-both flex flex-wrap gap-2">
        {choices.map((choice, index) => (
          <label
            key={choice.value}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-pill border border-control px-4 text-[0.875rem] font-semibold text-ink-body transition-[color,border-color,background-color] hover:border-ink hover:text-ink has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
          >
            <input
              type={type}
              id={index === 0 ? fieldId(name) : undefined}
              name={name}
              value={choice.value}
              checked={selected.includes(choice.value)}
              onChange={() => onToggle(choice.value)}
              aria-invalid={error && type === 'checkbox' ? true : undefined}
              aria-describedby={describedBy}
              className="sr-only"
            />
            {choice.label}
          </label>
        ))}
      </div>

      <FieldError name={name} error={error} />
    </fieldset>
  );
}
