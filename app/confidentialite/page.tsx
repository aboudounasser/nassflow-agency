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
    <main className="flex-1">
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
              Deux formulaires collectent des données sur ce site, et eux
              seuls. Chacun indique quels champs sont facultatifs ; vous
              n&apos;êtes jamais tenu de renseigner les autres.
            </p>

            <p className="mt-5 font-semibold text-[var(--ink)]">
              Formulaire « Démarrer un projet »
            </p>

            <p className="mt-2">
              Prénom, nom, entreprise, adresse e-mail professionnelle,
              numéro de téléphone, site web, nature de la solution
              recherchée, besoin principal, outils utilisés actuellement,
              budget envisagé, délai souhaité, message libre, et la manière
              dont vous avez connu NASSFLOW.
            </p>

            <p className="mt-5 font-semibold text-[var(--ink)]">
              Formulaires des fiches solution
            </p>

            <p className="mt-2">
              Entreprise, nom du contact, adresse e-mail, numéro de
              téléphone et secteur d&apos;activité, auxquels s&apos;ajoutent
              vos réponses aux questions propres à la solution demandée.
              Ces questions portent sur votre organisation actuelle — par
              exemple le volume de demandes reçues, les canaux par lesquels
              vos clients vous écrivent, l&apos;agenda ou la messagerie que
              vous utilisez, les outils en place ou ce qui fait varier vos
              prix. Elles changent d&apos;une solution à l&apos;autre, et la
              page que vous remplissez les affiche toutes avant envoi. Le
              chemin de cette page est enregistré avec votre demande, afin
              de savoir à quelle solution elle se rapporte.
            </p>

            <p className="mt-5">
              Aucune donnée n&apos;est collectée à votre insu et aucun traceur
              publicitaire n&apos;est déposé. Le site ne dépose aucun cookie
              de mesure d&apos;audience.
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Finalités du traitement
            </h2>

            <p>
              Les données servent uniquement à vous recontacter au sujet de
              votre demande et à préparer la proposition correspondante.
            </p>
          </section>

          <section className="border-t border-[var(--rule)] py-9">
            <h2 className="mb-5 font-[family-name:var(--font-archivo)] text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-[var(--ink)]">
              Base légale
            </h2>

            <p>
              Le traitement repose sur les mesures précontractuelles prises
              à votre demande (article 6.1.b du RGPD) : c&apos;est vous qui
              engagez l&apos;échange en nous écrivant, et les données servent
              à y répondre.
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
              <span className="font-semibold text-[var(--ink)]">Vercel Inc.</span>{' '}
              (États-Unis) héberge le site et le sert.
            </p>

            <p className="mt-3">
              <span className="font-semibold text-[var(--ink)]">Supabase</span>{' '}
              stocke les données des deux formulaires, au sein de l&apos;Union
              européenne (région West EU – Irlande, eu-west-1).
            </p>

            <p className="mt-3">
              <span className="font-semibold text-[var(--ink)]">Resend</span>{' '}
              (États-Unis) achemine l&apos;e-mail qui nous prévient
              qu&apos;une demande vient d&apos;arriver. Cet e-mail ne
              concerne que le formulaire « Démarrer un projet », et il en
              reprend l&apos;intégralité des champs : identité, entreprise,
              adresse e-mail, téléphone, site web, solution recherchée,
              besoin, outils, budget, délai, message et provenance. Votre
              adresse e-mail y sert aussi d&apos;adresse de réponse. Les
              demandes déposées depuis une fiche solution ne passent pas
              par Resend.
            </p>

            <p className="mt-3">
              <span className="font-semibold text-[var(--ink)]">Calendly</span>{' '}
              (États-Unis) gère la prise de rendez-vous. Si vous réservez un
              appel, vous saisissez vos données directement chez Calendly,
              sur son propre site : elles relèvent alors de sa politique de
              confidentialité, et non de celle-ci.
            </p>

            <p className="mt-3">
              Les transferts hors de l&apos;Union européenne qu&apos;impliquent
              Vercel, Resend et Calendly sont encadrés par des clauses
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
              Dernière mise à jour : 20 septembre 2026
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