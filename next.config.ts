import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "cxk4sb4b-3000.asse.devtunnels.ms",
        "*.asse.devtunnels.ms",
      ],
    },
  },
};

export default nextConfig;
