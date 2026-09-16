/**
 * Les classes partagées par les deux formulaires du site.
 *
 * C'est ici que la direction éditoriale se voit le plus : un champ n'a
 * ni cadre, ni fond, ni arrondi — seulement un filet 1px sous la ligne
 * de saisie, qui passe au vermillon quand le champ prend le focus. Le
 * filet est posé sur l'enveloppe en `focus-within`, donc il apparaît
 * aussi bien à la souris qu'à la tabulation : c'est lui, et non un halo,
 * qui sert d'état de focus visible au clavier.
 *
 * Les deux formulaires partagent ces constantes plutôt que de recopier
 * les mêmes chaînes : ils doivent rester indiscernables l'un de l'autre.
 */

export const formStyles = {
  /** Libellé : 11px · 600 · 0.16em · majuscules · ink-muted. */
  label:
    'mb-2 block font-[family-name:var(--font-archivo)] text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]',

  /** « (facultatif) » : même couleur, mais sans majuscules ni interlettrage. */
  optional: 'ml-1.5 normal-case tracking-normal text-[var(--ink-muted)]',

  /** L'enveloppe qui porte le filet, et son passage au vermillon. */
  fieldWrap:
    'border-b border-[var(--rule)] py-5 transition-colors duration-200 focus-within:border-[var(--accent)]',

  input:
    'min-h-11 w-full bg-transparent py-1 text-base text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]',

  textarea:
    'min-h-28 w-full resize-none bg-transparent py-1 text-base leading-7 text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]',

  select:
    'min-h-11 w-full bg-transparent py-1 text-base text-[var(--ink)] outline-none',

  /** Les listes déroulantes natives ne suivent pas le fond de la page. */
  option: 'bg-[var(--paper)] text-[var(--ink)]',

  /** Message d'erreur : du vermillon, pas un encadré. */
  error:
    'mb-6 text-[0.9375rem] leading-6 text-[var(--accent)]',

  /** Confirmation : deux filets, aucun fond. */
  success: 'border-y border-[var(--rule)] py-7',

  submit:
    'inline-flex min-h-12 w-full shrink-0 items-center justify-center bg-[var(--accent)] px-7 font-[family-name:var(--font-archivo)] text-[0.9375rem] font-semibold text-[var(--on-accent)] transition-colors duration-200 ease-out hover:bg-[#B92C18] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto',

  note: 'max-w-[62ch] text-[0.8125rem] leading-6 text-[var(--ink-muted)]',
};

/**
 * L'intitulé d'une étape : le numéro en vermillon, le reste en Archivo
 * 600 majuscule interlettré.
 */
export function FormStepTitle({
  step,
  children,
}: {
  step: string;
  children: React.ReactNode;
}) {
  return (
    <p className="mb-6 font-[family-name:var(--font-archivo)] text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">
      <span className="text-[var(--accent)]">{step}</span> — {children}
    </p>
  );
}
