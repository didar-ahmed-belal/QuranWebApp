import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static Site Generation: full static export
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
};

export default nextConfig;
