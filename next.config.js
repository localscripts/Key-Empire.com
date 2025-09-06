/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  
  // Add trailing slash for GitHub Pages compatibility
  trailingSlash: true,

  // Disable image optimization for GitHub Pages
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blob.v0.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placeholder.svg",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // GitHub Pages deployment configuration
  basePath: "",
  assetPrefix: "",

  // Ensure compatibility with GitHub Pages
  distDir: "out",

  // Disable server-side features that don't work with static export
  experimental: {
    // Disable features that require server-side rendering
  },

  // Configure for static export
  env: {
    CUSTOM_KEY: "my-value",
  },

  // Webpack configuration for GitHub Pages compatibility
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    return config
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
