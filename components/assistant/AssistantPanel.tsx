'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { BOOKING_URL, CONTACT_EMAIL } from '@/lib/content/contact';
import { assistantUnavailableMessage } from '@/lib/assistant/instructions';
import { linkify } from '@/components/assistant/linkify';
import { LeadForm } from '@/components/assistant/LeadForm';

/**
 * Le panneau de l'assistant, et toute sa logique.
 *
 * Il n'est chargé qu'au premier clic sur la bulle : c'est ce fichier,
 * et lui seul, qui porte le poids de la fonctionnalité. Voir
 * `AssistantBubble.tsx` pour le découpage.
 *
 * La conversation ne vit que dans cet état React : rien en base, rien
 * dans localStorage, rien qui survive au rechargement. Le visiteur qui
 * ferme l'onglet ne laisse rien derrière lui — c'est ce que la
 * politique de confidentialité promet.
 */

const MAX_CHARS = 1000;

/** En dessous, afficher un compteur ne ferait qu'encombrer. */
const COUNTER_FROM = 900;

const RATE_LIMITED_MESSAGE =
  'Vous envoyez beaucoup de messages. Réessayez dans une minute.';

/**
 * Le premier message est écrit ici, pas demandé au modèle : il est
 * toujours le même, l'appeler coûterait une requête et une seconde
 * d'attente pour un texte qu'on connaît déjà.
 */
const GREETING_BEFORE = 'Bonjour, je suis l’assistant IA de NASSFLOW. Je réponds à vos questions sur nos solutions et notre façon de travailler. Si vous préférez parler à une personne, ';
const GREETING_LINK = 'réservez un appel';
const GREETING_AFTER = '.';

const SUGGESTIONS = [
  'Que faites-vous exactement ?',
  'Vous travaillez avec mes outils ?',
  'Comment se passe un projet ?',
];

type Message = {
  role: 'user' | 'assistant';
  content: string;
  /** L'assistant a jugé le visiteur intéressé à ce tour-là. */
  offer?: boolean;
};

