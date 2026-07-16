/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — required for Cloudflare Pages.
  output: "export",
  reactStrictMode: true,
  images: {
    // next/image optimization isn't available on a static export; our images
    // are already pre-optimized, so serve them as-is.
    unoptimized: true,
  },
  eslint: {
    // No bloquear el deploy por reglas de lint (los tipos sí se validan).
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
