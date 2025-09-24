'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  BarChart3,
  UserCheck,
  FileText,
  Shield
} from 'lucide-react'

interface DashboardStats {
  totalEmployees: number
  activeRequests: number
  monthlyPayroll: number
  attendanceRate: number
  incidentCount: number
  approvedRequests: number
}

export function AdminMainDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeRequests: 0,
    monthlyPayroll: 0,
    attendanceRate: 0,
    incidentCount: 0,
    approvedRequests: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls - replace with real data
      setStats({
        totalEmployees: 156,
        activeRequests: 23,
        monthlyPayroll: 1250000,
        attendanceRate: 94.5,
        incidentCount: 7,
        approvedRequests: 89
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-scale">
      {/* Header */}
      <div className="mb-8 animate-slide-in-top">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Administrator Dashboard
        </h1>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          Welcome back, {session?.user.name}. Here's your system overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow-xl rounded-2xl card-hover border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Total Employees
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.totalEmployees}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-xl rounded-2xl card-hover border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Active Requests
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.activeRequests}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-xl rounded-2xl card-hover border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Monthly Payroll
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    ${(stats.monthlyPayroll / 1000).toFixed(0)}K
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-xl rounded-2xl card-hover border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Attendance Rate
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.attendanceRate}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-xl rounded-2xl card-hover border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Open Incidents
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.incidentCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-xl rounded-2xl card-hover border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Approved Today
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.approvedRequests}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* System Overview */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
          <div className="px-6 py-8 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">System Overview</h3>
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Building className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">System Status</p>
                    <p className="text-xs text-blue-700">All systems operational</p>
                  </div>
                </div>
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Performance</p>
                    <p className="text-xs text-green-700">Excellent system performance</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-800">98.5%</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-purple-900">Active Users</p>
                    <p className="text-xs text-purple-700">Currently online</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-purple-800">142</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
          <div className="px-6 py-8 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200 text-left">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm font-semibold text-blue-900">Add Employee</p>
                <p className="text-xs text-blue-700">Create new employee</p>
              </button>
              
              <button className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200 text-left">
                <FileText className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-sm font-semibold text-green-900">Review Requests</p>
                <p className="text-xs text-green-700">Pending approvals</p>
              </button>
              
              <button className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-200 text-left">
                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                <p className="text-sm font-semibold text-purple-900">View Analytics</p>
                <p className="text-xs text-purple-700">System reports</p>
              </button>
              
              <button className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-200 text-left">
                <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
                <p className="text-sm font-semibold text-orange-900">Incidents</p>
                <p className="text-xs text-orange-700">Manage incidents</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
        <div className="px-6 py-8 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent System Activity</h3>
          <div className="space-y-4">
            {[
              { type: 'user', message: 'New employee John Smith added to Engineering', time: '2 minutes ago', color: 'blue' },
              { type: 'request', message: 'Vacation request approved for Jane Doe', time: '15 minutes ago', color: 'green' },
              { type: 'incident', message: 'IT incident resolved - Network connectivity', time: '1 hour ago', color: 'orange' },
              { type: 'system', message: 'Monthly payroll processed successfully', time: '2 hours ago', color: 'purple' },
              { type: 'alert', message: 'System backup completed', time: '3 hours ago', color: 'teal' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors duration-200 border border-gray-200/50">
                <div className={`w-10 h-10 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
                  {activity.type === 'user' && <Users className={`w-5 h-5 text-${activity.color}-600`} />}
                  {activity.type === 'request' && <FileText className={`w-5 h-5 text-${activity.color}-600`} />}
                  {activity.type === 'incident' && <AlertTriangle className={`w-5 h-5 text-${activity.color}-600`} />}
                  {activity.type === 'system' && <Building className={`w-5 h-5 text-${activity.color}-600`} />}
                  {activity.type === 'alert' && <CheckCircle className={`w-5 h-5 text-${activity.color}-600`} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-600 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}