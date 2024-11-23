'use client'

import React, { useState } from 'react'
import Scene3D from './3d/Scene3D'
import { GraduationCap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { motion } from 'framer-motion'

// Auth Form Component
const AuthForm = ({ type }: { type: 'login' | 'signup' }) => {
  return (
    <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] z-50 bg-black/80 backdrop-blur-lg border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-xl text-cyan-500">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {type === 'login' 
            ? 'Access your AI-powered financial insights' 
            : 'Start your journey to better loan management'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@university.edu" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [authType, setAuthType] = useState<'login' | 'signup'>('login')

  return (
    <div className="w-full h-screen bg-black">
      <Scene3D />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-8 h-8 text-cyan-500" />
          <span className="text-xl font-bold text-cyan-500">FinMate.AI</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-cyan-500">Features</Button>
          <Button variant="ghost" className="text-cyan-500">How It Works</Button>
          <Button variant="ghost" className="text-cyan-500">About Us</Button>
          <Button 
            className="bg-cyan-500 hover:bg-cyan-600"
            onClick={() => setShowAuth(true)}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
          <div className="absolute inset-0" onClick={() => setShowAuth(false)} />
          <div className="relative z-50">
            <AuthForm type={authType} />
            <div className="fixed top-4 right-4 z-50 flex gap-2">
              <Button 
                variant="ghost" 
                className={`text-cyan-500 ${authType === 'login' ? 'bg-cyan-500/20' : ''}`}
                onClick={() => setAuthType('login')}
              >
                Login
              </Button>
              <Button 
                variant="ghost" 
                className={`text-cyan-500 ${authType === 'signup' ? 'bg-cyan-500/20' : ''}`}
                onClick={() => setAuthType('signup')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll Instructions */}
      <motion.div 
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 text-cyan-500"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll to explore
      </motion.div>

      {/* Problem Statement Overlay */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/50 backdrop-blur-lg">
        <h2 className="text-2xl font-bold text-cyan-500 mb-2">Improving Student Finance Management</h2>
        <p className="text-white">
          FinMate.AI addresses the global challenge of student loan management, affecting over 300 million students worldwide. 
          Our AI-driven platform provides personalized insights, repayment strategies, and financial planning tools to help students 
          navigate their educational finances effectively.
        </p>
      </div>
    </div>
  )
}

