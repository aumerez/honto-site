import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/case-studies",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/case-studies/bulwark",
        destination: "/work/bulwark",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
