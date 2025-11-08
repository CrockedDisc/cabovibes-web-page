import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vsdvaupohzzibwlvubnq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/Cabovibes/**",
      },
    ],
  },
};

export default nextConfig;
