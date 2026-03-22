import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { FileText, LogOut, User, Zap } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-light bg-background-primary/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-bold text-lg tracking-tight hover:text-primary transition-colors">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="hidden sm:inline">AIResume</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/analyzer" 
                  className="text-sm font-semibold text-text-secondary hover:text-primary flex items-center gap-2 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Analyzer</span>
                </Link>

                <div className="h-6 w-px bg-border-light hidden sm:block"></div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-text-primary bg-background-secondary px-4 py-2 rounded-lg border border-border-light">
                    <User className="h-4 w-4 text-primary" />
                    <span className="hidden sm:inline max-w-xs truncate">{user?.name || 'User'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all border border-transparent hover:border-danger/30"
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
                  className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors hidden sm:inline"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
