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
        <div className="absolute inset-0 bg-gradient-to-b from-background-primary/50 via-background-primary/30 to-background-primary/95 pointer-events-none" />

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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32 animate-slide-in-up">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
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

      {/* How It Works Section */}
      <section className="relative z-10 py-24 md:py-32 bg-background-primary">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">How It Works</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Building a professional resume has never been easier. Follow these simple steps to transform your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Add Your Info', description: 'Enter your work experience, education, and skills' },
              { step: '2', title: 'AI Enhancement', description: 'Our AI polishes and improves your bullet points' },
              { step: '3', title: 'Customize Design', description: 'Choose from professional templates or create custom' },
              { step: '4', title: 'Download & Apply', description: 'Export as PDF and start landing interviews' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-background-secondary border border-border-light rounded-xl p-8 text-center hover:border-accent/50 transition-all">
                  <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-6">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-text-secondary text-sm">{item.description}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-border-light">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-24 md:py-32 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Why Choose AIResume?</h2>
              <ul className="space-y-6">
                {[
                  'Save hours of resume writing and editing time',
                  'AI technology optimized for applicant tracking systems',
                  'Real-time feedback on content quality and clarity',
                  'Multiple professional templates and formats',
                  'Free updates and improvements to your resume',
                  'Export in multiple formats (PDF, DOCX, etc.)',
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-text-primary font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background-primary rounded-2xl border border-border-light p-10 shadow-lg">
              <div className="space-y-8">
                {[
                  { icon: '📊', stat: '10,000+', label: 'Resumes Created' },
                  { icon: '⭐', stat: '4.8/5', label: 'User Rating' },
                  { icon: '🚀', stat: '3x', label: 'Interview Increase' },
                ].map((item, idx) => (
                  <div key={idx} className="border-b border-border-light pb-6 last:border-b-0 last:pb-0">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-3xl font-bold text-primary mb-2">{item.stat}</p>
                    <p className="text-text-secondary">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 md:py-32 bg-background-primary">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Loved by Job Seekers</h2>
            <p className="text-lg text-text-secondary">See what users are saying about AIResume</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: 'AIResume helped me land 3 interviews within a week. The AI suggestions were incredibly helpful!',
                author: 'Sarah Johnson',
                role: 'Marketing Manager',
              },
              {
                quote: 'I was skeptical about AI-written resumes, but the quality was amazing. Highly recommended!',
                author: 'Michael Chen',
                role: 'Software Engineer',
              },
              {
                quote: 'The job matching feature is a game-changer. Got my dream job after using AIResume.',
                author: 'Emma Williams',
                role: 'Product Designer',
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-background-secondary border border-border-light rounded-xl p-8 hover:border-accent/50 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-accent text-lg">★</span>
                  ))}
                </div>
                <p className="text-text-primary font-medium mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="border-t border-border-light pt-4">
                  <p className="font-bold text-text-primary">{testimonial.author}</p>
                  <p className="text-text-secondary text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
