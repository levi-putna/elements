import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/elements",
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: "/elements",
  },
};

export default nextConfig;
