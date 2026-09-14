import type { MetadataRoute } from 'next';
import { solutions } from '@/lib/content/solutions';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nassflow.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/demarrer-un-projet`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Dérivées du catalogue, jamais listées à la main : ajouter une
    // solution doit suffire à la rendre indexable.
    ...solutions.map((solution) => ({
      url: `${baseUrl}/solutions/${solution.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}