import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions légales — NASSFLOW AGENCY',
  description:
    'Mentions légales et informations légales du site NASSFLOW AGENCY',
};

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#F4F7FA]">
      <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="mb-10 sm:mb-12">
          <h1 className="font-[family-name:var(--font-sora)] text-[clamp(2.2rem,9vw,3rem)] font-semibold leading-[1.05] tracking-[-0.05em] text-[#F4F7FA] sm:text-5xl">
            Mentions légales
          </h1>

          <p className="mt-4 max-w-[680px] text-sm leading-6 text-[#8E98A3] sm:text-base sm:leading-7">
            Informations légales et réglementaires relatives au site NASSFLOW
            AGENCY.
          </p>
        </div>

        <div className="space-y-6 text-[0.94rem] leading-7 text-[#CDD5DD] sm:space-y-8 sm:text-[0.95rem]">
          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
              Éditeur du site
            </h2>

            <div className="space-y-2">
              <p>
                <span className="text-[#8E98A3]">Dénomination :</span>{' '}
                <span className="text-[#CDD5DD]">Nasser Aboudou</span>
              </p>

              <p>
                <span className="text-[#8E98A3]">Forme juridique :</span>{' '}
                <span className="text-[#CDD5DD]">
                  Entrepreneur individuel
                </span>
              </p>

              <p>
                <span className="text-[#8E98A3]">Adresse :</span>{' '}
                <span className="text-[#CDD5DD]">
                  70 avenue Rhin et Danube, 86000 Poitiers, France
                </span>
              </p>

              <p>
                <span className="text-[#8E98A3]">SIREN :</span>{' '}
                <span className="text-[#CDD5DD]">105 022 537</span>
              </p>
            </div>
          </section>

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
              Responsable de publication
            </h2>

            <p>
              <span className="text-[#8E98A3]">Directeur publication :</span>{' '}
              <span className="text-[#CDD5DD]">Nasser Aboudou</span>
            </p>

            <p className="mt-2">
              <span className="text-[#8E98A3]">Email :</span>{' '}
              <span className="text-[#CDD5DD] break-words">
                contact@nassflow.com
              </span>
            </p>

            <p className="mt-2">
              <span className="text-[#8E98A3]">Téléphone :</span>{' '}
              <span className="text-[#CDD5DD]">06 56 76 51 28</span>
            </p>
          </section>

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
              Hébergeur
            </h2>

            <div className="space-y-2">
              <p>
                <span className="text-[#8E98A3]">Prestataire :</span>{' '}
                <span className="text-[#CDD5DD]">Vercel Inc.</span>
              </p>

              <p>
                <span className="text-[#8E98A3]">Adresse :</span>{' '}
                <span className="text-[#CDD5DD]">
                  440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
                </span>
              </p>
            </div>
          </section>

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
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

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
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

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
              Modifications
            </h2>

            <p>
              NASSFLOW AGENCY se réserve le droit de modifier les présentes
              mentions légales à tout moment. Les modifications entreront en
              vigueur dès leur publication.
            </p>
          </section>

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
              Droit applicable
            </h2>

            <p>
              Les présentes mentions légales sont régies par la loi française.
              Tout litige sera soumis aux tribunaux français.
            </p>
          </section>

          <div className="border-t border-[#1A2128] pt-6 sm:mt-12 sm:pt-8">
            <p className="text-[0.8rem] leading-5 text-[#5A6268] sm:text-[0.85rem]">
              Dernière mise à jour : septembre 2026
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full border border-[#2A333C] px-4 py-2 text-[0.8rem] text-[#CDD5DD] transition-all duration-200 hover:border-[#7CC7FF] hover:text-[#F4F7FA]"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}