'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertTriangle, CheckCircle2, TrendingUp, Briefcase, GraduationCap, DollarSign, CreditCard, PiggyBank, TrendingDown, History, Brain, Scissors, User } from 'lucide-react'
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import DashboardScene from './DashboardScene'
import { HolographicButton, HolographicCard } from '@/components/dashboard/HolographicUI'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { LucideIcon } from 'lucide-react'
import { getAIRecommendations } from '@/lib/ai-service'
import { AIAdvisor } from '@/components/dashboard/features/AIAdvisor/AIAdvisor'
import { CostCutter } from '@/components/dashboard/features/CostCutter/CostCutter'
import { FinancialTimeline } from '@/components/dashboard/features/Timeline/FinancialTimeline'

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  RadialLinearScale, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler
)

// Define interface for StatCard props
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  className?: string;
}

// Update the StatCard component with proper typing
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, className = '' }) => (
  <div className={`flex items-center p-4 rounded-lg bg-black/30 border border-cyan-500/30 ${className}`}>
    <Icon className="w-8 h-8 text-cyan-500 mr-3" />
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
    {trend !== undefined && (
      <div className={`ml-auto ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend > 0 ? <TrendingUp /> : <TrendingDown />}
        <span className="text-sm">{Math.abs(trend)}%</span>
      </div>
    )}
  </div>
)

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState({
    name: 'Jamshed',
    email: 'jamshed@example.com',
    university: 'Quantum University',
    loanAmount: 50000,
    interestRate: 5.5,
    repaymentTerm: 120,
    monthlyIncome: 3000,
    monthlyExpenses: 2000,
    country: 'USA',
  })

  // Add new state for financial metrics
  const [metrics, setMetrics] = useState({
    totalLoan: 50000,
    monthlyPayment: 500,
    savingsRate: 15,
    riskScore: 75
  })

  // Add financial recommendations
  const [recommendations, setRecommendations] = useState([
    "Consider refinancing your loan to get a lower interest rate",
    "Increase your monthly savings by reducing discretionary spending",
    "Look into student loan forgiveness programs",
    "Start building an emergency fund"
  ])

  const [aiData, setAiData] = useState(null)

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 2000)
  }, [])

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        const data = await getAIRecommendations({
          loanAmount: userData.loanAmount,
          monthlyIncome: userData.monthlyIncome,
          monthlyExpenses: userData.monthlyExpenses,
          country: userData.country,
          university: userData.university
        })
        setAiData(data)
        // Update metrics with AI data
        setMetrics(prev => ({
          ...prev,
          riskScore: data.data.riskScore,
          // Add other metrics
        }))
        // Update recommendations
        setRecommendations(data.data.recommendations)
      } catch (error) {
        console.error('Error fetching AI data:', error)
      }
    }

    if (!loading) {
      fetchAIData()
    }
  }, [userData, loading])

  // Add new feature tabs
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Brain },
    { id: 'cost-cutter', label: 'Cost Cutter', icon: Scissors },
    { id: 'timelines', label: 'Timelines', icon: History },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Scene */}
      <DashboardScene />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <HolographicButton
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={Icon}
                className={`${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-black'
                    : 'bg-transparent text-cyan-500'
                }`}
              >
                {tab.label}
              </HolographicButton>
            )
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[60vh]"
            >
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Existing dashboard content */}
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard 
                    title="Total Loan" 
                    value={`$${metrics.totalLoan.toLocaleString()}`}
                    icon={CreditCard}
                  />
                  <StatCard 
                    title="Monthly Payment" 
                    value={`$${metrics.monthlyPayment}`}
                    icon={DollarSign}
                    trend={-2.5}
                  />
                  <StatCard 
                    title="Savings Rate" 
                    value={`${metrics.savingsRate}%`}
                    icon={PiggyBank}
                    trend={5.2}
                  />
                  <StatCard 
                    title="Risk Score" 
                    value={metrics.riskScore}
                    icon={AlertTriangle}
                    trend={-1.5}
                  />

                  <div className="lg:col-span-2">
                    <HolographicCard>
                      <h3 className="text-xl font-bold mb-4">Loan Repayment Timeline</h3>
                      <Line
                        data={{
                          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                          datasets: [{
                            label: 'Projected Balance',
                            data: [50000, 48000, 46000, 44000, 42000, 40000],
                            borderColor: '#06b6d4',
                            backgroundColor: 'rgba(6, 182, 212, 0.1)',
                            fill: true,
                          }]
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { display: false },
                          },
                          scales: {
                            y: {
                              beginAtZero: false,
                              grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                              },
                            },
                            x: {
                              grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                              },
                            },
                          },
                        }}
                      />
                    </HolographicCard>
                  </div>

                  <div className="lg:col-span-2">
                    <HolographicCard>
                      <h3 className="text-xl font-bold mb-4">AI Recommendations</h3>
                      <div className="space-y-4">
                        {recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start">
                            <TrendingUp className="w-5 h-5 text-cyan-500 mr-2 mt-1" />
                            <p>{rec}</p>
                          </div>
                        ))}
                      </div>
                    </HolographicCard>
                  </div>
                </div>
              )}

              {/* AI Advisor Tab */}
              {activeTab === 'ai-advisor' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AIAdvisor userData={userData} />
                </div>
              )}

              {/* Cost Cutter Tab */}
              {activeTab === 'cost-cutter' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CostCutter userData={userData} />
                </div>
              )}

              {/* Timelines Tab */}
              {activeTab === 'timelines' && (
                <div className="grid grid-cols-1 gap-6">
                  <FinancialTimeline userData={userData} />
                </div>
              )}

              {/* Existing profile content */}
              {activeTab === 'profile' && (
                <HolographicCard>
                  <h2 className="text-2xl font-bold mb-6">User Profile</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Name</Label>
                        <Input 
                          value={userData.name}
                          className="bg-black/30 border-cyan-500/30 text-white"
                          onChange={(e) => setUserData({...userData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Email</Label>
                        <Input 
                          value={userData.email}
                          className="bg-black/30 border-cyan-500/30 text-white"
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">University</Label>
                        <Input 
                          value={userData.university}
                          className="bg-black/30 border-cyan-500/30 text-white"
                          onChange={(e) => setUserData({...userData, university: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Monthly Income</Label>
                        <Input 
                          type="number"
                          value={userData.monthlyIncome}
                          className="bg-black/30 border-cyan-500/30 text-white"
                          onChange={(e) => setUserData({...userData, monthlyIncome: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Monthly Expenses</Label>
                        <Input 
                          type="number"
                          value={userData.monthlyExpenses}
                          className="bg-black/30 border-cyan-500/30 text-white"
                          onChange={(e) => setUserData({...userData, monthlyExpenses: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Country</Label>
                        <Input 
                          value={userData.country}
                          className="bg-black/30 border-cyan-500/30 text-white"
                          onChange={(e) => setUserData({...userData, country: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <HolographicButton onClick={() => console.log('Profile updated')}>
                      Save Changes
                    </HolographicButton>
                  </div>
                </HolographicCard>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

