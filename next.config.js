/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `module` field
    config.resolve.alias = {
      ...config.resolve.alias,
      // Add any other aliases here if needed
    };

    return config;
  },
  // Enable React strict mode
  reactStrictMode: true,
};

module.exports = nextConfig;
