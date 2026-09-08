/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // derive hostname from env var so it stays in sync
        hostname: new URL(process.env.NEXT_PUBLIC_S3_BASE_URL).hostname,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
