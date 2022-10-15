/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA({
  dest: 'public',
  runtimeCaching,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
