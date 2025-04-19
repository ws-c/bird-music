/**​ @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https', // 允许 HTTPS 协议
        hostname: '*', // 允许任何域名
      },
      {
        protocol: 'http', // 允许 HTTP 协议
        hostname: '*', // 允许任何域名
      },
    ],
  },
};

export default config;