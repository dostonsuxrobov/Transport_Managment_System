import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Transport_Managment_System',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
