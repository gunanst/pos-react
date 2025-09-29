/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ['http://192.168.100.234:3000'],
    serverActions: true,
  },

};

module.exports = nextConfig;
