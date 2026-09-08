
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { SectionLabel } from "@/components/SectionLabel";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";

export const metadata = {
  title: "Création de site internet moderne pour entreprise | NASSFLOW AGENCY",
  description:
    "NASSFLOW AGENCY conçoit des sites web modernes, rapides et sur mesure, connectés à l'IA, aux automatisations et aux outils de votre entreprise.",
};

const services = [
  {
    number: "01",
    title: "Site vitrine",
    description:
      "Un site professionnel qui présente clairement votre activité, vos services et votre proposition de valeur.",
  },
  {
    number: "02",
    title: "Refonte de site",
    description:
      "Une nouvelle expérience pour un site devenu vieillissant, peu performant ou difficile à faire évoluer.",
  },
  {
    number: "03",
    title: "Site web sur mesure",
    description:
      "Une interface conçue autour de vos besoins spécifiques plutôt qu'autour d'un modèle préfabriqué.",
  },
  {
    number: "04",
    title: "Expérience connectée",
    description:
      "Un site capable de communiquer avec vos outils, votre CRM, votre assistant IA, WhatsApp ou vos automatisations.",
  },
];

const steps = [
  {
    number: "01",
    title: "Comprendre",
    description:
      "Nous commençons par votre activité, vos objectifs, vos clients et vos besoins.",
  },
  {
    number: "02",
    title: "Concevoir",
    description:
      "Nous travaillons l'architecture, l'expérience utilisateur et l'identité visuelle pour créer une interface claire et cohérente.",
  },
  {
    number: "03",
    title: "Développer",
    description:
      "Nous transformons la conception en un site rapide, responsive et pensé pour fonctionner sur ordinateur, tablette et mobile.",
  },
  {
    number: "04",
    title: "Connecter",
    description:
      "Votre site peut être relié à vos outils, votre CRM, votre assistant IA, WhatsApp ou vos automatisations.",
  },
];

const systemLayers = [
  {
    label: "SITE",
    text: "Votre présence digitale.",
  },
  {
    label: "IA",
    text: "Un assistant qui accompagne vos visiteurs.",
  },
  {
    label: "WHATSAPP",
    text: "Un canal de conversation connecté à votre activité.",
  },
  {
    label: "AUTOMATISATION",
    text: "Des actions déclenchées sans intervention manuelle.",
  },
  {
    label: "OUTILS MÉTIER",
    text: "Vos applications et données connectées au même environnement.",
  },
];

