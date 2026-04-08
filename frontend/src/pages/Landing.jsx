import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Sparkles as ThreeSparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, FileText, CheckCircle, Shield, Sparkles, Video, Mic } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Particles = ({ isHovered }) => {
  const count = 2000;
  const mesh = useRef();

  // Create dummy object for matrix transformations
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate initial random positions (Chaos)
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const speed = 0.01 + Math.random() / 100;

      // Target position in a "Grid" (Structure)
      const gridX = (i % 40) * 0.25 - 5;
      const gridY = Math.floor(i / 40) * 0.25 - 6;
      const gridZ = 0;

      // Random starting position (Chaos)
      const cur = new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );

      temp.push({ t, speed, gridX, gridY, gridZ, cur });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    particles.forEach((particle, i) => {
      let { t, gridX, gridY, gridZ, cur } = particle;

      // Chaos drift calculation
      const chaosX = Math.sin(t + time) * 10 + Math.cos(t * 0.5) * 5;
      const chaosY = Math.cos(t + time) * 10 + Math.sin(t * 0.3) * 5;
      const chaosZ = Math.sin(t * 0.2) * 5;

      // Target selection
      const targetX = isHovered ? gridX : chaosX;
      const targetY = isHovered ? gridY : chaosY;
      const targetZ = isHovered ? gridZ : chaosZ;

      // Smooth interpolation using Vector3.lerp
      const tempTarget = new THREE.Vector3(targetX, targetY, targetZ);
      cur.lerp(tempTarget, isHovered ? 0.08 : 0.03);

      dummy.position.copy(cur);

      // Dynamic scaling
      const s = isHovered ? 0.06 : 0.08;
      dummy.scale.set(s, s, s);

      // Subtle rotation for "chaos" feel
      dummy.rotation.x = cur.x * 0.02;
      dummy.rotation.y = cur.y * 0.02;

      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#4F46E5"
        emissive="#7C3AED"
        emissiveIntensity={isHovered ? 2 : 0.5}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
};

const Landing = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const ctaLink = isAuthenticated ? "/dashboard" : "/register";

  return (
    <div className="min-h-screen bg-app-bg overflow-y-auto flex flex-col font-sans relative custom-scrollbar">

      {/* Three.js Background Canvas */}
      <div
        className="absolute inset-0 z-0 opacity-40 md:opacity-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Canvas dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#7C3AED" />
          <Suspense fallback={null}>
            <Particles isHovered={isHovered} />
            <ThreeSparkles count={50} scale={20} size={1} speed={0.4} opacity={0.2} color="#4F46E5" />
          </Suspense>
        </Canvas>
      </div>

      {/* Navbar overlay */}
      <header className="relative z-20 w-full px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-text-primary uppercase">CareerBuilder.ai</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-xs font-black text-gray-400 hover:text-brand-primary transition-colors uppercase tracking-[0.2em]">
            Sign In
          </Link>
          <Link to={ctaLink} className="px-6 py-3 rounded-xl text-[10px] font-black bg-brand-primary text-white hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 uppercase tracking-widest">
            Create with AI
          </Link>
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto w-full pt-12 pb-24 pointer-events-none">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm"
        >
          <Zap className="w-4 h-4 mr-2" />
          <span>The Next Generation of Career Architecture</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-text-primary leading-[0.9] uppercase pointer-events-auto"
        >
          Chaos to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-ai decoration-brand-ai decoration-8">Structure</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl leading-relaxed font-medium pointer-events-auto"
        >
          Your career data is messy. Our spatial AI engine transforms raw experience into high-performance professional architectures instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto pointer-events-auto"
        >
          <Link
            to={ctaLink}
            className="group flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-brand-primary text-white font-black rounded-2xl text-xs hover:bg-brand-primary/90 transition-all shadow-2xl shadow-brand-primary/20 uppercase tracking-[0.2em]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Create with AI
            <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
          </Link>
          <Link to={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-white/80 backdrop-blur-md text-text-primary font-black rounded-2xl text-xs border border-gray-100 hover:bg-white transition-all shadow-lg uppercase tracking-[0.2em]">
            Build Manually
          </Link>
        </motion.div>

        {/* Feature Highlights Overlay */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full pointer-events-auto">
          {[
            { icon: FileText, title: 'Spatial Rendering', desc: 'Atomic design system for documents ensuring pixel-perfect A4 compliance.' },
            { icon: CheckCircle, title: 'ATS Matrix', desc: 'Engineered to bypass structural filters in modern applicant tracking systems.' },
            { icon: Shield, title: 'Neural Refinement', desc: 'LLM-driven verb optimization and metric-heavy bullet point synthesis.' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass p-8 rounded-[2rem] border border-white shadow-ai-panel flex flex-col gap-4 group hover:-translate-y-2 transition-transform cursor-default"
            >
              <div className="w-12 h-12 bg-brand-primary rounded-xl shadow-lg shadow-brand-primary/10 flex items-center justify-center text-white group-hover:bg-brand-ai transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-[10px] uppercase tracking-widest text-text-primary mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-[10px] font-bold leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Mock Interview Deep Dive Section */}
        <div className="mt-48 w-full text-left pointer-events-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-ai/10 text-brand-ai text-[10px] font-black uppercase tracking-widest">
                <Video className="w-3.5 h-3.5" />
                <span>New: Immersive Simulation</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter leading-[0.9] uppercase">
                Master the <br />
                <span className="text-brand-ai">Human Equation</span>
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed max-w-lg">
                The hardest part of the job hunt isn't the paper—it's the pressure. Our new AI Mock Interview suite simulates high-stakes technical cycles with real-time feedback.
              </p>
              <ul className="space-y-4">
                {[
                  'Groq-Powered Question Generation',
                  'Real-time Whisper Transcription',
                  'Deterministic Plagiarism Detection',
                  'Metric-Driven Score Breakdown'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                    <div className="w-5 h-5 bg-brand-ai/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-brand-ai" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/interview" className="inline-flex items-center gap-2 text-xs font-black text-brand-ai hover:gap-4 transition-all uppercase tracking-widest pt-4">
                Enter the Interview Room <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-brand-ai/20 rounded-[3rem] rotate-3 blur-2xl group-hover:rotate-6 transition-transform" />
              <div className="relative aspect-video bg-gray-900 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center group-hover:-translate-y-2 transition-transform">
                <div className="flex flex-col items-center gap-4 text-white/40">
                  <Mic className="w-12 h-12" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Simulation Active</span>
                </div>
                {/* Subtle Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.02] to-transparent bg-[length:100%_4px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="mt-48 w-full pointer-events-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl font-black text-text-primary tracking-tighter uppercase">The Architecture Flow</h2>
            <p className="text-gray-500 font-medium tracking-tight">Three steps to a superior professional identity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { step: '01', title: 'Data Ingestion', desc: 'Sync your raw bullet points, LinkedIn profile, or existing PDF documents into our spatial workspace.' },
              { step: '02', title: 'AI Synthesis', desc: 'Our neural engines refine your phrasing for maximum impact, ensuring zero dead weight in your narrative.' },
              { step: '03', title: 'Field Deployment', desc: 'Export high-fidelity, ATS-crushing blueprints and validate them through mock-interview cycles.' },
            ].map((p, i) => (
              <div key={i} className="space-y-6 relative">
                {i < 2 && <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-brand-primary/20 to-transparent" />}
                <div className="w-16 h-16 bg-white border border-gray-100 rounded-full flex items-center justify-center mx-auto shadow-sm text-brand-primary font-black text-xl">
                  {p.step}
                </div>
                <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">{p.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed px-4">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-gray-100 pt-24 pb-12 px-8 pointer-events-auto mt-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-text-primary">
                <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-tighter uppercase">CareerBuilder.ai</span>
              </div>
              <p className="text-xs text-gray-500 font-medium max-w-sm leading-relaxed">
                Empowering the next generation of professionals through spatial career intelligence and immersive AI evaluation. Built for high-performance candidates.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Platform</h4>
              <ul className="space-y-2 text-xs font-bold text-gray-600">
                <li><Link to="/register" className="hover:text-brand-primary transition-colors">AI Architect</Link></li>
                <li><Link to="/analyzer" className="hover:text-brand-primary transition-colors">ATS Match</Link></li>
                <li><Link to="/interview" className="hover:text-brand-primary transition-colors">Interview Room</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Social</h4>
              <ul className="space-y-2 text-xs font-bold text-gray-600">
                <li><a href="#" className="hover:text-brand-primary transition-colors">Twitter (X)</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">GitHub</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</h4>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">Engine Active</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              © 2026 Career Architecture Labs. All rights reserved.
            </p>
            <div className="flex gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of Protocol</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
