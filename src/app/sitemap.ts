import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.politicslk.xyz'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    { 
      url: `${baseUrl}/`, 
      lastModified: now, 
      changeFrequency: 'daily', 
      priority: 1 
    },
    { 
      url: `${baseUrl}/quiz`, 
      lastModified: now, 
      changeFrequency: 'weekly', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/result`, 
      lastModified: now, 
      changeFrequency: 'weekly', 
      priority: 0.8 
    },
    { 
      url: `${baseUrl}/community-results`, 
      lastModified: now, 
      changeFrequency: 'daily', 
      priority: 0.8 
    },
    { 
      url: `${baseUrl}/suggest-politicians`, 
      lastModified: now, 
      changeFrequency: 'daily', 
      priority: 0.7 
    },
  ]
}


