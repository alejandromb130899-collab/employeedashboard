import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, requireRole, createErrorResponse, createSuccessResponse } from '@/lib/api-utils'
import { Role } from '@prisma/client'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req)
    const { id } = await params
    
    const employee = await prisma.employee.findUnique({
      where: { id },
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
    
    if (!employee) {
      return createErrorResponse('Employee not found', 404)
    }
    
    // Employees can only view their own data, others need appropriate permissions
    if (user.role === Role.EMPLOYEE && user.employee?.id !== id) {
      return createErrorResponse('Insufficient permissions', 403)
    }
    
    return createSuccessResponse({ employee })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    return createErrorResponse('Internal server error', 500)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req)
    const { id } = await params
    
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { user: true },
    })
    
    if (!employee) {
      return createErrorResponse('Employee not found', 404)
    }
    
    // Check permissions
    const canEdit = 
      user.role === Role.ADMIN ||
      user.role === Role.HR ||
      (user.role === Role.EMPLOYEE && user.employee?.id === id)
    
    if (!canEdit) {
      return createErrorResponse('Insufficient permissions', 403)
    }
    
    const body = await req.json()
    const {
      firstName,
      lastName,
      position,
      department,
      phone,
      address,
      emergencyContact,
      salary,
    } = body
    
    // Employees can only edit certain fields
    const allowedFields: any = {
      firstName,
      lastName,
      phone,
      address,
      emergencyContact,
    }
    
    // Only admins and HR can edit sensitive fields
    if (user.role === Role.ADMIN || user.role === Role.HR) {
      allowedFields.position = position
      allowedFields.department = department
      allowedFields.salary = salary ? parseFloat(salary) : null
    }
    
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: allowedFields,
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
    
    return createSuccessResponse({ employee: updatedEmployee })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    return createErrorResponse('Internal server error', 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req)
    
    // Only admins can delete employees
    requireRole(user.role, [Role.ADMIN])
    
    const { id } = await params
    
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { user: true },
    })
    
    if (!employee) {
      return createErrorResponse('Employee not found', 404)
    }
    
    // Delete employee and associated user in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.employee.delete({
        where: { id },
      })
      
      await tx.user.delete({
        where: { id: employee.userId },
      })
    })
    
    return createSuccessResponse({ message: 'Employee deleted successfully' })
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
