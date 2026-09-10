'use client';

import { FormEvent, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { sendNotification } from '@/lib/notify';
import { transitions } from '@/lib/motion';

export function ProjectForm() {
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

    const value = (key: string) => String(formData.get(key) ?? '').trim();

    let website = value('website');

    if (website && !/^https?:\/\//i.test(website)) {
      website = `https://${website}`;
    }

    const payload = {
      first_name: value('firstName'),
      last_name: value('lastName'),
      company: value('company'),
      professional_email: value('email'),
      phone: value('phone'),
      website: website || null,
      solution: value('solution'),
      main_need: value('need'),
      current_tools: value('tools') || null,
      budget: value('budget'),
      timeline: value('timeline'),
      project_description: value('message'),
      source: value('source') || null,
    };

    try {
      const { error: insertError } = await getSupabaseClient()
        .from('project_requests')
        .insert(payload);

      if (insertError) throw insertError;
    } catch (insertError) {
      console.error('Supabase insert error:', insertError);

      setError(
        'Une erreur est survenue lors de l\u2019envoi. V\u00e9rifiez votre connexion puis r\u00e9essayez.',
      );

      setIsSubmitting(false);
      return;
    }

    await sendNotification('project', payload);

    form.reset();
    setSuccess(true);
    setIsSubmitting(false);
  }

  return (
      <form
        onSubmit={handleSubmit}
        className="border-t border-[#2A333C]"
      >
        <div className="border-b border-[#2A333C] py-7 sm:py-8">
          <p className="mb-5 text-[0.68rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:mb-6 sm:text-[0.72rem] sm:tracking-[0.16em]">
            01 — Votre entreprise
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
            <div className="border-b border-[#2A333C] py-5 transition-colors duration-300 focus-within:border-[#7CC7FF]/70 sm:border-b-0">
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
                className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:placeholder:text-[#9AA4AE]"
              />
            </div>

            <div className="border-b border-[#2A333C] py-5 transition-colors duration-300 focus-within:border-[#7CC7FF]/70 sm:border-b-0">
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
                className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:placeholder:text-[#9AA4AE]"
              />
            </div>

            <div className="border-b border-[#2A333C] py-5 transition-colors duration-300 focus-within:border-[#7CC7FF]/70">
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
                className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:placeholder:text-[#9AA4AE]"
              />
            </div>

            <div className="border-b border-[#2A333C] py-5 transition-colors duration-300 focus-within:border-[#7CC7FF]/70">
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
                className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:placeholder:text-[#9AA4AE]"
              />
            </div>

            <div className="border-b border-[#2A333C] py-5 transition-colors duration-300 focus-within:border-[#7CC7FF]/70 sm:col-span-2">
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
                className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:placeholder:text-[#9AA4AE]"
              />
            </div>

            <div className="py-5 sm:col-span-2">
              <label
                htmlFor="website"
                className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]"
              >
                Site web
                <span className="ml-2 normal-case tracking-normal text-[#8E98A3]">
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
                className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:placeholder:text-[#9AA4AE]"
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
                className="min-h-12 w-full border-b border-[#2A333C] bg-transparent py-3 duration-300 text-base text-[#CDD5DD] outline-none transition-colors focus:border-[#7CC7FF]"
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
                className="min-h-32 w-full resize-none border-b border-[#2A333C] bg-transparent py-3 duration-300 text-base leading-7 text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:border-[#7CC7FF]"
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
                className="min-h-12 w-full border-b border-[#2A333C] bg-transparent py-3 duration-300 text-base text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:border-[#7CC7FF]"
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
                className="min-h-12 w-full border-b border-[#2A333C] bg-transparent py-3 duration-300 text-base text-[#CDD5DD] outline-none transition-colors focus:border-[#7CC7FF]"
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
                className="min-h-12 w-full border-b border-[#2A333C] bg-transparent py-3 duration-300 text-base text-[#CDD5DD] outline-none transition-colors focus:border-[#7CC7FF]"
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
              className="min-h-44 w-full resize-none border-b border-[#2A333C] bg-transparent py-3 duration-300 text-base leading-7 text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:border-[#7CC7FF]"
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
              className="min-h-12 w-full border-b border-[#2A333C] bg-transparent py-3 duration-300 text-base text-[#CDD5DD] outline-none transition-colors focus:border-[#7CC7FF]"
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

        <div aria-live="polite" className="empty:hidden">
          <AnimatePresence mode="wait">
            {success && (
              <m.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={transitions.quick}
                className="mb-6 rounded-2xl border border-[#7CC7FF]/30 bg-[#10161D] px-4 py-4 text-sm leading-6 text-[#CDD5DD] sm:px-5"
              >
                <span className="font-medium text-[#7CC7FF]">
                  Demande envoyée.
                </span>{' '}
                Merci. Nous avons bien reçu votre projet et nous reviendrons
                vers vous prochainement.
              </m.div>
            )}

            {error && (
              <m.div
                key="error"
                role="alert"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={transitions.quick}
                className="mb-6 rounded-2xl border border-[#2A333C] bg-[#10161D] px-4 py-4 text-sm leading-6 text-[#CDD5DD] sm:px-5"
              >
                {error}
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-5 border-t border-[#2A333C] pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-7">
          <p className="max-w-[520px] text-xs leading-5 text-[#8E98A3]">
            Les informations transmises servent uniquement à comprendre
            votre projet et à vous recontacter au sujet de votre demande.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="sheen inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-full bg-[#7CC7FF] px-7 text-sm font-medium text-[#0A0D12] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#A9D9FF] hover:shadow-[0_10px_30px_rgba(124,199,255,0.22)] focus:outline-none focus:ring-2 focus:ring-[#7CC7FF] focus:ring-offset-2 focus:ring-offset-[#0A0D12] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
          </button>
        </div>
      </form>
  );
}
