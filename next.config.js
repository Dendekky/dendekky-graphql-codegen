/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "graphqlcodegen.com"],
    },
    optimizePackageImports: ['@radix-ui/react-dialog', '@radix-ui/react-slot', 'lucide-react'],
  },
  webpack: (config, { isServer }) => {
    // Handle GraphQL Tools dynamic imports
    if (isServer) {
      config.externals = [...config.externals, 'supports-color', 'encoding']
    }
    
    // Ignore warnings for GraphQL Tools dynamic requires
    config.ignoreWarnings = [
      { module: /node_modules\/@graphql-tools\/load/ },
      { file: /node_modules\/@graphql-tools\/load/ },
    ]
    
    return config
  },
  compress: true,
  trailingSlash: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/favicon.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // 24 hours
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // 24 hours
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Add redirects here if you need to redirect old URLs
    ];
  },
}

module.exports = nextConfig
