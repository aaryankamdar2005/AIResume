import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text3D, useFont } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedBox = ({ position }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
      meshRef.current.position.y += Math.sin(Date.now() * 0.001) * 0.0005;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#00d4ff" metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

const FloatingParticles = () => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.0002;
      groupRef.current.rotation.y += 0.0003;
    }
  });

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    position: [
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 6,
    ],
    scale: Math.random() * 0.5 + 0.1,
  }));

  return (
    <group ref={groupRef}>
      {particles.map((particle) => (
        <mesh key={particle.id} position={particle.position} scale={particle.scale}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#5c4d8c" wireframe emissive="#5c4d8c" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const Lights = () => (
  <>
    <ambientLight intensity={0.6} color="#ffffff" />
    <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" castShadow />
    <pointLight position={[-10, -10, 5]} intensity={0.5} color="#5c4d8c" />
    <directionalLight position={[0, 10, 5]} intensity={0.8} castShadow />
  </>
);

const Scene = () => {
  return (
    <>
      <Lights />
      <Environment preset="studio" />
      <AnimatedBox position={[-2, 0, 0]} />
      <AnimatedBox position={[0, 0, 0]} />
      <AnimatedBox position={[2, 0, 0]} />
      <FloatingParticles />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={2}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </>
  );
};

const FloatingScene = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default FloatingScene;
