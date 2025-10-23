/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ add this field
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000',  // your main dev URL
      'http://10.70.108.108:3000', // your LAN IP if you access via it
    ],
  },
}

module.exports = nextConfig