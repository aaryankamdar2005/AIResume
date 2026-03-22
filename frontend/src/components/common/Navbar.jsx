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
    <header className="bg-white/90 backdrop-blur-md border-b border-silver sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-3 text-navy font-extrabold text-xl tracking-tight">
              <div className="bg-navy p-1.5 rounded-sm shadow-sm">
                <FileText className="h-5 w-5 text-white" />
              </div>
              The Editorial Architect
            </Link>
          </div>

          <nav className="flex items-center gap-5">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-bold tracking-wide text-charcoal hover:text-blue transition-colors">
                  Dashboard
                </Link>
                <Link to="/analyzer" className="text-sm font-bold tracking-wide text-navy flex items-center gap-1 hover:text-blue transition-colors ml-4 border-l border-silver pl-4">
                  <Zap className="w-4 h-4" /> AI Analyzer
                </Link>
                <div className="h-6 w-px bg-silver mx-2 hidden sm:block"></div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-charcoal bg-slate px-4 py-2 rounded-md border border-silver shadow-inner tracking-wide">
                    <User className="h-4 w-4 text-blue" />
                    <span className="hidden sm:inline-block">{user?.name || 'Architect'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-charcoal/80 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-200"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold tracking-wide text-charcoal hover:text-blue transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold tracking-wide text-white bg-blue rounded-md shadow-sm hover:shadow hover:bg-navy hover:-translate-y-0.5 transform duration-300 transition-all">
                  Construct New
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
