import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            employee: true
          }
        })

        if (!user) {
          return null
        }

        // For demo purposes, we'll use a simple password check
        // In production, you should hash passwords properly
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password || '')
        
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          employee: user.employee ? {
            ...user.employee,
            position: user.employee.position || undefined,
            department: user.employee.department || undefined,
            hireDate: user.employee.hireDate || undefined,
            salary: user.employee.salary || undefined,
            phone: user.employee.phone || undefined,
            address: user.employee.address || undefined,
            emergencyContact: user.employee.emergencyContact || undefined
          } : undefined
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.employee = user.employee
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as any
        session.user.employee = token.employee as any
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}
