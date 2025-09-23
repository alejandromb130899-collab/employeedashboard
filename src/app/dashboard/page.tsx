'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Role } from '@prisma/client'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Navigation } from '@/components/navigation'
import { AdminDashboard } from '@/components/admin-dashboard'
import { EmployeeDashboard } from '@/components/employee-dashboard'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const isAdmin = session.user.role === Role.ADMIN || session.user.role === Role.HR || session.user.role === Role.MANAGER

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-6">
        {isAdmin ? <AdminDashboard /> : <EmployeeDashboard />}
      </main>
    </div>
  )
}
