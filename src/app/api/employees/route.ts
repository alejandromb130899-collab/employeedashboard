import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, requireRole, createErrorResponse, createSuccessResponse } from '@/lib/api-utils'
import { Role } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    
    // Only admins and HR can view all employees
    requireRole(user.role, [Role.ADMIN, Role.HR, Role.MANAGER])
    
    const employees = await prisma.employee.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return createSuccessResponse({ employees })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    if (error.message === 'Insufficient permissions') {
      return createErrorResponse('Insufficient permissions', 403)
    }
    return createErrorResponse('Internal server error', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    
    // Only admins and HR can create employees
    requireRole(user.role, [Role.ADMIN, Role.HR])
    
    const body = await req.json()
    const {
      email,
      name,
      role,
      employeeCode,
      firstName,
      lastName,
      position,
      department,
      hireDate,
      salary,
      phone,
      address,
      emergencyContact,
    } = body
    
    // Validate required fields
    if (!email || !employeeCode || !firstName || !lastName) {
      return createErrorResponse('Missing required fields')
    }
    
    // Check if user or employee already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    
    if (existingUser) {
      return createErrorResponse('User with this email already exists')
    }
    
    const existingEmployee = await prisma.employee.findUnique({
      where: { employeeCode },
    })
    
    if (existingEmployee) {
      return createErrorResponse('Employee with this code already exists')
    }
    
    // Create user and employee in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          name,
          role: role || Role.EMPLOYEE,
          // Default password - should be changed on first login
          password: await require('bcryptjs').hash('password123', 10),
        },
      })
      
      const newEmployee = await tx.employee.create({
        data: {
          userId: newUser.id,
          employeeCode,
          firstName,
          lastName,
          position,
          department,
          hireDate: hireDate ? new Date(hireDate) : null,
          salary: salary ? parseFloat(salary) : null,
          phone,
          address,
          emergencyContact,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
          },
        },
      })
      
      return newEmployee
    })
    
    return createSuccessResponse({ employee: result }, 201)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    if (error.message === 'Insufficient permissions') {
      return createErrorResponse('Insufficient permissions', 403)
    }
    return createErrorResponse('Internal server error', 500)
  }
}
