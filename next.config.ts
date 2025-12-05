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
        hostname:'https://heroic-bouquet-2407f56d2e.strapiapp.com'
      }
    ],
    dangerouslyAllowLocalIP: true,

  },
};

export default nextConfig;
