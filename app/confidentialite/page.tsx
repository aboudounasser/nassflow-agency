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
          <h1 className="font-sans text-[clamp(2rem,7vw,3rem)] font-extrabold leading-[1.0] tracking-[-0.035em] text-ink">
            Politique de confidentialité
          </h1>

          <p className="mt-4 max-w-[720px] text-body text-ink-body">
            NASSFLOW AGENCY s&apos;engage à respecter votre vie privée et à
            protéger vos données personnelles.
          </p>
        </div>

        <div className="text-body text-ink-body">
          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Responsable de traitement
            </h2>

            <p>
              <span className="text-ink-muted">Responsable :</span>{' '}
              <span className="text-ink">Nasser Aboudou</span>
            </p>

            <p className="mt-2">
              <span className="text-ink-muted">Adresse :</span>{' '}
              <span className="text-ink">
                70 avenue Rhin et Danube, 86000 Poitiers, France
              </span>
            </p>

            <p className="mt-2">
              <span className="text-ink-muted">Contact :</span>{' '}
              <span className="break-words text-ink">
                contact@nassflow.com
              </span>
            </p>
          </section>

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Données collectées
            </h2>

            <p>
              Deux formulaires collectent des données sur ce site. Chacun
              indique quels champs sont facultatifs ; vous n&apos;êtes
              jamais tenu de renseigner les autres. L&apos;assistant IA,
              qui peut lui aussi transmettre une demande si vous le lui
              demandez, fait l&apos;objet de la section suivante.
            </p>

            <p className="mt-5 font-semibold text-ink">
              Formulaire « Démarrer un projet »
            </p>

            <p className="mt-2">
              Prénom, nom, entreprise, adresse e-mail professionnelle,
              numéro de téléphone, site web, nature de la solution
              recherchée, besoin principal, outils utilisés actuellement,
              budget envisagé, délai souhaité, message libre, et la manière
              dont vous avez connu NASSFLOW.
            </p>

            <p className="mt-5 font-semibold text-ink">
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

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              L&apos;assistant IA
            </h2>

            <p>
              Le site propose un assistant conversationnel. Il est signalé
              comme tel : vous parlez à une intelligence artificielle, pas
              à un membre de l&apos;équipe.
            </p>

            <p className="mt-3">
              Si vous l&apos;utilisez, vos messages sont transmis à{' '}
              <span className="font-semibold text-ink">OpenAI</span>{' '}
              (États-Unis), qui génère la réponse. C&apos;est le seul
              usage qui en est fait. NASSFLOW ne les enregistre pas : la
              conversation ne vit que dans l&apos;onglet de votre
              navigateur et disparaît dès que vous le rechargez ou le
              fermez. Elle n&apos;est écrite dans aucune base — sauf si
              vous nous la confiez vous-même, voir plus bas — et nous
              demandons à OpenAI de ne pas la conserver non plus.
            </p>

            <p className="mt-3">
              OpenAI indique que les données envoyées par son interface de
              programmation ne servent pas à entraîner ses modèles, sauf
              accord explicite — que nous n&apos;avons pas donné. Elle
              conserve en revanche jusqu&apos;à trente jours un journal
              destiné à détecter les usages abusifs, délai qu&apos;elle
              peut dépasser si la loi l&apos;y oblige.
            </p>

            <p className="mt-3">
              Une exception, et une seule : le bouton{' '}
              <span className="font-semibold text-ink">
                « Être recontacté »
              </span>
              . Si vous l&apos;utilisez, votre adresse e-mail, votre
              prénom et votre besoin nous sont transmis — et la
              conversation que vous venez d&apos;avoir y est jointe,
              pour que nous sachions de quoi vous avez parlé. Le tout
              est alors enregistré dans notre base (Supabase, Union
              européenne) et nous est envoyé par e-mail (Resend), comme
              les demandes déposées par les formulaires, et conservé
              aussi longtemps : trois ans à compter du dernier contact.
              Tant que vous ne cliquez pas sur ce bouton, rien de la
              conversation n&apos;est conservé.
            </p>

            <p className="mt-3">
              N&apos;indiquez pas d&apos;informations sensibles dans
              l&apos;assistant. Pour transmettre quoi que ce soit de
              confidentiel, écrivez-nous ou réservez un appel : ces
              échanges ne passent pas par lui.
            </p>
          </section>

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Mesure d&apos;audience
            </h2>

            <p>
              Le site utilise{' '}
              <span className="font-semibold text-ink">
                Vercel Web Analytics
              </span>{' '}
              pour compter les pages vues. Vercel indique que cette mesure
              n&apos;utilise aucun cookie tiers : un visiteur y est
              distingué par une empreinte calculée à partir de sa requête,
              et cette durée de session n&apos;est pas conservée — elle est
              automatiquement supprimée au bout de vingt-quatre heures.
              Aucun identifiant permettant de vous suivre d&apos;un site à
              l&apos;autre n&apos;est collecté, et les données ne sont
              exploitées que sous forme agrégée, sans être rattachées à une
              personne ni à une adresse IP.
            </p>

            <p className="mt-3">
              Chaque page vue peut être enregistrée avec l&apos;horodatage,
              l&apos;adresse de la page et les paramètres d&apos;URL filtrés,
              la page d&apos;où vous venez, une géolocalisation approximative
              (pays, région, ville), le système et la version de votre
              appareil, votre navigateur et sa version, le type
              d&apos;appareil, et la version du script de mesure.
            </p>
          </section>

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Finalités du traitement
            </h2>

            <p>
              Les données servent uniquement à vous recontacter au sujet de
              votre demande et à préparer la proposition correspondante.
            </p>
          </section>

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Base légale
            </h2>

            <p>
              Le traitement repose sur les mesures précontractuelles prises
              à votre demande (article 6.1.b du RGPD) : c&apos;est vous qui
              engagez l&apos;échange en nous écrivant, et les données servent
              à y répondre.
            </p>
          </section>

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Durée de conservation
            </h2>

            <p>
              Les données sont conservées trois ans à compter du dernier
              contact, puis supprimées. Elles sont supprimées plus tôt sur
              simple demande écrite.
            </p>
          </section>

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Sous-traitants et hébergement
            </h2>

            <p>
              <span className="font-semibold text-ink">Vercel Inc.</span>{' '}
              (États-Unis) héberge le site et le sert.
            </p>

            <p className="mt-3">
              <span className="font-semibold text-ink">Supabase</span>{' '}
              stocke les données des deux formulaires, au sein de l&apos;Union
              européenne (région West EU – Irlande, eu-west-1).
            </p>

            <p className="mt-3">
              <span className="font-semibold text-ink">Resend</span>{' '}
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
              <span className="font-semibold text-ink">Calendly</span>{' '}
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

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
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
              <span className="break-words font-semibold text-ink">
                contact@nassflow.com
              </span>
            </p>
          </section>

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Réclamation
            </h2>

            <p>
              Si vous estimez, après nous avoir contactés, que vos droits ne
              sont pas respectés, vous pouvez adresser une réclamation à la
              Commission nationale de l&apos;informatique et des libertés, 3
              place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.
            </p>
          </section>

          <section className="border-t border-rule py-9">
            <h2 className="mb-5 font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.025em] text-ink">
              Modifications
            </h2>

            <p>
              Cette politique de confidentialité peut être mise à jour à tout
              moment. Les modifications entreront en vigueur dès leur
              publication. Nous vous encourageons à consulter régulièrement
              cette page.
            </p>
          </section>

          <div className="border-t border-rule pt-8 sm:mt-12">
            <p className="text-[0.875rem] leading-6 text-ink-muted">
              Dernière mise à jour : 21 septembre 2026
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <Link
            href="/"
            className="inline-flex items-center border-b border-ink pb-1 font-sans text-[0.9375rem] font-semibold text-ink-body transition-colors duration-200 ease-out hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}