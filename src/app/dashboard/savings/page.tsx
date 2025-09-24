'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  PiggyBank,
  TrendingUp,
  DollarSign,
  Calendar,
  Plus,
  Minus,
  Target,
  Award,
  Building,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface SavingsData {
  personalSavings: {
    total: number
    monthlyContribution: number
    monthsContributed: number
    interestEarned: number
  }
  companyFund: {
    total: number
    monthlyContribution: number
    monthsContributed: number
    matchPercentage: number
  }
  goals: {
    targetAmount: number
    targetDate: string
    progress: number
  }
  transactions: Transaction[]
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'interest' | 'company_match'
  amount: number
  date: string
  description: string
  fundType: 'personal' | 'company'
}

export default function SavingsPage() {
  const { data: session } = useSession()
  const [savingsData, setSavingsData] = useState<SavingsData>({
    personalSavings: {
      total: 12500,
      monthlyContribution: 625,
      monthsContributed: 20,
      interestEarned: 125
    },
    companyFund: {
      total: 12500,
      monthlyContribution: 625,
      monthsContributed: 20,
      matchPercentage: 10
    },
    goals: {
      targetAmount: 50000,
      targetDate: '2025-12-31',
      progress: 50
    },
    transactions: []
  })
  const [loading, setLoading] = useState(true)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestType, setRequestType] = useState<'personal' | 'company'>('personal')
  const [requestAmount, setRequestAmount] = useState('')
  const [requestReason, setRequestReason] = useState('')

  useEffect(() => {
    fetchSavingsData()
  }, [])

  const fetchSavingsData = async () => {
    try {
      setLoading(true)
      
      // Generate mock transaction history
      const transactions: Transaction[] = []
      const currentDate = new Date()
      
      // Generate monthly contributions for the past 20 months
      for (let i = 19; i >= 0; i--) {
        const date = new Date(currentDate)
        date.setMonth(date.getMonth() - i)
        
        // Personal savings contribution
        transactions.push({
          id: `personal-${i}`,
          type: 'deposit',
          amount: 625,
          date: date.toISOString(),
          description: 'Monthly personal savings contribution',
          fundType: 'personal'
        })
        
        // Company match
        transactions.push({
          id: `company-${i}`,
          type: 'company_match',
          amount: 625,
          date: date.toISOString(),
          description: 'Company 10% salary match',
          fundType: 'company'
        })
        
        // Occasional interest
        if (i % 3 === 0) {
          transactions.push({
            id: `interest-${i}`,
            type: 'interest',
            amount: Math.floor(Math.random() * 50) + 10,
            date: date.toISOString(),
            description: 'Interest earned on savings',
            fundType: 'personal'
          })
        }
      }
      
      // Add some withdrawal examples
      transactions.push({
        id: 'withdrawal-1',
        type: 'withdrawal',
        amount: 1000,
        date: new Date(2024, 8, 15).toISOString(),
        description: 'Emergency medical expense',
        fundType: 'personal'
      })
      
      setSavingsData(prev => ({
        ...prev,
        transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }))
    } catch (error) {
      console.error('Error fetching savings data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavingsRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Simulate API call
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: parseFloat(requestAmount),
        date: new Date().toISOString(),
        description: requestReason,
        fundType: requestType
      }
      
      setSavingsData(prev => ({
        ...prev,
        transactions: [newTransaction, ...prev.transactions]
      }))
      
      setRequestAmount('')
      setRequestReason('')
      setShowRequestForm(false)
      alert('Savings withdrawal request submitted successfully!')
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Failed to submit request')
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case 'withdrawal':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />
      case 'interest':
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case 'company_match':
        return <Building className="h-4 w-4 text-purple-600" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600'
      case 'withdrawal':
        return 'text-red-600'
      case 'interest':
        return 'text-blue-600'
      case 'company_match':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  const totalSavings = savingsData.personalSavings.total + savingsData.companyFund.total
  const monthsToGoal = Math.ceil((savingsData.goals.targetAmount - totalSavings) / (savingsData.personalSavings.monthlyContribution + savingsData.companyFund.monthlyContribution))

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Savings Tracker
            </h1>
            <p className="mt-3 text-lg text-gray-600 font-medium">
              Track your personal savings and company fund contributions
            </p>
          </div>
          <button
            onClick={() => setShowRequestForm(true)}
            className="mt-4 sm:mt-0 btn-primary"
          >
            <Minus className="h-5 w-5 mr-2" />
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow-xl rounded-2xl card-hover border border-gray-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Total Savings
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    ${totalSavings.toLocaleString()}
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
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Personal Savings
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    ${savingsData.personalSavings.total.toLocaleString()}
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
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 truncate">
                    Company Fund
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    ${savingsData.companyFund.total.toLocaleString()}
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
                    Monthly Growth
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 mt-1">
                    ${(savingsData.personalSavings.monthlyContribution + savingsData.companyFund.monthlyContribution).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Personal Savings */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
          <div className="px-6 py-8 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Personal Savings Box</h3>
              <PiggyBank className="h-6 w-6 text-purple-600" />
            </div>
            
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-purple-600">${savingsData.personalSavings.total.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">Total accumulated savings</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-900">Monthly Contribution</span>
                <span className="text-sm font-bold text-purple-800">${savingsData.personalSavings.monthlyContribution}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-900">Months Contributed</span>
                <span className="text-sm font-bold text-purple-800">{savingsData.personalSavings.monthsContributed}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-900">Interest Earned</span>
                <span className="text-sm font-bold text-purple-800">${savingsData.personalSavings.interestEarned}</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setRequestType('personal')
                setShowRequestForm(true)
              }}
              className="w-full mt-6 btn-primary"
            >
              Request Withdrawal
            </button>
          </div>
        </div>

        {/* Company Fund */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
          <div className="px-6 py-8 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Company Savings Fund</h3>
              <Building className="h-6 w-6 text-green-600" />
            </div>
            
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-green-600">${savingsData.companyFund.total.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">Company {savingsData.companyFund.matchPercentage}% contribution</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-900">Monthly Contribution</span>
                <span className="text-sm font-bold text-green-800">${savingsData.companyFund.monthlyContribution}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-900">Match Percentage</span>
                <span className="text-sm font-bold text-green-800">{savingsData.companyFund.matchPercentage}% of salary</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-900">Months Contributed</span>
                <span className="text-sm font-bold text-green-800">{savingsData.companyFund.monthsContributed}</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setRequestType('company')
                setShowRequestForm(true)
              }}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Request Company Fund
            </button>
          </div>
        </div>
      </div>

      {/* Savings Goal */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover mb-8">
        <div className="px-6 py-8 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Savings Goal</h3>
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <p className="text-3xl font-bold text-blue-600">${savingsData.goals.targetAmount.toLocaleString()}</p>
              <p className="text-sm text-blue-700 mt-2">Target Amount</p>
              <p className="text-xs text-blue-600 mt-1">By {new Date(savingsData.goals.targetDate).toLocaleDateString()}</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <p className="text-3xl font-bold text-green-600">{savingsData.goals.progress}%</p>
              <p className="text-sm text-green-700 mt-2">Progress</p>
              <p className="text-xs text-green-600 mt-1">${totalSavings.toLocaleString()} saved</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <p className="text-3xl font-bold text-orange-600">{monthsToGoal}</p>
              <p className="text-sm text-orange-700 mt-2">Months to Goal</p>
              <p className="text-xs text-orange-600 mt-1">At current rate</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Progress to Goal</span>
              <span>{savingsData.goals.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${savingsData.goals.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 card-hover">
        <div className="px-6 py-8 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Transaction History</h3>
          <div className="space-y-4">
            {savingsData.transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors duration-200 border border-gray-200/50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-600 font-medium">
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.fundType} fund
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{transaction.type.replace('_', ' ')}</p>
                </div>
              </div>
            ))}
            
            {savingsData.transactions.length === 0 && (
              <div className="text-center py-16">
                <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PiggyBank className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-semibold text-lg">No transactions yet</p>
                <p className="text-gray-400 text-sm mt-2">Your savings transactions will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Withdrawal Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Request {requestType === 'personal' ? 'Personal Savings' : 'Company Fund'} Withdrawal
              </h3>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Available Balance:</strong> ${requestType === 'personal' ? savingsData.personalSavings.total.toLocaleString() : savingsData.companyFund.total.toLocaleString()}
                </p>
                {requestType === 'company' && (
                  <p className="text-xs text-gray-600 mt-1">
                    Company fund requests require additional approval
                  </p>
                )}
              </div>
              
              <form onSubmit={handleSavingsRequest} className="space-y-6">
                <div>
                  <label className="form-label">Amount to Withdraw</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    className="form-input mt-2"
                    placeholder="0.00"
                    max={requestType === 'personal' ? savingsData.personalSavings.total : savingsData.companyFund.total}
                  />
                </div>
                
                <div>
                  <label className="form-label">Reason for Withdrawal</label>
                  <textarea
                    rows={4}
                    required
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    className="form-input mt-2 resize-none"
                    placeholder="Please explain why you need this withdrawal..."
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}