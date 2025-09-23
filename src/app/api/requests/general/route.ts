import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, createErrorResponse, createSuccessResponse } from '@/lib/api-utils'
import { Role, RequestStatus, Priority } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    
    let generalRequests
    
    if (user.role === Role.ADMIN || user.role === Role.HR || user.role === Role.MANAGER) {
      generalRequests = await prisma.generalRequest.findMany({
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
      if (!user.employee?.id) {
        return createErrorResponse('Employee profile not found', 404)
      }
      
      generalRequests = await prisma.generalRequest.findMany({
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
    
    return createSuccessResponse({ requests: generalRequests })
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
    const { requestType, subject, description, priority = Priority.MEDIUM } = body
    
    if (!requestType || !subject || !description) {
      return createErrorResponse('Request type, subject, and description are required')
    }
    
    if (!Object.values(Priority).includes(priority)) {
      return createErrorResponse('Invalid priority level')
    }
    
    const generalRequest = await prisma.generalRequest.create({
      data: {
        employeeId: user.employee.id,
        requestType,
        subject,
        description,
        priority,
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
    
    return createSuccessResponse({ request: generalRequest }, 201)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    return createErrorResponse('Internal server error', 500)
  }
}
