'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';

/**
 * Le mini-formulaire de rappel, inséré dans le fil de la conversation.
 *
 * Il ne demande que l'adresse. Le prénom et le besoin sont facultatifs
 * parce qu'un visiteur qui vient de tout expliquer à l'assistant n'a
 * aucune envie de le réécrire — c'est la conversation jointe qui porte
 * le contexte, pas ce champ.
 */

type Message = { role: 'user' | 'assistant'; content: string };

export function LeadForm({
  transcript,
  onSent,
}: {
  transcript: Message[];
  onSent: () => void;
}) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSending) return;

    setIsSending(true);
    setError('');

    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? '').trim();

    try {
      const response = await fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: value('email'),
          first_name: value('firstName') || null,
          need: value('need') || null,
          // Le champ piège part tel quel : c'est le serveur qui décide.
          website: value('website'),
          page: window.location.pathname,
          transcript,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);

        setError(
          (body && typeof body.error === 'string' && body.error) ||
            'L’envoi a échoué. Réessayez, ou écrivez-nous directement.',
        );

        setIsSending(false);
        return;
      }

      onSent();
    } catch {
      setError('L’envoi a échoué. Vérifiez votre connexion puis réessayez.');
      setIsSending(false);
    }
  }

  const label =
    'mb-1.5 block font-sans text-micro uppercase tracking-tag text-ink-muted';
  const field =
    'border-b border-rule pb-1 transition-colors focus-within:border-accent';
  const input =
    'min-h-10 w-full bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-ink-muted';

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Être recontacté"
      className="mt-6 border border-rule p-4"
    >
      <p className="font-sans text-micro uppercase text-ink-muted">
        Être recontacté
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <div className={field}>
          <label htmlFor="lead-email" className={label}>
            E-mail
          </label>

          <input
            id="lead-email"
            ref={emailRef}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={320}
            placeholder="vous@entreprise.com"
            className={input}
          />
        </div>

        <div className={field}>
          <label htmlFor="lead-first-name" className={label}>
            Prénom <span className="normal-case tracking-normal">(facultatif)</span>
          </label>

          <input
            id="lead-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            maxLength={100}
            placeholder="Votre prénom"
            className={input}
          />
        </div>

        <div className={field}>
          <label htmlFor="lead-need" className={label}>
            Un mot sur votre besoin{' '}
            <span className="normal-case tracking-normal">(facultatif)</span>
          </label>

          <textarea
            id="lead-need"
            name="need"
            rows={2}
            maxLength={1000}
            placeholder="Ce que vous cherchez à régler"
            className={`${input} min-h-16 resize-none leading-[1.5]`}
          />
        </div>
      </div>

      {/* Le champ piège : hors écran et hors tabulation, invisible pour
          un visiteur, rempli par un robot qui remplit tout. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="lead-website">Site web</label>
        <input
          id="lead-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {error && (
        <p role="alert" className="mt-4 text-[0.8125rem] leading-[1.5] text-accent">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="xs"
        disabled={isSending}
        className="mt-5 w-full"
      >
        {isSending ? 'Envoi en cours…' : 'Envoyer'}
      </Button>

      <p className="mt-3 text-[0.6875rem] leading-[1.5] text-ink-muted">
        La conversation sera jointe à votre demande, pour que nous sachions
        de quoi vous avez parlé.{' '}
        <TextLink href="/confidentialite" hover="ink">
          Confidentialité
        </TextLink>
      </p>
    </form>
  );
}
