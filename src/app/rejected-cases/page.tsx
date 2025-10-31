'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import RejectedCaseManagement from '../../components/RejectedCaseManagement'

function RejectedCasesContent() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (!userStr) {
      router.push('/login')
      return
    }
  }, [router])

  return <RejectedCaseManagement />
}

export default function RejectedCasesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RejectedCasesContent />
    </Suspense>
  )
}
