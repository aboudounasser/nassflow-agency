'use client';

import { FormEvent, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { transitions } from '@/lib/motion';
import { formStyles, FormStepTitle } from '@/components/forms/form-ui';
import type { Question, Solution } from '@/lib/content/solutions';
import { MotionProvider } from '@/components/motion/MotionProvider';

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

const { label: labelClass, optional: optionalClass, fieldWrap: fieldWrapClass,
  input: inputClass, textarea: textareaClass, select: selectClass,
  option: optionClass } = formStyles;

/** Le champ correspondant à une question du catalogue. */
function QuestionField({ question }: { question: Question }) {
  const name = `q_${question.id}`;

  return (
    <div className={fieldWrapClass}>
      <label htmlFor={name} className={labelClass}>
        {question.label}
        {!question.required && (
          <span className={optionalClass}>
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
          <option value="" disabled className={optionClass}>
            Sélectionnez une réponse
          </option>

          {question.options?.map((option) => (
            <option key={option} value={option} className={optionClass}>
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

/** Motion n'est chargé que sur les pages qui portent ce formulaire. */
export function SolutionRequestForm({ solution }: { solution: Solution }) {
  return (
    <MotionProvider>
      <SolutionRequestFormFields solution={solution} />
    </MotionProvider>
  );
}

function SolutionRequestFormFields({ solution }: { solution: Solution }) {
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
        className={formStyles.success}
      >
        <p className="font-sans text-[1.375rem] font-bold tracking-[-0.028em] text-ink">
          Demande envoyée.
        </p>

        <p className="mt-4 max-w-[62ch] text-body text-ink-body">
          Merci. Nous avons bien reçu vos réponses pour «&nbsp;
          {solution.title}&nbsp;». Nous revenons vers vous pour en parler et
          voir comment l&apos;adapter à votre façon de travailler.
        </p>
      </m.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="border-b border-rule pb-7 sm:pb-8">
        <FormStepTitle step="01">Vous joindre</FormStepTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
          <div className={fieldWrapClass}>
            <label htmlFor="company" className={labelClass}>
              Entreprise
              <span className={optionalClass}>
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
              <span className={optionalClass}>
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
              <span className={optionalClass}>
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
              <span className={optionalClass}>
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
        <FormStepTitle step="02">Votre situation</FormStepTitle>

        <p className="mb-7 max-w-[62ch] text-body text-ink-body">
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
              className={formStyles.error}
            >
              {error}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-5 border-t border-rule pt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-8">
        <p className={formStyles.note}>
          Les informations transmises servent uniquement à comprendre votre
          situation et à vous recontacter au sujet de cette demande.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className={formStyles.submit}
        >
          {isSubmitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
        </button>
      </div>
    </form>
  );
}
