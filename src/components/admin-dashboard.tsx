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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {session?.user.role === Role.ADMIN ? 'Admin Dashboard' : 
           session?.user.role === Role.HR ? 'HR Dashboard' : 'Manager Dashboard'}
        </h1>
        <p className="mt-2 text-gray-600">
          Manage employees and review requests
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'employees', 'requests'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Employees
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {employees.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Requests
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {pendingRequests.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Departments
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {departments.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Approved Today
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
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
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Requests
              </h3>
              <div className="space-y-3">
                {requests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {request.employee.firstName} {request.employee.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === RequestStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                      request.status === RequestStatus.APPROVED ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employees Tab */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Employees Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.user.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {employee.employeeCode}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.position || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        employee.user.role === Role.ADMIN ? 'bg-purple-100 text-purple-800' :
                        employee.user.role === Role.HR ? 'bg-blue-100 text-blue-800' :
                        employee.user.role === Role.MANAGER ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {employee.user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        {session?.user.role === Role.ADMIN && (
                          <button className="text-red-600 hover:text-red-900">
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
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Pending Requests
              </h3>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {request.employee.firstName} {request.employee.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {request.employee.employeeCode} • {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveRequest(request.id, 'vacation')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id, 'vacation')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No pending requests</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
