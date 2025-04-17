/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for app directory
  experimental: {
    appDir: true,
  },
  // Configure rewrites to proxy API requests to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/:path*',
      },
    ]
  },
}

export default nextConfig 