import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — NASSFLOW AGENCY',
  description:
    'Politique de confidentialité et traitement des données personnelles par NASSFLOW AGENCY',
  alternates: { canonical: '/confidentialite' },
};

export default function PolitiqueConfidentialite() {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto max-w-[68ch] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-10 sm:mb-12">
          <h1 className="font-[family-name:var(--font-archivo)] text-[clamp(2rem,7vw,3rem)] font-extrabold leading-[1.0] tracking-[-0.035em] text-[var(--ink)]">
            Politique de confidentialité
          </h1>

          <p className="mt-4 max-w-[720px] text-[1.125rem] leading-[1.6] text-[var(--ink-body)]">
            NASSFLOW AGENCY s&apos;engage à respecter votre vie privée et à
            protéger vos données personnelles.
          </p>
        </div>

        <div className="text-[1.125rem] leading-[1.6] text-[var(--ink-body)]">
          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Responsable de traitement
            </h2>

            <p>
              <span className="text-[var(--ink-muted)]">Responsable :</span>{' '}
              <span className="text-[var(--ink)]">Nasser Aboudou</span>
            </p>

            <p className="mt-2">
              <span className="text-[var(--ink-muted)]">Adresse :</span>{' '}
              <span className="text-[var(--ink)]">
                70 avenue Rhin et Danube, 86000 Poitiers, France
              </span>
            </p>

            <p className="mt-2">
              <span className="text-[var(--ink-muted)]">Contact :</span>{' '}
              <span className="break-words text-[var(--ink)]">
                contact@nassflow.com
              </span>
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Données collectées
            </h2>

            <p>
              Le formulaire de demande de diagnostic collecte : nom et prénom,
              société, adresse e-mail professionnelle, numéro de téléphone,
              volume de demandes de cotation reçues par jour, localisation
              actuelle de vos tarifs, TMS utilisé, activité principale et
              message libre.
            </p>

            <p className="mt-3">
              Aucune donnée n&apos;est collectée à votre insu et aucun traceur
              publicitaire n&apos;est déposé.
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Finalités du traitement
            </h2>

            <p>
              Les données servent uniquement à vous recontacter au sujet de
              votre demande de diagnostic et à préparer la proposition
              correspondante.
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Base légale
            </h2>

            <p>
              Le traitement repose sur l&apos;intérêt légitime du responsable
              de traitement à répondre à une demande professionnelle émanant
              d&apos;un prospect ayant volontairement transmis ses coordonnées.
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Durée de conservation
            </h2>

            <p>
              Les données sont conservées trois ans à compter du dernier
              contact, puis supprimées. Elles sont supprimées plus tôt sur
              simple demande écrite.
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Sous-traitants et hébergement
            </h2>

            <p>
              Le site est servi par une infrastructure internationale (Vercel
              Inc., États-Unis).
            </p>

            <p className="mt-3">
              Les données du formulaire, elles, sont stockées et traitées par
              Supabase au sein de l&apos;Union européenne (région West EU -
              Ireland, eu-west-1). Si un transfert hors de l&apos;Union
              européenne est nécessaire, il est encadré par des clauses
              contractuelles types.
            </p>

            <p className="mt-3">
              Aucune donnée n&apos;est cédée, revendue ou mutualisée avec un
              tiers à des fins commerciales.
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Vos droits
            </h2>

            <p>
              Vous disposez d&apos;un droit d&apos;accès, de rectification,
              d&apos;effacement, d&apos;opposition, de limitation et de
              portabilité de vos données.
            </p>

            <p className="mt-3">
              Ces droits s&apos;exercent par écrit à l&apos;adresse :
              <br />
              <span className="break-words font-semibold text-[var(--ink)]">
                contact@nassflow.com
              </span>
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Réclamation
            </h2>

            <p>
              Si vous estimez, après nous avoir contactés, que vos droits ne
              sont pas respectés, vous pouvez adresser une réclamation à la
              Commission nationale de l&apos;informatique et des libertés, 3
              place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Modifications
            </h2>

            <p>
              Cette politique de confidentialité peut être mise à jour à tout
              moment. Les modifications entreront en vigueur dès leur
              publication. Nous vous encourageons à consulter régulièrement
              cette page.
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