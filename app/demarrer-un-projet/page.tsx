'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { SectionShell } from '@/components/SectionShell';
import { supabase } from '@/lib/supabase/client';

export default function DemarrerUnProjetPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccess(false);
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    const company = String(formData.get('company') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();

    let website = String(formData.get('website') ?? '').trim();

    if (website && !/^https?:\/\//i.test(website)) {
      website = `https://${website}`;
    }

    const solution = String(formData.get('solution') ?? '').trim();
    const need = String(formData.get('need') ?? '').trim();
    const tools = String(formData.get('tools') ?? '').trim();
    const budget = String(formData.get('budget') ?? '').trim();
    const timeline = String(formData.get('timeline') ?? '').trim();

    const message = String(formData.get('message') ?? '').trim();
    const source = String(formData.get('source') ?? '').trim();

    const { error: insertError } = await supabase
      .from('project_requests')
      .insert({
        first_name: firstName,
        last_name: lastName,
        company,
        professional_email: email,
        phone,
        website: website || null,
        solution,
        main_need: need,
        current_tools: tools || null,
        budget,
        timeline,
        project_description: message,
        source: source || null,
      });

    if (insertError) {
      console.error('Supabase insert error:', insertError);

      setError(
        'Une erreur est survenue lors de l’envoi. Vérifiez votre connexion puis réessayez.',
      );

      setIsSubmitting(false);
      return;
    }

    try {
      const notificationResponse = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'project',
          data: {
            first_name: firstName,
            last_name: lastName,
            company,
            professional_email: email,
            phone,
            website,
            solution,
            main_need: need,
            current_tools: tools,
            budget,
            timeline,
            project_description: message,
            source,
          },
        }),
      });

      if (!notificationResponse.ok) {
        console.error(
          'Notification e-mail non envoyée:',
          await notificationResponse.text(),
        );
      }
    } catch (notificationError) {
      console.error(
        'Erreur lors de la notification e-mail:',
        notificationError,
      );
    }

    form.reset();
    setSuccess(true);
    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#0A0D12] text-[#F4F7FA]">
      <SectionShell className="py-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-[900px] px-1 sm:px-0">
          <Link
            href="/"
            className="mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-[#8E98A3] transition-colors hover:text-[#7CC7FF] sm:mb-14"
          >
            <span aria-hidden="true">←</span>
            Retour à l&apos;accueil
          </Link>

          <div className="mb-10 sm:mb-14 lg:mb-16">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:text-[0.72rem] sm:tracking-[0.16em]">
              Démarrer un projet
            </p>

            <h1 className="mt-5 max-w-[800px] font-[family-name:var(--font-sora)] text-[clamp(2.2rem,9vw,4rem)] font-semibold leading-[1.05] tracking-[-0.05em] text-[#F4F7FA] sm:mt-6 sm:text-5xl sm:leading-[1.05] lg:text-[4rem]">
              Construisons votre système intelligent.
            </h1>

            <p className="mt-5 max-w-[620px] text-base leading-7 text-[#8E98A3] sm:mt-6 sm:text-[1.05rem]">
              Présentez-nous votre entreprise, votre besoin et ce que vous
              souhaitez améliorer. Nous étudierons votre projet pour définir
              la solution la plus adaptée.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-[#2A333C]"
          >
            <div className="border-b border-[#2A333C] py-7 sm:py-8">
              <p className="mb-5 text-[0.68rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:mb-6 sm:text-[0.72rem] sm:tracking-[0.16em]">
                01 — Votre entreprise
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
                <div className="border-b border-[#2A333C] py-5 sm:border-b-0">
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                  >
                    Prénom
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    placeholder="Votre prénom"
                    className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C]"
                  />
                </div>

                <div className="border-b border-[#2A333C] py-5 sm:border-b-0">
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                  >
                    Nom
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    placeholder="Votre nom"
                    className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C]"
                  />
                </div>

                <div className="border-b border-[#2A333C] py-5">
                  <label
                    htmlFor="company"
                    className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                  >
                    Entreprise
                  </label>

                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    autoComplete="organization"
                    placeholder="Nom de votre entreprise"
                    className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C]"
                  />
                </div>

                <div className="border-b border-[#2A333C] py-5">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                  >
                    E-mail professionnel
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="vous@entreprise.com"
                    className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C]"
                  />
                </div>

                <div className="border-b border-[#2A333C] py-5 sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                  >
                    Téléphone
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="Votre numéro de téléphone"
                    className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C]"
                  />
                </div>

                <div className="py-5 sm:col-span-2">
                  <label
                    htmlFor="website"
                    className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                  >
                    Site web
                    <span className="ml-2 normal-case tracking-normal text-[#5F6973]">
                      (facultatif)
                    </span>
                  </label>

                  <input
                    id="website"
                    name="website"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="https://votre-site.com"
                    className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C]"
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-[#2A333C] py-7 sm:py-8">
              <p className="mb-5 text-[0.68rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:mb-6 sm:text-[0.72rem] sm:tracking-[0.16em]">
                02 — Votre projet
              </p>

              <div className="space-y-8 sm:space-y-9">
                <div>
                  <label
                    htmlFor="solution"
                    className="mb-3 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                  >
                    Que souhaitez-vous mettre en place ?
                  </label>

                  <select
                    id="solution"
                    name="solution"
                    required
                    defaultValue=""
                    className="min-h-12 w-full border-b border-[#2A333C] bg-transparent py-3 text-base text-[#CDD5DD] outline-none transition-colors focus:border-[#7CC7FF]"
                  >
                    <option value="" disabled className="bg-[#10161D]">
                      Sélectionnez une solution
                    </option>

                    <option value="website" className="bg-[#10161D]">
                      Site web
                    </option>

                    <option value="ai-assistant" className="bg-[#10161D]">
                      Assistant IA
                    </option>

                    <option value="whatsapp-ai" className="bg-[#10161D]">
                      WhatsApp IA
                    </option>

                    <option value="automation" className="bg-[#10161D]">
                      Automatisation
                    </option>

                    <option value="ai-agent" className="bg-[#10161D]">
                      Agent IA
                    </option>

                    <option value="integration" className="bg-[#10161D]">
                      Intégration d&apos;outils
                    </option>

                    <option value="multiple" className="bg-[#10161D]">
                      Plusieurs solutions
                    </option>

                    <option value="unknown" className="bg-[#10161D]">
                      Je ne sais pas encore
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="need"
                    className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                  >
                    Quel est votre principal besoin ?
                  </label>

                  <textarea
                    id="need"
                    name="need"
                    required
                    rows={4}
                    placeholder="Décrivez le problème que vous souhaitez résoudre..."
                    className="min-h-32 w-full resize-none border-b border-[#2A333C] bg-transparent py-3 text-base leading-7 text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:border-[#7CC7FF]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tools"
                    className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                  >
                    Quels outils utilisez-vous actuellement ?
                  </label>

                  <input
                    id="tools"
                    name="tools"
                    type="text"
                    placeholder="CRM, ERP, WhatsApp, logiciels métier..."
                    className="min-h-12 w-full border-b border-[#2A333C] bg-transparent py-3 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:border-[#7CC7FF]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                  >
                    Budget envisagé
                  </label>

                  <select
                    id="budget"
                    name="budget"
                    required
                    defaultValue=""
                    className="min-h-12 w-full border-b border-[#2A333C] bg-transparent py-3 text-base text-[#CDD5DD] outline-none transition-colors focus:border-[#7CC7FF]"
                  >
                    <option value="" disabled className="bg-[#10161D]">
                      Sélectionnez une fourchette
                    </option>

                    <option value="under-1000" className="bg-[#10161D]">
                      Moins de 1 000 €
                    </option>

                    <option value="1000-3000" className="bg-[#10161D]">
                      1 000 € — 3 000 €
                    </option>

                    <option value="3000-5000" className="bg-[#10161D]">
                      3 000 € — 5 000 €
                    </option>

                    <option value="5000-10000" className="bg-[#10161D]">
                      5 000 € — 10 000 €
                    </option>

                    <option value="over-10000" className="bg-[#10161D]">
                      Plus de 10 000 €
                    </option>

                    <option value="unknown" className="bg-[#10161D]">
                      Je ne sais pas encore
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="timeline"
                    className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                  >
                    Délai souhaité
                  </label>

                  <select
                    id="timeline"
                    name="timeline"
                    required
                    defaultValue=""
                    className="min-h-12 w-full border-b border-[#2A333C] bg-transparent py-3 text-base text-[#CDD5DD] outline-none transition-colors focus:border-[#7CC7FF]"
                  >
                    <option value="" disabled className="bg-[#10161D]">
                      Sélectionnez un délai
                    </option>

                    <option value="urgent" className="bg-[#10161D]">
                      Dès que possible
                    </option>

                    <option value="1-month" className="bg-[#10161D]">
                      Dans le mois
                    </option>

                    <option value="1-3-months" className="bg-[#10161D]">
                      Dans 1 à 3 mois
                    </option>

                    <option value="3-6-months" className="bg-[#10161D]">
                      Dans 3 à 6 mois
                    </option>

                    <option value="later" className="bg-[#10161D]">
                      Plus tard
                    </option>

                    <option value="unknown" className="bg-[#10161D]">
                      Pas encore défini
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="py-7 sm:py-8">
              <p className="mb-5 text-[0.68rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:mb-6 sm:text-[0.72rem] sm:tracking-[0.16em]">
                03 — Votre demande
              </p>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                >
                  Parlez-nous de votre projet
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={7}
                  placeholder="Expliquez-nous votre projet, vos objectifs et ce que vous aimeriez améliorer..."
                  className="min-h-44 w-full resize-none border-b border-[#2A333C] bg-transparent py-3 text-base leading-7 text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:border-[#7CC7FF]"
                />
              </div>

              <div className="mt-8">
                <label
                  htmlFor="source"
                  className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
                >
                  Comment avez-vous connu NASSFLOW ?
                </label>

                <select
                  id="source"
                  name="source"
                  defaultValue=""
                  className="min-h-12 w-full border-b border-[#2A333C] bg-transparent py-3 text-base text-[#CDD5DD] outline-none transition-colors focus:border-[#7CC7FF]"
                >
                  <option value="" className="bg-[#10161D]">
                    Sélectionnez une option
                  </option>

                  <option value="google" className="bg-[#10161D]">
                    Google
                  </option>

                  <option value="social" className="bg-[#10161D]">
                    Réseaux sociaux
                  </option>

                  <option value="recommendation" className="bg-[#10161D]">
                    Recommandation
                  </option>

                  <option value="other" className="bg-[#10161D]">
                    Autre
                  </option>
                </select>
              </div>
            </div>

            {success && (
              <div
                role="status"
                className="mb-6 rounded-2xl border border-[#2A333C] bg-[#10161D] px-4 py-4 text-sm leading-6 text-[#CDD5DD] sm:px-5"
              >
                <span className="font-medium text-[#7CC7FF]">
                  Demande envoyée.
                </span>{' '}
                Merci. Nous avons bien reçu votre projet et nous reviendrons
                vers vous prochainement.
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-[#2A333C] bg-[#10161D] px-4 py-4 text-sm leading-6 text-[#CDD5DD] sm:px-5"
              >
                {error}
              </div>
            )}

            <div className="flex flex-col gap-5 border-t border-[#2A333C] pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-7">
              <p className="max-w-[520px] text-xs leading-5 text-[#5F6973]">
                Les informations transmises servent uniquement à comprendre
                votre projet et à vous recontacter au sujet de votre demande.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-full bg-[#7CC7FF] px-7 text-sm font-medium text-[#0A0D12] transition-colors duration-200 hover:bg-[#A9D9FF] focus:outline-none focus:ring-2 focus:ring-[#7CC7FF] focus:ring-offset-2 focus:ring-offset-[#0A0D12] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
              </button>
            </div>
          </form>
        </div>
      </SectionShell>
    </main>
  );
}