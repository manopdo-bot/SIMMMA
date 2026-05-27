import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Briefcase, 
  Star, 
  MapPin, 
  FileSpreadsheet, 
  Settings, 
  LogOut, 
  User, 
  Bookmark, 
  ShieldCheck, 
  BellRing
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: 'Admin' | 'Student';
  userEmail: string;
  onRoleSwitch: () => void;
  darkMode: boolean;
  onLogout: () => void;
  unreadLogsCount: number;
}

export default function Sidebar({
  currentView,
  onViewChange,
  userRole,
  userEmail,
  onRoleSwitch,
  darkMode,
  onLogout,
  unreadLogsCount
}: SidebarProps) {
  
  const rawMenuItems = [
    { id: 'dashboard', name: 'แผงควบคุม (Dashboard)', icon: LayoutDashboard },
    { id: 'companies', name: 'สถานประกอบการฝึกงาน', icon: Building2 },
    { id: 'students', name: 'ข้อมูลนักศึกษา (Students)', icon: Users },
    { id: 'internship', name: 'จัดสรรฝึกงาน (Internships)', icon: Briefcase },
    { id: 'reviews', name: 'คะแนน & รีวิว (Reviews)', icon: Star },
    { id: 'maps', name: 'แผนที่ตั้งฝึกงาน (Maps)', icon: MapPin },
    { id: 'reports', name: 'รายงาน & ส่งออก (Reports)', icon: FileSpreadsheet },
    { id: 'settings', name: 'ตั้งค่า & เชื่อมโยง (Settings)', icon: Settings },
  ];

  const menuItems = userRole === 'Student'
    ? rawMenuItems.filter(item => !['students', 'internship', 'reports', 'settings'].includes(item.id))
    : rawMenuItems;

  return (
    <aside className={`w-80 flex-shrink-0 flex flex-col h-full border-r transition-colors duration-300 ${
      darkMode 
        ? 'bg-[#15202B] border-[#253341] text-gray-200' 
        : 'bg-white border-slate-150 text-slate-700'
    }`}>
      {/* Brand Header */}
      <div className={`p-6 border-b transition-colors duration-300 flex flex-col gap-2 ${
        darkMode ? 'border-[#253341]' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg tracking-tight leading-none text-blue-600">
              SIMS
            </h1>
            <span className="text-[10px] font-mono tracking-wider text-slate-400">
              INTERNSHIP v2026.1
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          ระบบสารสนเทศบริหารจัดการการฝึกงานนักศึกษา
        </p>
      </div>

      {/* User Status Card */}
      <div className={`mx-4 my-5 p-4 rounded-xl transition-all duration-300 border ${
        darkMode 
          ? 'bg-[#1E2732] border-[#253341]' 
          : 'bg-slate-50 border-slate-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-full ${
            userRole === 'Admin' ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
          }`}>
            <User size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-slate-400 leading-none">
              ผู้ใช้งานปัจจุบัน
            </p>
            <p className={`text-sm font-bold truncate mt-1 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              {userRole === 'Admin' ? 'อาจารย์ผู้ดูแลระบบ' : 'นักศึกษา'}
            </p>
            <p className="text-[11px] text-slate-400 truncate leading-tight font-mono">
              {userEmail}
            </p>
          </div>
        </div>
        
        {/* Switch Role Simulator */}
        <button
          onClick={onRoleSwitch}
          id="btn-switch-role"
          className="mt-3 w-full text-center text-xs py-1.5 px-3 rounded-lg border font-medium cursor-pointer transition-colors duration-200 border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
        >
          สลับบทบาทเป็น {userRole === 'Admin' ? 'นักศึกษา' : 'อาจารย์'}
        </button>
      </div>

      {/* Menu / Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              id={`menu-item-${item.id}`}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                  : darkMode 
                    ? 'text-gray-400 hover:bg-[#1E2732] hover:text-gray-100' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <IconComponent size={18} className={isActive ? 'text-white' : 'text-current'} />
              <span className="flex-1 text-left">{item.name}</span>
              
              {item.id === 'dashboard' && unreadLogsCount > 0 && (
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className={`p-4 border-t transition-colors duration-300 ${
        darkMode ? 'border-[#253341]' : 'border-slate-150'
      }`}>
        <button
          onClick={onLogout}
          id="btn-sidebar-logout"
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border transition-all duration-200 active:scale-95 ${
            darkMode 
              ? 'border-[#253341] text-gray-400 hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/30' 
              : 'border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100'
          }`}
        >
          <LogOut size={16} />
          <span>ออกจากระบบสำนัก</span>
        </button>
      </div>
    </aside>
  );
}
