'use client';

import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';

/**
 * La bulle de l'assistant : un bouton, et rien d'autre.
 *
 * Tout ce qui fait l'assistant — le fil, le streaming, la saisie, le
 * filtrage des liens — vit dans `AssistantPanel`, importé
 * dynamiquement. Ce fichier est présent sur toutes les pages ; le
 * panneau n'est téléchargé qu'au premier clic. Un visiteur qui lit une
 * fiche solution sans jamais ouvrir l'assistant ne paie que ce bouton.
 *
 * `ssr: false` parce qu'il n'y a rien à prérendre : le panneau n'existe
 * qu'après un geste, et son contenu est vide au départ.
 */
const AssistantPanel = dynamic(
  () => import('@/components/assistant/AssistantPanel'),
  { ssr: false },
);

export function AssistantBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Le focus revient d'où il venait : sans ça, la fermeture au clavier
  // renvoie en haut du document.
  const close = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  return (
    <>
      {!isOpen && (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          className="fixed bottom-5 right-5 z-[60] inline-flex min-h-11 items-center justify-center bg-accent px-5 font-sans text-[0.875rem] font-semibold text-on-accent transition-colors duration-200 ease-out hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:bottom-6 sm:right-6"
        >
          Une question&nbsp;?
        </button>
      )}

      {isOpen && <AssistantPanel onClose={close} />}
    </>
  );
}
