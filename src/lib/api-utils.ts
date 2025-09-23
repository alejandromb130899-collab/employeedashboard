import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { Role } from '@prisma/client'

export async function getAuthenticatedUser(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  
  return session.user
}

export function requireRole(userRole: Role, requiredRoles: Role[]) {
  if (!requiredRoles.includes(userRole)) {
    throw new Error('Insufficient permissions')
  }
}

export function createErrorResponse(message: string, status: number = 400) {
  return Response.json({ error: message }, { status })
}

export function createSuccessResponse(data: any, status: number = 200) {
  return Response.json(data, { status })
}
