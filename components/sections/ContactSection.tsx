'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { SectionLabel } from '@/components/SectionLabel';
import { SectionShell } from '@/components/SectionShell';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactSection() {
  const [formState, setFormState] = useState<FormState>('idle');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormState('submitting');

    try {
      // Simulation temporaire.
      // Le véritable envoi sera connecté dans un prochain pass.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      setFormState('success');

      setTimeout(() => {
        setFormState('idle');
      }, 4000);
    } catch {
      setFormState('error');

      setTimeout(() => {
        setFormState('idle');
      }, 4000);
    }
  };

  const isDisabled =
    formState === 'submitting' || formState === 'success';

  return (
    <section
      id="contact"
      aria-label="Contacter l'équipe"
      className="border-t border-[#151C23]"
    >
      <SectionShell className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[820px]">
          {/* Header */}
          <div className="mb-12 sm:mb-14">
            <SectionLabel>Contacter l&apos;équipe</SectionLabel>

            <div className="mt-6 max-w-[720px]">
              <h2 className="text-3xl font-light leading-[1.08] tracking-[-0.035em] text-[#F4F7FA] sm:text-4xl lg:text-[3.25rem]">
                Une question, un besoin ou un imprévu ?
              </h2>

              <p className="mt-5 max-w-[560px] text-base leading-7 text-[#8E98A3]">
                Écrivez-nous directement. L&apos;équipe NASSFLOW vous répondra
                au sujet de votre demande.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-[#2A333C]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
              {/* Nom */}
              <div className="border-b border-[#2A333C] py-5">
                <label
                  htmlFor="name"
                  className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#8E98A3]"
                >
                  Nom
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  required
                  autoComplete="name"
                  placeholder="Votre nom"
                  className="w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C] disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* E-mail */}
              <div className="border-b border-[#2A333C] py-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#8E98A3]"
                >
                  E-mail
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  required
                  autoComplete="email"
                  placeholder="votre@email.com"
                  className="w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C] disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Sujet */}
              <div className="border-b border-[#2A333C] py-5 sm:col-span-2">
                <label
                  htmlFor="subject"
                  className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#8E98A3]"
                >
                  Sujet
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  required
                  placeholder="Sujet de votre message"
                  className="w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C] disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Message */}
              <div className="border-b border-[#2A333C] py-5 sm:col-span-2">
                <label
                  htmlFor="message"
                  className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#8E98A3]"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  required
                  rows={6}
                  placeholder="Décrivez votre demande..."
                  className="w-full resize-none bg-transparent py-1 text-base leading-7 text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C] disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Bottom / état / action */}
            <div className="flex flex-col gap-6 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-[24px] max-w-[520px]">
                {formState === 'success' && (
                  <p
                    role="status"
                    className="text-sm text-[#7CC7FF]"
                  >
                    Votre message a bien été envoyé.
                  </p>
                )}

                {formState === 'error' && (
                  <p
                    role="alert"
                    className="text-sm leading-6 text-[#CDD5DD]"
                  >
                    Une erreur est survenue. Vous pouvez nous contacter
                    directement par e-mail ou téléphone.
                  </p>
                )}

                {formState === 'idle' && (
                  <p className="text-xs leading-5 text-[#5F6973]">
                    Nous utiliserons uniquement les informations nécessaires
                    pour répondre à votre message.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isDisabled}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#7CC7FF] px-7 text-sm font-medium text-[#0A0D12] transition-colors duration-200 hover:bg-[#A9D9FF] focus:outline-none focus:ring-2 focus:ring-[#7CC7FF] focus:ring-offset-2 focus:ring-offset-[#0A0D12] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {formState === 'submitting' && 'Envoi en cours…'}
                {formState === 'success' && 'Message envoyé ✓'}
                {formState !== 'submitting' &&
                  formState !== 'success' &&
                  'Envoyer le message'}
              </button>
            </div>
          </form>
        </div>
      </SectionShell>
    </section>
  );
}