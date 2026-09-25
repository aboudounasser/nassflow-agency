import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Mentions légales — NASSFLOW AGENCY',
  description:
    'Mentions légales et informations légales du site NASSFLOW AGENCY',
  alternates: { canonical: '/mentions-legales' },
};

export default function MentionsLegales() {
  return (
    <main id="contenu" className="flex-1">
      <div className="mx-auto max-w-[68ch] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-10 sm:mb-12">
          <h1 className="font-sans text-[clamp(2rem,7vw,3rem)] font-extrabold leading-[1.0] tracking-[-0.035em] text-ink">
            Mentions légales
          </h1>

          <p className="mt-4 max-w-[680px] text-body text-ink-body">
            Informations légales et réglementaires relatives au site NASSFLOW
            AGENCY.
          </p>
        </div>

        <div className="text-body text-ink-body">
          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Éditeur du site
            </h2>

            <div className="space-y-2">
              <p>
                <span className="text-ink-muted">Dénomination :</span>{' '}
                <span className="text-ink">Nasser Aboudou</span>
              </p>

              <p>
                <span className="text-ink-muted">Forme juridique :</span>{' '}
                <span className="text-ink">
                  Entrepreneur individuel
                </span>
              </p>

              <p>
                <span className="text-ink-muted">Adresse :</span>{' '}
                <span className="text-ink">
                  70 avenue Rhin et Danube, 86000 Poitiers, France
                </span>
              </p>

              <p>
                <span className="text-ink-muted">SIREN :</span>{' '}
                <span className="text-ink">105 022 537</span>
              </p>
            </div>
          </section>

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Responsable de publication
            </h2>

            <p>
              <span className="text-ink-muted">Directeur publication :</span>{' '}
              <span className="text-ink">Nasser Aboudou</span>
            </p>

            <p className="mt-2">
              <span className="text-ink-muted">Email :</span>{' '}
              <span className="break-words text-ink">
                contact@nassflow.com
              </span>
            </p>

            <p className="mt-2">
              <span className="text-ink-muted">Téléphone :</span>{' '}
              <span className="text-ink">06 56 76 51 28</span>
            </p>
          </section>

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Hébergeur
            </h2>

            <div className="space-y-2">
              <p>
                <span className="text-ink-muted">Prestataire :</span>{' '}
                <span className="text-ink">Vercel Inc.</span>
              </p>

              <p>
                <span className="text-ink-muted">Adresse :</span>{' '}
                <span className="text-ink">
                  440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
                </span>
              </p>
            </div>
          </section>

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
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

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
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

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Modifications
            </h2>

            <p>
              NASSFLOW AGENCY se réserve le droit de modifier les présentes
              mentions légales à tout moment. Les modifications entreront en
              vigueur dès leur publication.
            </p>
          </section>

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Droit applicable
            </h2>

            <p>
              Les présentes mentions légales sont régies par la loi française.
              Tout litige sera soumis aux tribunaux français.
            </p>
          </section>

          <div className="border-t border-rule pt-8 sm:mt-12">
            <p className="text-[0.875rem] leading-6 text-ink-muted">
              Dernière mise à jour : septembre 2026
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <Button href="/" variant="secondary">
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    </main>
  );
}