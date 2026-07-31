/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; img-src 'self' https://img.youtube.com data: blob:;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;