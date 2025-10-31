const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUsers() {
  try {
    // Test users to create
    const testUsers = [
      {
        name: 'Б.Болдбаатар',
        email: 'boldbaatar@police.gov.mn',
        password: 'user123',
        role: 'admin',
        status: 'active',
        badge: 'P001',
        location: 'Баянзүрх дүүрэг',
        cases: 15
      },
      {
        name: 'Д.Түмэндэмбэрэл',
        email: 'tumendemberel@police.gov.mn',
        password: 'user123',
        role: 'readwrite',
        status: 'active',
        badge: 'P002',
        location: 'Сүхбаатар дүүрэг',
        cases: 8
      },
      {
        name: 'С.Энхбаяр',
        email: 'enkhbayar@police.gov.mn',
        password: 'user123',
        role: 'readonly',
        status: 'active',
        badge: 'P003',
        location: 'Чингэлтэй дүүрэг',
        cases: 3
      }
    ]

    for (const userData of testUsers) {
      // Check if user already exists
      const existing = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (existing) {
        console.log(`ℹ️  ${userData.name} (${userData.email}) аль хэдийн байна`)
        continue
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      // Create user
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword
        }
      })

      console.log(`✅ ${user.name} (${user.role}) амжилттай үүсгэгдлээ`)
    }

    console.log('')
    console.log('📋 Хэрэглэгчдийн жагсаалт:')
    console.log('┌─────────────────────────────────────────────────────────────┐')
    console.log('│ И-мэйл                        │ Нууц үг │ Роль       │ Нэр    │')
    console.log('├─────────────────────────────────────────────────────────────┤')
    console.log('│ admin@police.gov.mn           │ admin123 │ superadmin │ Админ  │')
    console.log('│ boldbaatar@police.gov.mn      │ user123  │ admin      │ Болдо  │')
    console.log('│ tumendemberel@police.gov.mn   │ user123  │ readwrite  │ Түмэн  │')
    console.log('│ enkhbayar@police.gov.mn       │ user123  │ readonly   │ Энхбаяр│')
    console.log('└─────────────────────────────────────────────────────────────┘')

  } catch (error) {
    console.error('❌ Хэрэглэгч үүсгэхэд алдаа гарлаа:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUsers()