export default function SiteWebPage() {
  return (
    <main className="min-h-screen bg-[#0A0D12] text-[#F4F7FA]">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#2A333C]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(124,199,255,0.09),transparent_38%)]" />

        <div className="relative mx-auto grid min-h-[78vh] max-w-[1280px] items-center gap-16 px-6 pb-20 pt-32 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <SectionLabel>CRÉATION DE SITE WEB</SectionLabel>

            <h1 className="mt-6 max-w-4xl font-[family-name:var(--font-sora)] text-4xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
              Un site web moderne qui devient une partie de votre système.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#CDD5DD]">
              Votre site ne devrait pas seulement présenter votre entreprise.
              Il devrait donner une première impression forte, guider vos
              visiteurs, faciliter les échanges et pouvoir évoluer avec votre
              activité.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#8E98A3]">
              NASSFLOW conçoit des sites web modernes, rapides et sur mesure,
              pensés pour s&apos;intégrer naturellement à votre environnement
              digital.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonPrimary href="/demarrer-un-projet">
                Démarrer un projet
              </ButtonPrimary>

              <ButtonSecondary href="/#systems">
                Découvrir le système
              </ButtonSecondary>
            </div>
          </div>

          {/* Architecture visual */}
          <div className="relative hidden min-h-[420px] lg:col-span-5 lg:block">
            <div className="absolute inset-8 rounded-[32px] border border-[#2A333C] bg-[#10161D]/80 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-[#2A333C] pb-4">
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs tracking-[0.18em] text-[#8E98A3]">
                  SYSTEM / WEB
                </span>
                <span className="h-2 w-2 rounded-full bg-[#7CC7FF]" />
              </div>

              <div className="flex h-[310px] items-center justify-center">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-[#7CC7FF]/40 bg-[#141B22] shadow-[0_0_80px_rgba(124,199,255,0.08)]">
                  <div className="absolute h-24 w-24 rounded-full border border-[#7CC7FF]/30" />
                  <span className="relative text-center font-[family-name:var(--font-ibm-plex-mono)] text-xs tracking-[0.12em] text-[#F4F7FA]">
                    SITE
                    <br />
                    WEB
                  </span>
                </div>

                <div className="absolute left-8 top-16 rounded-xl border border-[#2A333C] bg-[#141B22] px-4 py-3 text-xs text-[#CDD5DD]">
                  DESIGN
                </div>

                <div className="absolute right-8 top-20 rounded-xl border border-[#2A333C] bg-[#141B22] px-4 py-3 text-xs text-[#CDD5DD]">
                  IA
                </div>

                <div className="absolute bottom-12 left-12 rounded-xl border border-[#2A333C] bg-[#141B22] px-4 py-3 text-xs text-[#CDD5DD]">
                  OUTILS
                </div>

                <div className="absolute bottom-10 right-10 rounded-xl border border-[#2A333C] bg-[#141B22] px-4 py-3 text-xs text-[#CDD5DD]">
                  AUTOMATION
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-[#2A333C]">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionLabel>LE PROBLÈME</SectionLabel>

              <h2 className="mt-5 max-w-xl font-[family-name:var(--font-sora)] text-3xl font-medium leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                Votre site est souvent le premier contact avec votre
                entreprise.
              </h2>
            </div>

            <div className="lg:col-span-7">
              <p className="max-w-2xl text-lg leading-8 text-[#CDD5DD]">
                Un site vieillissant, difficile à utiliser ou déconnecté de
                vos outils peut rapidement devenir un frein.
              </p>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#8E98A3]">
                Nous concevons des expériences web qui donnent une image claire
                de votre activité et créent une base solide pour la suite.
              </p>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#8E98A3]">
                Que vous partiez de zéro ou que votre site actuel ait besoin
                d&apos;être repensé, nous construisons une solution adaptée à
                votre entreprise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="border-b border-[#2A333C]">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <SectionLabel>NOTRE APPROCHE</SectionLabel>

          <div className="mt-5 max-w-3xl">
            <h2 className="font-[family-name:var(--font-sora)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              De la première idée à un système web cohérent.
            </h2>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[#2A333C] bg-[#2A333C] md:grid-cols-2">
            {steps.map((step) => (
              <article key={step.number} className="bg-[#10161D] p-7 lg:p-9">
                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs tracking-[0.15em] text-[#7CC7FF]">
                  {step.number}
                </span>

                <h3 className="mt-5 font-[family-name:var(--font-sora)] text-2xl font-medium">
                  {step.title}
                </h3>

                <p className="mt-4 max-w-md leading-7 text-[#8E98A3]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-b border-[#2A333C]">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionLabel>CE QUE NOUS CRÉONS</SectionLabel>

              <h2 className="mt-5 font-[family-name:var(--font-sora)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                Une présence web pensée autour de votre activité.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {services.map((service) => (
                <article
                  key={service.number}
                  className="rounded-2xl border border-[#2A333C] bg-[#10161D] p-7 transition-colors duration-200 hover:border-[#465461]"
                >
                  <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs tracking-[0.15em] text-[#7CC7FF]">
                    {service.number}
                  </span>

                  <h3 className="mt-5 font-[family-name:var(--font-sora)] text-xl font-medium">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-[#8E98A3]">
                    {service.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* System */}
      <section className="border-b border-[#2A333C]">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <SectionLabel>LE SITE COMME SYSTÈME</SectionLabel>

            <h2 className="mx-auto mt-5 max-w-3xl font-[family-name:var(--font-sora)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Un site. Plusieurs possibilités.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#8E98A3]">
              Un site web peut rester un simple point de contact. Mais il peut
              aussi devenir le point de départ de tout un système.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-2xl border border-[#2A333C] bg-[#10161D]">
            {systemLayers.map((layer, index) => (
              <div
                key={layer.label}
                className={`flex gap-6 p-6 sm:items-center sm:p-7 ${
                  index !== systemLayers.length - 1
                    ? "border-b border-[#2A333C]"
                    : ""
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#7CC7FF]/30 bg-[#141B22]">
                  <span className="h-2 w-2 rounded-full bg-[#7CC7FF]" />
                </div>

                <div>
                  <div className="font-[family-name:var(--font-ibm-plex-mono)] text-xs tracking-[0.14em] text-[#7CC7FF]">
                    {layer.label}
                  </div>

                  <p className="mt-1 text-sm leading-6 text-[#CDD5DD]">
                    {layer.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="border-b border-[#2A333C]">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionLabel>POURQUOI NASSFLOW</SectionLabel>

              <h2 className="mt-5 font-[family-name:var(--font-sora)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                Pas seulement un site.
              </h2>
            </div>

            <div className="space-y-10 lg:col-span-7">
              <div>
                <h3 className="font-[family-name:var(--font-sora)] text-2xl font-medium">
                  Une conception sur mesure.
                </h3>
                <p className="mt-3 max-w-2xl leading-7 text-[#8E98A3]">
                  Votre entreprise n&apos;est pas un modèle. Nous adaptons la
                  structure, l&apos;expérience et les fonctionnalités à vos
                  objectifs.
                </p>
              </div>

              <div>
                <h3 className="font-[family-name:var(--font-sora)] text-2xl font-medium">
                  Une base prête pour la suite.
                </h3>
                <p className="mt-3 max-w-2xl leading-7 text-[#8E98A3]">
                  Votre site peut être conçu dès le départ pour accueillir de
                  nouvelles briques : IA, automatisation, intégrations ou
                  outils métier.
                </p>
              </div>

              <div>
                <h3 className="font-[family-name:var(--font-sora)] text-2xl font-medium">
                  Un système plutôt qu&apos;un empilement d&apos;outils.
                </h3>
                <p className="mt-3 max-w-2xl leading-7 text-[#8E98A3]">
                  Nous réfléchissons à la manière dont votre site peut
                  s&apos;intégrer dans votre activité actuelle et évoluer avec
                  elle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="rounded-3xl border border-[#2A333C] bg-[#10161D] px-6 py-16 text-center sm:px-10 lg:px-16 lg:py-20">
            <SectionLabel>PROCHAIN PROJET</SectionLabel>

            <h2 className="mx-auto mt-5 max-w-3xl font-[family-name:var(--font-sora)] text-3xl font-medium tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Votre prochain site peut faire beaucoup plus.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-7 text-[#8E98A3]">
              Si vous avez besoin d&apos;un nouveau site ou si votre site
              actuel ne correspond plus à votre entreprise, parlons-en.
            </p>

            <div className="mt-9 flex justify-center">
              <ButtonPrimary href="/demarrer-un-projet">
                Démarrer un projet
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}