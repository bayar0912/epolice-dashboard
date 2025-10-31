const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateMenu() {
  try {
    // Update the violations menu name
    await prisma.menu.updateMany({
      where: {
        path: '/violations'
      },
      data: {
        name: 'Зөрчлийн хэргийн мэдээлэл'
      }
    })
    
    console.log('✅ Зөрчлийн хэргийн цэсийн нэр амжилттай шинэчлэгдлээ!')
    
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

updateMenu()
