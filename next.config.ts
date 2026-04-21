import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Seminar form uploads up to 4 × ~10MB PDFs in one shot.
      // Plus other single-file uploads. 50mb gives headroom.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
