const path = require('path');
const os = require('os');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ FIX: Use a folder that OneDrive IGNORES (node_modules)
  // This prevents the "-4094 UNKNOWN" error while keeping paths relative.
  distDir: process.env.NODE_ENV === 'development' 
    ? 'node_modules/.next-build' 
    : '.next',
  
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  swcMinify: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pdgsxesdxgtpyhohrmwi.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // ✅ Suppress non-actionable warnings and fix OneDrive lock issues
  webpack: (config, { isServer, dev }) => {
    // 1. Fix for OneDrive/Windows "-4094 UNKNOWN" error
    // Move Webpack's filesystem cache to a TEMP folder outside OneDrive
    if (dev) {
      if (config.cache && typeof config.cache === 'object') {
        config.cache.cacheDirectory = path.join(os.tmpdir(), 'next-webpack-cache-futurematrix');
      }
      
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }

    // 2. Ignore warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /esm.*\.js/ },
      { file: /node_modules.*\.js/ },
      (warning) => {
        const message = warning.message || '';
        return message.includes('hydration') || message.includes('React');
      },
    ]

    return config
  },
  
  // ✅ Suppress runtime warnings
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' data: localhost:3000 http://localhost:3000; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://accounts.google.com https://consent.google.com localhost:3000 http://localhost:3000; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com data:; img-src 'self' data: https: blob: localhost:3000 http://localhost:3000; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: wss: http://localhost:3000 localhost:3000 https://www.google-analytics.com https://www.googletagmanager.com https://*.firebaseio.com https://*.googleapis.com https://accounts.google.com https://*.firebaseapp.com; frame-src 'self' http://localhost:3000 localhost:3000 https://accounts.google.com https://*.firebaseapp.com https://www.gstatic.com; object-src 'self' data:; frame-ancestors 'self' http://localhost:3000 localhost:3000; base-uri 'self'; media-src 'self' data: https: blob:;"
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM http://localhost:3000'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          
        ]
      }
    ]
  },
}

module.exports = nextConfig
