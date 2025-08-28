import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Security headers - Balanced for production compatibility
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Changed from DENY to allow analytics
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
          // Add CSP that allows Vercel Analytics and Supabase
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'production' 
              ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-analytics.com va.vercel-scripts.com; connect-src 'self' *.supabase.co *.vercel-analytics.com vitals.vercel-insights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self';"
              : "default-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' *.supabase.co *.vercel-analytics.com vitals.vercel-insights.com ws: wss:;"
          },
        ],
      },
    ];
  },

  // Block access to sensitive files and directories
  async rewrites() {
    return {
      beforeFiles: [
        // Block access to log files
        {
          source: '/:path*.log',
          destination: '/404',
        },
        // Block access to config files
        {
          source: '/next.config.js',
          destination: '/404',
        },
        {
          source: '/next.config.ts',
          destination: '/404',
        },
        {
          source: '/postcss.config.mjs',
          destination: '/404',
        },
        {
          source: '/tailwind.config.js',
          destination: '/404',
        },
        // Block access to environment files
        {
          source: '/.env',
          destination: '/404',
        },
        {
          source: '/.env.local',
          destination: '/404',
        },
        {
          source: '/.env.production',
          destination: '/404',
        },
        {
          source: '/.env.development',
          destination: '/404',
        },
        // Block access to package files
        {
          source: '/package.json',
          destination: '/404',
        },
        {
          source: '/package-lock.json',
          destination: '/404',
        },
        // Block access to node_modules
        {
          source: '/node_modules/:path*',
          destination: '/404',
        },
        // Block access to .next build directory
        {
          source: '/.next/:path*',
          destination: '/404',
        },
        // Block access to git files
        {
          source: '/.git/:path*',
          destination: '/404',
        },
        // Block access to common sensitive files
        {
          source: '/robots.txt',
          destination: '/404',
        },
        {
          source: '/sitemap.xml',
          destination: '/404',
        },
        {
          source: '/.well-known/:path*',
          destination: '/404',
        },
        // Block access to source maps in production only
        ...(process.env.NODE_ENV === 'production' ? [{
          source: '/:path*.map',
          destination: '/404',
        }] : []),
        // Block access to backup files
        {
          source: '/:path*~',
          destination: '/404',
        },
        {
          source: '/:path*.bak',
          destination: '/404',
        },
        {
          source: '/:path*.backup',
          destination: '/404',
        },
        // Block access to editor files
        {
          source: '/:path*.swp',
          destination: '/404',
        },
        {
          source: '/:path*.tmp',
          destination: '/404',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  // Additional security for static file serving
  async redirects() {
    return [
      // Redirect attempts to access admin-like paths
      {
        source: '/admin/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/api/admin/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/debug/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/logs/:path*',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
