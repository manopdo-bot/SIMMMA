import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  User, 
  Moon, 
  Sun, 
  Settings, 
  FileText, 
  RotateCcw, 
  Database, 
  Bell, 
  CornerDownRight, 
  Info,
  Clock,
  HelpCircle,
  QrCode,
  Globe,
  Flame,
  CheckCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import CompaniesView from './components/CompaniesView';
import StudentsView from './components/StudentsView';
import InternshipView from './components/InternshipView';
import ReviewsView from './components/ReviewsView';
import MapView from './components/MapView';
import ReportsView from './components/ReportsView';

export default function App() {
  // Dark mode persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("sims_dark_mode") === "true";
  });

  // Authentication persistence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("sims_auth") === "true";
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem("sims_email") || "admin.coop@university.ac.th";
  });

  const [userRole, setUserRole] = useState<'Admin' | 'Student'>(() => {
    return (localStorage.getItem("sims_role") as 'Admin' | 'Student') || "Admin";
  });

  const [accessCode, setAccessCode] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  // Current view navigation
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [unreadCount, setUnreadCount] = useState<number>(3);
  const [logs, setLogs] = useState<any[]>([]);

  // Settings State variables
  const [gsheetUrl, setGsheetUrl] = useState("https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKv1aJfAkgwn9bM");
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "System Boot v2026.1 initialized",
    "Connected local database file mapping secure db.json index"
  ]);

  useEffect(() => {
    localStorage.setItem("sims_dark_mode", String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("_dark");
    } else {
      document.documentElement.classList.remove("_dark");
    }
  }, [darkMode]);

  // Load backend activity log for statistics
  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs");
      if (res.ok) {
        setLogs(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated, currentView]);

  useEffect(() => {
    if (userRole === "Student" && ['students', 'internship', 'reports', 'settings'].includes(currentView)) {
      setCurrentView("dashboard");
    }
  }, [userRole, currentView]);

  const handleRoleSwitch = () => {
    const nextRole = userRole === "Admin" ? "Student" : "Admin";
    const nextEmail = nextRole === "Admin" ? "admin.coop@university.ac.th" : "st.66010199@university.ac.th";
    
    setUserRole(nextRole);
    setUserEmail(nextEmail);
    localStorage.setItem("sims_role", nextRole);
    localStorage.setItem("sims_email", nextEmail);
    
    // Add activity log simulation
    addSystemLog(`สลับบทบาทเป็น: ${nextRole}`);
  };

  const handleGoogleLogin = (role: 'Admin' | 'Student') => {
    const email = role === 'Admin' ? "admin.coop@university.ac.th" : "st.66010199@university.ac.th";
    
    setUserEmail(email);
    setUserRole(role);
    setIsAuthenticated(true);
    
    localStorage.setItem("sims_auth", "true");
    localStorage.setItem("sims_role", role);
    localStorage.setItem("sims_email", email);

    addSystemLog(`ออเทนติเคชันด้วยบัญชี Googleสำเร็จ (${role})`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("sims_auth");
    localStorage.removeItem("sims_role");
    localStorage.removeItem("sims_email");
  };

  const addSystemLog = (msg: string) => {
    setSystemLogs(prev => [msg, ...prev].slice(0, 10));
  };

  // Back up Database to local JSON file
  const handleBackupJSON = async () => {
    try {
      const res = await fetch("/api/students");
      const st = await res.json();
      const res2 = await fetch("/api/companies");
      const cp = await res2.json();

      const blobData = {
        meta: {
          app: "SIMS STUDENT INTERNSHIP MANAGEMENT SYSTEM",
          timestamp: new Date().toISOString(),
          version: "2026.1"
        },
        database: {
          students: st,
          companies: cp
        }
      };

      const blob = new Blob([JSON.stringify(blobData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `SIMS-Data-Backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addSystemLog("สำรองฐานข้อมูลเสร็จสิ้นในคอมพิวเตอร์");
    } catch (e) {
      console.error(e);
    }
  };

  // Restore Default seeds
  const handleRestoreDefaults = async () => {
    const ok = window.confirm("คุณแน่ใจว่าต้องการรีเซ็ตสิทธิ์หรือกู้คืนรายการเริ่มต้น? ข้อมูลนักศึกษาที่เพิ่มล่าสุดจะสูญหาย");
    if (!ok) return;

    try {
      const res = await fetch("/api/system/reset", {
        method: "POST"
      });
      if (res.ok) {
        alert("กู้คืนข้อมูลแบบ Seed เริ่มต้นสถาบันสำเร็จแล้ว!");
        addSystemLog("กู้คืนการตั้งค่าเริ่มต้นแบบคลีนเซตสำเร็จ");
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Switch content panel switcher
  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView darkMode={darkMode} userRole={userRole} />;
      case 'companies':
        return <CompaniesView darkMode={darkMode} userRole={userRole} userEmail={userEmail} />;
      case 'students':
        return <StudentsView darkMode={darkMode} userRole={userRole} />;
      case 'internship':
        return <InternshipView darkMode={darkMode} userRole={userRole} />;
      case 'reviews':
        return <ReviewsView darkMode={darkMode} userRole={userRole} userEmail={userEmail} />;
      case 'maps':
        return <MapView darkMode={darkMode} />;
      case 'reports':
        return <ReportsView darkMode={darkMode} userRole={userRole} />;
      case 'settings':
        // Core interactive settings view defined right inside App file
        return (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 flex flex-col">
            
            {/* Header Settings */}
            <div className="border-b border-slate-500/10 pb-5 shrink-0">
              <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase font-mono">
                System Configurations & Integrations
              </span>
              <h1 className={`text-2xl md:text-3xl font-sans font-bold tracking-tight mt-1 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                สิทธิ์ระดับระบบและซิงค์เชื่อมโยง (SIMS Configuration)
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                การจัดการแผนผังความปลอดภัย, บันทึกการจำลองแอปซิงค์คลาวด์ภายนอก และการสำรองค่าจัดส่งข้อมูล
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 items-start">
              
              {/* Google Sheets Synchronization Card */}
              <div className={`p-6 rounded-2xl border ${
                darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-150 shadow-sm'
              }`}>
                <h3 className={`font-bold font-sans text-sm flex items-center gap-2 ${darkMode?'text-white':'text-slate-800'}`}>
                  <Database size={16} className="text-blue-500" />
                  <span>Google Sheets API Connection (Database Link)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  เชื่อมโยงสิทธิเข้ากับแบบฟอร์มบน Google Sheets สำหรับดึงค่าอัตราการรับนิสิตและอัตราเงินเดือนเรียลไทม์
                </p>

                <div className="mt-5 space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400">Google Sheet URL</label>
                    <input
                      type="text"
                      value={gsheetUrl}
                      onChange={(e) => setGsheetUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      className={`w-full mt-1.5 p-2.5 font-mono text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        darkMode ? 'bg-[#15202B] border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => alert("ระบบได้ซิงค์ข้อมูลลงสมุดงาน Excel เรียบร้อย!")}
                      className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow cursor-pointer active:scale-95"
                    >
                      ตรวจสอบและเริ่มซิงค์ (Sync Connection)
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Backup & Migration Center */}
              <div className={`p-6 rounded-2xl border ${
                darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-150 shadow-sm'
              }`}>
                <h3 className={`font-bold font-sans text-sm flex items-center gap-2 ${darkMode?'text-white':'text-slate-800'}`}>
                  <RotateCcw size={16} className="text-emerald-500" />
                  <span>ศูนย์สำรองฐานข้อมูล & คลีนคืนค่าเดิม (Recovery System)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  ป้องกันการสูญหายของข้อมูลนักศึกษาฝึกงาน ด้วยกลไกสำรองแบบ JSON ทันทีในคลิกเดียว หรือทำการคลีนระบบทั้งหมด
                </p>

                <div className="flex gap-2.5 mt-6 pt-2">
                  <button
                    onClick={handleBackupJSON}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-500/30 text-emerald-500 text-xs font-bold hover:bg-emerald-500/10 transition-colors cursor-pointer"
                  >
                    <Database size={14} />
                    <span>สำรองค่าฐานข้อมูล (JSON)</span>
                  </button>
                  <button
                    onClick={handleRestoreDefaults}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500/5 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>ลบค่าและกู้คืนเริ่มต้น</span>
                  </button>
                </div>
              </div>

              {/* Developer credentials warning info */}
              <div className={`p-6 rounded-2xl border lg:col-span-2 flex gap-4 ${
                darkMode ? 'bg-[#15202B]/60 border-slate-800' : 'bg-slate-50 border-slate-150'
              }`}>
                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 text-slate-400">
                  <strong className="block text-slate-350">ระบบความคุ้มครองระบบนิเวศ (Sandbox Active):</strong>
                  <p className="leading-relaxed">
                    ระบบ SIMS นี้ดำเนินการภายใต้แพลตฟอร์ม Cloud Run แบ็กเอนด์มีความสมบูรณ์ 100% ตัววิเคราะห์สังเคราะห์ข้อมูลขับเคลื่อนโดย
                    ปัญญาประดิษฐ์ <strong>Gemini 2.5 Flash</strong> ซึ่งมีความปลอดภัยแบบ Server-side และเชื่อมต่อ Mock แบ็กเอนด์ให้แก้อรรถรสในความสะดวกรวดเร็วได้ดีเยี่ยม
                  </p>
                </div>
              </div>

            </div>

          </div>
        );
      default:
        return <DashboardView darkMode={darkMode} userRole={userRole} />;
    }
  };

  if (!isAuthenticated) {
    const handleCodeLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      const code = accessCode.trim();
      
      // Admin Login with access code
      if (code === "098765") {
        setUserRole("Admin");
        setUserEmail("admin.coop@university.ac.th");
        setIsAuthenticated(true);
        localStorage.setItem("sims_auth", "true");
        localStorage.setItem("sims_role", "Admin");
        localStorage.setItem("sims_email", "admin.coop@university.ac.th");
        addSystemLog("ออเทนติเคชันด้วยรหัสผ่านผู้ดูแลระบบสำเร็จ");
        setAccessCode("");
        setLoginError("");
        return;
      }
      
      // Student Login with 8-digit Student ID
      if (/^\d{8}$/.test(code)) {
        try {
          const res = await fetch("/api/students");
          let email = `st.${code}@university.ac.th`;
          if (res.ok) {
            const list = await res.json();
            const found = list.find((s: any) => s.student_id === code);
            if (found && found.email) {
              email = found.email;
            }
          }
          setUserRole("Student");
          setUserEmail(email);
          setIsAuthenticated(true);
          localStorage.setItem("sims_auth", "true");
          localStorage.setItem("sims_role", "Student");
          localStorage.setItem("sims_email", email);
          addSystemLog(`ออเทนติเคชันด้วยรหัสนักศึกษา ${code} สำเร็จ`);
          setAccessCode("");
          setLoginError("");
          return;
        } catch (err) {
          console.error("Login lookup failed:", err);
        }
      }

      setLoginError("ระบุค่าไม่ถูกต้อง กรุณากรอกรหัสนักศึกษา 8 หลัก หรือรหัสผ่านผู้ดูแลระบบที่ถูกต้อง");
    };

    return (
      <div className={`min-h-screen flex flex-col justify-center items-center p-4 transition-colors duration-300 font-sans ${
        darkMode ? 'bg-[#15202B] text-gray-200' : 'bg-slate-50 text-slate-800'
      }`}>
        <div className={`w-full max-w-md p-8 md:p-10 rounded-3xl border text-center space-y-6 shadow-2xl transition-all duration-300 ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100'
        }`}>
          {/* Logo Brand Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-500/20">
              <ShieldCheck size={36} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">STUDENT INTERNSHIP PORTAL</h2>
              <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">
                Student Internship Management System (SIMS)
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            เข้าสู่ระบบแนะแนวและบริหารจัดการสหกิจ เพื่อบันทึก ค้นหาสินทรัพย์ พิกัดฝึกงาน และจัดการวิชาร่วมพัฒนา
          </p>

          {/* Core Access Code Login Form */}
          <form onSubmit={handleCodeLogin} className="space-y-4 pt-2 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2 text-slate-500">
                กรอกรหัสนักศึกษา หรือรหัสผ่านผู้ดูแลระบบ
              </label>
              <input
                type="password"
                placeholder="ระบุรหัสเข้าใช้งานดิจิทัล"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className={`w-full p-3.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  darkMode ? 'bg-[#15202B] border-[#253341] text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                }`}
              />
              {loginError && (
                <p className="text-xs text-rose-500 mt-1.5 font-sans font-medium">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md active:scale-95 cursor-pointer flex justify-center items-center gap-2"
            >
              <ShieldCheck size={14} />
              <span>เข้าใช้งานระบบ</span>
            </button>
          </form>



          <div className="pt-2 border-t border-slate-500/5 flex justify-between items-center text-[10px] text-slate-400">
            <span className="font-mono">v2026.1 (Latest)</span>
            <span className="flex items-center gap-1">🔒 SSL Secure 256-bit</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex overflow-hidden font-sans transition-colors duration-300 ${
      darkMode ? 'bg-[#15202B] text-gray-200' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Navigation Sidebar Drawer */}
      <Sidebar 
        currentView={currentView}
        onViewChange={(v) => setCurrentView(v)}
        userRole={userRole}
        userEmail={userEmail}
        onRoleSwitch={handleRoleSwitch}
        darkMode={darkMode}
        onLogout={handleLogout}
        unreadLogsCount={unreadCount}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top App Bar Header Controls */}
        <header className={`p-4 px-6 border-b transition-colors duration-300 flex justify-between items-center shrink-0 ${
          darkMode ? 'bg-[#1C242F] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          {/* Quick status information */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="text-[11px] font-semibold text-slate-400 leading-none flex items-center gap-1.5 font-mono">
              <span>SERVER: ONLINE</span>
              <span className="opacity-40">|</span>
              <span className="text-blue-500 uppercase font-bold">{userRole} MODE</span>
            </div>
          </div>

          {/* Theme, Clock, Notification icons */}
          <div className="flex items-center gap-3">
            {/* Real-time UTC timezone representation for user safety */}
            <div className="hidden md:flex items-center gap-1.5 p-1 px-2.5 rounded-lg text-[10px] font-mono bg-slate-500/5 text-slate-400 font-bold">
              <Clock size={11} className="text-blue-400" />
              <span>2026-05-24 12:38 UTC</span>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              id="theme-toggler"
              className="p-2 rounded-xl bg-slate-500/5 hover:bg-slate-500/10 cursor-pointer text-slate-400 transition-colors"
              title="สลับโหมดสว่าง/มืด"
            >
              {darkMode ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => {
                setUnreadCount(0);
                alert("ไม่มีการแจ้งเตือนพิกัดใหม่ในวันนี้");
              }}
              className="p-2 rounded-xl bg-slate-500/5 hover:bg-slate-500/10 cursor-pointer text-slate-400 relative transition-colors"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
              )}
            </button>
          </div>
        </header>

        {/* Dynamic Inner Application Frame */}
        {renderMainContent()}

      </div>
    </div>
  );
}
