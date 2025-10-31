import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const callTypes = await prisma.callType.findMany({
      orderBy: { id: 'asc' }
    })
    return NextResponse.json({ callTypes }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Call types fetch error:', error)
    return NextResponse.json({ callTypes: [] }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }
}

export async function POST(req: Request) {
  const { name } = await req.json()
  if (!name) {
    return NextResponse.json({ success: false, message: 'Нэр шаардлагатай' })
  }
  
  try {
    const callType = await prisma.callType.create({ 
      data: { name } 
    })
    return NextResponse.json({ success: true, callType })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Алдаа гарлаа' })
  }
}

export async function PATCH(req: Request) {
  const { id, name } = await req.json()
  if (!id || !name) {
    return NextResponse.json({ success: false, message: 'ID болон нэр шаардлагатай' })
  }
  
  try {
    const callType = await prisma.callType.update({ 
      where: { id }, 
      data: { name } 
    })
    return NextResponse.json({ success: true, callType })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Алдаа гарлаа' })
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ success: false, message: 'ID шаардлагатай' })
  }
  
  try {
    await prisma.callType.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Алдаа гарлаа' })
  }
}
