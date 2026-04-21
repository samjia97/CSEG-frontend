import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      //   Strapi Cloud
      {
        protocol: 'https',
        hostname:process.env.STRAPI_CLOUD_FOR_IMAGES || 'wise-wealth-46b9441c98.media.strapiapp.com',
        pathname:'/**',
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
