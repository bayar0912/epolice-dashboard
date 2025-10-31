const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Delete all existing menus first
  await prisma.menu.deleteMany({})
  
  // Add menus with proper unicode encoding
  await prisma.menu.createMany({
    data: [
      {
        name: 'Ерөнхий',
        path: '/dashboard',
        roles: 'admin,superadmin,readwrite,readonly',
      },
      {
        name: 'Дуудлага',
        path: '/calls',
        roles: 'admin,superadmin,readwrite,readonly',
      },
      {
        name: 'Гомдол мэдээлэл',
        path: '/cases',
        roles: 'admin,superadmin,readwrite,readonly',
      },
      {
        name: 'Газрын зураг',
        path: '/map',
        roles: 'admin,superadmin,readwrite,readonly',
      },
      {
        name: 'Өгөгдлийн сан',
        path: '/database',
        roles: 'admin,superadmin,readwrite',
      },
      {
        name: 'Гэмт хэргийн мэдээлэл',
        path: '/reports',
        roles: 'admin,superadmin,readwrite',
      },
      {
        name: 'Ажилтнууд',
        path: '/officers',
        roles: 'admin,superadmin,readwrite',
      },
      {
        name: 'Зурвас',
        path: '/messages',
        roles: 'admin,superadmin,readwrite',
      },
      {
        name: 'Гомдол мэдээлэл удирдлага',
        path: '/complaints',
        roles: 'admin,superadmin,readwrite',
      },
      {
        name: 'Цэсний удирдлага',
        path: '/admin/menu',
        roles: 'admin,superadmin',
      },
      {
        name: 'Хэрэглэгчид',
        path: '/admin/users',
        roles: 'admin,superadmin',
      },
      {
        name: 'Эрхийн бүтэц',
        path: '/admin/roles',
        roles: 'admin,superadmin',
      },
    ],
    skipDuplicates: true,
  })
  console.log('Цэсүүд амжилттай шинэчлэгдлээ!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
