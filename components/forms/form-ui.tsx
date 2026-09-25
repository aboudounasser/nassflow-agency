import { Eyebrow } from '@/components/ui/Eyebrow';

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
    'mb-2 block font-sans text-label uppercase tracking-tag text-ink-muted',

  /** « (facultatif) » : même couleur, mais sans majuscules ni interlettrage. */
  optional: 'ml-1.5 normal-case tracking-normal text-ink-muted',

  /** L'enveloppe qui porte le filet, et son passage au vermillon. */
  fieldWrap:
    'border-b border-rule py-5 transition-colors focus-within:border-accent',

  input:
    'min-h-11 w-full bg-transparent py-1 text-base text-ink outline-none placeholder:text-ink-muted',

  textarea:
    'min-h-28 w-full resize-none bg-transparent py-1 text-base leading-7 text-ink outline-none placeholder:text-ink-muted',

  select:
    'min-h-11 w-full bg-transparent py-1 text-base text-ink outline-none',

  /** Les listes déroulantes natives ne suivent pas le fond de la page. */
  option: 'bg-paper text-ink',

  /** Message d'erreur : du vermillon, pas un encadré. */
  error:
    'mb-6 text-small text-accent',

  /** Confirmation : deux filets, aucun fond. */
  success: 'border-y border-rule py-7',


  note: 'max-w-[62ch] text-[0.8125rem] leading-6 text-ink-muted',
};

/**
 * L'intitulé d'une étape : un sur-titre à l'encre, dont seul le numéro
 * passe au vermillon.
 */
export function FormStepTitle({
  step,
  children,
}: {
  step: string;
  children: React.ReactNode;
}) {
  return (
    <Eyebrow as="p" tone="ink" className="mb-6">
      <span className="text-accent">{step}</span> — {children}
    </Eyebrow>
  );
}
