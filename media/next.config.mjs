/** @type {import('next').NextConfig} */
const nextConfig = {
  // HP（site/）と同じく静的出力し、さくらVPSの nginx で配信する
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true },
};

export default nextConfig;
