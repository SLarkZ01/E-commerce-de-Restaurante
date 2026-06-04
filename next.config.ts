import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "chart.js",
      "react-chartjs-2",
      "@base-ui/react",
    ],
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default withBundleAnalyzer(nextConfig);
