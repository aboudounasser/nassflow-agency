'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { formStyles } from '@/components/forms/form-ui';
import { MIN_SCORE } from '@/lib/crm/types';
import { importCsvAction, type ActionResult, type ImportSummary } from './actions';

/**
 * Importer une liste : un fichier CSV, ou son contenu collé. Chaque
 * ligne est notée à l'arrivée ; celles sous 5 vont directement en
 * « Non pertinent ».
 */

const EXAMPLE = `Entreprise;Responsable;Fonction;E-mail;Téléphone;Site web;Secteur;Effectif;Besoin
Duval Immobilier SARL;Claire Duval;Gérante;claire@duval-immobilier.fr;06 39 98 12 40;duval-immobilier.fr;Immobilier;8;Trop de demandes de visite à traiter à la main`;

export function ImportDialog({
  onClose,
  onImported,
}: {
  onClose: () => void;
  onImported: (result: ActionResult<ImportSummary>) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  async function pick(file: File | undefined) {
    if (!file) return;

    setFileName(file.name);
    setContent(await file.text());
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const result = await importCsvAction(content);

      if (result.ok) onImported(result);
      else setError(result.error);
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
      aria-labelledby="import-titre"
      className="m-auto max-h-[92vh] w-[min(46rem,calc(100vw-2rem))] overflow-y-auto border border-ink bg-paper p-0 text-ink backdrop:bg-ink/40"
    >
      <form onSubmit={submit} className="px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="import-titre" className="font-heading text-subtitle text-ink">
            Importer des prospects
          </h2>
          <button type="button" onClick={() => dialog.current?.close()} className="text-small text-ink-muted hover:text-ink">
            Fermer
          </button>
        </div>

        <p className={`${formStyles.note} mt-3`}>
          Un CSV avec une ligne d’en-tête (export Excel, Google Sheets, Sales Navigator…). Colonnes reconnues :
          Entreprise, Responsable, Fonction, E-mail, Téléphone, Site web, Secteur, Effectif, Besoin (ou Notes) —
          en français ou en anglais. Les fiches sous {MIN_SCORE}/10 sont classées « Non pertinent » d’office.
        </p>

        <div className="mt-5">
          <label htmlFor="import-fichier" className={formStyles.label}>
            Fichier
          </label>
          <input
            id="import-fichier"
            type="file"
            accept=".csv,.tsv,.txt,text/csv"
            onChange={(event) => pick(event.target.files?.[0])}
            className="block w-full text-small text-ink-body file:mr-4 file:min-h-10 file:border file:border-ink file:bg-paper file:px-4 file:font-sans file:text-[0.8125rem] file:font-semibold file:text-ink hover:file:bg-ink hover:file:text-paper"
          />
          {fileName && <p className="mt-1 text-[0.8125rem] text-ink-muted">{fileName}</p>}
        </div>

        <div className={`${formStyles.fieldWrap} mt-2`}>
          <label htmlFor="import-contenu" className={formStyles.label}>
            Ou collez le contenu
          </label>
          <textarea
            id="import-contenu"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={EXAMPLE}
            spellCheck={false}
            className={`${formStyles.textarea} min-h-44 font-mono text-[0.8125rem] leading-6`}
          />
        </div>

        {error && <p className={`${formStyles.error} mt-4 mb-0`}>{error}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-6">
          <Button type="submit" size="sm" disabled={pending || content.trim() === ''}>
            {pending ? 'Import en cours…' : 'Importer et noter'}
          </Button>
          <Button variant="secondary" onClick={() => setContent(EXAMPLE)}>
            Voir un exemple
          </Button>
        </div>
      </form>
    </dialog>
  );
}
