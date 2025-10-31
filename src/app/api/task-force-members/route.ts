import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Томилгоот багт гишүүн нэмэх
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskForceId, officerId, role, joinDate } = body

    // Аль хэдийн гишүүн байгаа эсэхийг шалгах
    const existingMember = await prisma.taskForceMember.findUnique({
      where: {
        taskForceId_officerId: {
          taskForceId: parseInt(taskForceId),
          officerId: parseInt(officerId)
        }
      }
    })

    if (existingMember) {
      return NextResponse.json({ 
        success: false, 
        message: 'Энэ ажилтан аль хэдийн багт орсон байна' 
      }, { status: 400 })
    }

    const member = await prisma.taskForceMember.create({
      data: {
        taskForceId: parseInt(taskForceId),
        officerId: parseInt(officerId),
        role,
        joinDate
      },
      include: {
        officer: true
      }
    })

    return NextResponse.json({ success: true, member })
  } catch (error) {
    console.error('Алдаа:', error)
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' }, { status: 500 })
  }
}

// DELETE - Томилгоот багаас гишүүнийг хасах
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    await prisma.taskForceMember.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Алдаа:', error)
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' }, { status: 500 })
  }
}

// PATCH - Гишүүний мэдээллийг засах
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const member = await prisma.taskForceMember.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        officer: true
      }
    })

    return NextResponse.json({ success: true, member })
  } catch (error) {
    console.error('Алдаа:', error)
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' }, { status: 500 })
  }
}
