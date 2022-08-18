/** @type {import('next').NextConfig} */

// basePath and assetPrefix are needed for gh-pages deployment
// otherwise paths to assets are not set correctly
// https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
// https://nextjs.org/docs/api-reference/next.config.js/basepath

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
};

module.exports = nextConfig;
