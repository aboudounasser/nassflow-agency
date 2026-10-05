'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { todayInParis } from '@/lib/crm/dates';
import {
  applyStepAction,
  compareViews,
  moveProspect,
  viewProspect,
  type StepAction,
} from '@/lib/crm/prospect';
import { normalize } from '@/lib/crm/scoring';
import { MIN_SCORE, STAGE_LABELS, STAGES, type Prospect, type Stage } from '@/lib/crm/types';
import {
  deleteProspectAction,
  importSiteLeadsAction,
  moveProspectAction,
  stepAction,
  type ActionResult,
  type ImportSummary,
} from './actions';
import { ImportDialog } from './ImportDialog';
import { ProspectCard } from './ProspectCard';
import { ProspectDialog } from './ProspectDialog';

/**
 * Le tableau : six colonnes, une carte par prospect.
 *
 * Les déplacements et les actions s'appliquent tout de suite à l'écran,
 * avec les mêmes fonctions pures que le serveur (lib/crm/prospect.ts),
 * puis la fiche renvoyée par le serveur remplace la version locale. En
 * cas d'échec, la fiche revient à son état d'avant et l'erreur s'affiche.
 */

type Notice = { tone: 'ok' | 'error'; text: string } | null;

const COLUMN_NOTES: Partial<Record<Stage, string>> = {
  non_pertinent: `Score sous ${MIN_SCORE} : exclu automatiquement. Complétez la fiche pour la réintégrer.`,
};

function matches(prospect: Prospect, query: string): boolean {
  if (!query) return true;

  return normalize(
    [prospect.company, prospect.contactName, prospect.email, prospect.phone, prospect.sector, prospect.need].join(' '),
  ).includes(query);
}

