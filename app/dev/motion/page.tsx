import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MotionDemo } from './MotionDemo';

/**
 * Page interne : les quatre primitives de mouvement, isolées, avec leurs
 * variantes. Elle n'existe qu'en développement — en production elle
 * répond 404 —, n'est pas dans le sitemap (app/sitemap.ts liste ses
 * routes une à une) et demande à ne pas être indexée.
 */
export const metadata: Metadata = {
  title: 'Mouvement — démonstration interne',
  robots: { index: false, follow: false },
};

export default function MotionDemoPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return <MotionDemo />;
}
