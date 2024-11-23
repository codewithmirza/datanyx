'use client'

import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Text3D, Sphere, Torus, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Types
interface FloatingCardProps {
  children: React.ReactNode
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

interface ClockState {
  clock: THREE.Clock
}

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

  useFrame(({ clock }: ClockState) => {
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

// Main Scene Component
export const Scene: React.FC = () => {
  return (
    <>
      <QuantumCore />
      <Float floatIntensity={2} rotationIntensity={2}>
        <group position={[-6, 5, 0]}>
          <Sphere args={[0.5, 32, 32]}>
            <MeshDistortMaterial
              color="#00ffff"
              distort={0.3}
              speed={2}
              roughness={0}
              metalness={1}
            />
          </Sphere>
        </group>
      </Float>
    </>
  )
} 