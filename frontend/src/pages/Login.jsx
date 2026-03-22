import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Mail, Lock, FileText, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex bg-background-primary font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 bg-gradient-to-br from-primary-dark to-primary p-12 text-text-inverse justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-secondary rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span>AIResume</span>
        </Link>

        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Welcome Back to Your Career
          </h2>
          <p className="text-lg text-neutral-300 leading-relaxed max-w-md">
            Access your resumes, continue your journey, and land your dream job with AI-powered tools.
          </p>
        </div>

        <p className="text-neutral-400 text-sm">© 2024 AIResume</p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 sm:px-8 py-12 md:py-0">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Sign In</h1>
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-accent hover:text-accent/80 transition-colors">
                Create one
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-danger/10 border border-danger/30 text-danger rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-text-primary placeholder-text-tertiary"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-text-primary">Password</label>
                <a href="#" className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-text-primary placeholder-text-tertiary"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-border-default text-accent focus:ring-accent"
              />
              <label htmlFor="remember" className="text-sm font-medium text-text-secondary cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 transition-all mt-8"
            >
              {isLoading ? 'Signing in...' : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-default"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-background-primary text-sm font-semibold text-text-secondary">Or continue with</span>
            </div>
          </div>

          {/* OAuth */}
          <button
            onClick={() => handleOAuth('google')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border-default rounded-lg hover:bg-background-secondary transition-all font-semibold text-text-primary"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
