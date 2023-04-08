/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "links.papareact.com",
      "seeklogo.com",
      "aiimagegeneratoryo2d3f34.blob.core.windows.net",
    ],
  },
};

module.exports = nextConfig;
