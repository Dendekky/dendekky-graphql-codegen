/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
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
}

module.exports = nextConfig
