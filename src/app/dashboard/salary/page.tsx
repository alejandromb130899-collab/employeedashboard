'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Calculator,
  PieChart,
  Download,
  Eye,
  CreditCard,
  Building
} from 'lucide-react'

interface SalaryInfo {
  annualSalary: number
  monthlySalary: number
  dailySalary: number
  hourlySalary: number
  workingDaysPerMonth: number
  workingHoursPerDay: number
  totalWorkingDays: number
  daysWorked: number
  grossPay: number
  deductions: {
    tax: number
    insurance: number
    retirement: number
    other: number
  }
  netPay: number
}

interface PayrollHistory {
  month: string
  year: number
  grossPay: number
  deductions: number
  netPay: number
  daysWorked: number
  overtime: number
}

export default function SalaryPage() {
  const { data: session } = useSession()
  const [salaryInfo, setSalaryInfo] = useState<SalaryInfo>({
    annualSalary: 75000,
    monthlySalary: 6250,
    dailySalary: 240.38,
    hourlySalary: 26.71,
    workingDaysPerMonth: 26,
    workingHoursPerDay: 9,
    totalWorkingDays: 26,
    daysWorked: 24,
    grossPay: 5769.12,
    deductions: {
      tax: 1153.82,
      insurance: 250,
      retirement: 375,
      other: 50
    },
    netPay: 3940.30
  })
  const [payrollHistory, setPayrollHistory] = useState<PayrollHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('current')

  useEffect(() => {
    fetchSalaryData()
  }, [])

  const fetchSalaryData = async () => {
    try {
      setLoading(true)
      
      // Generate mock payroll history
      const history: PayrollHistory[] = []
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      
      for (let i = 0; i < 12; i++) {
        const daysWorked = Math.floor(Math.random() * 4) + 22 // 22-26 days
        const grossPay = daysWorked * salaryInfo.dailySalary
        const deductions = grossPay * 0.3 // 30% deductions
        const netPay = grossPay - deductions
        
        history.push({
          month: months[i],
          year: 2024,
          grossPay,
          deductions,
          netPay,
          daysWorked,
          overtime: Math.floor(Math.random() * 10)
        })
      }
      
      setPayrollHistory(history)
    } catch (error) {
      console.error('Error fetching salary data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalDeductions = Object.values(salaryInfo.deductions).reduce((sum, deduction) => sum + deduction, 0)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-scale">
      {/* Header */}
      <div className="mb-8 animate-slide-in-top">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Salary Information
        </h1>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          View your salary details and payroll history
        </p>
      </div>

      {/* Salary Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow-xl rounded-2xl card-hover border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Annual Salary
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    ${salaryInfo.annualSalary.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-xl rounded-2xl card-hover border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Monthly Salary
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    ${salaryInfo.monthlySalary.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-xl rounded-2xl card-hover border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Daily Salary
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    ${salaryInfo.dailySalary.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-xl rounded-2xl card-hover border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Hourly Rate
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    ${salaryInfo.hourlySalary.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Month Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Earnings Breakdown */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
          <div className="px-6 py-8 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Current Month Earnings</h3>
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            
            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <p className="text-3xl font-bold text-green-600">${salaryInfo.grossPay.toFixed(2)}</p>
                <p className="text-sm text-green-700 mt-2">Gross Pay</p>
                <p className="text-xs text-green-600 mt-1">{salaryInfo.daysWorked} days worked</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Base Salary</span>
                  <span className="text-sm font-bold text-gray-900">${(salaryInfo.daysWorked * salaryInfo.dailySalary).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Overtime</span>
                  <span className="text-sm font-bold text-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Bonuses</span>
                  <span className="text-sm font-bold text-gray-900">$0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deductions Breakdown */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
          <div className="px-6 py-8 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Deductions</h3>
              <PieChart className="h-6 w-6 text-red-600" />
            </div>
            
            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                <p className="text-3xl font-bold text-red-600">${totalDeductions.toFixed(2)}</p>
                <p className="text-sm text-red-700 mt-2">Total Deductions</p>
                <p className="text-xs text-red-600 mt-1">{((totalDeductions / salaryInfo.grossPay) * 100).toFixed(1)}% of gross</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Income Tax</span>
                  <span className="text-sm font-bold text-gray-900">${salaryInfo.deductions.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Health Insurance</span>
                  <span className="text-sm font-bold text-gray-900">${salaryInfo.deductions.insurance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Retirement (401k)</span>
                  <span className="text-sm font-bold text-gray-900">${salaryInfo.deductions.retirement.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Other</span>
                  <span className="text-sm font-bold text-gray-900">${salaryInfo.deductions.other.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Net Pay Summary */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover mb-8">
        <div className="px-6 py-8 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Net Pay Summary</h3>
            <CreditCard className="h-6 w-6 text-green-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <p className="text-4xl font-bold text-blue-600">${salaryInfo.netPay.toFixed(2)}</p>
              <p className="text-sm text-blue-700 mt-2">Net Pay This Month</p>
              <p className="text-xs text-blue-600 mt-1">After all deductions</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <p className="text-4xl font-bold text-purple-600">{((salaryInfo.netPay / salaryInfo.grossPay) * 100).toFixed(1)}%</p>
              <p className="text-sm text-purple-700 mt-2">Take Home Rate</p>
              <p className="text-xs text-purple-600 mt-1">Of gross salary</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border border-teal-200">
              <p className="text-4xl font-bold text-teal-600">${(salaryInfo.netPay / salaryInfo.daysWorked).toFixed(2)}</p>
              <p className="text-sm text-teal-700 mt-2">Daily Net Pay</p>
              <p className="text-xs text-teal-600 mt-1">Per working day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll History */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
        <div className="px-6 py-8 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Payroll History</h3>
            <div className="flex space-x-2">
              <button className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <Download className="h-5 w-5" />
              </button>
              <button className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200">
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Days Worked
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Gross Pay
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Net Pay
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {payrollHistory.slice(-6).reverse().map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {record.month} {record.year}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.daysWorked} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${record.grossPay.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      -${record.deductions.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                      ${record.netPay.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-all duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-all duration-200">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}