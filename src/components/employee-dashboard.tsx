'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Calendar,
  DollarSign,
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building
} from 'lucide-react'
import { RequestStatus, FundType, Priority } from '@prisma/client'

interface VacationRequest {
  id: string
  startDate: string
  endDate: string
  daysRequested: number
  reason?: string
  status: RequestStatus
  createdAt: string
}

interface FundRequest {
  id: string
  fundType: FundType
  amount: number
  reason: string
  requestType: string
  status: RequestStatus
  createdAt: string
}

interface GeneralRequest {
  id: string
  requestType: string
  subject: string
  description: string
  priority: Priority
  status: RequestStatus
  createdAt: string
}

export function EmployeeDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'vacation' | 'fund' | 'general' | 'profile'>('overview')
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([])
  const [fundRequests, setFundRequests] = useState<FundRequest[]>([])
  const [generalRequests, setGeneralRequests] = useState<GeneralRequest[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [vacationForm, setVacationForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  })
  const [fundForm, setFundForm] = useState({
    fundType: 'TRAVEL' as FundType,
    amount: '',
    reason: '',
    requestType: ''
  })
  const [generalForm, setGeneralForm] = useState({
    requestType: '',
    subject: '',
    description: '',
    priority: 'MEDIUM' as Priority
  })

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      
      const [vacationRes, fundRes, generalRes] = await Promise.all([
        fetch('/api/requests/vacation'),
        fetch('/api/requests/fund'),
        fetch('/api/requests/general')
      ])

      if (vacationRes.ok) {
        const data = await vacationRes.json()
        setVacationRequests(data.requests)
      }

      if (fundRes.ok) {
        const data = await fundRes.json()
        setFundRequests(data.requests)
      }

      if (generalRes.ok) {
        const data = await generalRes.json()
        setGeneralRequests(data.requests)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitVacationRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/requests/vacation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vacationForm),
      })

      if (response.ok) {
        setVacationForm({ startDate: '', endDate: '', reason: '' })
        fetchRequests()
        alert('Vacation request submitted successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit request')
      }
    } catch (error) {
      console.error('Error submitting vacation request:', error)
      alert('Failed to submit request')
    }
  }

  const submitFundRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/requests/fund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fundForm),
      })

      if (response.ok) {
        setFundForm({ fundType: 'TRAVEL' as FundType, amount: '', reason: '', requestType: '' })
        fetchRequests()
        alert('Fund request submitted successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit request')
      }
    } catch (error) {
      console.error('Error submitting fund request:', error)
      alert('Failed to submit request')
    }
  }

  const submitGeneralRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/requests/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generalForm),
      })

      if (response.ok) {
        setGeneralForm({ requestType: '', subject: '', description: '', priority: 'MEDIUM' as Priority })
        fetchRequests()
        alert('Request submitted successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit request')
      }
    } catch (error) {
      console.error('Error submitting general request:', error)
      alert('Failed to submit request')
    }
  }

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

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.APPROVED:
        return 'bg-green-100 text-green-800'
      case RequestStatus.REJECTED:
        return 'bg-red-100 text-red-800'
      case RequestStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const allRequests = [
    ...vacationRequests.map(req => ({ ...req, type: 'vacation' })),
    ...fundRequests.map(req => ({ ...req, type: 'fund' })),
    ...generalRequests.map(req => ({ ...req, type: 'general' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const pendingCount = allRequests.filter(req => req.status === RequestStatus.PENDING).length

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
        <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {session?.user.name || session?.user.email}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: AlertCircle },
            { key: 'vacation', label: 'Vacation', icon: Calendar },
            { key: 'fund', label: 'Fund Requests', icon: DollarSign },
            { key: 'general', label: 'General', icon: FileText },
            { key: 'profile', label: 'Profile', icon: User }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        {pendingCount}
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
                        Approved Requests
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {allRequests.filter(req => req.status === RequestStatus.APPROVED).length}
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
                    <FileText className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Requests
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {allRequests.length}
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
                {allRequests.slice(0, 5).map((request) => (
                  <div key={`${request.type}-${request.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {request.type} Request
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                ))}
                {allRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No requests yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vacation Tab */}
      {activeTab === 'vacation' && (
        <div className="space-y-6">
          {/* New Vacation Request Form */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Request Vacation Time
              </h3>
              <form onSubmit={submitVacationRequest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      required
                      value={vacationForm.startDate}
                      onChange={(e) => setVacationForm({ ...vacationForm, startDate: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      required
                      value={vacationForm.endDate}
                      onChange={(e) => setVacationForm({ ...vacationForm, endDate: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason (Optional)</label>
                  <textarea
                    rows={3}
                    value={vacationForm.reason}
                    onChange={(e) => setVacationForm({ ...vacationForm, reason: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Reason for vacation request..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Request
                </button>
              </form>
            </div>
          </div>

          {/* Vacation Requests List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Your Vacation Requests
              </h3>
              <div className="space-y-4">
                {vacationRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <h4 className="text-sm font-medium text-gray-900">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {request.daysRequested} days • Submitted {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        {request.reason && (
                          <p className="text-sm text-gray-600 mt-2">{request.reason}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
                {vacationRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No vacation requests yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fund Tab */}
      {activeTab === 'fund' && (
        <div className="space-y-6">
          {/* New Fund Request Form */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Request Funds
              </h3>
              <form onSubmit={submitFundRequest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fund Type</label>
                    <select
                      value={fundForm.fundType}
                      onChange={(e) => setFundForm({ ...fundForm, fundType: e.target.value as FundType })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.values(FundType).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={fundForm.amount}
                      onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Request Type</label>
                  <input
                    type="text"
                    required
                    value={fundForm.requestType}
                    onChange={(e) => setFundForm({ ...fundForm, requestType: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Conference attendance, Equipment purchase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <textarea
                    rows={3}
                    required
                    value={fundForm.reason}
                    onChange={(e) => setFundForm({ ...fundForm, reason: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detailed reason for fund request..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Request
                </button>
              </form>
            </div>
          </div>

          {/* Fund Requests List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Your Fund Requests
              </h3>
              <div className="space-y-4">
                {fundRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <h4 className="text-sm font-medium text-gray-900">
                            {request.fundType} - ${request.amount}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {request.requestType} • Submitted {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{request.reason}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
                {fundRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No fund requests yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* New General Request Form */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Submit General Request
              </h3>
              <form onSubmit={submitGeneralRequest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Request Type</label>
                    <input
                      type="text"
                      required
                      value={generalForm.requestType}
                      onChange={(e) => setGeneralForm({ ...generalForm, requestType: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., IT Support, Office Supplies"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={generalForm.priority}
                      onChange={(e) => setGeneralForm({ ...generalForm, priority: e.target.value as Priority })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.values(Priority).map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    required
                    value={generalForm.subject}
                    onChange={(e) => setGeneralForm({ ...generalForm, subject: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief subject of your request"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={4}
                    required
                    value={generalForm.description}
                    onChange={(e) => setGeneralForm({ ...generalForm, description: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detailed description of your request..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Request
                </button>
              </form>
            </div>
          </div>

          {/* General Requests List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Your General Requests
              </h3>
              <div className="space-y-4">
                {generalRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <h4 className="text-sm font-medium text-gray-900">
                            {request.subject}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            request.priority === Priority.URGENT ? 'bg-red-100 text-red-800' :
                            request.priority === Priority.HIGH ? 'bg-orange-100 text-orange-800' :
                            request.priority === Priority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {request.requestType} • Submitted {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{request.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
                {generalRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No general requests yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Name</p>
                      <p className="text-sm text-gray-600">{session?.user.name || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{session?.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Role</p>
                      <p className="text-sm text-gray-600">{session?.user.role}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {session?.user.employee && (
                    <>
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Employee Code</p>
                          <p className="text-sm text-gray-600">{session.user.employee.employeeCode}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Position</p>
                          <p className="text-sm text-gray-600">{session.user.employee.position || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Department</p>
                          <p className="text-sm text-gray-600">{session.user.employee.department || 'Not specified'}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
