import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock menu data with correct Mongolian text and proper paths that match page.tsx switch cases
    const menus = [
      { id: 1, name: "Дашбоард", path: "/dashboard", roles: "all" },
      { id: 2, name: "Харанхуй дашбоард", path: "/dark-dashboard", roles: "all" },
      { id: 3, name: "Дуудлага", path: "/calls", roles: "all" },
      { id: 4, name: "Хэргүүд", path: "/cases", roles: "all" },
      { id: 5, name: "Газрын зураг", path: "/map", roles: "all" },
      { id: 6, name: "Өгөгдлийн сан", path: "/database", roles: "admin" },
      { id: 7, name: "Тайлан", path: "/reports", roles: "all" },
      { id: 8, name: "Ажилтнууд", path: "/officers", roles: "admin" },
      { id: 9, name: "Зурвас", path: "/messages", roles: "all" },
      { id: 10, name: "Гомдол", path: "/complaints", roles: "all" },
      { id: 11, name: "Дуудлагын тохиргоо", path: "/call-settings", roles: "admin" },
      { id: 12, name: "Хэрэглэгчид", path: "/admin/users", roles: "admin" },
      { id: 13, name: "Эрхийн бүтэц", path: "/admin/roles", roles: "admin" },
      { id: 14, name: "Цэсний удирдлага", path: "/admin/menu", roles: "admin" },
      { id: 15, name: "Томилгоот баг", path: "/task-forces", roles: "admin" },
      { id: 16, name: "Цагличийн хуваарь", path: "/calendar", roles: "all" }
    ]
    
    return NextResponse.json({ menus }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Menu fetch error:', error)
    return NextResponse.json({ menus: [] }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }
}

export async function POST(req: Request) {
  try {
    const { name, path, roles, userId } = await req.json()
    if (!name || !path || !roles) {
      return NextResponse.json({ success: false, message: 'Бүх талбарыг бөглөнө үү' })
    }
    
    // Mock response
    const menu = {
      id: Date.now(),
      name,
      path,
      roles,
      userId: userId ? parseInt(userId) : null
    }
    
    return NextResponse.json({ success: true, menu })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, name, path, roles, userId } = await req.json()
    if (!id || !name || !path || !roles) {
      return NextResponse.json({ success: false, message: 'Бүх талбарыг бөглөнө үү' })
    }
    
    // Mock response
    const menu = {
      id,
      name,
      path,
      roles,
      userId: userId ? parseInt(userId) : null
    }
    
    return NextResponse.json({ success: true, menu })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ success: false, message: 'ID дутуу' })
    
    // Mock response
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Серверийн алдаа' })
  }
}
