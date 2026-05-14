import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  PlusSquare, 
  FileCheck, 
  ClipboardList, 
  BarChart3, 
  LogOut, 
  Activity,
  User
} from 'lucide-react';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['farmasi', 'logistik', 'manajemen'] },
    { to: '/input', label: 'Permintaan', icon: PlusSquare, roles: ['farmasi'] },
    { to: '/verification', label: 'Verifikasi', icon: FileCheck, roles: ['logistik', 'manajemen'] },
    { to: '/tasks', label: 'Tugas', icon: ClipboardList, roles: ['logistik'] },
    { to: '/monitoring', label: 'Monitoring', icon: BarChart3, roles: ['manajemen', 'logistik'] },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row w-full">
      {/* Sidebar / Top Nav */}
      <nav className="w-full md:w-80 bg-white border-r border-slate-100 flex flex-col p-6 space-y-8 premium-shadow z-10">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-blue-600 tracking-tighter uppercase">SIMSO</span>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.filter(item => item.roles.includes(user?.role || '')).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-2' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-50 space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-inner">
              <User className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-black text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
