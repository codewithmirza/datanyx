'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { HolographicButton, HolographicCard } from '@/components/dashboard/HolographicUI'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { UserData, LoanPrediction, GlobalData } from '@/types/dashboard'
import DashboardScene from '@/app/dashboard/DashboardScene'
import { fetchUserData, processData, generatePredictions } from '../../lib/dashboard'

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [predictions, setPredictions] = useState<LoanPrediction | null>(null)
  const [globalData, setGlobalData] = useState<GlobalData | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    const initializeDashboard = async () => {
      try {
        const data = await fetchUserData(user.uid)
        setUserData(data)
        const processedData = await processData(data)
        setGlobalData(processedData)
        const predictions = await generatePredictions(data, processedData)
        setPredictions(predictions)
      } catch (error) {
        console.error('Error initializing dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [user, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardScene />
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Dashboard content */}
        <h1 className="text-4xl font-bold text-cyan-500 mb-8">Welcome, {userData?.name}</h1>
        
        {/* Navigation */}
        <div className="flex space-x-4 mb-8">
          <HolographicButton 
            onClick={() => setActiveTab('overview')} 
            className={activeTab === 'overview' ? 'bg-cyan-500/20' : ''}
          >
            Overview
          </HolographicButton>
          {/* Add more navigation buttons */}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Add tab content here */}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

