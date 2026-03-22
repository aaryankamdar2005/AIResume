import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { LogOut, User, Zap, Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="relative z-50 w-full px-6 md:px-8 py-4 sticky top-0">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 glass -z-10"></div>

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#ec4899] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient hidden sm:inline">ResumeLM</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-[#cbd5e1] hover:text-[#6366f1] transition-colors duration-300"
              >
                Dashboard
              </Link>
              <Link
                to="/analyzer"
                className="flex items-center gap-2 text-sm font-semibold text-[#cbd5e1] hover:text-[#ec4899] transition-colors duration-300"
              >
                <Zap className="w-4 h-4" />
                AI Analyzer
              </Link>
              <div className="h-6 w-px bg-[#475569]"></div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#f1f5f9] glass px-4 py-2 rounded-lg">
                  <User className="h-4 w-4 text-[#6366f1]" />
                  <span>{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#cbd5e1] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors duration-300"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-[#cbd5e1] hover:text-[#6366f1] transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#6366f1] to-[#ec4899] hover:shadow-lg hover:shadow-[#6366f1]/50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#cbd5e1] hover:text-[#6366f1] transition-colors duration-300"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in-up">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="block text-sm font-semibold text-[#cbd5e1] hover:text-[#6366f1] transition-colors duration-300 py-2"
              >
                Dashboard
              </Link>
              <Link
                to="/analyzer"
                className="flex items-center gap-2 text-sm font-semibold text-[#cbd5e1] hover:text-[#ec4899] transition-colors duration-300 py-2"
              >
                <Zap className="w-4 h-4" />
                AI Analyzer
              </Link>
              <div className="pt-2 border-t border-[#475569]">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#f1f5f9] glass px-4 py-2 rounded-lg mt-2">
                  <User className="h-4 w-4 text-[#6366f1]" />
                  <span>{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-2 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors duration-300 font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-sm font-semibold text-[#cbd5e1] hover:text-[#6366f1] transition-colors duration-300 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#6366f1] to-[#ec4899] hover:shadow-lg hover:shadow-[#6366f1]/50 transition-all duration-300 text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
