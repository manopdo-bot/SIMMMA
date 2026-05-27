import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  Download, 
  Check, 
  FileText,
  Clock,
  Info
} from 'lucide-react';
import { Student, Company, Internship } from '../types';

interface ReportsViewProps {
  darkMode: boolean;
  userRole: 'Admin' | 'Student';
}

export default function ReportsView({ darkMode, userRole }: ReportsViewProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [st, cp, inR] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/companies"),
        fetch("/api/internships")
      ]);
      if (st.ok && cp.ok && inR.ok) {
        setStudents(await st.json());
        setCompanies(await cp.json());
        setInternships(await inR.json());
      }
    }
    loadData();
  }, []);

  const triggerNotification = (name: string) => {
    setExportSuccess(name);
    setTimeout(() => setExportSuccess(null), 3000);
  };

  // 1. Export Students to CSV
  const exportStudentsCSV = () => {
    let csv = "\uFEFF"; // Thai UTF8 excel support helper
    csv += "รหัสนักศึกษา,ชื่อ,นามสกุล,สาขาวิชา,ระดับการศึกษา,ชั้นปี,เบอร์ติดต่อ,อีเมล,ปีที่เข้าฝึกงาน,สถานะ\n";
    students.forEach(s => {
      csv += `"${s.student_id}","${s.first_name}","${s.last_name}","${s.major}","${s.education_level}",${s.year_level},"${s.phone}","${s.email}",${s.internship_year},"${s.internship_status}"\n`;
    });
    downloadCSV(csv, "Roster-Students-SIMS");
    triggerNotification("รายชื่อนักศึกษา.csv");
  };

  // 2. Export Companies to CSV
  const exportCompaniesCSV = () => {
    let csv = "\uFEFF";
    csv += "รหัสบริษัท,ชื่อบริษัท,ธุรกิจ,จังหวัด,ที่อยู่,เบอร์โทร,อีเมล,ค่าตอบแทนรายวัน,สิทธิ์หอพัก,อัตราบรรจุ,เฉลี่ยดาว\n";
    companies.forEach(c => {
      csv += `"${c.company_id}","${c.company_name}","${c.business_type}","${c.province}","${c.address}","${c.phone}","${c.email}",${c.allowance},"${c.accommodation ? 'มี': 'ไม่มี'}",${c.internship_slots},${c.avg_rating}\n`;
    });
    downloadCSV(csv, "Directory-Companies-SIMS");
    triggerNotification("รายชื่อบริษัท.csv");
  };

  // 3. Export Assignments Matching to CSV
  const exportAssignmentsCSV = () => {
    let csv = "\uFEFF";
    csv += "รหัสนักศึกษา,ชื่อนักศึกษา,สาขา,บริษัทฝึกงานที่ได้รับจัดสรร,จังหวัด,วันที่เข้าระบบ,สถานะ\n";
    students.filter(s => s.company_id !== null).forEach(s => {
      const comp = companies.find(c => c.company_id === s.company_id);
      csv += `"${s.student_id}","${s.first_name} ${s.last_name}","${s.major}","${comp?.company_name || 'ไม่พบ'}","${comp?.province || '-'}","${s.internship_year}","${s.internship_status}"\n`;
    });
    downloadCSV(csv, "Matched-Roster-SIMS");
    triggerNotification("รายงานคู่จัดสรรฝึกงาน.csv");
  };

  // 4. Export Annual summary dashboard index to CSV
  const exportAnnualSummaryCSV = () => {
    let csv = "\uFEFF";
    csv += "หัวข้อสถิติ,ข้อมูลสถิติประจำปี 2026\n";
    csv += `จำนวนบริษัทฝึกงานรวม,${companies.length} แห่ง\n`;
    csv += `จำนวนนักศึกษาฝึกงานในฐานข้อมูล,${students.length} คน\n`;
    csv += `จำนวนนักศึกษาที่เข้าฝึกงานปีปัจจุบัน (ค.ศ. 2026),${students.filter(s => s.internship_year === 2026).length} คน\n`;
    csv += `จังหวัดจุดปักหมุดที่เปิดเรียนสถิติ,${new Set(companies.map(c => c.province)).size} จังหวัด\n`;
    
    downloadCSV(csv, "Annual-Summary-Metrics-2569");
    triggerNotification("รายงานสรุปผลสัมฤทธิ์ประจำปี.csv");
  };

  // Helper download trigger
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Formatter PDF trigger layout
  const handlePrintAnnualReport = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 flex flex-col">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-500/10 pb-5">
        <div>
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase font-mono">
            Module 6 : Exporting & Reporting Center
          </span>
          <h1 className={`text-2xl md:text-3xl font-sans font-bold tracking-tight mt-1 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            ศูนย์บริการรายงานสารสนเทศ (SIMS Reports)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            เครื่องมือเพื่อดาวน์โหลดแฟ้มทะเบียนข้อมูลแบบ CSV , จัดพิมพ์ประเมิน PDF และการสร้างบันทึกข้อตกลงอย่างเป็นทางการ
          </p>
        </div>
      </div>

      {/* Floating success notice when downloading files */}
      {exportSuccess && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-500 flex items-center gap-2.5 animate-bounce shadow">
          <Check size={14} className="shrink-0" />
          <span>ดาวน์โหลดเอกสาร <strong>{exportSuccess}</strong> ประสบความสำเร็จเรียบร้อย</span>
        </div>
      )}

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-start">
        
        {/* Report 1 : Student roster */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-150 shadow-sm'
        }`}>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl shrink-0"><Users size={20} /></div>
            <div>
              <h3 className={`text-base font-sans font-bold ${darkMode?'text-slate-100':'text-slate-800'}`}>
                1. ทะเบียนรายชื่อนักศึกษาทั้งหมด
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                ดาวน์โหลดข้อมูลรายชื่อ บัญชีเบอร์โทรศัพท์ อีเมล แผนกวิชา และประวัติการฝึกงานสหกิจของนักศึกษาทั้ง <strong>{students.length} ราย</strong> ในระบบแบบกลุ่ม
              </p>
            </div>
          </div>
          
          <div className="flex gap-2.5 mt-6 pt-5 border-t border-slate-500/5 justify-end">
            <button
              onClick={exportStudentsCSV}
              className="flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-550/10 hover:bg-slate-500/5 text-blue-500 text-xs font-bold cursor-pointer"
            >
              <FileSpreadsheet size={14} />
              <span>ส่งออก Excel/CSV</span>
            </button>
            <button
              onClick={handlePrintAnnualReport}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
            >
              <Printer size={14} />
              <span>พิมพ์รายงาน (PDF)</span>
            </button>
          </div>
        </div>

        {/* Report 2 : Corporate directory */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-150 shadow-sm'
        }`}>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl shrink-0"><Building2 size={20} /></div>
            <div>
              <h3 className={`text-base font-sans font-bold ${darkMode?'text-slate-100':'text-slate-800'}`}>
                2. ทะเบียนตำแหน่งงาน & สถานประกอบการ
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                ทำเนียบแบรนด์พาร์ทเนอร์ ตำแแหน่งที่ยังเปิดรับสมัคร อัตราค่าตอบแทนต่อสัปดาห์ และคะแนนประเมินเรตติ้งที่อัปเดตเรียลไทม์จำแนกตามรายจังหวัด
              </p>
            </div>
          </div>
          
          <div className="flex gap-2.5 mt-6 pt-5 border-t border-slate-500/5 justify-end">
            <button
              onClick={exportCompaniesCSV}
              className="flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-550/10 hover:bg-slate-500/5 text-blue-500 text-xs font-bold cursor-pointer"
            >
              <FileSpreadsheet size={14} />
              <span>ส่งออก Excel/CSV</span>
            </button>
            <button
              onClick={handlePrintAnnualReport}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
            >
              <Printer size={14} />
              <span>พิมพ์รายงาน (PDF)</span>
            </button>
          </div>
        </div>

        {/* Report 3 : Matching Assignments */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-150 shadow-sm'
        }`}>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl shrink-0"><Briefcase size={20} /></div>
            <div>
              <h3 className={`text-base font-sans font-bold ${darkMode?'text-slate-100':'text-slate-800'}`}>
                3. รายงานสรุปการจัดสรรคู่ฝึกงานรายบุคคล
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                สัญญารับมอบหลักฐาน รายคู่จับกลุ่มจัดสรรนิสิต-บริษัท พิกัดเริ่มปฏิบัติการ และตารางยืนยันสิ้นสุดโครงสหกิจศึกษา เหมาะส่งมอบคณะวิชาการ
              </p>
            </div>
          </div>
          
          <div className="flex gap-2.5 mt-6 pt-5 border-t border-slate-500/5 justify-end">
            <button
              onClick={exportAssignmentsCSV}
              className="flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-550/10 hover:bg-slate-500/5 text-blue-500 text-xs font-bold cursor-pointer"
            >
              <FileSpreadsheet size={14} />
              <span>ส่งออก Excel/CSV</span>
            </button>
            <button
              onClick={handlePrintAnnualReport}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
            >
              <Printer size={14} />
              <span>พิมพ์รายงาน (PDF)</span>
            </button>
          </div>
        </div>

        {/* Report 4 : Annual statistics statement */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
          darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-150 shadow-sm'
        }`}>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl shrink-0"><TrendingUp size={20} /></div>
            <div>
              <h3 className={`text-base font-sans font-bold ${darkMode?'text-slate-100':'text-slate-800'}`}>
                4. รายงานสถิติสรุปภาพรวมผลสัมฤทธิ์ประจำปี
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                หนังสือรวม KPI ชี้วัดประจำสเกลวิชา, จังหวัดที่ส่งนิสิตเข้าศึกษามากที่สุด, และภาพวิเคราะห์ Donut แดชบอร์ดเพื่อเสนอต่อทีมผู้บริหารสถาบัน
              </p>
            </div>
          </div>
          
          <div className="flex gap-2.5 mt-6 pt-5 border-t border-slate-500/5 justify-end">
            <button
              onClick={exportAnnualSummaryCSV}
              className="flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-550/10 hover:bg-slate-500/5 text-blue-500 text-xs font-bold cursor-pointer"
            >
              <FileSpreadsheet size={14} />
              <span>ส่งออก Excel/CSV</span>
            </button>
            <button
              onClick={handlePrintAnnualReport}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
            >
              <Printer size={14} />
              <span>พิมพ์บันทึกเสนอหลัก (PDF)</span>
            </button>
          </div>
        </div>

      </div>

      {/* Hidden formatting warning / PDF generation layout */}
      <div className={`p-4 rounded-xl border text-[11px] font-sans flex gap-2 ${
        darkMode ? 'bg-[#15202B]/60 border-slate-800 text-slate-450' : 'bg-slate-50 border-slate-150 text-slate-500'
      }`}>
        <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
        <span>ระบบใช้เทคนิคการพิมพ์เอกสารมาตรฐาน Browser Print View CSS ในไฟล์พิมพ์ใบแสดงผล ซึ่งพิกัดตัวหนอนและอักษรภาษาไทยจะชัดเจน 100% สกรีนตัดขอบพอดีขยายและเซฟเป็น PDF ได้ทันทีโดยไม่เพรสอักษรรวนล้มเหลว</span>
      </div>

    </div>
  );
}
