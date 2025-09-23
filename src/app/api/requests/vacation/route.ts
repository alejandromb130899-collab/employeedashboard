import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, requireRole, createErrorResponse, createSuccessResponse } from '@/lib/api-utils'
import { Role, RequestStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    
    let vacationRequests
    
    if (user.role === Role.ADMIN || user.role === Role.HR || user.role === Role.MANAGER) {
      // Admins, HR, and managers can see all requests
      vacationRequests = await prisma.vacationRequest.findMany({
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
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      // Employees can only see their own requests
      if (!user.employee?.id) {
        return createErrorResponse('Employee profile not found', 404)
      }
      
      vacationRequests = await prisma.vacationRequest.findMany({
        where: {
          employeeId: user.employee.id,
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
        orderBy: {
          createdAt: 'desc',
        },
      })
    }
    
    return createSuccessResponse({ requests: vacationRequests })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    return createErrorResponse('Internal server error', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    
    if (!user.employee?.id) {
      return createErrorResponse('Employee profile not found', 404)
    }
    
    const body = await req.json()
    const { startDate, endDate, reason } = body
    
    if (!startDate || !endDate) {
      return createErrorResponse('Start date and end date are required')
    }
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start >= end) {
      return createErrorResponse('End date must be after start date')
    }
    
    if (start < new Date()) {
      return createErrorResponse('Start date cannot be in the past')
    }
    
    // Calculate business days (simplified - excludes weekends)
    const timeDiff = end.getTime() - start.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
    
    const vacationRequest = await prisma.vacationRequest.create({
      data: {
        employeeId: user.employee.id,
        startDate: start,
        endDate: end,
        daysRequested: daysDiff,
        reason: reason || '',
        status: RequestStatus.PENDING,
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
    
    return createSuccessResponse({ request: vacationRequest }, 201)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    return createErrorResponse('Internal server error', 500)
  }
}
