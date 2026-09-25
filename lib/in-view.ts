'use client';

import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

/**
 * Les briques communes des primitives de mouvement.
 *
 * Une primitive ne joue que si les trois conditions sont réunies :
 * - le mouvement est actif (`html[data-motion="on"]`, posé par
 *   lib/motion-boot.ts : JS actif et pas de « réduire les animations ») ;
 * - elle est dans le viewport ;
 * - l'onglet est au premier plan.
 * Sinon elle s'arrête, pour ne pas dépenser de batterie hors champ.
 */

type InViewRegistry = {
  observe: (el: Element, callback: (inView: boolean) => void) => () => void;
};

declare global {
  interface Window {
    __inView?: InViewRegistry;
  }
}

/**
 * S'abonne aux entrées et sorties de `el` dans le viewport, via le seul
 * IntersectionObserver du site (créé par lib/motion-boot.ts). Si le script
 * d'amorçage n'a pas tourné, un observateur local prend le relais.
 */
export function observeInView(el: Element, callback: (inView: boolean) => void) {
  if (window.__inView) return window.__inView.observe(el, callback);

  if (!('IntersectionObserver' in window)) {
    callback(true);
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) callback(entry.isIntersecting);
  });

  observer.observe(el);

  return () => observer.disconnect();
}

/* ─────────────────────────────────────────────
   Mouvement actif : l'attribut de <html>
   ───────────────────────────────────────────── */

function subscribeMotion(onChange: () => void) {
  const observer = new MutationObserver(onChange);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-motion'],
  });

  return () => observer.disconnect();
}

const motionSnapshot = () =>
  document.documentElement.getAttribute('data-motion') === 'on';

/**
 * `true` quand le mouvement est actif. Faux au rendu serveur : le HTML
 * part toujours dans son état final.
 */
export function useMotionEnabled() {
  return useSyncExternalStore(subscribeMotion, motionSnapshot, () => false);
}

/* ─────────────────────────────────────────────
   Onglet au premier plan
   ───────────────────────────────────────────── */

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);

  return () => document.removeEventListener('visibilitychange', onChange);
}

export function usePageVisible() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => true,
  );
}

/* ─────────────────────────────────────────────
   Dans le viewport
   ───────────────────────────────────────────── */

export function useInView(ref: RefObject<Element | null>) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    return observeInView(el, setInView);
  }, [ref]);

  return inView;
}

/** Les trois conditions réunies : la primitive peut jouer. */
export function usePlaying(ref: RefObject<Element | null>) {
  const enabled = useMotionEnabled();
  const inView = useInView(ref);
  const visible = usePageVisible();

  return { enabled, playing: enabled && inView && visible };
}
