import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { checkCrmAccess } from '@/lib/crm/auth';
import { todayInParis } from '@/lib/crm/dates';
import { reconcile } from '@/lib/crm/prospect';
import { CrmStoreError, getCrmStore } from '@/lib/crm/store';
import type { Prospect } from '@/lib/crm/types';
import { CrmBoard } from './CrmBoard';

/**
 * Le CRM de prospection : un outil interne, pas une page du site.
 *
 * Protégé par CRM_PASSWORD (proxy.ts, puis revérifié ici et dans chaque
 * Server Action), absent du sitemap (app/sitemap.ts liste ses routes
 * une à une), non indexé. Sans mot de passe défini, il répond 404 en
 * production.
 */
export const metadata: Metadata = {
  title: 'CRM — prospection',
  robots: { index: false, follow: false },
};

export default async function CrmPage() {
  const access = checkCrmAccess((await headers()).get('authorization'));

  if (access !== 'granted') notFound();

  const today = todayInParis();
  let prospects: Prospect[] = [];
  let storeKind: 'supabase' | 'memoire' | null = null;
  let error: string | null = null;

  try {
    const store = getCrmStore();

    storeKind = store.kind;
    // La règle d'exclusion appliquée au score du jour : une règle de
    // scoring modifiée se voit tout de suite. La fiche est réécrite à
    // sa prochaine modification, qui repasse par la même règle.
    prospects = (await store.list()).map((prospect) => reconcile(prospect, today));
  } catch (caught) {
    error =
      caught instanceof CrmStoreError ? caught.message : 'Les fiches n’ont pas pu être chargées.';

    if (!(caught instanceof CrmStoreError)) console.error('CRM — chargement :', caught);
  }

  return (
    <main id="contenu" className="flex-1">
      <CrmBoard initialProspects={prospects} initialToday={today} storeKind={storeKind} loadError={error} />
    </main>
  );
}
