'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Building2, 
  LogOut, 
  User, 
  Settings,
  LayoutDashboard,
  AlertTriangle,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  PiggyBank,
  TrendingUp,
  UserCheck,
  Building,
  Shield,
  BarChart3
} from 'lucide-react'
import { Role } from '@prisma/client'

export function Navigation() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

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

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        description: 'Main dashboard'
      }
    ]

    if (session.user.role === Role.ADMIN) {
      return [
        ...baseItems,
        {
          name: 'Employee Management',
          href: '/dashboard/employees',
          icon: Users,
          description: 'Manage employees'
        },
        {
          name: 'Request Management',
          href: '/dashboard/requests',
          icon: FileText,
          description: 'Handle requests'
        },
        {
          name: 'Analytics',
          href: '/dashboard/analytics',
          icon: BarChart3,
          description: 'System analytics'
        },
        {
          name: 'System Settings',
          href: '/dashboard/settings',
          icon: Settings,
          description: 'System configuration'
        },
        {
          name: 'Incident Dashboard',
          href: '/dashboard/incidents',
          icon: AlertTriangle,
          description: 'Incident management'
        }
      ]
    }

    if (session.user.role === Role.HR) {
      return [
        ...baseItems,
        {
          name: 'Employee Management',
          href: '/dashboard/employees',
          icon: Users,
          description: 'Manage employees'
        },
        {
          name: 'Request Management',
          href: '/dashboard/requests',
          icon: FileText,
          description: 'Handle requests'
        },
        {
          name: 'Attendance',
          href: '/dashboard/attendance',
          icon: UserCheck,
          description: 'Attendance tracking'
        },
        {
          name: 'Payroll',
          href: '/dashboard/payroll',
          icon: DollarSign,
          description: 'Payroll management'
        },
        {
          name: 'Incident Dashboard',
          href: '/dashboard/incidents',
          icon: AlertTriangle,
          description: 'Incident management'
        }
      ]
    }

    if (session.user.role === Role.MANAGER) {
      return [
        ...baseItems,
        {
          name: 'Team Management',
          href: '/dashboard/team',
          icon: Users,
          description: 'Manage your team'
        },
        {
          name: 'Request Approval',
          href: '/dashboard/requests',
          icon: FileText,
          description: 'Approve requests'
        },
        {
          name: 'Team Analytics',
          href: '/dashboard/analytics',
          icon: BarChart3,
          description: 'Team performance'
        },
        {
          name: 'Incident Dashboard',
          href: '/dashboard/incidents',
          icon: AlertTriangle,
          description: 'Incident management'
        }
      ]
    }

    // Employee navigation
    return [
      ...baseItems,
      {
        name: 'Attendance',
        href: '/dashboard/attendance',
        icon: Calendar,
        description: 'View attendance'
      },
      {
        name: 'Salary Info',
        href: '/dashboard/salary',
        icon: DollarSign,
        description: 'Salary details'
      },
      {
        name: 'Savings',
        href: '/dashboard/savings',
        icon: PiggyBank,
        description: 'Savings tracking'
      },
      {
        name: 'Incident Dashboard',
        href: '/dashboard/incidents',
        icon: AlertTriangle,
        description: 'Report incidents'
      }
    ]
  }

  const navigationItems = getNavigationItems()

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

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                  }`}
                  title={item.description}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.name}</span>
                </button>
              )
            })}
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

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200/50 py-2">
          <div className="flex overflow-x-auto space-x-1 px-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}