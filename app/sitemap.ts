import type { MetadataRoute } from 'next';
import { PSEO_TOPICS } from '@/lib/pseo-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    'https://colorkit.io';

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  Object.keys(PSEO_TOPICS).forEach((slug) => {
    routes.push({
      url: `${baseUrl}/explore/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  return routes;
}
