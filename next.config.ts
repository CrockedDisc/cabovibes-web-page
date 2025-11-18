import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Configuración de webpack para builds de producción
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // Configuración para turbopack (desarrollo)
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
