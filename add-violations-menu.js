const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addViolationsMenu() {
  try {
    // Check if violations menu already exists
    const existingMenu = await prisma.menu.findFirst({
      where: {
        path: '/violations'
      }
    })
    
    if (existingMenu) {
      console.log('ℹ️  Зөрчлийн хэргийн цэс аль хэдийн байна, нэрийг шинэчилж байна...')
      await prisma.menu.update({
        where: { id: existingMenu.id },
        data: {
          name: 'Зөрчлийн хэргийн мэдээлэл'
        }
      })
    } else {
      console.log('🆕 Зөрчлийн хэргийн цэс үүсгэж байна...')
      await prisma.menu.create({
        data: {
          name: 'Зөрчлийн хэргийн мэдээлэл',
          path: '/violations',
          roles: 'admin,superadmin,readwrite,readonly'
        }
      })
    }
    
    // Check if rejected cases menu exists
    const rejectedMenu = await prisma.menu.findFirst({
      where: {
        path: '/rejected-cases'
      }
    })
    
    if (!rejectedMenu) {
      console.log('🆕 Татгалзсан бүртгэлийн цэс үүсгэж байна...')
      await prisma.menu.create({
        data: {
          name: 'Татгалзсан бүртгэл',
          path: '/rejected-cases',
          roles: 'admin,superadmin,readwrite,readonly'
        }
      })
    }
    
    console.log('✅ Цэсүүд амжилттай нэмэгдлээ!')
    
    // List all menus to verify
    const menus = await prisma.menu.findMany({
      orderBy: { id: 'asc' }
    })
    
    console.log('\n📋 Одоогийн цэсүүд:')
    menus.forEach(menu => {
      console.log(`  • ${menu.name} (${menu.path})`)
    })
    
  } catch (error) {
    console.error('❌ Алдаа гарлаа:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addViolationsMenu()
