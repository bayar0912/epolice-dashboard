/** @type {import('next').NextConfig} */
const nextConfig = {
  // Дотоод сүлжээгээр хандах боломжийг идэвхжүүлэх
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // cPanel/Plesk зэрэг Node сервер дээр байршуулж ажиллуулахын тулд standalone build үүсгэнэ
  // Энэ нь `.next/standalone` хавтасыг үүсгэж, `node .next/standalone/server.js`-аар ажиллуулна
  output: 'standalone',
  // Бүх IP хаягуудаас хандах боломжтой болгох
  async rewrites() {
    return []
  },
  // Хөгжүүлэлтийн үеийн хост тохиргоо
  devIndicators: {
    buildActivity: true,
  },
  // Статик файлуудын хандалт
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Сүлжээний хандалтын тохиргоо
  trailingSlash: false,
}

module.exports = nextConfig