export default function AssistantPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [error, setError] = useState('');

  /**
   * Le relais vers un humain : « ouvert » tant que le visiteur remplit
   * le formulaire, « envoyé » ensuite. Ce n'est pas un message de
   * l'assistant, donc ça ne passe pas par `messages` — ce qui serait
   * renvoyé au modèle au tour suivant.
   *
   * Une fois envoyé, l'état ne revient jamais à « closed » : la
   * proposition disparaît de la conversation pour de bon.
   */
  const [leadState, setLeadState] = useState<'closed' | 'open' | 'sent'>(
    'closed',
  );

  /**
   * Sous 640px le panneau couvre toute la page : il est alors modal, et
   * doit le dire. Au-dessus, il occupe un coin, la page reste lisible et
   * cliquable pendant la discussion — `aria-modal` y serait un mensonge
   * qui ferait masquer le reste de la page aux lecteurs d'écran.
   */
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)');
    const sync = () => setIsFullScreen(query.matches);

    sync();
    query.addEventListener('change', sync);

    return () => query.removeEventListener('change', sync);
  }, []);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Le focus arrive sur le champ : c'est ce qu'on vient faire ici.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Échap ferme, d'où qu'on soit dans le panneau.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKey);

    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Suivre le fil pendant qu'il s'écrit.
  useEffect(() => {
    const log = logRef.current;

    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, isAnswering]);

  const send = useCallback(
    async (question: string) => {
      const trimmed = question.trim();

      if (!trimmed || isAnswering) return;

      setError('');
      setDraft('');
      setIsAnswering(true);

      const history: Message[] = [
        ...messages,
        { role: 'user', content: trimmed },
      ];

      setMessages([...history, { role: 'assistant', content: '' }]);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });

        if (!response.ok || !response.body) {
          setMessages(history);
          setError(
            response.status === 429
              ? RATE_LIMITED_MESSAGE
              : assistantUnavailableMessage,
          );

          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Une ligne JSON par événement : { delta } ou { lead }.
        let buffer = '';

        const handle = (line: string) => {
          if (!line.trim()) return;

          let event: { delta?: string; lead?: boolean };

          try {
            event = JSON.parse(line);
          } catch {
            // Une ligne tronquée par une coupure réseau ne doit pas
            // faire échouer la réponse déjà reçue.
            return;
          }

          setMessages((current) => {
            const next = [...current];
            const last = next[next.length - 1];

            next[next.length - 1] = {
              ...last,
              content:
                typeof event.delta === 'string'
                  ? last.content + event.delta
                  : last.content,
              offer: event.lead === true ? true : last.offer,
            };

            return next;
          });
        };

        for (;;) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) handle(line);
        }

        handle(buffer);

        // Un flux qui se termine sans un mot vaut une panne : le
        // visiteur ne doit pas rester devant une bulle vide.
        setMessages((current) => {
          const last = current[current.length - 1];

          if (last?.role === 'assistant' && last.content.trim() === '') {
            setError(assistantUnavailableMessage);

            return current.slice(0, -1);
          }

          return current;
        });
      } catch {
        setMessages(history);
        setError(assistantUnavailableMessage);
      } finally {
        setIsAnswering(false);
        inputRef.current?.focus();
      }
    },
    [isAnswering, messages],
  );

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Entrée envoie, Maj+Entrée va à la ligne.
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void send(draft);
    }
  }

  const tooLong = draft.length >= MAX_CHARS;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal={isFullScreen}
      aria-label="Assistant NASSFLOW"
      className="fixed inset-0 z-[60] flex flex-col border-ink bg-paper text-ink sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(620px,calc(100vh-3rem))] sm:w-[400px] sm:border"
    >
      {/* En-tête */}
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-rule px-5 py-4">
        <div className="flex flex-col">
          <span className="font-sans text-[0.9375rem] font-extrabold tracking-[-0.02em]">
            Assistant NASSFLOW
          </span>

          <span className="mt-1 font-sans text-micro uppercase text-ink-muted">
            IA · répond 24h/24
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer l’assistant"
          className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center text-[1.25rem] leading-none text-ink-muted transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      {/* Le fil */}
      <div
        ref={logRef}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-5"
      >
        <p className="text-small text-ink-body">
          {GREETING_BEFORE}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-accent"
          >
            {GREETING_LINK}
            <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
          </a>
          {GREETING_AFTER}
        </p>

        {messages.length === 0 && (
          <div className="mt-5 flex flex-col items-start gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void send(suggestion)}
                className="border border-rule px-3 py-2 text-left font-sans text-[0.8125rem] text-ink-body transition-colors duration-200 hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* `aria-live` sur le conteneur des échanges, pas sur la page :
            seules les nouveautés sont annoncées. */}
        <div aria-live="polite" className="flex flex-col gap-5 empty:hidden">
          {messages.map((message, index) => (
            <div key={index} className={index === 0 ? 'mt-6' : undefined}>
              <p className="font-sans text-micro uppercase text-ink-muted">
                {message.role === 'user' ? 'Vous' : 'Assistant'}
              </p>

              <p className="mt-1.5 whitespace-pre-wrap break-words text-small text-ink-body">
                {message.role === 'assistant'
                  ? linkify(message.content)
                  : message.content}
                {/* Le curseur d'attente, sur la dernière bulle en cours. */}
                {isAnswering &&
                  index === messages.length - 1 &&
                  message.role === 'assistant' && (
                    <span
                      aria-hidden="true"
                      className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-accent motion-safe:animate-pulse"
                    />
                  )}
              </p>

              {/* La proposition, attachée à la réponse qui l'a
                  déclenchée. Elle ne survit pas à l'envoi du
                  formulaire, et ne s'affiche que sous le dernier
                  message : une conversation qui en aurait déclenché
                  deux ne doit pas laisser traîner la première. */}
              {message.offer &&
                leadState === 'closed' &&
                index === messages.length - 1 &&
                !isAnswering && (
                  <div className="mt-4 border-t border-rule pt-4">
                    <p className="text-[0.875rem] leading-[1.5] text-ink-body">
                      Vous voulez qu’on vous recontacte&nbsp;?
                    </p>

                    <button
                      type="button"
                      onClick={() => setLeadState('open')}
                      className="mt-3 inline-flex min-h-10 items-center justify-center border border-ink px-4 font-sans text-[0.8125rem] font-semibold text-ink transition-colors duration-200 ease-out hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      Être recontacté
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>

        <div aria-live="polite">
          {leadState === 'open' && (
            <LeadForm
              transcript={messages}
              onSent={() => setLeadState('sent')}
            />
          )}

          {leadState === 'sent' && (
            <p className="mt-6 border-y border-rule py-5 text-small text-ink-body">
              <span className="font-sans font-bold text-ink">
                C’est noté.
              </span>{' '}
              Nous revenons vers vous par e-mail.
            </p>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 text-[0.875rem] leading-[1.6] text-accent"
          >
            {error}
          </p>
        )}
      </div>

      {/* La saisie */}
      <div className="shrink-0 border-t border-rule px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
        <div className="flex items-end gap-3 border-b border-rule transition-colors duration-200 focus-within:border-accent">
          <label htmlFor="assistant-question" className="sr-only">
            Votre question
          </label>

          <textarea
            id="assistant-question"
            ref={inputRef}
            rows={1}
            value={draft}
            disabled={isAnswering}
            maxLength={MAX_CHARS}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={isAnswering ? 'Réponse en cours…' : 'Votre question'}
            className="max-h-28 min-h-11 w-full resize-none bg-transparent py-2 text-base leading-[1.5] text-ink outline-none placeholder:text-ink-muted disabled:opacity-60"
          />

          <button
            type="button"
            onClick={() => void send(draft)}
            disabled={isAnswering || draft.trim().length === 0}
            className="mb-1 shrink-0 font-sans text-[0.8125rem] font-semibold text-accent transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            Envoyer
          </button>
        </div>

        {draft.length >= COUNTER_FROM && (
          <p
            aria-live="polite"
            className={`mt-2 text-right text-[0.75rem] ${tooLong ? 'text-accent' : 'text-ink-muted'}`}
          >
            {draft.length} / {MAX_CHARS}
          </p>
        )}

        <p className="mt-3 text-[0.6875rem] leading-[1.5] text-ink-muted">
          Assistant IA. Vos messages sont traités par OpenAI ; n’y indiquez
          pas d’informations sensibles.{' '}
          <a
            href="/confidentialite"
            className="underline underline-offset-2 hover:text-ink"
          >
            Confidentialité
          </a>
          . Écrire directement :{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline underline-offset-2 hover:text-ink"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
