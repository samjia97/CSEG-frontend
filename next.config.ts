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
        hostname:'heroic-bouquet-2407f56d2e.strapiapp.com',
        pathname:'/**',
      },
      {
        protocol: 'https',
        hostname:'heroic-bouquet-2407f56d2e.media.strapiapp.com',
        pathname:'/**',
      },
    ],
    dangerouslyAllowLocalIP: true,

  },
};

export default nextConfig;
