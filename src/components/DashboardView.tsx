import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Briefcase, 
  Map, 
  Award, 
  TrendingUp, 
  Share2, 
  ChevronRight, 
  QrCode, 
  Copy, 
  Check, 
  BellRing,
  ExternalLink,
  History,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { SystemStats, ActivityLog } from '../types';

interface DashboardViewProps {
  darkMode: boolean;
  userRole: 'Admin' | 'Student';
}

export default function DashboardView({ darkMode, userRole }: DashboardViewProps) {
  const [stats, setStats] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  // Load from API
  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const statsUrl = selectedYear ? `/api/stats?year=${selectedYear}` : "/api/stats";
        const [statsRes, logsRes] = await Promise.all([
          fetch(statsUrl),
          fetch("/api/logs")
        ]);
        
        if (!statsRes.ok || !logsRes.ok) {
          throw new Error("ล้มเหลวในการดาวน์โหลดข้อมูลแดชบอร์ด");
        }
        
        const statsData = await statsRes.json();
        const logsData = await logsRes.json();
        
        setStats(statsData);
        setActivityLogs(logsData);
        setErrorMessage("");
      } catch (err: any) {
        console.error("Dashboard loaded error:", err);
        setErrorMessage("ไม่สามารถดึงข้อมูลแดชบอร์ดจากเซิร์ฟเวอร์ได้ในขณะนี้");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [selectedYear]);

  const publicUrl = window.location.origin + '?public=true';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className={`mt-4 font-medium ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
          กำลังวิเคราะห์สถิติและเตรียมแดชบอร์ด...
        </p>
      </div>
    );
  }

  if (errorMessage || !stats) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="p-4 rounded-full bg-red-100 text-red-600 mb-4">
          <Info size={32} />
        </div>
        <p className="text-red-500 font-semibold text-lg">{errorMessage || "เกิดข้อผิดพลาด"}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  const kpiData = stats.kpis;
  const trendData = stats.chartMonthlyPlacements || [];
  const maxCount = Math.max(...trendData.map((d: any) => d.count), 5) || 5;

  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = 900;
  const chartHeight = 220;

  const points = trendData.map((d: any, idx: number) => {
    const x = paddingX + (idx / (trendData.length - 1 || 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.count / maxCount) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  const gridRows = 4;
  const gridLines = Array.from({ length: gridRows + 1 }).map((_, i) => {
    const val = (maxCount / gridRows) * i;
    const y = chartHeight - paddingY - (val / maxCount) * (chartHeight - paddingY * 2);
    return { y, val: Math.round(val) };
  });

  // Pie Chart Colors
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase font-mono">
            ระบบตรวจสอบและจับคู่ฝึกงาน
          </span>
          <h1 className={`text-2xl md:text-3xl font-sans font-bold tracking-tight mt-1 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            แดชบอร์ดภาพรวม (Public Analytics)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            รายงานวิเคราะห์ข้อมูลและสถิติสถานที่ฝึกงานของนักศึกษาย้อนหลัง
          </p>
        </div>

        {/* Public Sharing Button & QR Code Popover wrapper */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Calendar Year Filter Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className={`py-2.5 px-3 text-xs font-bold rounded-xl border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all cursor-pointer ${
              darkMode 
                ? 'bg-[#1E2732] border-[#253341] text-gray-200 focus:border-blue-500' 
                : 'bg-white border-slate-200 text-slate-700 focus:border-blue-400 shadow-sm'
            }`}
          >
            <option value="">ปีศึกษาฝึกงาน (ทั้งหมด)</option>
            <option value="2025">ปีการศึกษา 2025 (พ.ศ. 2568)</option>
            <option value="2026">ปีการศึกษา 2026 (พ.ศ. 2569)</option>
            <option value="2027">ปีการศึกษา 2027 (พ.ศ. 2570)</option>
          </select>

          {/* Quick Info */}
          <div className="hidden lg:flex items-center gap-2 p-2 px-3 border rounded-xl pointer-events-none text-xs font-mono text-slate-400 bg-slate-500/5 border-slate-550/10">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>เชื่อมฐานข้อมูลหลักสำนักวิชาวิทยาการ</span>
          </div>
          
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100'
            }`}
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copied ? 'คัดลอกลิงก์สำเร็จ' : 'แชร์ แดชบอร์ด'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* KPI 1 */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 tracking-normal">จำนวนบริษัททั้งหมด</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><Building2 size={18} /></span>
          </div>
          <div className="mt-4">
            <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {kpiData.totalCompanies}
            </span>
            <span className="text-xs font-semibold text-emerald-500 ml-2">บริษัท</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" />
            <span>+3 บริษัทเพิ่มใหม่ในเทอมนี้</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 tracking-normal">นักศึกษาในระบบ</span>
            <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500"><Users size={18} /></span>
          </div>
          <div className="mt-4">
            <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {kpiData.totalStudents}
            </span>
            <span className="text-xs font-semibold text-violet-500 ml-2">ราย</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center gap-1">
            <span>ป.ตรี และ ปวส. ชั้นปี 3-4</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 tracking-normal">ฝึกงานปีปัจจุบัน (2026)</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><Briefcase size={18} /></span>
          </div>
          <div className="mt-4">
            <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {kpiData.activeInternsCurrentYear}
            </span>
            <span className="text-xs font-semibold text-emerald-500 ml-2">ราย</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center gap-1">
            <span className="font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/45 px-1.5 py-0.5 rounded">
              กำลังดำเนินการ 38 ราย
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 tracking-normal">จังหวัดที่มีการฝึกงาน</span>
            <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><Map size={18} /></span>
          </div>
          <div className="mt-4">
            <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {kpiData.totalProvinces}
            </span>
            <span className="text-xs font-semibold text-orange-500 ml-2">จังหวัด</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center gap-1">
            <span>ครอบคลุมภาคตะวันออก & ใต้</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden sm:col-span-2 lg:col-span-1 ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 tracking-normal">บริษัทคะแนนสูงสุด</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><Award size={18} /></span>
          </div>
          <div className="mt-3 min-h-[38px] flex flex-col justify-end">
            <p className={`text-xs font-bold truncate leading-tight ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              {kpiData.topRatedCompany}
            </p>
            <p className="text-[11px] text-amber-500 font-mono mt-1 flex items-center gap-0.5">
              ⭐ {kpiData.topRating} คะแนนเฉลี่ย
            </p>
          </div>
        </div>
      </div>

      {/* Charts Block Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart 1 : บาร์แนวตั้ง นักศึกษาฝึกงานแยกตามปีการศึกษา */}
        <div className={`p-6 rounded-2xl border flex flex-col col-span-1 lg:col-span-1 ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div>
            <h3 className={`font-sans font-bold text-base ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              จำนวนนักศึกษาฝึกงานแยกตามปี
            </h3>
            <p className="text-xs text-slate-400">แสดงแนวโน้มจำนวนผู้เข้าฝึกงานย้อนหลัง</p>
          </div>
          
          {/* Vertical Bar Chart Drawing */}
          <div className="flex-1 h-60 flex items-end justify-between mt-6 px-4 pb-2 border-b border-dashed border-slate-700/20 relative">
            {stats.chartYear.map((item: any, idx: number) => {
              const maxVal = Math.max(...stats.chartYear.map((i: any) => i.count)) || 1;
              const pct = (item.count / maxVal) * 65; // scale limit to leave space for labels on top
              return (
                <div key={idx} className="flex flex-col items-center justify-end h-full flex-1 group relative mx-2">
                  {/* Count indicator on top of the bar */}
                  <span className="text-[11px] font-extrabold text-blue-500 font-mono mb-1.5 dark:text-blue-400">
                    {item.count} คน
                  </span>
                  
                  <div 
                    className="w-12 bg-gradient-to-t from-blue-600 to-indigo-400 hover:from-blue-500 hover:to-indigo-300 transition-all rounded-t-lg shadow-sm"
                    style={{ height: `${pct || 1}%` }} 
                  />
                  <span className={`text-[11px] font-mono mt-2.5 truncate max-w-[110px] text-center ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.year_level}
                  </span>
                </div>
              );
            })}
          </div>
          <span className="text-[11px] font-mono text-center text-slate-400 mt-2">ปีระบบการศึกษา (พ.ศ.)</span>
        </div>

        {/* Chart 2 : แนวนอน นักศึกษาฝึกงานแยกตามจังหวัด */}
        <div className={`p-6 rounded-2xl border flex flex-col col-span-1 lg:col-span-2 ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div>
            <h3 className={`font-sans font-bold text-base ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              จำนวนนักศึกษาฝึกงานแยกตามจังหวัด (Top Provinces)
            </h3>
            <p className="text-xs text-slate-400">อัตราการกระจายจังหวัดที่นิสิตเลือกฝึกงานสูงสุด</p>
          </div>

          {/* Horizontal Bar Chart Custom Map */}
          <div className="mt-5 space-y-3.5 flex-1 flex flex-col justify-center">
            {stats.chartProvince.slice(0, 5).map((item: any, idx: number) => {
              const maxVal = Math.max(...stats.chartProvince.map((i: any) => i.count)) || 1;
              const pct = (item.count / maxVal) * 100;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className={`w-28 text-xs font-semibold truncate ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    📍 {item.province}
                  </span>
                  <div className="flex-1">
                    <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                  </div>
                  <span className="w-10 text-xs font-bold font-mono text-right text-indigo-500">
                    {item.count} คน
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 12-Month Line Chart Trend */}
      <div className={`p-6 rounded-2xl border flex flex-col ${
        darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <div>
            <h3 className={`font-sans font-bold text-base flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              <span className="p-1 px-1.5 rounded bg-indigo-500/10 text-indigo-500 text-xs font-bold font-mono">Trend</span>
              แนวโน้มจำนวนผู้เข้าฝึกงานรายเดือน (ย้อนหลัง 12 เดือน)
            </h3>
            <p className="text-xs text-slate-400 mt-1">ยอดรวมสถิติการตอบรับเข้าฝึกงานรายเดือนของนักศึกษา (Placement Trend)</p>
          </div>
          
          {/* Legend / Hover indicator */}
          {hoveredTrendIndex !== null && trendData[hoveredTrendIndex] ? (
            <div className="flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/20 rounded-xl px-3 py-1.5 animate-none">
              <span className="text-[11px] font-bold text-indigo-400 font-sans">
                {trendData[hoveredTrendIndex].month}:
              </span>
              <strong className="text-xs font-black font-mono text-indigo-500">
                {trendData[hoveredTrendIndex].count}
              </strong>
              <span className="text-[10px] text-slate-400"> คน</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="inline-block w-2.5 h-2.5 rounded bg-indigo-500 shrink-0" />
              <span>จำนวนงานฝึกงานตอบรับแยกตามรายเดือน (คน)</span>
            </div>
          )}
        </div>

        <div className="flex-1 w-full relative min-h-[200px]">
          {trendData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
              ไม่มีข้อมูลประวัติในช่วงเวลาดังกล่าว
            </div>
          ) : (
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.00" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines & Labels */}
              {gridLines.map((line, idx) => (
                <g key={idx} className="opacity-40">
                  <line 
                    x1={paddingX} 
                    y1={line.y} 
                    x2={chartWidth - paddingX} 
                    y2={line.y} 
                    stroke={darkMode ? "#334155" : "#E2E8F0"} 
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text 
                    x={paddingX - 10} 
                    y={line.y + 4} 
                    textAnchor="end" 
                    className={`text-[10px] font-mono font-bold ${darkMode ? 'fill-slate-500' : 'fill-slate-400'}`}
                  >
                    {line.val}
                  </text>
                </g>
              ))}

              {/* Shaded Area Zone */}
              {areaPath && (
                <path 
                  d={areaPath} 
                  fill="url(#areaGradient)" 
                  className="transition-all duration-300"
                />
              )}

              {/* Smooth Glow Filter / Stroke Line */}
              {linePath && (
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="url(#lineGradient)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
              )}

              {/* Hover Helper Vertical Guide Line */}
              {hoveredTrendIndex !== null && points[hoveredTrendIndex] && (
                <line 
                  x1={points[hoveredTrendIndex].x} 
                  y1={paddingY} 
                  x2={points[hoveredTrendIndex].x} 
                  y2={chartHeight - paddingY} 
                  stroke="#818CF8" 
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  className="opacity-70"
                />
              )}

              {/* Points Circle Dots */}
              {points.map((p, idx) => {
                const isHovered = hoveredTrendIndex === idx;
                return (
                  <g key={idx}>
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r={isHovered ? "7" : "4"} 
                      className={`transition-all duration-150 cursor-pointer ${
                        isHovered 
                          ? 'fill-indigo-500 stroke-white dark:stroke-slate-900 stroke-2' 
                          : 'fill-blue-500 hover:fill-indigo-500'
                      }`}
                      onMouseEnter={() => setHoveredTrendIndex(idx)}
                      onMouseLeave={() => setHoveredTrendIndex(null)}
                    />
                    
                    {/* Count value indicator on point if hovered or positive */}
                    {(isHovered || p.count > 0) && (
                      <text
                        x={p.x}
                        y={p.y - 12}
                        textAnchor="middle"
                        className={`text-[11px] font-bold font-mono ${
                          isHovered 
                            ? 'fill-indigo-500 dark:fill-indigo-400 font-extrabold' 
                            : (darkMode ? 'fill-slate-300' : 'fill-slate-700')
                        }`}
                      >
                        {p.count} คน
                      </text>
                    )}

                    {/* X-Axis labels at bottom */}
                    <text 
                      x={p.x} 
                      y={chartHeight - paddingY + 18} 
                      textAnchor="middle" 
                      className={`text-[10px] font-mono font-bold ${
                        isHovered 
                          ? (darkMode ? 'fill-indigo-400' : 'fill-indigo-700') 
                          : (darkMode ? 'fill-slate-400' : 'fill-slate-500')
                      }`}
                    >
                      {p.month}
                    </text>
                  </g>
                );
              })}

              {/* Absolute overlay mouse handlers columns across horizontal range */}
              {points.map((p, idx) => {
                const columnWidth = (chartWidth - paddingX * 2) / (trendData.length - 1 || 1);
                const startX = p.x - columnWidth / 2;
                return (
                  <rect 
                    key={idx}
                    x={startX}
                    y={0}
                    width={columnWidth}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredTrendIndex(idx)}
                    onMouseLeave={() => setHoveredTrendIndex(null)}
                  />
                );
              })}
            </svg>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart 4 : วงกลมสัดส่วนประเภทกิจการ (Pie Chart) */}
        <div className={`p-6 rounded-2xl border flex flex-col ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div>
            <h3 className={`font-sans font-bold text-base ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              สัดส่วนประเภทกิจการอุตสาหกรรม
            </h3>
            <p className="text-xs text-slate-400">สัดส่วนประเภทบริษัททั้งหมดในระบบ (Companies Business Type)</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mt-6">
            {/* Pie representation */}
            <div className="relative w-40 h-40">
              {/* Outer stroke gauge */}
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Simulated Segment Donut */}
                {(() => {
                  let accumulatedPercent = 0;
                  const total = stats.chartBusinessTypes.reduce((acc: number, item: any) => acc + item.value, 0) || 1;
                  return stats.chartBusinessTypes.map((item: any, idx: number) => {
                    const percent = (item.value / total) * 100;
                    const strokeDasharray = `${percent} ${100 - percent}`;
                    const strokeDashoffset = 100 - accumulatedPercent;
                    accumulatedPercent += percent;
                    const strokeColor = colors[idx % colors.length];
                    
                    return (
                      <circle
                        key={idx}
                        cx="18"
                        cy="18"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke={strokeColor}
                        strokeWidth="4"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="cursor-pointer transition-all hover:stroke-[5px]"
                        onMouseEnter={() => setHoveredPieIndex(idx)}
                        onMouseLeave={() => setHoveredPieIndex(null)}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                <span className={`text-[10px] text-slate-400 font-mono tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {hoveredPieIndex !== null ? stats.chartBusinessTypes[hoveredPieIndex].name : "รวมประเภท"}
                </span>
                <span className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {hoveredPieIndex !== null 
                    ? `${stats.chartBusinessTypes[hoveredPieIndex].value} แห่ง` 
                    : `${stats.kpis.totalCompanies} แห่ง`
                  }
                </span>
              </div>
            </div>

            {/* Custom Pie Legend */}
            <div className="grid grid-cols-2 gap-2 w-full mt-6">
              {stats.chartBusinessTypes.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                  <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: colors[idx % colors.length] }} />
                  <span className={`truncate text-[11px] ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>{item.name}</span>
                  <span className="font-mono text-[10px] text-slate-400 font-semibold">({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 3 : จำนวนนักศึกษาฝึกงานแยกตามที่ตั้งบริษัท Top 10 */}
        <div className={`p-6 rounded-2xl border flex flex-col lg:col-span-2 ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div>
            <h3 className={`font-sans font-bold text-base ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              จำนวนนักศึกษาฝึกงานใน 10 บริษัทแรก (Top 10 Companies)
            </h3>
            <p className="text-xs text-slate-400">สถานประกอบการที่มีนักศึกษาฝึกงานมากที่สุดในระบบ</p>
          </div>

          <div className="mt-5 space-y-3 flex-1 flex flex-col justify-center">
            {stats.chartCompDistribution.length === 0 ? (
              <p className="text-center text-xs text-slate-400 my-8">ยังไม่มีข้อมูลการจัดสรรที่เสร็จสมบูรณ์</p>
            ) : (
              stats.chartCompDistribution.map((item: any, idx: number) => {
                const maxVal = Math.max(...stats.chartCompDistribution.map((i: any) => i.count)) || 1;
                const pct = (item.count / maxVal) * 100;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400 w-4 font-bold">{idx + 1}.</span>
                    <span className={`w-40 text-xs truncate ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.company_name}
                    </span>
                    <div className="flex-1">
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono text-right text-indigo-600 w-10">
                      {item.count} คน
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart 5 : คะแนนเฉลี่ยบริษัท (Top 20 Rated Companies) */}
        <div className={`p-6 rounded-2xl border flex flex-col lg:col-span-2 ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div>
            <h3 className={`font-sans font-bold text-base ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              อันดับคะแนนเฉลี่ยบริษัทสูงสุด (Top Rated Companies)
            </h3>
            <p className="text-xs text-slate-400">จัดอันดับโดยคะแนนเกณฑ์รีวิวของนักศึกษาปีที่ผ่านมา</p>
          </div>

          <div className="mt-5 space-y-2.5 flex-1 overflow-y-auto max-h-[300px] pr-2">
            {stats.chartRatings.slice(0, 8).map((item: any, idx: number) => {
              return (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-500/5 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-400 w-6 shrink-0">{idx+1}.</span>
                    <p className={`text-xs font-bold truncate ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {item.company_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center text-amber-500 text-xs gap-0.5">
                      <span>⭐</span>
                      <span className="font-bold font-mono">{item.rating}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">({item.reviews} รีวิว)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 6: Heat Map แผ่นที่ความหนาแน่นจุดกระจายตัวในไทย */}
        <div className={`p-6 rounded-2xl border flex flex-col ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div>
            <h3 className={`font-sans font-bold text-base ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              แผงวิเคราะห์ความหนาแน่นเชิงพื้นที่
            </h3>
            <p className="text-xs text-slate-400">วิเคราะห์ Heat Map การกระจายตัวภูมิภาคหลัก</p>
          </div>

          <div className="flex-1 flex flex-col justify-center mt-5">
            {/* Visual Region Box Grid representation */}
            <div className="space-y-3.5">
              
              {/* Region 1: Central region */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>🏙️ ภาคกลาง (กรุงเทพฯ & ปริมณฑล)</span>
                  <span className="text-blue-500">หนาแน่นสูงมาก (68%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              {/* Region 2: Eastern EEC */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>🏭 ภาคตะวันออก (EEC ชลบุรี/ระยอง)</span>
                  <span className="text-emerald-500">หนาแน่นสูง (22%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '22%' }} />
                </div>
              </div>

              {/* Region 3: Northern */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>⛰️ ภาคเหนือ (เชียงใหม่)</span>
                  <span className="text-sky-500">ปานกลาง (6%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: '6%' }} />
                </div>
              </div>

              {/* Region 4: Southern */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>🏖️ ภาคใต้ (ภูเก็ต)</span>
                  <span className="text-amber-500">ปานกลาง (4%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '4%' }} />
                </div>
              </div>

            </div>

            <div className={`mt-5 p-3 rounded-xl border text-[11px] font-sans flex gap-2 items-start ${
              darkMode ? 'bg-[#15202B] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-600'
            }`}>
              <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
              <span>ความหนาแน่นสูงสุดอยู่บริเวณนิคมอุตสาหกรรมชลบุรี/ระยอง และไอทีกรุงเทพมหานคร สอดคล้องกับการเปลี่ยนแปลงแนวอุตสาหกรรมในยุคปัจจุบัน</span>
            </div>
          </div>
        </div>

      </div>

      {/* Sharing QR Card Details */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center gap-6 mt-6 justify-between ${
        darkMode ? 'bg-gradient-to-r from-blue-950/20 to-transparent border-[#253341]' : 'bg-gradient-to-r from-blue-50/50 to-transparent border-blue-100 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row items-center gap-5 min-w-0">
          <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-md">
            {/* Visual represent of QR Code */}
            <QrCode size={90} className="text-slate-800" />
          </div>
          <div className="text-center md:text-left min-w-0">
            <h4 className={`text-base font-sans font-bold leading-tight ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              แชร์หน้ารายงาน Public Dashboard
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-lg">
              คุณสามารถสแกนคิวอาร์โค้ดนี้ หรือคัดลอกลิงก์เพื่อนำไปแชร์ให้แก่บุคคลทั่วไปภายนอกดูรายงาน สถิติ ความเหมาะสมของบรัษัท อัตราเบี้ยเลี้ยง และแผนภูมิโดยไม่ต้องทำการเข้าสู่ระบบ
            </p>
            <div className="mt-3 flex items-center justify-center md:justify-start gap-2">
              <span className="text-[11px] select-all font-mono py-1 px-2 border rounded bg-slate-500/5 border-slate-500/10 text-blue-500 max-w-[200px] md:max-w-md truncate">
                {publicUrl}
              </span>
              <button 
                id="btn-copy-mini"
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg border border-slate-500/15 hover:bg-blue-500/10 text-blue-500 cursor-pointer"
                title="คัดลอกพิกัดลิงก์"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Log Track Summary */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <History size={16} className="text-blue-500" />
            <h4 className={`text-sm font-sans font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              บันทึกกิจกรรมล่าสุด (Activity Log Trail)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">เฝ้าระวังความปลอดภัยระบบ</span>
        </div>
        
        <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1">
          {activityLogs.slice(0, 4).map((log) => {
            const isAdm = log.user_role === "Admin";
            return (
              <div key={log.id} className="flex justify-between items-start text-xs border-b border-slate-500/5 pb-2">
                <div className="flex gap-2.5 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] shrink-0 font-bold ${
                    isAdm 
                      ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20" 
                      : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {log.user_role}
                  </span>
                  <div className="min-w-0">
                    <p className={`font-semibold truncate ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{log.action}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{log.details}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{log.user_email}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
