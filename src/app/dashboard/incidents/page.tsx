'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Building
} from 'lucide-react'
import { Role, RequestStatus, Priority } from '@prisma/client'

interface Incident {
  id: string
  title: string
  description: string
  priority: Priority
  status: RequestStatus
  reportedBy: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  category: string
}

export default function IncidentDashboard() {
  const { data: session } = useSession()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')

  // Form state
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    category: 'General'
  })

  useEffect(() => {
    fetchIncidents()
  }, [])

  const fetchIncidents = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with real data
      const mockIncidents: Incident[] = [
        {
          id: '1',
          title: 'Network Connectivity Issue',
          description: 'Unable to access company servers from workstation',
          priority: Priority.HIGH,
          status: RequestStatus.IN_PROGRESS,
          reportedBy: 'John Doe',
          assignedTo: 'IT Support',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          category: 'IT'
        },
        {
          id: '2',
          title: 'Safety Hazard in Warehouse',
          description: 'Wet floor without proper signage causing slip hazard',
          priority: Priority.URGENT,
          status: RequestStatus.PENDING,
          reportedBy: 'Jane Smith',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          category: 'Safety'
        },
        {
          id: '3',
          title: 'Equipment Malfunction',
          description: 'Printer in office not working properly',
          priority: Priority.LOW,
          status: RequestStatus.COMPLETED,
          reportedBy: 'Mike Johnson',
          assignedTo: 'Maintenance',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          category: 'Equipment'
        }
      ]
      setIncidents(mockIncidents)
    } catch (error) {
      console.error('Error fetching incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Simulate API call
      const incident: Incident = {
        id: Date.now().toString(),
        ...newIncident,
        status: RequestStatus.PENDING,
        reportedBy: session?.user.name || 'Unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setIncidents([incident, ...incidents])
      setNewIncident({
        title: '',
        description: '',
        priority: Priority.MEDIUM,
        category: 'General'
      })
      setShowCreateForm(false)
      alert('Incident reported successfully!')
    } catch (error) {
      console.error('Error creating incident:', error)
      alert('Failed to create incident')
    }
  }

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case RequestStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-blue-500" />
      case RequestStatus.PENDING:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case RequestStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case RequestStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800'
      case RequestStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case RequestStatus.REJECTED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return 'bg-red-100 text-red-800'
      case Priority.HIGH:
        return 'bg-orange-100 text-orange-800'
      case Priority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800'
      case Priority.LOW:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !filterStatus || incident.status === filterStatus
    const matchesPriority = !filterPriority || incident.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Incident Dashboard
            </h1>
            <p className="mt-3 text-lg text-gray-600 font-medium">
              Report and track incidents across the organization
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 sm:mt-0 btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Report Incident
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    Total Incidents
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {incidents.length}
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
                    Pending
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {incidents.filter(i => i.status === RequestStatus.PENDING).length}
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
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    In Progress
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {incidents.filter(i => i.status === RequestStatus.IN_PROGRESS).length}
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
                    Resolved
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    {incidents.filter(i => i.status === RequestStatus.COMPLETED).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-12 pr-4 py-3 w-full text-base"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input px-4 py-3 text-base min-w-48"
          >
            <option value="">All Statuses</option>
            {Object.values(RequestStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="form-input px-4 py-3 text-base min-w-48"
          >
            <option value="">All Priorities</option>
            {Object.values(Priority).map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Incidents List */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="px-6 py-8 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Incident Reports
          </h3>
          <div className="space-y-6">
            {filteredIncidents.map((incident) => (
              <div key={incident.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {getStatusIcon(incident.status)}
                      <h4 className="text-lg font-semibold text-gray-900">
                        {incident.title}
                      </h4>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(incident.priority)}`}>
                        {incident.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      {incident.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Reported by: {incident.reportedBy}</span>
                      </div>
                      {incident.assignedTo && (
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>Assigned to: {incident.assignedTo}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                        {incident.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-3">
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                    
                    {(session?.user.role === Role.ADMIN || session?.user.role === Role.HR || session?.user.role === Role.MANAGER) && (
                      <div className="flex space-x-2">
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
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredIncidents.length === 0 && (
              <div className="text-center py-16">
                <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-semibold text-lg">No incidents found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Incident Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Report New Incident</h3>
              <form onSubmit={handleCreateIncident} className="space-y-6">
                <div>
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    required
                    value={newIncident.title}
                    onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                    className="form-input mt-2"
                    placeholder="Brief description of the incident"
                  />
                </div>
                
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={newIncident.category}
                    onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value })}
                    className="form-input mt-2"
                  >
                    <option value="General">General</option>
                    <option value="IT">IT</option>
                    <option value="Safety">Safety</option>
                    <option value="Equipment">Equipment</option>
                    <option value="HR">HR</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Priority</label>
                  <select
                    value={newIncident.priority}
                    onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value as Priority })}
                    className="form-input mt-2"
                  >
                    {Object.values(Priority).map((priority) => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    rows={4}
                    required
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                    className="form-input mt-2 resize-none"
                    placeholder="Detailed description of the incident..."
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Report Incident
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}