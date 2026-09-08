'use client';

import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function ContactForm() {
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

    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const subject = String(formData.get('subject') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    const { error: insertError } = await supabase
      .from('contact_requests')
      .insert({
        name,
        email,
        subject,
        message,
      });

    if (insertError) {
      console.error('Supabase contact insert error:', insertError);

      setError(
        'Une erreur est survenue lors de l’envoi. Vérifiez votre connexion puis réessayez.',
      );

      setIsSubmitting(false);
      return;
    }

    form.reset();
    setSuccess(true);
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-[#2A333C]">
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
        {/* Nom */}
        <div className="border-b border-[#2A333C] py-5 sm:py-6">
          <label
            htmlFor="name"
            className="mb-2.5 block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#8E98A3] sm:text-[0.72rem]"
          >
            Nom
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Votre nom"
            className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C]"
          />
        </div>

        {/* E-mail */}
        <div className="border-b border-[#2A333C] py-5 sm:py-6">
          <label
            htmlFor="email"
            className="mb-2.5 block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#8E98A3] sm:text-[0.72rem]"
          >
            E-mail
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="votre@email.com"
            className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C]"
          />
        </div>

        {/* Sujet */}
        <div className="border-b border-[#2A333C] py-5 sm:col-span-2 sm:py-6">
          <label
            htmlFor="subject"
            className="mb-2.5 block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#8E98A3] sm:text-[0.72rem]"
          >
            Sujet
          </label>

          <input
            id="subject"
            name="subject"
            type="text"
            required
            placeholder="Sujet de votre message"
            className="min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C]"
          />
        </div>

        {/* Message */}
        <div className="border-b border-[#2A333C] py-5 sm:col-span-2 sm:py-6">
          <label
            htmlFor="message"
            className="mb-2.5 block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#8E98A3] sm:text-[0.72rem]"
          >
            Message
          </label>

          <textarea
            id="message"
            name="message"
            required
            rows={7}
            placeholder="Décrivez votre demande..."
            className="min-h-40 w-full resize-none bg-transparent py-1 text-base leading-7 text-[#F4F7FA] outline-none placeholder:text-[#4F5861] transition-colors focus:placeholder:text-[#66717C]"
          />
        </div>
      </div>

      {/* Success */}
      {success && (
        <div
          role="status"
          className="mt-5 rounded-2xl border border-[#2A333C] bg-[#10161D] px-4 py-4 text-sm leading-6 text-[#CDD5DD] sm:mt-6 sm:px-5"
        >
          <span className="font-medium text-[#7CC7FF]">
            Message envoyé.
          </span>{' '}
          Merci. Nous avons bien reçu votre message et nous reviendrons vers
          vous prochainement.
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-[#2A333C] bg-[#10161D] px-4 py-4 text-sm leading-6 text-[#CDD5DD] sm:mt-6 sm:px-5"
        >
          {error}
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-7">
        <p className="max-w-[480px] text-xs leading-5 text-[#5F6973]">
          Nous utiliserons uniquement les informations nécessaires pour
          répondre à votre message.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-full bg-[#7CC7FF] px-7 text-sm font-medium text-[#0A0D12] transition-colors duration-200 hover:bg-[#A9D9FF] focus:outline-none focus:ring-2 focus:ring-[#7CC7FF] focus:ring-offset-2 focus:ring-offset-[#0A0D12] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? 'Envoi en cours…' : 'Envoyer le message'}
        </button>
      </div>
    </form>
  );
}