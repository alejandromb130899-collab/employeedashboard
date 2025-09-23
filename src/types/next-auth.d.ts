import { Role } from '@prisma/client'
import { Employee } from './index'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      role: Role
      employee?: Employee
    }
  }

  interface User {
    role: Role
    employee?: Employee
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role
    employee?: Employee
  }
}
