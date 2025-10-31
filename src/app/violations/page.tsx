'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import ViolationCaseManagement from '../../components/ViolationCaseManagement'

function ViolationsContent() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (!userStr) {
      router.push('/login')
      return
    }
  }, [router])

  return <ViolationCaseManagement />
}

export default function ViolationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViolationsContent />
    </Suspense>
  )
}
