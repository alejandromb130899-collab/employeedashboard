'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  PiggyBank,
  TrendingUp,
  User,
  Building,
  Phone,
  Mail
} from 'lucide-react'

interface EmployeeStats {
  attendanceRate: number
  presentDays: number
  totalDays: number
  lateDays: number
  absentDays: number
  dailySalary: number
  monthlySalary: number
  savingsBox: number
  savingsFund: number
  pendingRequests: number
}

export function EmployeeMainDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<EmployeeStats>({
    attendanceRate: 0,
    presentDays: 0,
    totalDays: 0,
    lateDays: 0,
    absentDays: 0,
    dailySalary: 0,
    monthlySalary: 0,
    savingsBox: 0,
    savingsFund: 0,
    pendingRequests: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployeeData()
  }, [])

  const fetchEmployeeData = async () => {
    try {
      // Simulate API calls - replace with real data
      const monthlySalary = 75000 / 12 // Assuming annual salary of 75k
      const dailySalary = monthlySalary / 26 // 6-day work week
      
      setStats({
        attendanceRate: 94.2,
        presentDays: 24,
        totalDays: 26,
        lateDays: 2,
        absentDays: 2,
        dailySalary: dailySalary,
        monthlySalary: monthlySalary,
        savingsBox: 12500, // Employee savings
        savingsFund: 12500, // Company 10% contribution
        pendingRequests: 3
      })
    } catch (error) {
      console.error('Error fetching employee data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateCalendarData = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    
    const calendarData = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      calendarData.push(null)
    }
    
    // Generate days with attendance data
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayOfWeek = date.getDay()
      
      // Skip Sundays (6-day work week)
      if (dayOfWeek === 0) {
        calendarData.push({ day, status: 'weekend' })
        continue
      }
      
      // Mock attendance data
      const rand = Math.random()
      let status = 'present'
      if (rand < 0.05) status = 'absent'
      else if (rand < 0.1) status = 'late'
      
      calendarData.push({ day, status })
    }
    
    return calendarData
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200'
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'absent': return 'bg-red-100 text-red-800 border-red-200'
      case 'weekend': return 'bg-gray-100 text-gray-400 border-gray-200'
      default: return 'bg-gray-50 text-gray-400 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-3 h-3" />
      case 'late': return <Clock className="w-3 h-3" />
      case 'absent': return <XCircle className="w-3 h-3" />
      default: return null
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

  const calendarData = generateCalendarData()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-scale">
      {/* Header */}
      <div className="mb-8 animate-slide-in-top">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Employee Dashboard
        </h1>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          Welcome back, {session?.user.name}. Here's your personal overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow-xl rounded-2xl card-hover border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
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
                  <dd className="text-xs text-gray-500">
                    {stats.presentDays}/{stats.totalDays} days
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
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Daily Salary
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    ${stats.dailySalary.toFixed(2)}
                  </dd>
                  <dd className="text-xs text-gray-500">
                    ${stats.monthlySalary.toFixed(0)} monthly
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
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Savings Box
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    ${stats.savingsBox.toLocaleString()}
                  </dd>
                  <dd className="text-xs text-gray-500">
                    Personal savings
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
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Company Fund
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    ${stats.savingsFund.toLocaleString()}
                  </dd>
                  <dd className="text-xs text-gray-500">
                    10% contribution
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Attendance Calendar */}
        <div className="lg:col-span-2 bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
          <div className="px-6 py-8 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Attendance Calendar</h3>
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
              {calendarData.map((dayData, index) => (
                <div key={index} className="aspect-square">
                  {dayData ? (
                    <div className={`w-full h-full border rounded-lg flex flex-col items-center justify-center text-xs cursor-pointer transition-colors ${getStatusColor(dayData.status)}`}>
                      <span className="font-medium">{dayData.day}</span>
                      {dayData.status !== 'weekend' && (
                        <div className="flex items-center space-x-1 mt-1">
                          {getStatusIcon(dayData.status)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center space-x-4 text-xs pt-4 border-t">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                <span>Late</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                <span>Absent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
            <div className="px-6 py-8 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => router.push('/dashboard/incidents')}
                  className="w-full p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
                  <p className="text-sm font-semibold text-red-900">Report Incident</p>
                  <p className="text-xs text-red-700">Submit incident report</p>
                </button>
                
                <button 
                  onClick={() => router.push('/dashboard/attendance')}
                  className="w-full p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-sm font-semibold text-blue-900">View Attendance</p>
                  <p className="text-xs text-blue-700">Detailed attendance</p>
                </button>
                
                <button 
                  onClick={() => router.push('/dashboard/savings')}
                  className="w-full p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <PiggyBank className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-sm font-semibold text-green-900">Savings Tracker</p>
                  <p className="text-xs text-green-700">Track your savings</p>
                </button>
              </div>
            </div>
          </div>

          {/* Employee Info */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
            <div className="px-6 py-8 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Employee Info</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{session?.user.name}</p>
                    <p className="text-xs text-gray-600">Employee</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{session?.user.email}</p>
                    <p className="text-xs text-gray-600">Email</p>
                  </div>
                </div>
                
                {session?.user.employee && (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Building className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{session.user.employee.position || 'Not specified'}</p>
                        <p className="text-xs text-gray-600">Position</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Building className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{session.user.employee.department || 'Not specified'}</p>
                        <p className="text-xs text-gray-600">Department</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Savings */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
          <div className="px-6 py-8 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Personal Savings Box</h3>
              <PiggyBank className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-purple-600">${stats.savingsBox.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">Total accumulated savings</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-900">Monthly Contribution</span>
                <span className="text-sm font-bold text-purple-800">$625</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-900">Months Worked</span>
                <span className="text-sm font-bold text-purple-800">20</span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Fund */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
          <div className="px-6 py-8 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Company Savings Fund</h3>
              <TrendingUp className="h-6 w-6 text-teal-600" />
            </div>
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-teal-600">${stats.savingsFund.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">Company 10% contribution</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                <span className="text-sm font-medium text-teal-900">Monthly Contribution</span>
                <span className="text-sm font-bold text-teal-800">$625</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                <span className="text-sm font-medium text-teal-900">Total Combined</span>
                <span className="text-sm font-bold text-teal-800">${(stats.savingsBox + stats.savingsFund).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}