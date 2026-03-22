import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { LayoutDashboard, Zap, LogOut, Sparkles } from 'lucide-react';

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
        className={`flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-all font-medium text-sm ${isActive ? 'bg-gradient-to-r from-[#6366f1]/20 to-[#ec4899]/20 text-[#6366f1] border border-[#6366f1]/30' : 'text-[#cbd5e1] hover:text-[#f1f5f9] hover:bg-[#1e293b]/50'}`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-[#6366f1]' : 'text-[#64748b]'}`} strokeWidth={2} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 glass flex flex-col h-screen shrink-0 relative z-20 border-r border-[#475569]" style={{ background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)' }}>
      <div className="h-20 flex items-center px-6 border-b border-[#475569] shrink-0">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#ec4899] flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient">ResumeLM</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 mt-6 flex flex-col gap-1">
        <div className="text-xs font-bold uppercase tracking-widest text-[#64748b] px-4 mb-4">Navigation</div>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="My Resumes" />
        <NavItem to="/analyzer" icon={Zap} label="AI Analyzer" />
      </nav>

      <div className="p-4 border-t border-[#475569]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-[#cbd5e1] hover:bg-[#ef4444]/20 hover:text-[#ef4444] transition-all duration-300 font-medium text-sm group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
