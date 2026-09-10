'use client';

import { FormEvent, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { sendNotification } from '@/lib/notify';
import { transitions } from '@/lib/motion';

const fieldWrap =
  'border-b border-[#2A333C] py-5 transition-colors duration-300 focus-within:border-[#7CC7FF]/70 sm:py-6';

const fieldLabel =
  'mb-2.5 block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#8E98A3] transition-colors duration-300 sm:text-[0.72rem]';

const fieldInput =
  'min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:placeholder:text-[#9AA4AE]';

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

    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      subject: String(formData.get('subject') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    };

    try {
      const { error: insertError } = await getSupabaseClient()
        .from('contact_requests')
        .insert(payload);

      if (insertError) throw insertError;
    } catch (insertError) {
      console.error('Supabase contact insert error:', insertError);

      setError(
        'Une erreur est survenue lors de l’envoi. Vérifiez votre connexion puis réessayez.',
      );

      setIsSubmitting(false);
      return;
    }

    // Le message était enregistré en base sans que personne n'en soit
    // averti : la notification manquait ici, alors qu'elle existait déjà
    // sur le formulaire « Démarrer un projet ».
    await sendNotification('contact', payload);

    form.reset();
    setSuccess(true);
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-[#2A333C]">
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
        {/* Nom */}
        <div className={fieldWrap}>
          <label htmlFor="name" className={fieldLabel}>
            Nom
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Votre nom"
            className={fieldInput}
          />
        </div>

        {/* E-mail */}
        <div className={fieldWrap}>
          <label htmlFor="email" className={fieldLabel}>
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
            className={fieldInput}
          />
        </div>

        {/* Sujet */}
        <div className={`${fieldWrap} sm:col-span-2`}>
          <label htmlFor="subject" className={fieldLabel}>
            Sujet
          </label>

          <input
            id="subject"
            name="subject"
            type="text"
            required
            placeholder="Sujet de votre message"
            className={fieldInput}
          />
        </div>

        {/* Message */}
        <div className={`${fieldWrap} sm:col-span-2`}>
          <label htmlFor="message" className={fieldLabel}>
            Message
          </label>

          <textarea
            id="message"
            name="message"
            required
            rows={7}
            placeholder="Décrivez votre demande..."
            className="min-h-40 w-full resize-none bg-transparent py-1 text-base leading-7 text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:placeholder:text-[#9AA4AE]"
          />
        </div>
      </div>

      {/* Retour d'état — région live, annoncée même si le bloc apparaît
          après coup, et animée pour ne pas surgir brutalement. */}
      <div aria-live="polite" className="empty:hidden">
        <AnimatePresence mode="wait">
          {success && (
            <m.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={transitions.quick}
              className="mt-5 rounded-2xl border border-[#7CC7FF]/30 bg-[#10161D] px-4 py-4 text-sm leading-6 text-[#CDD5DD] sm:mt-6 sm:px-5"
            >
              <span className="font-medium text-[#7CC7FF]">
                Message envoyé.
              </span>{' '}
              Merci. Nous avons bien reçu votre message et nous reviendrons
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
              className="mt-5 rounded-2xl border border-[#2A333C] bg-[#10161D] px-4 py-4 text-sm leading-6 text-[#CDD5DD] sm:mt-6 sm:px-5"
            >
              {error}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bas de formulaire */}
      <div className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-7">
        <p className="max-w-[480px] text-xs leading-5 text-[#8E98A3]">
          Nous utiliserons uniquement les informations nécessaires pour
          répondre à votre message.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="sheen inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-full bg-[#7CC7FF] px-7 text-sm font-medium text-[#0A0D12] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#A9D9FF] hover:shadow-[0_10px_30px_rgba(124,199,255,0.22)] focus:outline-none focus:ring-2 focus:ring-[#7CC7FF] focus:ring-offset-2 focus:ring-offset-[#0A0D12] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? 'Envoi en cours…' : 'Envoyer le message'}
        </button>
      </div>
    </form>
  );
}
