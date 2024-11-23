'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertTriangle, CheckCircle2, TrendingUp, Briefcase, GraduationCap, DollarSign, CreditCard, PiggyBank, TrendingDown, History } from 'lucide-react'
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import DashboardScene from './DashboardScene'
import { HolographicButton, HolographicCard } from '@/components/dashboard/HolographicUI'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { LucideIcon } from 'lucide-react'

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

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 2000)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <DashboardScene />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-cyan-500 mb-4">
            SmartFinance.AI Dashboard
          </h1>
          <nav className="flex justify-center space-x-4">
            <HolographicButton 
              onClick={() => setActiveTab('dashboard')} 
              icon={Briefcase}
            >
              Dashboard
            </HolographicButton>
            <HolographicButton 
              onClick={() => setActiveTab('profile')} 
              icon={GraduationCap}
            >
              Profile
            </HolographicButton>
            <HolographicButton 
              onClick={() => setActiveTab('global')} 
              icon={DollarSign}
            >
              Global Insights
            </HolographicButton>
          </nav>
        </header>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-64"
            >
              <Loader2 className="w-16 h-16 animate-spin text-cyan-500" />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
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

              {activeTab === 'global' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <HolographicCard>
                    <h2 className="text-2xl font-bold mb-4">Global Loan Statistics</h2>
                    <Bar
                      data={{
                        labels: ['USA', 'UK', 'Canada', 'Australia', 'Germany'],
                        datasets: [{
                          label: 'Average Student Loan (USD)',
                          data: [35000, 28000, 30000, 25000, 15000],
                          backgroundColor: [
                            'rgba(6, 182, 212, 0.6)',
                            'rgba(6, 182, 212, 0.5)',
                            'rgba(6, 182, 212, 0.4)',
                            'rgba(6, 182, 212, 0.3)',
                            'rgba(6, 182, 212, 0.2)',
                          ],
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                          },
                          x: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                          }
                        }
                      }}
                    />
                  </HolographicCard>

                  <HolographicCard>
                    <h2 className="text-2xl font-bold mb-4">Interest Rate Trends</h2>
                    <Line
                      data={{
                        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                        datasets: [{
                          label: 'Average Interest Rate (%)',
                          data: [5.8, 5.3, 4.9, 5.1, 5.5, 5.7],
                          borderColor: '#06b6d4',
                          backgroundColor: 'rgba(6, 182, 212, 0.1)',
                          fill: true,
                          tension: 0.4
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                        },
                        scales: {
                          y: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                          },
                          x: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                          }
                        }
                      }}
                    />
                  </HolographicCard>

                  <HolographicCard>
                    <h2 className="text-2xl font-bold mb-4">Default Risk by Education Level</h2>
                    <Doughnut
                      data={{
                        labels: ['Undergraduate', 'Graduate', 'PhD', 'Professional'],
                        datasets: [{
                          data: [35, 25, 15, 25],
                          backgroundColor: [
                            'rgba(6, 182, 212, 0.8)',
                            'rgba(6, 182, 212, 0.6)',
                            'rgba(6, 182, 212, 0.4)',
                            'rgba(6, 182, 212, 0.2)',
                          ],
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: { color: 'rgba(255, 255, 255, 0.7)' }
                          }
                        }
                      }}
                    />
                  </HolographicCard>

                  <HolographicCard>
                    <h2 className="text-2xl font-bold mb-4">Financial Aid Distribution</h2>
                    <Radar
                      data={{
                        labels: ['Grants', 'Scholarships', 'Work Study', 'Federal Loans', 'Private Loans'],
                        datasets: [{
                          label: 'Current Year',
                          data: [80, 65, 45, 70, 55],
                          backgroundColor: 'rgba(6, 182, 212, 0.2)',
                          borderColor: '#06b6d4',
                          pointBackgroundColor: '#06b6d4',
                        }]
                      }}
                      options={{
                        responsive: true,
                        scales: {
                          r: {
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            pointLabels: { color: 'rgba(255, 255, 255, 0.7)' },
                            ticks: { display: false }
                          }
                        },
                        plugins: {
                          legend: { display: false }
                        }
                      }}
                    />
                  </HolographicCard>

                  <HolographicCard className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Global Market Analysis</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                        <div>
                          <p className="text-gray-400">Total Global Student Debt</p>
                          <p className="text-2xl font-bold text-white">$1.7T</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-cyan-500" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                        <div>
                          <p className="text-gray-400">Average Repayment Period</p>
                          <p className="text-2xl font-bold text-white">20 Years</p>
                        </div>
                        <History className="w-8 h-8 text-cyan-500" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                        <div>
                          <p className="text-gray-400">Global Default Rate</p>
                          <p className="text-2xl font-bold text-white">11.5%</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-cyan-500" />
                      </div>
                    </div>
                  </HolographicCard>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

