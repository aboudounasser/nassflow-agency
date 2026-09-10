import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionShell } from '@/components/SectionShell';
import { ContactForm } from '@/components/ContactForm';
import { SectionLabel } from '@/components/SectionLabel';
import { Reveal } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Contact | NASSFLOW AGENCY',
  description:
    'Contactez l’équipe NASSFLOW pour une question, un besoin ou un imprévu.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0A0D12] text-[#F4F7FA]">
      <SectionShell className="py-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-[820px] px-1 sm:px-0">
          <Link
            href="/"
            className="group mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-[#8E98A3] transition-colors hover:text-[#7CC7FF] sm:mb-14"
          >
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
            >
              ←
            </span>
            Retour à l&apos;accueil
          </Link>

          {/* La page ne portait aucun titre de niveau 1 : le titre et
              l'intro n'avaient pas suivi lors du découpage en pages. */}
          <Reveal onMount className="mb-10 sm:mb-12">
            <SectionLabel>Contacter l&apos;équipe</SectionLabel>

            <h1 className="mt-5 max-w-[680px] font-[family-name:var(--font-sora)] text-[clamp(2rem,8vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.045em] text-[#F4F7FA] sm:mt-6">
              Une question, un besoin ou un imprévu ?
            </h1>

            <p className="mt-4 max-w-[560px] text-base leading-7 text-[#8E98A3] sm:mt-5">
              Écrivez-nous directement. L&apos;équipe NASSFLOW vous répondra
              au sujet de votre demande. Pour un projet complet,{' '}
              <Link
                href="/demarrer-un-projet"
                className="text-[#7CC7FF] link-underline"
              >
                remplissez plutôt le formulaire projet
              </Link>
              .
            </p>
          </Reveal>

          <Reveal preset="soft" delay={0.12}>
            <ContactForm />
          </Reveal>
        </div>
      </SectionShell>
    </main>
  );
}
