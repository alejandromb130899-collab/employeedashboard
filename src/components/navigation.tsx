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
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                HR Management
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{session.user.name}</p>
                  <p className="text-gray-500">{getRoleDisplay(session.user.role)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
