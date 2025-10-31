import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true }
  })
  return NextResponse.json({ users })
}

export async function PATCH(req: Request) {
  const { id, role, status } = await req.json()
  if (!id) return NextResponse.json({ success: false, message: 'ID дутуу' })
  const user = await prisma.user.update({
    where: { id },
    data: { role, status }
  })
  return NextResponse.json({ success: true, user })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ success: false, message: 'ID дутуу' })
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

export async function POST(req: Request) {
  const { name, email, password, role, status } = await req.json()
  if (!name || !email || !password || !role) {
    return NextResponse.json({ success: false, message: 'Бүх талбарыг бөглөнө үү' })
  }
  // Check if email already exists
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return NextResponse.json({ success: false, message: 'И-мэйл бүртгэлтэй байна' })
  }
  const user = await prisma.user.create({
    data: { name, email, password, role, status: status || 'active' }
  })
  return NextResponse.json({ success: true, user })
}
