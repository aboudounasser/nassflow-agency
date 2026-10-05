'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { formStyles } from '@/components/forms/form-ui';
import { readProspectInput } from '@/lib/crm/input';
import { scoreProspect } from '@/lib/crm/scoring';
import { MIN_SCORE, type Prospect } from '@/lib/crm/types';
import { createProspectAction, updateProspectAction } from './actions';

/**
 * Ajouter ou modifier une fiche. Le score se recalcule à chaque frappe,
 * avec la même fonction que le serveur : on voit avant d'enregistrer si
 * la fiche ira en « Non pertinent », et pourquoi.
 */

type Values = Record<
  'company' | 'contactName' | 'contactRole' | 'email' | 'phone' | 'website' | 'sector' | 'employees' | 'need',
  string
>;

const FIELDS: { name: keyof Values; label: string; type?: string; placeholder?: string; wide?: boolean }[] = [
  { name: 'company', label: 'Entreprise', placeholder: 'ex. Duval Immobilier SARL' },
  { name: 'contactName', label: 'Responsable', placeholder: 'ex. Claire Duval' },
  { name: 'contactRole', label: 'Fonction', placeholder: 'ex. Gérante' },
  { name: 'email', label: 'E-mail', type: 'email', placeholder: 'ex. claire@duval-immobilier.fr' },
  { name: 'phone', label: 'Téléphone', type: 'tel', placeholder: 'ex. 06 12 34 56 78' },
  { name: 'website', label: 'Site web', placeholder: 'ex. duval-immobilier.fr' },
  { name: 'sector', label: 'Secteur', placeholder: 'ex. Immobilier' },
  { name: 'employees', label: 'Effectif', type: 'number', placeholder: 'ex. 8' },
];

function initial(prospect: Prospect | null): Values {
  return {
    company: prospect?.company ?? '',
    contactName: prospect?.contactName ?? '',
    contactRole: prospect?.contactRole ?? '',
    email: prospect?.email ?? '',
    phone: prospect?.phone ?? '',
    website: prospect?.website ?? '',
    sector: prospect?.sector ?? '',
    employees: prospect?.employees?.toString() ?? '',
    need: prospect?.need ?? '',
  };
}

export function ProspectDialog({
  prospect,
  onClose,
  onSaved,
}: {
  prospect: Prospect | null;
  onClose: () => void;
  onSaved: (prospect: Prospect, message: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState(() => initial(prospect));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  const read = readProspectInput(values, prospect?.source ?? 'manuel');
  const preview = read.ok ? scoreProspect(read.input) : null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const result = prospect
        ? await updateProspectAction(prospect.id, values)
        : await createProspectAction(values);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const name = result.prospect.company ?? result.prospect.contactName ?? 'La fiche';
      const where =
        result.prospect.stage === 'non_pertinent'
          ? `classée « Non pertinent » (score sous ${MIN_SCORE})`
          : 'enregistrée';

      onSaved(result.prospect, `${name} : fiche ${where}.`);
    } catch {
      setError('Le serveur ne répond pas, ou la session a expiré. Rechargez la page.');
    } finally {
      setPending(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-labelledby="fiche-titre"
      className="m-auto max-h-[92vh] w-[min(46rem,calc(100vw-2rem))] overflow-y-auto border border-ink bg-paper p-0 text-ink backdrop:bg-ink/40"
    >
      <form onSubmit={submit} className="px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="fiche-titre" className="font-heading text-subtitle text-ink">
            {prospect ? 'Modifier la fiche' : 'Nouveau prospect'}
          </h2>
          <button type="button" onClick={() => dialog.current?.close()} className="text-small text-ink-muted hover:text-ink">
            Fermer
          </button>
        </div>

        <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field.name} className={formStyles.fieldWrap.replace('py-5', 'py-3')}>
              <label htmlFor={`fiche-${field.name}`} className={formStyles.label}>
                {field.label}
              </label>
              <input
                id={`fiche-${field.name}`}
                name={field.name}
                type={field.type === 'email' ? 'text' : (field.type ?? 'text')}
                inputMode={field.type === 'email' ? 'email' : undefined}
                min={field.type === 'number' ? 0 : undefined}
                value={values[field.name]}
                placeholder={field.placeholder}
                onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                className={formStyles.input}
                autoComplete="off"
              />
            </div>
          ))}
        </div>

        <div className={formStyles.fieldWrap.replace('py-5', 'py-3')}>
          <label htmlFor="fiche-need" className={formStyles.label}>
            Besoin, notes
          </label>
          <textarea
            id="fiche-need"
            name="need"
            value={values.need}
            placeholder="Ce qu’il fait à la main, ce qui déborde, ce qu’il a dit…"
            onChange={(event) => setValues((current) => ({ ...current, need: event.target.value }))}
            className={formStyles.textarea}
          />
        </div>

        <div className="mt-6 border-y border-rule py-4" aria-live="polite">
          {preview ? (
            <>
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-[1.25rem] text-ink">{preview.score}/10</span>
                <span className={`text-small font-semibold ${preview.relevant ? 'text-ink' : 'text-accent'}`}>
                  {preview.relevant ? 'Pertinent' : 'Sera classé « Non pertinent »'}
                </span>
              </p>
              <p className="mt-1 text-small text-ink-body">{preview.reason}</p>
            </>
          ) : (
            <p className="text-small text-ink-muted">{read.ok ? '' : read.error}</p>
          )}
        </div>

        {error && <p className={`${formStyles.error} mt-4 mb-0`}>{error}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-6">
          <Button type="submit" size="sm" disabled={pending || !read.ok}>
            {pending ? 'Enregistrement…' : prospect ? 'Enregistrer' : 'Ajouter'}
          </Button>
          <Button variant="secondary" onClick={() => dialog.current?.close()}>
            Annuler
          </Button>
        </div>
      </form>
    </dialog>
  );
}
