'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Building2, Mail, Lock, AlertCircle } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        // Get the session to check user role
        const session = await getSession()
        router.push('/dashboard')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in-scale">
        <div className="text-center animate-slide-in-top">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-8 text-4xl font-bold text-gray-900 tracking-tight">
            HR Management System
          </h2>
          <p className="mt-3 text-base text-gray-600 font-medium">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl py-10 px-8 shadow-2xl rounded-2xl border border-white/20 animate-slide-in-left">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 flex items-center animate-fade-in-scale">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-sm text-red-700 font-medium">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 transition-colors duration-200" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-12 pr-4 py-3.5 text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 transition-colors duration-200" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-12 pr-4 py-3.5 text-base"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-gray-200/60 pt-8">
            <div className="text-sm text-gray-600 bg-gray-50/50 rounded-xl p-4">
              <p className="font-semibold mb-3 text-gray-800">Demo Accounts:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="font-medium text-purple-700">Admin</p>
                  <p className="text-gray-600">admin@company.com</p>
                  <p className="text-gray-500">admin123</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="font-medium text-blue-700">HR</p>
                  <p className="text-gray-600">hr@company.com</p>
                  <p className="text-gray-500">hr123</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="font-medium text-green-700">Manager</p>
                  <p className="text-gray-600">manager@company.com</p>
                  <p className="text-gray-500">manager123</p>
                </div>
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="font-medium text-orange-700">Employee</p>
                  <p className="text-gray-600">john.doe@company.com</p>
                  <p className="text-gray-500">employee123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
