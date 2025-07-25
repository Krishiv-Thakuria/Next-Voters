/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add fallback for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false
    };
    
    return config;
  }
};

module.exports = nextConfig;
