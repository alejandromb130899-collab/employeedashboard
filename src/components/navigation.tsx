'use client'

import { useSession, signOut } from 'next-auth/react'
import { Building2, LogOut, User, Settings } from 'lucide-react'
import { Role } from '@prisma/client'

export function Navigation() {
  const { data: session } = useSession()

  if (!session) return null

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  const getRoleDisplay = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'Administrator'
      case Role.HR:
        return 'HR Manager'
      case Role.MANAGER:
        return 'Manager'
      case Role.EMPLOYEE:
        return 'Employee'
      default:
        return 'User'
    }
  }

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-slide-in-top">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 tracking-tight">
                HR Management
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-50/80 rounded-xl px-4 py-2">
                <div className="h-8 w-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{session.user.name}</p>
                  <p className="text-gray-600 text-xs font-medium">{getRoleDisplay(session.user.role)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200 focus-ring"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
