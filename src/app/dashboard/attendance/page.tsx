'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface AttendanceRecord {
  date: string
  status: 'present' | 'absent' | 'late' | 'weekend'
  checkIn?: string
  checkOut?: string
  hoursWorked?: number
}

interface AttendanceStats {
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  attendanceRate: number
  averageHours: number
}

export default function AttendancePage() {
  const { data: session } = useSession()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats>({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    attendanceRate: 0,
    averageHours: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateAttendanceData()
  }, [currentMonth])

  const generateAttendanceData = () => {
    setLoading(true)
    
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const records: AttendanceRecord[] = []
    let presentCount = 0
    let absentCount = 0
    let lateCount = 0
    let totalWorkDays = 0
    let totalHours = 0
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayOfWeek = date.getDay()
      const dateString = date.toISOString().split('T')[0]
      
      // Skip Sundays (6-day work week)
      if (dayOfWeek === 0) {
        records.push({
          date: dateString,
          status: 'weekend'
        })
        continue
      }
      
      totalWorkDays++
      
      // Generate mock attendance data
      const rand = Math.random()
      let status: 'present' | 'absent' | 'late' = 'present'
      let checkIn = '09:00'
      let checkOut = '18:00'
      let hoursWorked = 9
      
      if (rand < 0.05) {
        status = 'absent'
        checkIn = undefined
        checkOut = undefined
        hoursWorked = 0
        absentCount++
      } else if (rand < 0.15) {
        status = 'late'
        checkIn = '09:30'
        hoursWorked = 8.5
        lateCount++
        totalHours += hoursWorked
      } else {
        presentCount++
        totalHours += hoursWorked
      }
      
      records.push({
        date: dateString,
        status,
        checkIn,
        checkOut,
        hoursWorked
      })
    }
    
    setAttendanceData(records)
    setStats({
      totalDays: totalWorkDays,
      presentDays: presentCount,
      absentDays: absentCount,
      lateDays: lateCount,
      attendanceRate: totalWorkDays > 0 ? (presentCount / totalWorkDays) * 100 : 0,
      averageHours: totalWorkDays > 0 ? totalHours / (presentCount + lateCount) : 0
    })
    
    setLoading(false)
  }

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(currentMonth.getMonth() + direction)
    setCurrentMonth(newDate)
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
      case 'present': return <CheckCircle className="w-4 h-4" />
      case 'late': return <Clock className="w-4 h-4" />
      case 'absent': return <XCircle className="w-4 h-4" />
      default: return null
    }
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

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
          Attendance Tracking
        </h1>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          Track your daily attendance and work hours
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                    {stats.attendanceRate.toFixed(1)}%
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
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Present Days
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.presentDays}
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
                    Late Days
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.lateDays}
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
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Absent Days
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.absentDays}
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
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Avg Hours
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.averageHours.toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover mb-8">
        <div className="px-6 py-8 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-sm font-semibold text-gray-600 text-center py-3">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {(() => {
              const year = currentMonth.getFullYear()
              const month = currentMonth.getMonth()
              const firstDay = new Date(year, month, 1).getDay()
              const daysInMonth = new Date(year, month + 1, 0).getDate()
              const calendarCells = []

              // Empty cells for days before month starts
              for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
                calendarCells.push(<div key={`empty-${i}`} className="aspect-square" />)
              }

              // Calendar days
              for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day)
                const dateString = date.toISOString().split('T')[0]
                const record = attendanceData.find(r => r.date === dateString)
                const status = record?.status || 'weekend'

                calendarCells.push(
                  <div key={day} className="aspect-square">
                    <div className={`w-full h-full border rounded-lg flex flex-col items-center justify-center text-sm cursor-pointer transition-all duration-200 hover:shadow-md ${getStatusColor(status)}`}>
                      <span className="font-semibold">{day}</span>
                      {record && record.status !== 'weekend' && (
                        <div className="flex items-center space-x-1 mt-1">
                          {getStatusIcon(record.status)}
                        </div>
                      )}
                      {record && record.hoursWorked && (
                        <span className="text-xs mt-1">{record.hoursWorked}h</span>
                      )}
                    </div>
                  </div>
                )
              }

              return calendarCells
            })()}
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-6 text-sm pt-6 border-t mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span>Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span>Late</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span>Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span>Weekend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
        <div className="px-6 py-8 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Attendance Records</h3>
          <div className="space-y-4">
            {attendanceData
              .filter(record => record.status !== 'weekend')
              .slice(-10)
              .reverse()
              .map((record, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors duration-200 border border-gray-200/50">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(record.status)}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      {record.checkIn && record.checkOut && (
                        <p className="text-xs text-gray-600 font-medium">
                          {record.checkIn} - {record.checkOut} ({record.hoursWorked}h)
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(record.status).replace('border-', 'border ')}`}>
                    {record.status.toUpperCase()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}