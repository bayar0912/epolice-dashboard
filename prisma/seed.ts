const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  // Seed Roles
  await prisma.role.createMany({
    data: [
      { name: 'superadmin', description: 'System super administrator' },
      { name: 'admin', description: 'Administrator' },
      { name: 'readwrite', description: 'Standard user with write permissions' },
      { name: 'readonly', description: 'Read-only user' },
    ],
    skipDuplicates: true,
  })

  // Seed default call types and categories
  await prisma.callType.createMany({
    data: [
      { name: 'Яаралтай дуудлага' },
      { name: 'Энгийн дуудлага' },
      { name: 'Тусламж' },
    ],
    skipDuplicates: true,
  })

  await prisma.callCategory.createMany({
    data: [
      { name: 'Зам тээвэр' },
      { name: 'Хулгай' },
      { name: 'Зөрчил' },
      { name: 'Гэр бүлийн хүчирхийлэл' },
    ],
    skipDuplicates: true,
  })

  // Main dashboard menus
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
        name: 'Зөрчлийн хэргийн мэдээлэл',
        path: '/violations',
        roles: 'admin,superadmin,readwrite,readonly',
      },
      {
        name: 'Татгалзсан бүртгэл',
        path: '/rejected-cases',
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
  console.log('Цэсүүд амжилттай нэмэгдлээ!')

  // Default admin user (only if not exists)
  const adminEmail = 'admin@epolice.local'
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existing) {
    const passwordHash = await bcrypt.hash('Admin@123456', 10)
    await prisma.user.create({
      data: {
        name: 'System Admin',
        email: adminEmail,
        password: passwordHash,
        role: 'superadmin',
        status: 'active',
      },
    })
    console.log(`Анхны админ хэрэглэгч үүсгэлээ: ${adminEmail} / нууц үг: Admin@123456`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
