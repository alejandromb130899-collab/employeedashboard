import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, createErrorResponse, createSuccessResponse } from '@/lib/api-utils'
import { Role, RequestStatus, FundType } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    
    let fundRequests
    
    if (user.role === Role.ADMIN || user.role === Role.HR || user.role === Role.MANAGER) {
      fundRequests = await prisma.fundRequest.findMany({
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
      
      fundRequests = await prisma.fundRequest.findMany({
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
    
    return createSuccessResponse({ requests: fundRequests })
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
    const { fundType, amount, reason, requestType } = body
    
    if (!fundType || !amount || !reason || !requestType) {
      return createErrorResponse('All fields are required')
    }
    
    if (!Object.values(FundType).includes(fundType)) {
      return createErrorResponse('Invalid fund type')
    }
    
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return createErrorResponse('Amount must be a positive number')
    }
    
    const fundRequest = await prisma.fundRequest.create({
      data: {
        employeeId: user.employee.id,
        fundType,
        amount: parsedAmount,
        reason,
        requestType,
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
    
    return createSuccessResponse({ request: fundRequest }, 201)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    return createErrorResponse('Internal server error', 500)
  }
}
