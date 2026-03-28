import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Next 15 enables this by default, but in this project it corrupts the dev
    // manifest/chunk state and leaves blank previews on refresh.
    devtoolSegmentExplorer: false,
  },
  async headers() {
    return [
      {
        // Never cache translate.js — always serve fresh
        source: "/translate.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;
