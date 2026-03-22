import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { LayoutDashboard, Zap, LogOut, FileText } from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname.includes(to);
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-all font-medium text-sm ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} strokeWidth={2} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen shrink-0 relative z-20 shadow-sm">
      <div className="h-20 flex items-center px-6 border-b border-gray-100 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">CareerBuilder</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 mt-6 flex flex-col gap-1">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-4 mb-3">Menu</div>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="My Resumes" />
        <NavItem to="/analyzer" icon={Zap} label="AI Analyzer" />
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm"
        >
          <LogOut className="w-5 h-5" strokeWidth={2} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
