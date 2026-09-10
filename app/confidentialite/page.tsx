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
    <main className="min-h-screen bg-[#0A0D12] text-[#F4F7FA]">
      <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="mb-10 sm:mb-12">
          <h1 className="font-[family-name:var(--font-sora)] text-[clamp(2.2rem,9vw,3rem)] font-semibold leading-[1.05] tracking-[-0.05em] text-[#F4F7FA] sm:text-5xl">
            Politique de confidentialité
          </h1>

          <p className="mt-4 max-w-[720px] text-sm leading-6 text-[#8E98A3] sm:text-base sm:leading-7">
            NASSFLOW AGENCY s&apos;engage à respecter votre vie privée et à
            protéger vos données personnelles.
          </p>
        </div>

        <div className="space-y-6 text-[0.94rem] leading-7 text-[#CDD5DD] sm:space-y-8 sm:text-[0.95rem]">
          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
              Responsable de traitement
            </h2>

            <p>
              <span className="text-[#8E98A3]">Responsable :</span>{' '}
              <span className="text-[#CDD5DD]">Nasser Aboudou</span>
            </p>

            <p className="mt-2">
              <span className="text-[#8E98A3]">Adresse :</span>{' '}
              <span className="text-[#CDD5DD]">
                70 avenue Rhin et Danube, 86000 Poitiers, France
              </span>
            </p>

            <p className="mt-2">
              <span className="text-[#8E98A3]">Contact :</span>{' '}
              <span className="break-words text-[#CDD5DD]">
                contact@nassflow.com
              </span>
            </p>
          </section>

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
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

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
              Finalités du traitement
            </h2>

            <p>
              Les données servent uniquement à vous recontacter au sujet de
              votre demande de diagnostic et à préparer la proposition
              correspondante.
            </p>
          </section>

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
              Base légale
            </h2>

            <p>
              Le traitement repose sur l&apos;intérêt légitime du responsable
              de traitement à répondre à une demande professionnelle émanant
              d&apos;un prospect ayant volontairement transmis ses coordonnées.
            </p>
          </section>

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
              Durée de conservation
            </h2>

            <p>
              Les données sont conservées trois ans à compter du dernier
              contact, puis supprimées. Elles sont supprimées plus tôt sur
              simple demande écrite.
            </p>
          </section>

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
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

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
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
              <span className="font-medium break-words text-[#CDD5DD]">
                contact@nassflow.com
              </span>
            </p>
          </section>

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
              Réclamation
            </h2>

            <p>
              Si vous estimez, après nous avoir contactés, que vos droits ne
              sont pas respectés, vous pouvez adresser une réclamation à la
              Commission nationale de l&apos;informatique et des libertés, 3
              place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.
            </p>
          </section>

          <section className="border-l-2 border-[#2A333C] py-4 pl-4 sm:pl-6">
            <h2 className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.85rem] sm:tracking-[0.16em]">
              Modifications
            </h2>

            <p>
              Cette politique de confidentialité peut être mise à jour à tout
              moment. Les modifications entreront en vigueur dès leur
              publication. Nous vous encourageons à consulter régulièrement
              cette page.
            </p>
          </section>

          <div className="border-t border-[#1A2128] pt-6 sm:mt-12 sm:pt-8">
            <p className="text-[0.8rem] leading-5 text-[#8E98A3] sm:text-[0.85rem]">
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
    </main>
  );
}