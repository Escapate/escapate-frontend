/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // No bloquear el deploy por reglas de lint (los tipos sí se validan).
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
