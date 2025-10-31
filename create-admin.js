const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'superadmin'
      }
    })

    if (existingAdmin) {
      console.log('✅ SuperAdmin хэрэглэгч аль хэдийн байна:')
      console.log(`   И-мэйл: ${existingAdmin.email}`)
      console.log(`   Нэр: ${existingAdmin.name}`)
      console.log(`   Роль: ${existingAdmin.role}`)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Системийн админ',
        email: 'admin@police.gov.mn',
        password: hashedPassword,
        role: 'superadmin',
        status: 'active',
        badge: 'ADMIN001',
        location: 'Улаанбаатар хот',
        cases: 0
      }
    })

    console.log('✅ Админ хэрэглэгч амжилттай үүсгэгдлээ!')
    console.log('📧 И-мэйл: admin@police.gov.mn')
    console.log('🔑 Нууц үг: admin123')
    console.log('👤 Роль: superadmin')
    console.log('')
    console.log('⚠️  АНХААРУУЛГА: Нууц үгийг аюулгүйн үүднээс өөрчилнө үү!')

  } catch (error) {
    console.error('❌ Админ үүсгэхэд алдаа гарлаа:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
