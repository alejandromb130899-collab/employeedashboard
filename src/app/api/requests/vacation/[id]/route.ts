import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, requireRole, createErrorResponse, createSuccessResponse } from '@/lib/api-utils'
import { Role, RequestStatus } from '@prisma/client'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req)
    
    // Only admins, HR, and managers can approve/reject requests
    requireRole(user.role, [Role.ADMIN, Role.HR, Role.MANAGER])
    
    const { id } = await params
    const body = await req.json()
    const { status, response } = body
    
    if (!Object.values(RequestStatus).includes(status)) {
      return createErrorResponse('Invalid status')
    }
    
    const request = await prisma.vacationRequest.findUnique({
      where: { id },
    })
    
    if (!request) {
      return createErrorResponse('Request not found', 404)
    }
    
    if (request.status !== RequestStatus.PENDING) {
      return createErrorResponse('Request has already been processed')
    }
    
    const updatedRequest = await prisma.vacationRequest.update({
      where: { id },
      data: {
        status,
        approvedBy: user.id,
        approvedAt: new Date(),
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })
    
    return createSuccessResponse({ request: updatedRequest })
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req)
    const { id } = await params
    
    const request = await prisma.vacationRequest.findUnique({
      where: { id },
      include: { employee: true },
    })
    
    if (!request) {
      return createErrorResponse('Request not found', 404)
    }
    
    // Only the requester or admins/HR can delete requests
    const canDelete = 
      user.employee?.id === request.employeeId ||
      user.role === Role.ADMIN ||
      user.role === Role.HR
    
    if (!canDelete) {
      return createErrorResponse('Insufficient permissions', 403)
    }
    
    // Can only delete pending requests
    if (request.status !== RequestStatus.PENDING) {
      return createErrorResponse('Cannot delete processed requests')
    }
    
    await prisma.vacationRequest.delete({
      where: { id },
    })
    
    return createSuccessResponse({ message: 'Request deleted successfully' })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    return createErrorResponse('Internal server error', 500)
  }
}
