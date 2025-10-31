import { NextRequest, NextResponse } from 'next/server'

// GET - Бүх томилгоот багийн жагсаалт
export async function GET() {
  try {
    // Mock data - ирээдүйд Prisma ашиглах
    const taskForces = [
      {
        id: 1,
        name: "Зуны аюулгүй байдлын баг",
        description: "Зуны улиралын аюулгүй байдлыг хангах",
        objective: "Зуны улиралд иргэдийн аюулгүй байдлыг хангах, гэмт хэргээс урьдчилан сэргийлэх",
        startDate: "2024-06-01",
        endDate: "2024-08-31", 
        status: "active",
        priority: "high",
        location: "Улаанбаатар хот",
        commander: "Ахлах байцаагч Б.Төмөр",
        members: [
          {
            id: 1,
            taskForceId: 1,
            officerId: 1,
            role: "Багийн гишүүн",
            joinDate: "2024-06-01",
            status: "active",
            officer: {
              id: 1,
              badge: "001",
              firstName: "Цэрэн",
              lastName: "Болд", 
              rank: "Байцаагч",
              department: "Гэмт хэргийн цагдаа"
            }
          },
          {
            id: 2,
            taskForceId: 1,
            officerId: 3,
            role: "Мэдээллийн ажилтан",
            joinDate: "2024-06-01",
            status: "active",
            officer: {
              id: 3,
              badge: "003",
              firstName: "Даваа",
              lastName: "Оюун",
              rank: "Цагдаа", 
              department: "Цагдаагийн байгууллага"
            }
          }
        ],
        activities: [],
        createdAt: "2024-06-01T00:00:00.000Z",
        updatedAt: "2024-06-01T00:00:00.000Z"
      },
      {
        id: 2,
        name: "Мансууруулах бодисын эсрэг тэмцэх баг",
        description: "Мансууруулах бодисын эсрэг тэмцэх ажиллагаа",
        objective: "Мансууруулах бодисын худалдаа, хэрэглээний эсрэг тэмцэх",
        startDate: "2024-01-01",
        endDate: null,
        status: "active", 
        priority: "high",
        location: "Улаанбаатар хот, орон нутаг",
        commander: "Дэслэгч Г.Баяр",
        members: [
          {
            id: 3,
            taskForceId: 2,
            officerId: 4,
            role: "Багийн ахлагч",
            joinDate: "2024-01-01",
            status: "active",
            officer: {
              id: 4,
              badge: "004",
              firstName: "Ганбат",
              lastName: "Баяр",
              rank: "Дэслэгч",
              department: "Онцгой байдлын цагдаа"
            }
          },
          {
            id: 4,
            taskForceId: 2,
            officerId: 5,
            role: "Аналитикч",
            joinDate: "2024-01-15",
            status: "active", 
            officer: {
              id: 5,
              badge: "005",
              firstName: "Мөнхтуга",
              lastName: "Эрдэнэ",
              rank: "Ахлах цагдаа",
              department: "Дотоод аюулгүй байдал"
            }
          }
        ],
        activities: [],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      }
    ]
    
    return NextResponse.json({ success: true, taskForces })
  } catch (error) {
    console.error('Алдаа:', error)
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' }, { status: 500 })
  }
}

// POST - Шинэ томилгоот баг үүсгэх
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, description, objective, startDate, endDate, 
      priority, location, commander 
    } = body

    // Mock response - ирээдүйд Prisma ашиглах
    const taskForce = {
      id: Date.now(),
      name,
      description: description || null,
      objective,
      startDate,
      endDate: endDate || null,
      priority: priority || 'medium',
      location: location || null,
      commander,
      status: 'active',
      members: [],
      activities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ success: true, taskForce })
  } catch (error) {
    console.error('Алдаа:', error)
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' }, { status: 500 })
  }
}

// PATCH - Томилгоот багийн мэдээллийг засах
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    // Mock response - ирээдүйд Prisma ашиглах
    const taskForce = {
      id: parseInt(id),
      ...updateData,
      updatedAt: new Date().toISOString(),
      members: [],
      activities: []
    }

    return NextResponse.json({ success: true, taskForce })
  } catch (error) {
    console.error('Алдаа:', error)
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' }, { status: 500 })
  }
}

// DELETE - Томилгоот багийг устгах
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    // Mock response - ирээдүйд Prisma ашиглах
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Алдаа:', error)
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' }, { status: 500 })
  }
}
