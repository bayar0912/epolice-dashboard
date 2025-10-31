import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const roles = await prisma.role.findMany()
  return NextResponse.json({ roles })
}

export async function POST(req: Request) {
  const { name, description } = await req.json()
  if (!name || !description) {
    return NextResponse.json({ success: false, message: 'Бүх талбарыг бөглөнө үү' })
  }
  const exists = await prisma.role.findUnique({ where: { name } })
  if (exists) {
    return NextResponse.json({ success: false, message: 'Эрхийн нэр давхцаж байна' })
  }
  const role = await prisma.role.create({ data: { name, description } })
  return NextResponse.json({ success: true, role })
}

export async function PATCH(req: Request) {
  const { id, name, description } = await req.json()
  if (!id || !name || !description) {
    return NextResponse.json({ success: false, message: 'Бүх талбарыг бөглөнө үү' })
  }
  const role = await prisma.role.update({ where: { id }, data: { name, description } })
  return NextResponse.json({ success: true, role })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ success: false, message: 'ID дутуу' })
  await prisma.role.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
