import type { NextConfig } from "next";

const strapiRoot = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api").replace(/\/api\/?$/, "");
const strapiUrl = new URL(strapiRoot);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: strapiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: strapiUrl.hostname,
        port: strapiUrl.port,
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
