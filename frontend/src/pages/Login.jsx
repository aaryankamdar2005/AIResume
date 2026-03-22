import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Mail, Lock } from 'lucide-react';

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
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2942 100%)' }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center animate-fade-in-up">
        <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight mb-2 text-gradient">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-[#cbd5e1] font-medium tracking-wide">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#6366f1] hover:text-[#ec4899] transition-colors duration-300">
            create one now
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass py-8 px-6 sm:px-10 rounded-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-[#ef4444]/20 border border-[#ef4444]/30 text-sm text-[#ef4444] rounded-lg font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#cbd5e1] uppercase tracking-widest mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#6366f1]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#1e293b] border border-[#475569] rounded-lg text-[#f1f5f9] placeholder-[#64748b] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/30 outline-none transition-all duration-300 font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#cbd5e1] uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#6366f1]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#1e293b] border border-[#475569] rounded-lg text-[#f1f5f9] placeholder-[#64748b] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/30 outline-none transition-all duration-300 font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#475569] bg-[#1e293b] text-[#6366f1] focus:ring-[#6366f1] cursor-pointer"
                />
                <label htmlFor="remember-me" className="text-sm text-[#cbd5e1] font-medium cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-[#6366f1] hover:text-[#ec4899] transition-colors duration-300">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 rounded-lg font-bold tracking-wide text-white bg-gradient-to-r from-[#6366f1] to-[#ec4899] hover:shadow-lg hover:shadow-[#6366f1]/50 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none uppercase text-sm"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#475569]"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold tracking-widest uppercase">
                <span className="px-2 bg-[#1e293b] text-[#cbd5e1]">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => handleOAuth('google')}
                className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-[#475569] rounded-lg bg-transparent text-sm font-bold text-[#f1f5f9] hover:bg-[#1e293b]/50 transition-all duration-300"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" xmlSpace="preserve">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
