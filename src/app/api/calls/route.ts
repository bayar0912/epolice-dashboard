import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const call = await prisma.emergencyCall.create({
      data: {
        type: data.type,
        location: data.location,
        priority: data.priority,
        time: data.time,
        officer: data.officer
      }
    })
    return NextResponse.json({ success: true, call })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Error' }, { status: 500 })
  }
}
