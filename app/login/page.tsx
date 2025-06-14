'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      // Validate input
      if (!email || !password) {
        setError('Email and password are required')
        return
      }
      
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      
      // Successful login/signup - navigate to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Authentication error:', error)
      setError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px] bg-black/80 backdrop-blur-lg border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-500">
              {isLogin ? 'Welcome to SmartFinance.AI' : 'Join SmartFinance.AI'}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin 
                ? 'Access your AI-powered financial insights' 
                : 'Start your journey to better loan management'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@university.edu"
                  className="bg-gray-900 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-900 text-white"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-cyan-500 hover:bg-cyan-600"
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Processing...' 
                  : isLogin ? 'Sign In' : 'Create Account'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-cyan-500 hover:text-cyan-400 text-sm"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 