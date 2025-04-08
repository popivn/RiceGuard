const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Add the alias for @ to point to the root directory
    config.resolve.alias['@'] = path.resolve(__dirname);
    
    // Specifically add aliases for the components that are causing issues
    config.resolve.alias['@/components'] = path.resolve(__dirname, 'components');
    config.resolve.alias['@/components/ui'] = path.resolve(__dirname, 'components/ui');
    
    return config;
  },
};

module.exports = nextConfig; 