import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json()
  if (!name || !email || !password) {
    return NextResponse.json({ success: false, message: 'Бүх талбарыг бөглөнө үү' })
  }
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ success: false, message: 'И-мэйл бүртгэлтэй байна' })
  }
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hash, role: role || 'user', status: 'active' }
  })
  return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}
