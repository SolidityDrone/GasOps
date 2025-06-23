import type { NextConfig } from "next";

const nextConfig = {
  webpack: (config: { externals: string[]; }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};
export default nextConfig;
