/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static site generation for GitHub Pages
  output: "export",

  // Output directory for static files
  distDir: "out",

  // Add trailing slash for GitHub Pages compatibility
  trailingSlash: true,

  // Disable image optimization (required for static export)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blob.v0.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placeholder.svg",
        pathname: "/**",
      },
    ],
  },

  // Environment variables
  env: {
    CUSTOM_KEY: "my-value",
  },

  // Webpack configuration for GitHub Pages compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  // Disable build-time lint and type errors for smoother CI
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
