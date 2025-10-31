const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAdminStatus() {
  try {
    console.log('🔍 Админ эрхийн шалгалт хийж байна...\n')

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        badge: true,
        location: true
      },
      orderBy: {
        role: 'desc'
      }
    })

    if (users.length === 0) {
      console.log('❌ Системд хэрэглэгч байхгүй байна!')
      return
    }

    console.log('👥 Системд бүртгэгдсэн хэрэглэгчид:')
    console.log('┌─────┬──────────────────────┬─────────────────────────────┬─────────────┬─────────┬─────────┐')
    console.log('│ ID  │ Нэр                  │ И-мэйл                      │ Роль        │ Статус  │ Тэмдэг  │')
    console.log('├─────┼──────────────────────┼─────────────────────────────┼─────────────┼─────────┼─────────┤')

    users.forEach(user => {
      const id = user.id.toString().padEnd(3)
      const name = user.name.padEnd(20)
      const email = user.email.padEnd(29)
      const role = user.role.padEnd(11)
      const status = user.status.padEnd(7)
      const badge = (user.badge || '').padEnd(7)
      
      let roleIcon = ''
      if (user.role === 'superadmin') roleIcon = '👑'
      else if (user.role === 'admin') roleIcon = '🛡️ '
      else if (user.role === 'readwrite') roleIcon = '✏️ '
      else if (user.role === 'readonly') roleIcon = '👁️ '

      console.log(`│ ${id} │ ${name} │ ${email} │ ${roleIcon}${role} │ ${status} │ ${badge} │`)
    })

    console.log('└─────┴──────────────────────┴─────────────────────────────┴─────────────┴─────────┴─────────┘')

    // Check admin permissions
    const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'superadmin')
    
    console.log('\n🔐 Админ эрхтэй хэрэглэгчид:')
    if (adminUsers.length === 0) {
      console.log('❌ Админ эрхтэй хэрэглэгч байхгүй!')
    } else {
      adminUsers.forEach(admin => {
        console.log(`✅ ${admin.name} (${admin.email}) - ${admin.role}`)
      })
    }

    // Check menu permissions
    const menus = await prisma.menu.findMany()
    const adminMenus = menus.filter(menu => 
      menu.roles.includes('admin') || menu.roles.includes('superadmin')
    )

    console.log('\n📋 Админд зориулсан цэсүүд:')
    adminMenus.forEach(menu => {
      console.log(`  • ${menu.name} (${menu.path})`)
    })

    console.log('\n🔑 Нэвтрэхийн тулд дараах мэдээллийг ашиглана уу:')
    console.log('┌─────────────────────────────────┬──────────┬─────────────┐')
    console.log('│ И-мэйл                          │ Нууц үг │ Роль        │')
    console.log('├─────────────────────────────────┼──────────┼─────────────┤')
    console.log('│ admin@police.gov.mn             │ admin123 │ superadmin  │')
    console.log('│ boldbaatar@police.gov.mn        │ user123  │ admin       │')
    console.log('└─────────────────────────────────┴──────────┴─────────────┘')

    console.log('\n🌐 Системийн хаяг: http://localhost:3000')
    console.log('🔗 Нэвтрэх хуудас: http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Алдаа гарлаа:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdminStatus()
