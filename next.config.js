/** @type {import('next').NextConfig} */
const nextConfig = {
  // Дотоод сүлжээгээр хандах боломжийг идэвхжүүлэх
  experimental: {
    serverComponentsExternalPackages: [],
  },
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
