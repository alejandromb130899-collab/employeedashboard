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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-scale">
      {/* Header */}
      <div className="mb-8 animate-slide-in-top">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Employee Dashboard</h1>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          Welcome back, {session?.user.name || session?.user.email}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200/60 mb-8 animate-slide-in-left">
        <nav className="-mb-px flex flex-wrap gap-1 bg-gray-50/50 rounded-t-xl p-1">
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
              className={`py-3 px-4 sm:px-6 font-semibold text-sm flex items-center space-x-2 rounded-lg transition-all duration-200 ${
                activeTab === key
                  ? 'bg-white text-blue-600 shadow-md border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in-scale">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        {pendingCount}
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
                        Approved Requests
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 mt-1">
                        {allRequests.filter(req => req.status === RequestStatus.APPROVED).length}
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
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-semibold text-gray-600 truncate">
                        Total Requests
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 mt-1">
                        {allRequests.length}
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
                {allRequests.slice(0, 5).map((request) => (
                  <div key={`${request.type}-${request.id}`} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors duration-200 border border-gray-200/50">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(request.status)}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 capitalize">
                          {request.type} Request
                        </p>
                        <p className="text-xs text-gray-600 font-medium">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                ))}
                {allRequests.length === 0 && (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No requests yet</p>
                    <p className="text-gray-400 text-sm mt-1">Submit your first request to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vacation Tab */}
      {activeTab === 'vacation' && (
        <div className="space-y-8 animate-fade-in-scale">
          {/* New Vacation Request Form */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
            <div className="px-6 py-8 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Request Vacation Time
              </h3>
              <form onSubmit={submitVacationRequest} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      required
                      value={vacationForm.startDate}
                      onChange={(e) => setVacationForm({ ...vacationForm, startDate: e.target.value })}
                      className="form-input mt-2"
                    />
                  </div>
                  <div>
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      required
                      value={vacationForm.endDate}
                      onChange={(e) => setVacationForm({ ...vacationForm, endDate: e.target.value })}
                      className="form-input mt-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Reason (Optional)</label>
                  <textarea
                    rows={4}
                    value={vacationForm.reason}
                    onChange={(e) => setVacationForm({ ...vacationForm, reason: e.target.value })}
                    className="form-input mt-2 resize-none"
                    placeholder="Reason for vacation request..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Submit Request
                </button>
              </form>
            </div>
          </div>

          {/* Vacation Requests List */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
            <div className="px-6 py-8 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Your Vacation Requests
              </h3>
              <div className="space-y-6">
                {vacationRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(request.status)}
                          <h4 className="text-base font-semibold text-gray-900">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 font-medium mt-2">
                          {request.daysRequested} days • Submitted {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        {request.reason && (
                          <p className="text-sm text-gray-700 mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">{request.reason}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(request.status)} self-start sm:self-center`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
                {vacationRequests.length === 0 && (
                  <div className="text-center py-16">
                    <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-semibold text-lg">No vacation requests yet</p>
                    <p className="text-gray-400 text-sm mt-2">Submit your first vacation request above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fund Tab */}
      {activeTab === 'fund' && (
        <div className="space-y-8 animate-fade-in-scale">
          {/* New Fund Request Form */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
            <div className="px-6 py-8 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Request Funds
              </h3>
              <form onSubmit={submitFundRequest} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Fund Type</label>
                    <select
                      value={fundForm.fundType}
                      onChange={(e) => setFundForm({ ...fundForm, fundType: e.target.value as FundType })}
                      className="form-input mt-2"
                    >
                      {Object.values(FundType).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={fundForm.amount}
                      onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })}
                      className="form-input mt-2"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Request Type</label>
                  <input
                    type="text"
                    required
                    value={fundForm.requestType}
                    onChange={(e) => setFundForm({ ...fundForm, requestType: e.target.value })}
                    className="form-input mt-2"
                    placeholder="e.g., Conference attendance, Equipment purchase"
                  />
                </div>
                <div>
                  <label className="form-label">Reason</label>
                  <textarea
                    rows={4}
                    required
                    value={fundForm.reason}
                    onChange={(e) => setFundForm({ ...fundForm, reason: e.target.value })}
                    className="form-input mt-2 resize-none"
                    placeholder="Detailed reason for fund request..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Submit Request
                </button>
              </form>
            </div>
          </div>

          {/* Fund Requests List */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
            <div className="px-6 py-8 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Your Fund Requests
              </h3>
              <div className="space-y-6">
                {fundRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(request.status)}
                          <h4 className="text-base font-semibold text-gray-900">
                            {request.fundType} - ${request.amount}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 font-medium mt-2">
                          {request.requestType} • Submitted {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-700 mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">{request.reason}</p>
                      </div>
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(request.status)} self-start sm:self-center`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
                {fundRequests.length === 0 && (
                  <div className="text-center py-16">
                    <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-semibold text-lg">No fund requests yet</p>
                    <p className="text-gray-400 text-sm mt-2">Submit your first fund request above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-8 animate-fade-in-scale">
          {/* New General Request Form */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
            <div className="px-6 py-8 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Submit General Request
              </h3>
              <form onSubmit={submitGeneralRequest} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Request Type</label>
                    <input
                      type="text"
                      required
                      value={generalForm.requestType}
                      onChange={(e) => setGeneralForm({ ...generalForm, requestType: e.target.value })}
                      className="form-input mt-2"
                      placeholder="e.g., IT Support, Office Supplies"
                    />
                  </div>
                  <div>
                    <label className="form-label">Priority</label>
                    <select
                      value={generalForm.priority}
                      onChange={(e) => setGeneralForm({ ...generalForm, priority: e.target.value as Priority })}
                      className="form-input mt-2"
                    >
                      {Object.values(Priority).map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    value={generalForm.subject}
                    onChange={(e) => setGeneralForm({ ...generalForm, subject: e.target.value })}
                    className="form-input mt-2"
                    placeholder="Brief subject of your request"
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    rows={5}
                    required
                    value={generalForm.description}
                    onChange={(e) => setGeneralForm({ ...generalForm, description: e.target.value })}
                    className="form-input mt-2 resize-none"
                    placeholder="Detailed description of your request..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Submit Request
                </button>
              </form>
            </div>
          </div>

          {/* General Requests List */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
            <div className="px-6 py-8 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Your General Requests
              </h3>
              <div className="space-y-6">
                {generalRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(request.status)}
                          <h4 className="text-base font-semibold text-gray-900">
                            {request.subject}
                          </h4>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            request.priority === Priority.URGENT ? 'bg-red-100 text-red-800' :
                            request.priority === Priority.HIGH ? 'bg-orange-100 text-orange-800' :
                            request.priority === Priority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium mb-3">
                          {request.requestType} • Submitted {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-200">{request.description}</p>
                      </div>
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(request.status)} self-start`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
                {generalRequests.length === 0 && (
                  <div className="text-center py-16">
                    <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-semibold text-lg">No general requests yet</p>
                    <p className="text-gray-400 text-sm mt-2">Submit your first general request above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-8 animate-fade-in-scale">
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
            <div className="px-6 py-8 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Profile Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Name</p>
                      <p className="text-sm text-gray-700 font-medium">{session?.user.name || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                    <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Email</p>
                      <p className="text-sm text-gray-700 font-medium">{session?.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                    <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Role</p>
                      <p className="text-sm text-gray-700 font-medium">{session?.user.role}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  {session?.user.employee && (
                    <>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                        <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Employee Code</p>
                          <p className="text-sm text-gray-700 font-medium">{session.user.employee.employeeCode}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                        <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Position</p>
                          <p className="text-sm text-gray-700 font-medium">{session.user.employee.position || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Department</p>
                          <p className="text-sm text-gray-700 font-medium">{session.user.employee.department || 'Not specified'}</p>
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
