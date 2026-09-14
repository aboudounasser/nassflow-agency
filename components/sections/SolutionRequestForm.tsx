'use client';

import { FormEvent, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { transitions } from '@/lib/motion';
import type { Question, Solution } from '@/lib/content/solutions';

/**
 * Formulaire d'une fiche solution : les champs communs, puis un champ par
 * entrée de `solution.questions`.
 *
 * Les champs spécifiques ne sont pas écrits ici : les ajouter à la main
 * ferait diverger le formulaire du catalogue dès la première question
 * modifiée. Ils sont générés, et leurs réponses repartent clées par
 * `question.id`, ce qui est exactement la forme attendue par la colonne
 * `answers` (jsonb) de `solution_requests`.
 *
 * L'envoi passe par /api/solution-requests et non par le client Supabase
 * du navigateur, contrairement à ContactForm : la table refuse `anon`,
 * seule la clé service_role peut y écrire et elle reste sur le serveur.
 */

const labelClass =
  'mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[#8E98A3] sm:text-[0.72rem] sm:tracking-[0.14em]';

const fieldWrapClass =
  'border-b border-[#2A333C] py-5 transition-colors duration-300 focus-within:border-[#7CC7FF]/70';

const inputClass =
  'min-h-11 w-full bg-transparent py-1 text-base text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:placeholder:text-[#9AA4AE]';

const textareaClass =
  'min-h-28 w-full resize-none bg-transparent py-1 text-base leading-7 text-[#F4F7FA] outline-none placeholder:text-[#7A838D] transition-colors focus:placeholder:text-[#9AA4AE]';

const selectClass =
  'min-h-11 w-full bg-transparent py-1 text-base text-[#CDD5DD] outline-none transition-colors';

/** Le champ correspondant à une question du catalogue. */
function QuestionField({ question }: { question: Question }) {
  const name = `q_${question.id}`;

  return (
    <div className={fieldWrapClass}>
      <label htmlFor={name} className={labelClass}>
        {question.label}
        {!question.required && (
          <span className="ml-1.5 normal-case tracking-normal text-[#7A838D]">
            (facultatif)
          </span>
        )}
      </label>

      {question.type === 'textarea' && (
        <textarea
          id={name}
          name={name}
          rows={4}
          required={question.required}
          className={textareaClass}
        />
      )}

      {question.type === 'select' && (
        <select
          id={name}
          name={name}
          defaultValue=""
          required={question.required}
          className={selectClass}
        >
          <option value="" disabled className="bg-[#10161D]">
            Sélectionnez une réponse
          </option>

          {question.options?.map((option) => (
            <option key={option} value={option} className="bg-[#10161D]">
              {option}
            </option>
          ))}
        </select>
      )}

      {question.type === 'text' && (
        <input
          id={name}
          name={name}
          type="text"
          required={question.required}
          className={inputClass}
        />
      )}
    </div>
  );
}

export function SolutionRequestForm({ solution }: { solution: Solution }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const value = (key: string) => String(formData.get(key) ?? '').trim();

    const email = value('email');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Indiquez une adresse e-mail valide pour qu’on puisse vous répondre.');
      setIsSubmitting(false);
      return;
    }

    const answers: Record<string, string> = {};

    for (const question of solution.questions) {
      const answer = value(`q_${question.id}`);

      if (question.required && !answer) {
        setError('Certaines questions obligatoires sont encore sans réponse.');
        setIsSubmitting(false);
        return;
      }

      if (answer) answers[question.id] = answer;
    }

    try {
      const response = await fetch('/api/solution-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solution_slug: solution.slug,
          company: value('company'),
          contact_name: value('contactName'),
          email,
          phone: value('phone'),
          sector: value('sector'),
          answers,
        }),
      });

      if (!response.ok) {
        // Le serveur renvoie un message lisible ; on ne le remplace que
        // s'il manque, pour ne pas masquer une cause précise.
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(data?.error ?? 'Envoi impossible.');
      }
    } catch (sendError) {
      console.error('Solution request error:', sendError);

      setError(
        sendError instanceof Error && sendError.message
          ? `${sendError.message} Vérifiez votre connexion puis réessayez.`
          : 'Une erreur est survenue lors de l’envoi. Réessayez.',
      );

      setIsSubmitting(false);
      return;
    }

    setSuccess(true);
    setIsSubmitting(false);
  }

  // Après succès, le formulaire cède la place à la confirmation : le
  // renvoyer vide inviterait à soumettre une seconde fois la même demande.
  if (success) {
    return (
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.quick}
        role="status"
        className="rounded-[1.25rem] border border-[#7CC7FF]/30 bg-[#10161D] p-6 sm:rounded-[1.5rem] sm:p-8"
      >
        <p className="font-[family-name:var(--font-sora)] text-[1.15rem] font-medium tracking-[-0.03em] text-[#F4F7FA]">
          Demande envoyée.
        </p>

        <p className="mt-3 text-[0.95rem] leading-7 text-[#CDD5DD]">
          Merci. Nous avons bien reçu vos réponses pour «&nbsp;
          {solution.title}&nbsp;». Nous revenons vers vous pour en parler et
          voir comment l&apos;adapter à votre façon de travailler.
        </p>
      </m.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="border-b border-[#2A333C] pb-7 sm:pb-8">
        <p className="mb-5 text-[0.68rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:mb-6 sm:text-[0.72rem] sm:tracking-[0.16em]">
          01 — Vous joindre
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
          <div className={fieldWrapClass}>
            <label htmlFor="company" className={labelClass}>
              Entreprise
              <span className="ml-1.5 normal-case tracking-normal text-[#7A838D]">
                (facultatif)
              </span>
            </label>

            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              className={inputClass}
            />
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="contactName" className={labelClass}>
              Votre nom
              <span className="ml-1.5 normal-case tracking-normal text-[#7A838D]">
                (facultatif)
              </span>
            </label>

            <input
              id="contactName"
              name="contactName"
              type="text"
              autoComplete="name"
              className={inputClass}
            />
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="email" className={labelClass}>
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div className={fieldWrapClass}>
            <label htmlFor="phone" className={labelClass}>
              Téléphone
              <span className="ml-1.5 normal-case tracking-normal text-[#7A838D]">
                (facultatif)
              </span>
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={inputClass}
            />
          </div>

          <div className={`${fieldWrapClass} sm:col-span-2`}>
            <label htmlFor="sector" className={labelClass}>
              Votre secteur
              <span className="ml-1.5 normal-case tracking-normal text-[#7A838D]">
                (facultatif)
              </span>
            </label>

            <input
              id="sector"
              name="sector"
              type="text"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="py-7 sm:py-8">
        <p className="mb-5 text-[0.68rem] font-medium uppercase tracking-[0.15em] text-[#7CC7FF] sm:mb-6 sm:text-[0.72rem] sm:tracking-[0.16em]">
          02 — Votre situation
        </p>

        <p className="mb-5 max-w-[520px] text-[0.9rem] leading-6 text-[#8E98A3] sm:mb-6">
          Ces questions sont celles qu&apos;on vous poserait de toute façon.
          Y répondre maintenant nous évite de vous les reposer.
        </p>

        <div className="grid grid-cols-1">
          {solution.questions.map((question) => (
            <QuestionField key={question.id} question={question} />
          ))}
        </div>
      </div>

      <div aria-live="polite" className="empty:hidden">
        <AnimatePresence mode="wait">
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
        <p className="max-w-[460px] text-xs leading-5 text-[#8E98A3]">
          Les informations transmises servent uniquement à comprendre votre
          situation et à vous recontacter au sujet de cette demande.
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