export function CrmBoard({
  initialProspects,
  initialToday,
  storeKind,
  loadError,
}: {
  initialProspects: Prospect[];
  initialToday: string;
  storeKind: 'supabase' | 'memoire' | null;
  loadError: string | null;
}) {
  const [prospects, setProspects] = useState(initialProspects);
  const [today, setToday] = useState(initialToday);
  const [query, setQuery] = useState('');
  const [dueOnly, setDueOnly] = useState(false);
  const [notice, setNotice] = useState<Notice>(loadError ? { tone: 'error', text: loadError } : null);
  const [editing, setEditing] = useState<Prospect | 'new' | null>(null);
  const [importing, setImporting] = useState(false);
  const [dropTarget, setDropTarget] = useState<Stage | null>(null);
  const [siteImportPending, startSiteImport] = useTransition();

  // Une page laissée ouverte passe minuit : les échéances suivent.
  useEffect(() => {
    const timer = setInterval(() => setToday(todayInParis()), 60_000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (notice?.tone !== 'ok') return;

    const timer = setTimeout(() => setNotice(null), 6000);

    return () => clearTimeout(timer);
  }, [notice]);

  const views = useMemo(() => prospects.map((prospect) => viewProspect(prospect, today)), [prospects, today]);

  const active = views.filter((view) => view.prospect.stage !== 'non_pertinent');
  const overdue = active.filter((view) => view.prospect.dueOn < today).length;
  const dueToday = active.filter((view) => view.prospect.dueOn === today).length;

  const search = normalize(query);
  const columns = STAGES.map((stage) => ({
    stage,
    views: views
      .filter(
        (view) =>
          view.prospect.stage === stage &&
          matches(view.prospect, search) &&
          (!dueOnly || (stage !== 'non_pertinent' && view.prospect.dueOn <= today)),
      )
      .sort(compareViews),
  }));

  function replace(prospect: Prospect) {
    setProspects((list) =>
      list.some((item) => item.id === prospect.id)
        ? list.map((item) => (item.id === prospect.id ? prospect : item))
        : [prospect, ...list],
    );
  }

  /**
   * Applique `local` à l'écran, envoie `remote`, puis garde la version
   * du serveur — ou revient à `before`.
   */
  async function optimistic(
    before: Prospect,
    local: Prospect,
    remote: () => Promise<ActionResult<{ prospect: Prospect }>>,
    success?: (prospect: Prospect) => string | null,
  ) {
    replace(local);

    try {
      const result = await remote();

      if (result.ok) {
        replace(result.prospect);
        const text = success?.(result.prospect);
        if (text) setNotice({ tone: 'ok', text });
      } else {
        replace(before);
        setNotice({ tone: 'error', text: result.error });
      }
    } catch {
      replace(before);
      setNotice({ tone: 'error', text: 'Le serveur ne répond pas, ou la session a expiré. Rechargez la page.' });
    }
  }

  async function move(prospect: Prospect, stage: Stage) {
    const local = moveProspect(prospect, stage, today);

    if (!local.ok) {
      setNotice({ tone: 'error', text: local.error });
      return;
    }

    await optimistic(prospect, local.prospect, () => moveProspectAction(prospect.id, stage));
  }

  async function step(prospect: Prospect, action: StepAction) {
    const local = applyStepAction(prospect, action, today);

    await optimistic(prospect, local, () => stepAction(prospect.id, action), (saved) =>
      saved.stage !== prospect.stage ? `${saved.company ?? 'La fiche'} passe en « ${STAGE_LABELS[saved.stage]} ».` : null,
    );
  }

  async function remove(prospect: Prospect) {
    if (!window.confirm(`Supprimer définitivement la fiche « ${prospect.company ?? prospect.contactName ?? prospect.email} » ?`)) return;

    setProspects((list) => list.filter((item) => item.id !== prospect.id));

    try {
      const result = await deleteProspectAction(prospect.id);

      if (!result.ok) {
        replace(prospect);
        setNotice({ tone: 'error', text: result.error });
      }
    } catch {
      replace(prospect);
      setNotice({ tone: 'error', text: 'La suppression a échoué. Rechargez la page.' });
    }
  }

  function imported(result: ActionResult<ImportSummary>) {
    if (!result.ok) {
      setNotice({ tone: 'error', text: result.error });
      return;
    }

    setProspects((list) => [...result.prospects, ...list]);

    const created = result.prospects.length;
    const parts = [
      `${created} fiche${created > 1 ? 's' : ''} importée${created > 1 ? 's' : ''}`,
      result.excluded > 0 ? `dont ${result.excluded} exclue${result.excluded > 1 ? 's' : ''} (score sous ${MIN_SCORE})` : null,
      result.skipped > 0 ? `${result.skipped} ligne${result.skipped > 1 ? 's' : ''} ignorée${result.skipped > 1 ? 's' : ''}` : null,
    ].filter(Boolean);

    setNotice({ tone: 'ok', text: [`${parts.join(', ')}.`, ...result.notes].join(' ') });
  }

  function importSite() {
    startSiteImport(async () => {
      try {
        imported(await importSiteLeadsAction());
      } catch {
        setNotice({ tone: 'error', text: 'L’import a échoué. Rechargez la page.' });
      }
    });
  }

  function onDrop(stage: Stage, id: string) {
    setDropTarget(null);

    const prospect = prospects.find((item) => item.id === id);

    if (prospect && prospect.stage !== stage) void move(prospect, stage);
  }

  return (
    <div className="py-10 sm:py-14">
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        <Eyebrow as="p">Interne · Prospection</Eyebrow>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-heading text-heading text-ink">CRM agents IA &amp; automatisation</h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button size="sm" onClick={() => setEditing('new')}>
              Ajouter un prospect
            </Button>
            <Button variant="secondary" onClick={() => setImporting(true)}>
              Importer un CSV
            </Button>
            {storeKind === 'supabase' && (
              <Button variant="secondary" onClick={importSite} disabled={siteImportPending}>
                {siteImportPending ? 'Import en cours…' : 'Importer les demandes du site'}
              </Button>
            )}
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 border-y border-rule sm:grid-cols-4">
          {[
            { label: 'Dans le pipeline', value: active.length },
            { label: 'À faire aujourd’hui', value: dueToday },
            { label: 'En retard', value: overdue, alert: overdue > 0 },
            { label: 'Non pertinents', value: views.length - active.length },
          ].map((stat) => (
            <div key={stat.label} className="border-rule py-4 pr-4 even:border-l even:pl-4 sm:border-l sm:pl-4 sm:first:border-l-0 sm:first:pl-0">
              <dt className="font-sans text-label uppercase tracking-tag text-ink-muted">{stat.label}</dt>
              <dd className={`mt-1 font-heading text-[1.75rem] font-extrabold leading-none ${stat.alert ? 'text-accent' : 'text-ink'}`}>
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
          <label className="flex min-w-[min(100%,20rem)] flex-1 items-center gap-3 border-b border-rule py-2 transition-colors focus-within:border-accent sm:flex-none">
            <span className="font-sans text-label uppercase tracking-tag text-ink-muted">Chercher</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Entreprise, nom, besoin…"
              className="min-h-9 w-full bg-transparent text-small text-ink outline-none placeholder:text-ink-muted"
            />
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-small text-ink-body">
            <input
              type="checkbox"
              checked={dueOnly}
              onChange={(event) => setDueOnly(event.target.checked)}
              className="size-4 accent-[var(--ink)]"
            />
            Seulement les actions dues
          </label>
        </div>

        {storeKind === 'memoire' && (
          <p className="mt-6 max-w-[80ch] border-l-2 border-ink pl-4 text-small text-ink-body">
            <strong className="text-ink">Mode démonstration.</strong> Supabase n’est pas configuré : les fiches
            sont des exemples fictifs, gardés en mémoire et effacés au redémarrage du serveur. Exécutez{' '}
            <code className="font-mono text-[0.8125rem]">supabase/crm_prospects.sql</code> et définissez les
            variables Supabase pour les conserver.
          </p>
        )}

        <div role="status" aria-live="polite" className="min-h-6 pt-4">
          {notice && (
            <p className={`flex items-start gap-3 text-small ${notice.tone === 'error' ? 'text-accent' : 'text-ink'}`}>
              <span>{notice.text}</span>
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="shrink-0 text-ink-muted underline-offset-2 hover:text-ink hover:underline"
              >
                Fermer
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="mt-2 overflow-x-auto pb-6">
        <div className="mx-auto flex w-max min-w-full max-w-none gap-4 px-4 sm:px-6 lg:px-8 2xl:justify-center">
          {columns.map(({ stage, views: cards }) => (
            <section
              key={stage}
              aria-labelledby={`colonne-${stage}`}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
                if (dropTarget !== stage) setDropTarget(stage);
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropTarget(null);
              }}
              onDrop={(event) => {
                event.preventDefault();
                onDrop(stage, event.dataTransfer.getData('text/plain'));
              }}
              className={`flex w-[19rem] shrink-0 flex-col border-t-2 transition-colors ${
                dropTarget === stage ? 'border-accent bg-ink/[0.06]' : 'border-ink bg-ink/[0.025]'
              } ${stage === 'non_pertinent' ? 'opacity-90' : ''}`}
            >
              <header className="px-3 pt-3 pb-2">
                <h2 id={`colonne-${stage}`} className="flex items-baseline justify-between gap-2 font-heading text-small font-bold text-ink">
                  {STAGE_LABELS[stage]}
                  <span className="font-mono text-[0.75rem] font-normal text-ink-muted">{cards.length}</span>
                </h2>
                {COLUMN_NOTES[stage] && <p className="mt-1 text-[0.75rem] leading-5 text-ink-muted">{COLUMN_NOTES[stage]}</p>}
              </header>

              <ol className="flex min-h-40 flex-1 flex-col gap-3 px-3 pb-3">
                {cards.map((view) => (
                  <li key={view.prospect.id}>
                    <ProspectCard
                      view={view}
                      today={today}
                      onStep={(action) => step(view.prospect, action)}
                      onMove={(to) => move(view.prospect, to)}
                      onEdit={() => setEditing(view.prospect)}
                      onDelete={() => remove(view.prospect)}
                    />
                  </li>
                ))}
                {cards.length === 0 && (
                  <li className="border border-dashed border-rule px-3 py-6 text-center text-[0.8125rem] text-ink-muted">
                    {dueOnly || search ? 'Rien ici avec ces filtres.' : 'Aucune fiche.'}
                  </li>
                )}
              </ol>
            </section>
          ))}
        </div>
      </div>

      {editing && (
        <ProspectDialog
          prospect={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(prospect, text) => {
            replace(prospect);
            setEditing(null);
            setNotice({ tone: 'ok', text });
          }}
        />
      )}

      {importing && (
        <ImportDialog
          onClose={() => setImporting(false)}
          onImported={(result) => {
            imported(result);
            if (result.ok) setImporting(false);
          }}
        />
      )}
    </div>
  );
}
