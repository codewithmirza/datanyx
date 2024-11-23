'use client'

import React, { useState } from 'react'
import Scene3D from './3d/Scene3D'
import { GraduationCap, Brain, Scissors, BarChart3, History } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: any, 
  title: string, 
  description: string 
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="w-full max-w-sm"
  >
    <Card className="bg-black/80 backdrop-blur-lg border-cyan-500/30 h-full">
      <CardHeader>
        <Icon className="w-8 h-8 text-cyan-500 mb-2" />
        <CardTitle className="text-xl text-cyan-500">{title}</CardTitle>
        <CardDescription className="text-gray-300">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  </motion.div>
)

export default function LandingPage() {
  const router = useRouter()
  const [showAuth, setShowAuth] = useState(false)

  // Features data
  const features = [
    {
      icon: Brain,
      title: "AI Finance Advisor",
      description: "Personalized financial guidance powered by AI. Get smart suggestions for expense management, loan repayment, investments, and more."
    },
    {
      icon: History,
      title: "Smart Timelines",
      description: "Visualize your entire cash flow - from loan deadlines to income streams. Stay on top of your financial commitments."
    },
    {
      icon: Scissors,
      title: "The Cost Cutter",
      description: "AI-powered expense optimization. Identify areas to save and maintain a healthy financial lifestyle."
    },
    {
      icon: BarChart3,
      title: "Financial Insights",
      description: "Comprehensive analytics and visualizations of your financial data. Make informed decisions with clear insights."
    }
  ]

  return (
    <div className="w-full min-h-screen bg-black overflow-x-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0">
        <Scene3D />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-cyan-500" />
            <span className="text-xl font-bold text-cyan-500">SmartFinance.AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-cyan-500">Features</Button>
            <Button variant="ghost" className="text-cyan-500">How It Works</Button>
            <Button variant="ghost" className="text-cyan-500">About Us</Button>
            <Button 
              className="bg-cyan-500 hover:bg-cyan-600"
              onClick={() => router.push('/login')}
            >
              Get Started
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-cyan-500 mb-4">
              Your AI-Powered Financial Companion
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Navigate student finances with confidence using advanced AI insights, 
              personalized recommendations, and smart expense management.
            </p>
            <Button 
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-600"
              onClick={() => router.push('/login')}
            >
              Start Your Journey
            </Button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="min-h-screen py-20 px-4">
          <h2 className="text-3xl font-bold text-cyan-500 text-center mb-12">
            Powerful Features for Your Financial Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-20 px-4 bg-black/50 backdrop-blur-lg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-cyan-500 text-center mb-12">
              Powered by Advanced Technology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-black/80 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-500">AI & Machine Learning</CardTitle>
                  <CardDescription className="text-gray-300">
                    Our AI model utilizes RAG (Retrieval-Augmented Generation) and 
                    fine-tuned vector databases to provide personalized financial advice 
                    and insights based on your unique situation.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-black/80 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-500">Data Analytics</CardTitle>
                  <CardDescription className="text-gray-300">
                    Advanced data visualization and analytics help you understand your 
                    financial patterns and make informed decisions about your future.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-black/50 backdrop-blur-lg">
          <div className="max-w-6xl mx-auto text-center text-gray-400">
            <p>© 2024 SmartFinance.AI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

