import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Zap, Sparkles } from 'lucide-react';
import ThreeScene from '../components/ThreeScene';

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 3D Background Scene */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <ThreeScene />
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(15,23,42,0.7)] pointer-events-none z-0"></div>

      {/* Navbar */}
      <header className="relative z-10 w-full px-6 md:px-8 py-6 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#ec4899] flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">ResumeLM</span>
          </div>
          <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Link
              to="/login"
              className="text-sm md:text-base font-semibold text-[#cbd5e1] hover:text-[#6366f1] transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-lg text-sm md:text-base font-bold bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white hover:shadow-lg hover:shadow-[#6366f1]/50 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto w-full text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center justify-center px-4 py-2 rounded-full glass glass-hover mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <Zap className="w-4 h-4 mr-2 text-[#ec4899]" />
            <span className="text-sm font-semibold text-[#cbd5e1]">Powered by Advanced AI Technology</span>
          </div>

          {/* Main Heading */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-tight animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <span className="text-[#f1f5f9]">Build Your</span>
            <br />
            <span className="text-gradient">Dream Resume</span>
            <br />
            <span className="text-[#f1f5f9]">in Minutes</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-lg md:text-xl text-[#cbd5e1] mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Let AI craft your perfect resume. Upload your details, customize with precision, and land interviews with ATS-optimized perfection.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#6366f1] to-[#ec4899] hover:shadow-lg hover:shadow-[#6366f1]/50 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
            >
              Create Free Resume
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg text-[#6366f1] glass glass-hover w-full sm:w-auto"
            >
              View Examples
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="glass glass-hover p-8 rounded-xl group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6366f1]/30 to-[#ec4899]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7 text-[#6366f1]" />
              </div>
              <h3 className="text-xl font-bold text-[#f1f5f9] mb-3">AI-Powered Generation</h3>
              <p className="text-[#cbd5e1]">Advanced AI transforms your notes into professionally crafted bullet points that showcase your impact.</p>
            </div>

            <div className="glass glass-hover p-8 rounded-xl group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6366f1]/30 to-[#ec4899]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-7 h-7 text-[#10b981]" />
              </div>
              <h3 className="text-xl font-bold text-[#f1f5f9] mb-3">ATS-Optimized</h3>
              <p className="text-[#cbd5e1]">Perfectly formatted to pass through Applicant Tracking Systems while maintaining visual appeal.</p>
            </div>

            <div className="glass glass-hover p-8 rounded-xl group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6366f1]/30 to-[#ec4899]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-7 h-7 text-[#ec4899]" />
              </div>
              <h3 className="text-xl font-bold text-[#f1f5f9] mb-3">Job Matcher</h3>
              <p className="text-[#cbd5e1]">Compare your resume to job descriptions and let AI tailor content for maximum relevance.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[rgba(15,23,42,0.95)] to-transparent pointer-events-none z-5"></div>
    </div>
  );
};

export default Landing;
