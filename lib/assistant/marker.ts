/**
 * Le marqueur par lequel l'assistant signale un visiteur intéressé, et
 * la machine qui le retire du flux.
 *
 * Le problème que ça résout : la réponse arrive caractère par
 * caractère. Si on relayait chaque fragment tel quel, le visiteur
 * verrait passer « [ », puis « [[ », puis « [[RAP » à l'écran avant
 * qu'on ait de quoi reconnaître le marqueur. Il faut donc retenir toute
 * fin de texte qui pourrait encore devenir un marqueur, et ne la
 * laisser passer que lorsqu'on sait qu'elle n'en est pas un.
 *
 * Les espaces et retours à la ligne de fin sont retenus avec elle : le
 * marqueur vit sur sa propre ligne, et laisser filer le saut de ligne
 * qui le précède afficherait une ligne vide là où il ne doit rien
 * rester.
 */

export const LEAD_MARKER = '[[RAPPEL]]';

export type MarkerFilter = {
  /** Le texte sûr à afficher pour ce fragment. Peut être vide. */
  push: (chunk: string) => string;
  /** Ce qui restait en attente, une fois la réponse terminée. */
  flush: () => string;
  /** `true` si le marqueur a été vu au moins une fois. */
  seen: () => boolean;
};

export function createMarkerFilter(): MarkerFilter {
  let pending = '';
  let found = false;

  /** La plus longue fin de `pending` qui pourrait amorcer le marqueur. */
  function heldLength(): number {
    const max = Math.min(LEAD_MARKER.length - 1, pending.length);

    for (let n = max; n > 0; n -= 1) {
      if (pending.endsWith(LEAD_MARKER.slice(0, n))) {
        // Les blancs qui précèdent l'amorce sont retenus avec elle.
        const before = pending.slice(0, pending.length - n);
        const blancs = before.length - before.replace(/\s+$/, '').length;

        return n + blancs;
      }
    }

    // Aucune amorce, mais des blancs finaux : ils peuvent précéder un
    // marqueur qui n'est pas encore arrivé.
    const blancs = pending.length - pending.replace(/\s+$/, '').length;

    return blancs;
  }

  function removeMarkers() {
    for (;;) {
      const at = pending.indexOf(LEAD_MARKER);

      if (at === -1) return;

      found = true;

      pending =
        pending.slice(0, at).replace(/\s+$/, '') +
        pending.slice(at + LEAD_MARKER.length);
    }
  }

  return {
    push(chunk: string): string {
      pending += chunk;
      removeMarkers();

      const held = heldLength();
      const safe = pending.slice(0, pending.length - held);

      pending = pending.slice(pending.length - held);

      return safe;
    },

    flush(): string {
      removeMarkers();

      // Plus rien ne viendra : ce qui reste est du texte, débarrassé de
      // ses blancs de fin.
      const rest = pending.replace(/\s+$/, '');

      pending = '';

      return rest;
    },

    seen: () => found,
  };
}
