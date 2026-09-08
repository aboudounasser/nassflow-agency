import Link from 'next/link';
import { SectionShell } from '@/components/SectionShell';
import { ContactForm } from '@/components/ContactForm';

export const metadata = {
  title: 'Contact | NASSFLOW AGENCY',
  description:
    'Contactez l’équipe NASSFLOW pour une question, un besoin ou un imprévu.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0A0D12] text-[#F4F7FA]">
      <SectionShell className="py-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-[820px] px-1 sm:px-0">
          <Link
            href="/"
            className="mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-[#8E98A3] transition-colors hover:text-[#7CC7FF] sm:mb-14"
          >
            <span aria-hidden="true">←</span>
            Retour à l&apos;accueil
          </Link>

          <ContactForm />
        </div>
      </SectionShell>
    </main>
  );
}