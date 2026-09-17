import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions légales — NASSFLOW AGENCY',
  description:
    'Mentions légales et informations légales du site NASSFLOW AGENCY',
  alternates: { canonical: '/mentions-legales' },
};

export default function MentionsLegales() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[68ch] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-10 sm:mb-12">
          <h1 className="font-[family-name:var(--font-archivo)] text-[clamp(2rem,7vw,3rem)] font-extrabold leading-[1.0] tracking-[-0.035em] text-[var(--ink)]">
            Mentions légales
          </h1>

          <p className="mt-4 max-w-[680px] text-[1.125rem] leading-[1.6] text-[var(--ink-body)]">
            Informations légales et réglementaires relatives au site NASSFLOW
            AGENCY.
          </p>
        </div>

        <div className="text-[1.125rem] leading-[1.6] text-[var(--ink-body)]">
          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Éditeur du site
            </h2>

            <div className="space-y-2">
              <p>
                <span className="text-[var(--ink-muted)]">Dénomination :</span>{' '}
                <span className="text-[var(--ink)]">Nasser Aboudou</span>
              </p>

              <p>
                <span className="text-[var(--ink-muted)]">Forme juridique :</span>{' '}
                <span className="text-[var(--ink)]">
                  Entrepreneur individuel
                </span>
              </p>

              <p>
                <span className="text-[var(--ink-muted)]">Adresse :</span>{' '}
                <span className="text-[var(--ink)]">
                  70 avenue Rhin et Danube, 86000 Poitiers, France
                </span>
              </p>

              <p>
                <span className="text-[var(--ink-muted)]">SIREN :</span>{' '}
                <span className="text-[var(--ink)]">105 022 537</span>
              </p>
            </div>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Responsable de publication
            </h2>

            <p>
              <span className="text-[var(--ink-muted)]">Directeur publication :</span>{' '}
              <span className="text-[var(--ink)]">Nasser Aboudou</span>
            </p>

            <p className="mt-2">
              <span className="text-[var(--ink-muted)]">Email :</span>{' '}
              <span className="break-words text-[var(--ink)]">
                contact@nassflow.com
              </span>
            </p>

            <p className="mt-2">
              <span className="text-[var(--ink-muted)]">Téléphone :</span>{' '}
              <span className="text-[var(--ink)]">06 56 76 51 28</span>
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Hébergeur
            </h2>

            <div className="space-y-2">
              <p>
                <span className="text-[var(--ink-muted)]">Prestataire :</span>{' '}
                <span className="text-[var(--ink)]">Vercel Inc.</span>
              </p>

              <p>
                <span className="text-[var(--ink-muted)]">Adresse :</span>{' '}
                <span className="text-[var(--ink)]">
                  440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
                </span>
              </p>
            </div>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Propriété intellectuelle
            </h2>

            <p>
              L&apos;ensemble des contenus présents sur ce site — textes,
              structures, éléments graphiques, marques et logotypes — est
              protégé par le droit de la propriété intellectuelle et demeure
              la propriété exclusive de l&apos;éditeur.
            </p>

            <p className="mt-3">
              Toute reproduction, représentation, adaptation ou exploitation,
              totale ou partielle, sans autorisation écrite préalable, est
              interdite.
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Limitation de responsabilité
            </h2>

            <p>
              NASSFLOW AGENCY s&apos;efforce de maintenir les informations
              contenues sur ce site à jour et exactes. Cependant, elle ne
              garantit pas l&apos;exactitude, la complétude ou la pertinence
              des informations. L&apos;accès au site se fait à titre gratuit et
              aux risques de l&apos;utilisateur.
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Modifications
            </h2>

            <p>
              NASSFLOW AGENCY se réserve le droit de modifier les présentes
              mentions légales à tout moment. Les modifications entreront en
              vigueur dès leur publication.
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Droit applicable
            </h2>

            <p>
              Les présentes mentions légales sont régies par la loi française.
              Tout litige sera soumis aux tribunaux français.
            </p>
          </section>

          <div className="border-t border-[var(--rule)] pt-8 sm:mt-12">
            <p className="text-[0.875rem] leading-6 text-[var(--ink-muted)]">
              Dernière mise à jour : septembre 2026
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <Link
            href="/"
            className="inline-flex items-center border-b border-[var(--ink)] pb-1 font-[family-name:var(--font-archivo)] text-[0.9375rem] font-semibold text-[var(--ink-body)] transition-colors duration-200 ease-out hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}