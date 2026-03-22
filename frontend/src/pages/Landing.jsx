import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Zap, Sparkles } from 'lucide-react';
import FloatingScene from '../components/3d/FloatingScene';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary overflow-hidden font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-light bg-background-primary/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight hover:text-accent transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-secondary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:inline">AIResume</span>
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              to="/login"
              className="text-sm font-semibold text-text-secondary hover:text-accent transition-colors hidden sm:inline"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary-light transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with 3D Animation */}
      <main className="relative pt-20 min-h-screen flex flex-col items-center justify-center">
        {/* 3D Background Scene */}
        <div className="absolute inset-0 w-full h-full">
          <Suspense fallback={<div className="w-full h-full bg-background-secondary" />}>
            <FloatingScene />
          </Suspense>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background-primary/40 via-background-primary/20 to-background-primary/90 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 text-center pt-20 pb-32">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-bold mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Resume Building</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight animate-slide-in-up">
            Craft Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary">
              Perfect Resume
            </span>
            {' '}in Minutes
          </h1>

          <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-in-up">
            Transform your career narrative with our intelligent AI that understands what recruiters want. Build an ATS-optimized resume that gets results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-slide-in-up">
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Start Building</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-background-secondary text-text-primary font-bold rounded-lg text-lg border border-border-default hover:bg-background-tertiary transition-all"
            >
              <span>Explore Demo</span>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'AI-Powered Writing',
                description: 'Intelligent suggestions that transform your experience into compelling achievements.',
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: 'ATS Optimized',
                description: 'Every resume is formatted to pass applicant tracking systems with flying colors.',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Job Matching',
                description: 'Tailor your resume to job descriptions in seconds with AI analysis.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-background-secondary hover:bg-background-tertiary border border-border-light hover:border-accent/30 rounded-xl p-8 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-3 text-text-primary">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <section className="relative z-10 bg-primary text-text-inverse py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Join thousands of job seekers succeeding with AIResume
              </h2>
              <p className="text-lg text-neutral-300 mb-8 max-w-xl leading-relaxed">
                Our users report getting interviews 2x faster with AI-optimized resumes that truly stand out.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Resumes Created', value: '10K+' },
                { label: 'Success Rate', value: '94%' },
                { label: 'Average Time Saved', value: '2.5h' },
                { label: 'Interview Rate Boost', value: '2x' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.value}</p>
                  <p className="text-neutral-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-neutral-400 text-sm">
            <p>© 2024 AIResume. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-accent transition-colors">Privacy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms</a>
              <a href="#" className="hover:text-accent transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
