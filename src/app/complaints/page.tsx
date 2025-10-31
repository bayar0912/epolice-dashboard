'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ComplaintManagement from '../../components/ComplaintManagement'

export default function ComplaintsPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (!userStr) {
      router.push('/login')
      return
    }
  }, [router])

  return <ComplaintManagement />
}
