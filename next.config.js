/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
   async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          
        ],
      },
    ];
  }
}

module.exports = nextConfig