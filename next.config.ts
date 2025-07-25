import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add the images configuration here
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "*", // Allow images from all domains
      },
    ],
    domains: [
      'cdn.vectorstock.com', // This line allows images from placehold.co
      // If you have other external image domains, add them here:
      // 'example.com',
      // 'cdn.another-site.net',
    ],
  },
  /* other config options can go here */
};

export default nextConfig;