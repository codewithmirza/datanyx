'use client'

import React, { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Environment, 
  Float, 
  Html, 
  PerspectiveCamera, 
  Text3D,
  useGLTF,
  OrbitControls,
  ScrollControls,
  useScroll,
  Stars,
  Sphere,
  MeshDistortMaterial,
  RoundedBox,
  useTexture,
  Torus
} from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, Clock, TrendingUp, Users, FileText, Bot, BarChartIcon as ChartBar, Sparkles, Lock, GraduationCap, DollarSign, PiggyBank } from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import * as THREE from 'three'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

// Holographic Material
const HolographicMaterial = () => {
  const { clock } = useThree()
  const shaderRef = useRef<THREE.ShaderMaterial>(null)

  useFrame(() => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = clock.getElapsedTime()
    }
  })

  return (
    <shaderMaterial
      ref={shaderRef}
      transparent
      uniforms={{
        time: { value: 0 },
      }}
      vertexShader={`
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vec3 color = vec3(0.0, 1.0, 1.0);
          float alpha = sin(vUv.y * 10.0 + time) * 0.5 + 0.5;
          float pulse = sin(time * 2.0) * 0.5 + 0.5;
          color += vec3(0.5, 0.5, 1.0) * pulse;
          float edge = 1.0 - max(abs(vPosition.x), max(abs(vPosition.y), abs(vPosition.z)));
          alpha *= smoothstep(0.0, 0.1, edge);
          gl_FragColor = vec4(color, alpha * 0.7);
        }
      `}
    />
  )
}

// Core Component
const QuantumCore = () => {
  const meshRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2
      meshRef.current.rotation.y += 0.002
      meshRef.current.rotation.z = Math.cos(clock.getElapsedTime() * 0.2) * 0.15
    }
  })

  return (
    <group ref={meshRef}>
      <Sphere args={[2, 64, 64]}>
        <MeshDistortMaterial
          color="#00ffff"
          attach="material"
          distort={0.4}
          speed={3}
          roughness={0}
          metalness={1}
        />
      </Sphere>
      <Torus args={[3, 0.2, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <HolographicMaterial />
      </Torus>
      <Torus args={[3.5, 0.1, 16, 100]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <HolographicMaterial />
      </Torus>
    </group>
  )
}

// Main Component
export default function LandingPage() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <ScrollControls pages={3} damping={0.25}>
            <QuantumCore />
          </ScrollControls>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />
        </Suspense>
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.75}
        />
      </Canvas>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-8 h-8 text-cyan-500" />
          <span className="text-xl font-bold text-cyan-500">SmartFinance.AI</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-cyan-500">Features</Button>
          <Button variant="ghost" className="text-cyan-500">How It Works</Button>
          <Button variant="ghost" className="text-cyan-500">About Us</Button>
          <Button className="bg-cyan-500 hover:bg-cyan-600">Get Started</Button>
        </div>
      </nav>

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

