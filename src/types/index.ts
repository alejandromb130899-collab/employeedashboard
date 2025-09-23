import { Role, RequestStatus, FundType, Priority } from '@prisma/client'

export interface User {
  id: string
  email: string
  name?: string
  role: Role
  employee?: Employee
}

export interface Employee {
  id: string
  userId: string
  employeeCode: string
  firstName: string
  lastName: string
  position?: string
  department?: string
  hireDate?: Date
  salary?: number
  phone?: string
  address?: string
  emergencyContact?: string
}

export interface VacationRequest {
  id: string
  employeeId: string
  startDate: Date
  endDate: Date
  daysRequested: number
  reason?: string
  status: RequestStatus
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
  employee?: Employee
}

export interface FundRequest {
  id: string
  employeeId: string
  fundType: FundType
  amount: number
  reason: string
  requestType: string
  status: RequestStatus
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
  employee?: Employee
}

export interface GeneralRequest {
  id: string
  employeeId: string
  requestType: string
  subject: string
  description: string
  priority: Priority
  status: RequestStatus
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  employee?: Employee
}

export { Role, RequestStatus, FundType, Priority }
