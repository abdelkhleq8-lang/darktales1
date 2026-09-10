/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/darktales1',
  assetPrefix: '/darktales1',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
