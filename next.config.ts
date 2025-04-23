import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['avatars.githubusercontent.com'], // ✅ Add allowed domains here
  },
};

export default nextConfig;
