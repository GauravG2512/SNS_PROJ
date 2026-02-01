
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { LayoutDashboard, FilePlus, ListTodo, PieChart, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';

interface Props {
  user: User;
  onLogout: () => void;
}

const Navigation: React.FC<Props> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const profilePath = user.role === UserRole.CITIZEN ? '/citizen/profile' : '/admin/profile';

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-blue-900">SNS Portal</span>
            </Link>

            <div className="hidden md:flex space-x-4">
              {user.role === UserRole.CITIZEN ? (
                <>
                  <NavLink to="/citizen/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                  <NavLink to="/citizen/lodge" icon={<FilePlus size={18} />} label="Lodge" />
                  <NavLink to="/citizen/track" icon={<ListTodo size={18} />} label="Tracking" />
                </>
              ) : (
                <>
                  <NavLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Summary" />
                  <NavLink to="/admin/complaints" icon={<ListTodo size={18} />} label="Manage" />
                  <NavLink to="/admin/analytics" icon={<PieChart size={18} />} label="Analytics" />
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to={profilePath}
              className="hidden sm:flex flex-col items-end mr-2 hover:opacity-70 transition-opacity"
            >
              <span className="text-sm font-bold text-gray-900 tracking-tight">{user.fullName}</span>
              <span className="text-[9px] text-blue-600 font-black bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest">{user.role}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-black text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-widest"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Navigation;
