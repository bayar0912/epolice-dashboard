import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Бүх цагдаагын ажилтануудын жагсаалт
export async function GET() {
  try {
    // Эхлээд mock data ашиглая
    const officers = [
      {
        id: 1,
        badge: "001",
        firstName: "Цэрэн",
        lastName: "Болд",
        rank: "Байцаагч",
        department: "Гэмт хэргийн цагдаа",
        position: "Мөрдөгч",
        phone: "99112233",
        email: "tseren.bold@police.gov.mn",
        status: "active",
        hireDate: "2020-01-15"
      },
      {
        id: 2,
        badge: "002",
        firstName: "Батбаяр",
        lastName: "Төмөр",
        rank: "Ахлах байцаагч",
        department: "Замын цагдаа",
        position: "Ахлагч",
        phone: "99223344",
        email: "batbayar.tumor@police.gov.mn", 
        status: "active",
        hireDate: "2018-03-10"
      },
      {
        id: 3,
        badge: "003",
        firstName: "Даваа",
        lastName: "Оюун",
        rank: "Цагдаа",
        department: "Цагдаагийн байгууллага",
        position: "Мэдээллийн ажилтан",
        phone: "99334455",
        status: "active",
        hireDate: "2021-06-20"
      },
      {
        id: 4,
        badge: "004", 
        firstName: "Ганбат",
        lastName: "Баяр",
        rank: "Дэслэгч",
        department: "Онцгой байдлын цагдаа",
        position: "Багийн ахлагч",
        phone: "99445566",
        status: "active",
        hireDate: "2015-09-01"
      },
      {
        id: 5,
        badge: "005",
        firstName: "Мөнхтуга",
        lastName: "Эрдэнэ", 
        rank: "Ахлах цагдаа",
        department: "Дотоод аюулгүй байдал",
        position: "Аналитикч",
        phone: "99556677",
        status: "active",
        hireDate: "2019-11-12"
      }
    ]
    
    return NextResponse.json({ success: true, officers })
  } catch (error) {
    console.error('Алдаа:', error)
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' }, { status: 500 })
  }
}

// POST - Шинэ цагдаагын ажилтан нэмэх  
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      badge, firstName, lastName, rank, department, position, 
      phone, email, address, birthDate, hireDate, photo 
    } = body

    // Mock response - ирээдүйд Prisma ашиглах
    const officer = {
      id: Date.now(),
      badge,
      firstName,
      lastName,
      rank,
      department,
      position,
      phone,
      email: email || null,
      address: address || null,
      birthDate: birthDate || null,
      hireDate,
      photo: photo || null,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ success: true, officer })
  } catch (error) {
    console.error('Алдаа:', error)
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' }, { status: 500 })
  }
}

// PATCH - Цагдаагын ажилтны мэдээллийг засах
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    // Mock response - ирээдүйд Prisma ашиглах
    const officer = {
      id: parseInt(id),
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ success: true, officer })
  } catch (error) {
    console.error('Алдаа:', error)
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' }, { status: 500 })
  }
}

// DELETE - Цагдаагын ажилтны бүртгэлийг устгах
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
