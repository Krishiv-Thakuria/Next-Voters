import { NextConfig } from 'next';

/** @type {NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React Strict Mode for better error detection
  swcMinify: true, // Use SWC for faster builds and minification

  // Custom Webpack configuration
  webpack: (config, { isServer }) => {
    // Add fallbacks for Node.js modules if needed
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // Externalize large modules for server-side builds
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas'];
    }

    return config;
  },

  // Enable experimental features
  experimental: {
    modern: true, // Enable modern JavaScript output
    scrollRestoration: true, // Enable scroll restoration between pages
  },

  // Optimize images
  images: {
    domains: ['example.com'], // Add domains for optimized images
    formats: ['image/avif', 'image/webp'], // Use modern image formats
  },
};

export default nextConfig;
