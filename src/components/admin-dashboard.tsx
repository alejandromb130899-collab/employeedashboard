'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  UserX,
  Clock,
  DollarSign,
  Calendar,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Role, RequestStatus } from '@prisma/client'

interface Employee {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  position?: string
  department?: string
  hireDate?: string
  salary?: number
  phone?: string
  address?: string
  emergencyContact?: string
  user: {
    id: string
    email: string
    name?: string
    role: Role
  }
}

interface Request {
  id: string
  status: RequestStatus
  createdAt: string
  employee: {
    firstName: string
    lastName: string
    employeeCode: string
    user: {
      name?: string
      email: string
    }
  }
}

export function AdminDashboard() {
  const { data: session } = useSession()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'requests'>('overview')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch employees
      const employeesResponse = await fetch('/api/employees')
      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json()
        setEmployees(employeesData.employees)
      }

      // Fetch requests
      const requestsPromises = [
        fetch('/api/requests/vacation'),
        fetch('/api/requests/fund'),
        fetch('/api/requests/general')
      ]

      const responses = await Promise.all(requestsPromises)
      const allRequests: Request[] = []

      for (const response of responses) {
        if (response.ok) {
          const data = await response.json()
          allRequests.push(...data.requests)
        }
      }

      setRequests(allRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveRequest = async (requestId: string, type: 'vacation' | 'fund' | 'general') => {
    try {
      const response = await fetch(`/api/requests/${type}/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: RequestStatus.APPROVED }),
      })

      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Error approving request:', error)
    }
  }

  const handleRejectRequest = async (requestId: string, type: 'vacation' | 'fund' | 'general') => {
    try {
      const response = await fetch(`/api/requests/${type}/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: RequestStatus.REJECTED }),
      })

      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment
    
    return matchesSearch && matchesDepartment
  })

  const pendingRequests = requests.filter(req => req.status === RequestStatus.PENDING)
  const departments = Array.from(new Set(employees.map(emp => emp.department).filter(Boolean)))

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.APPROVED:
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case RequestStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-red-500" />
      case RequestStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
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
          {session?.user.role === Role.ADMIN ? 'Admin Dashboard' : 
           session?.user.role === Role.HR ? 'HR Dashboard' : 'Manager Dashboard'}
        </h1>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          Manage employees and review requests
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200/60 mb-8 animate-slide-in-left">
        <nav className="-mb-px flex space-x-1 bg-gray-50/50 rounded-t-xl p-1">
          {['overview', 'employees', 'requests'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-3 px-6 font-semibold text-sm capitalize rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-md border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in-scale">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        {employees.length}
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
                        Pending Requests
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 mt-1">
                        {pendingRequests.length}
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
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-semibold text-gray-600 truncate">
                        Departments
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 mt-1">
                        {departments.length}
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
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-semibold text-gray-600 truncate">
                        Approved Today
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 mt-1">
                        {requests.filter(req => 
                          req.status === RequestStatus.APPROVED && 
                          new Date(req.createdAt).toDateString() === new Date().toDateString()
                        ).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
            <div className="px-6 py-8 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Recent Requests
              </h3>
              <div className="space-y-4">
                {requests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors duration-200 border border-gray-200/50">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(request.status)}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {request.employee.firstName} {request.employee.lastName}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                      request.status === RequestStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                      request.status === RequestStatus.APPROVED ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No requests found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="space-y-8 animate-fade-in-scale">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-12 pr-4 py-3 w-full text-base"
                />
              </div>
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="form-input px-4 py-3 text-base min-w-48"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Employees Table */}
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="table-professional">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                      <td className="px-6 py-5 whitespace-nowrap">
                      <div>
                          <div className="text-sm font-semibold text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                          <div className="text-sm text-gray-600 font-medium">
                          {employee.user.email}
                        </div>
                          <div className="text-xs text-gray-500 font-medium bg-gray-100 rounded-md px-2 py-1 inline-block mt-1">
                          {employee.employeeCode}
                        </div>
                      </div>
                    </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.position || 'N/A'}
                    </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.department || 'N/A'}
                    </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                        employee.user.role === Role.ADMIN ? 'bg-purple-100 text-purple-800' :
                        employee.user.role === Role.HR ? 'bg-blue-100 text-blue-800' :
                        employee.user.role === Role.MANAGER ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {employee.user.role}
                      </span>
                    </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                          <button className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200">
                          <Edit className="h-4 w-4" />
                        </button>
                        {session?.user.role === Role.ADMIN && (
                            <button className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-8 animate-fade-in-scale">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-8 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Pending Requests
              </h3>
              <div className="space-y-6">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900">
                          {request.employee.firstName} {request.employee.lastName}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium mt-1">
                          {request.employee.employeeCode} • {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApproveRequest(request.id, 'vacation')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id, 'vacation')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingRequests.length === 0 && (
                  <div className="text-center py-16">
                    <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-semibold text-lg">No pending requests</p>
                    <p className="text-gray-400 text-sm mt-2">All requests have been processed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
