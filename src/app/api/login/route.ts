import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ success: false, message: 'И-мэйл буруу байна' })
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return NextResponse.json({ success: false, message: 'Нууц үг буруу байна' })
  }
  // TODO: Set session/cookie here
  return NextResponse.json({ success: true, user: { id: user.id, name: user.name, role: user.role } })
}
