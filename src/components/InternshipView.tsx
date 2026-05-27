import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  Building2, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  ChevronRight, 
  ArrowRightLeft, 
  Clock, 
  Check, 
  X,
  Search,
  BookOpen
} from 'lucide-react';
import { Student, Company, Internship } from '../types';

interface InternshipViewProps {
  darkMode: boolean;
  userRole: 'Admin' | 'Student';
}

export default function InternshipView({ darkMode, userRole }: InternshipViewProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  
  // Search state
  const [stSearch, setStSearch] = useState("");
  const [cpSearch, setCpSearch] = useState("");
  
  // Pairing Modal state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [matchingCompanyId, setMatchingCompanyId] = useState("");
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-10-31");
  
  // Loading & logs
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stRes, cpRes, inRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/companies?status=Active"),
        fetch("/api/internships")
      ]);
      
      if (stRes.ok && cpRes.ok && inRes.ok) {
        setStudents(await stRes.json());
        setCompanies(await cpRes.json());
        setInternships(await inRes.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter unassigned students (no company assigned yet)
  const unassignedStudents = students.filter(s => 
    s.company_id === null && 
    (stSearch === "" || 
     `${s.first_name} ${s.last_name}`.toLowerCase().includes(stSearch.toLowerCase()) ||
     s.student_id.includes(stSearch)
    )
  );

  // Filter active companies for selection grid
  const filteredCompanies = companies.filter(c => 
    c.status === "Active" &&
    (cpSearch === "" || c.company_name.toLowerCase().includes(cpSearch.toLowerCase()))
  );

  // Assigned Roster list with joins
  const assignedRoster = students.filter(s => s.company_id !== null).map(s => {
    const comp = companies.find(c => c.company_id === s.company_id);
    const intern = internships.find(i => i.student_id === s.student_id);
    return {
      student_id: s.student_id,
      name: `${s.first_name} ${s.last_name}`,
      major: s.major,
      internship_year: s.internship_year,
      status: s.internship_status,
      company_name: comp?.company_name || "บริษัทเดิม (กำลังดึงข้อมูล)",
      province: comp?.province || "ไม่ระบุ",
      start_date: intern?.start_date || "-",
      end_date: intern?.end_date || "-",
    };
  });

  // Open pair assign dialog
  const handleOpenAssign = (st: Student) => {
    setSelectedStudent(st);
    setMatchingCompanyId(companies[0]?.company_id || "");
    setStartDate("2026-06-01");
    setEndDate("2026-10-31");
  };

  // Match / Assign
  const handleExecuteAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !matchingCompanyId) return;

    try {
      const res = await fetch("/api/internships/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: selectedStudent.student_id,
          company_id: matchingCompanyId,
          start_date: startDate,
          end_date: endDate
        })
      });

      if (res.ok) {
        setSelectedStudent(null);
        loadData();
      } else {
        const d = await res.json();
        alert(d.error || "เกิดข้อขัดข้องในการจัดสรร");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change matched student condition status
  const handleChangeStatus = async (stId: string, value: string) => {
    try {
      const res = await fetch("/api/internships/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: stId, status: value })
      });
      if (res.ok) {
        loadData();
      } else {
        alert("ปรับปรุงสถานะล้มเหลว");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Quick report download CSV
  const handleExportCSV = () => {
    let csv = "\uFEFF"; // BOM for excel thai lettering standard
    csv += "รหัสนักศึกษา,ชื่อ-นามสกุล,หลักสูตร,ปีการศึกษา,บริษัทฝึกงาน,จังหวัดสถานที่ตั้ง,วันที่เริ่ม,วันที่สิ้นสุด,สถานะ\n";
    
    assignedRoster.forEach(row => {
      csv += `"${row.student_id}","${row.name}","${row.major}",${row.internship_year},"${row.company_name}","${row.province}","${row.start_date}","${row.end_date}","${row.status}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SIMS-Internship-Matched-Report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 flex flex-col">
      {/* Lower Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-500/10 pb-5">
        <div>
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase font-mono">
            Module 3 : Internship Assignment
          </span>
          <h1 className={`text-2xl md:text-3xl font-sans font-bold tracking-tight mt-1 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            ระบบจับคู่จัดสรรสถานที่ทำงาน (Matchmaker)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            พิจารณาและประกบคู่ประวัตินักศึกษาให้ตรงกับสมรรถนะและความต้องการของสถานประกอบการอุตสาหกรรมต่างจังหวัด
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          id="btn-export-matched"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl cursor-pointer shadow-md transition-all duration-200 text-xs"
        >
          <FileSpreadsheet size={16} />
          <span>ดาวน์โหลดรายงานจัดสรร (CSV)</span>
        </button>
      </div>

      {userRole === 'Student' ? (
        <div className={`p-8 text-center rounded-2xl border ${darkMode ? 'border-[#253341] bg-[#1E2732]':'border-slate-100 bg-white shadow-sm'}`}>
          <AlertCircle size={32} className="mx-auto mb-2.5 text-blue-500" />
          <h3 className={`text-sm font-bold ${darkMode?'text-white':'text-slate-800'}`}>โมดูลการเข้าถึงสิทธิ์ผู้ดูแลระบบ (Admin) เท่านั้น</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">เฉพาะผู้ดูแลระบบและอาจารย์แนะแนว จึงจะสามารถดำเนินการจัดสรรตำแหน่งว่างให้แก่นิสิต และปรับเปลี่ยนสถานะการฝึกงานพิกัดบริษัทได้</p>
        </div>
      ) : (
        <>
          {/* Pairing Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Unassigned Students List (Left, 1 column) */}
            <div className={`p-5 rounded-2xl border flex flex-col max-h-[380px] ${
              darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-150 shadow-sm'
            }`}>
              <div className="border-b border-slate-500/5 pb-3">
                <h3 className={`font-sans font-bold text-sm tracking-tight flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  <Users size={16} className="text-blue-500" />
                  <span>นักศึกษาที่ยังไม่ได้รับการจัดสรร ({unassignedStudents.length})</span>
                </h3>
                <div className="mt-3 relative">
                  <span className="absolute inset-y-0 left-2.5 flex items-center pr-3 pointer-events-none text-slate-450"><Search size={13} /></span>
                  <input
                    type="text"
                    placeholder="ค้นหารหัส / นามสกุล..."
                    value={stSearch}
                    onChange={(e) => setStSearch(e.target.value)}
                    className={`w-full py-1.5 pl-8 pr-3 text-[11px] rounded-lg border outline-none ${
                      darkMode ? 'bg-[#15202B] border-slate-800 text-white':'bg-slate-50 border-slate-150'
                    }`}
                  />
                </div>
              </div>

              {/* Table / List */}
              <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
                {unassignedStudents.length === 0 ? (
                  <p className="text-[11px] text-center text-slate-400 my-10 font-medium">✨ นักศึกษาจัดสรรครบถ้วนทั้งหมดแล้ว !</p>
                ) : (
                  unassignedStudents.slice(0, 15).map((st) => (
                    <div 
                      key={st.student_id}
                      className={`p-3 rounded-xl border flex justify-between items-center ${
                        darkMode ? 'bg-[#15202B]/60 border-slate-800 hover:border-blue-500/40':'bg-slate-50 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className={`font-bold text-xs truncate ${darkMode?'text-slate-200':'text-slate-800'}`}>{st.first_name} {st.last_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {st.student_id} | {st.major}</p>
                      </div>
                      
                      <button
                        onClick={() => handleOpenAssign(st)}
                        className="py-1 px-2.5 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold text-[10px] tracking-tight shrink-0 cursor-pointer"
                      >
                        จัดสรร
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Matching Roster Status Board (Right, 2 columns) */}
            <div className={`p-5 rounded-2xl border flex flex-col lg:col-span-2 ${
              darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-150 shadow-sm'
            }`}>
              <div className="border-b border-slate-500/5 pb-3">
                <h3 className={`font-sans font-bold text-sm tracking-tight flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  <Briefcase size={16} className="text-indigo-500" />
                  <span>ทำเนียบนักศึกษาที่ได้รับการบรรจุแล้ว ({assignedRoster.length} ราย)</span>
                </h3>
              </div>

              {/* Roster table wrapper */}
              <div className="flex-1 overflow-y-auto mt-3 max-h-[300px]">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-500/5 text-slate-400 pb-2">
                      <th className="py-2">นักศึกษา</th>
                      <th className="py-2">สาขา/ปีการศึกษา</th>
                      <th className="py-2">หน่วยฝึกงานที่บรรจุ</th>
                      <th className="py-2">ที่ตั้งหน่วย</th>
                      <th className="py-2">สถานการณ์ฝึกงาน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-500/5 text-slate-300">
                    {assignedRoster.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">ยังไม่มีนักศึกษาได้รับการบรรจุลงในระบบ ณ ขณะนี้</td>
                      </tr>
                    ) : (
                      assignedRoster.map((row) => (
                        <tr key={row.student_id} className="hover:bg-slate-500/5 transition-colors">
                          <td className="py-2.5 font-bold text-slate-200">
                            <p className={darkMode?'text-slate-200':'text-slate-800'}>{row.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {row.student_id}</p>
                          </td>
                          <td className="py-2.5">
                            <p>{row.major}</p>
                            <p className="text-[10px] text-slate-400">พ.ศ. {row.internship_year+543}</p>
                          </td>
                          <td className="py-2.5 font-semibold truncate max-w-[120px] text-indigo-400">
                            {row.company_name}
                          </td>
                          <td className="py-2.5 font-medium">📍 {row.province}</td>
                          <td className="py-2.5">
                            <select
                              value={row.status}
                              onChange={(e) => handleChangeStatus(row.student_id, e.target.value)}
                              className={`p-1 text-[10px] font-bold rounded border ${
                                row.status === 'Completed' 
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              }`}
                            >
                              <option value="Planned">Planned</option>
                              <option value="Ongoing">Ongoing (กำลังฝึก)</option>
                              <option value="Completed">Completed (จบหลักสูตร)</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Modal Pairing Assign */}
          {selectedStudent && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className={`w-full max-w-md rounded-2xl border shadow-xl flex flex-col ${
                darkMode ? 'bg-[#1E2732] border-[#253341] text-gray-255' : 'bg-white border-slate-100 text-slate-800'
              }`}>
                
                <div className="p-5 border-b border-slate-100/10 flex justify-between items-center">
                  <h3 className="font-sans font-bold text-base flex items-center gap-2">
                    <ArrowRightLeft size={16} className="text-blue-500" />
                    <span>จับคู่จัดตั้งคณะการฝึกฝน</span>
                  </h3>
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    className="p-1 px-1.5 hover:bg-slate-500/10 rounded-full cursor-pointer text-slate-400"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleExecuteAssign} className="p-6 space-y-4 text-xs font-semibold">
                  
                  {/* Selected target Student info */}
                  <div className={`p-4 rounded-xl border ${darkMode?'bg-[#15202B] border-slate-800':'bg-slate-50 border-slate-100'}`}>
                    <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1">นิสิตผู้ได้รับการจัดสรร</span>
                    <strong className={`block text-sm ${darkMode?'text-white':'text-slate-800'}`}>
                      {selectedStudent.first_name} {selectedStudent.last_name}
                    </strong>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                      รหัส: {selectedStudent.student_id} | ป.ตรี | สายงาน {selectedStudent.major}
                    </span>
                  </div>

                  {/* Company selection dropdown */}
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-400">สถานประกอบการเปิดรับ (Active list)</label>
                    <select
                      required
                      value={matchingCompanyId}
                      onChange={(e) => setMatchingCompanyId(e.target.value)}
                      className={`w-full p-2.5 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        darkMode ? 'bg-[#15202B] border-slate-800 text-white':'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      {companies.map(c => (
                        <option key={c.company_id} value={c.company_id}>
                          {c.company_id} - {c.company_name} (📍 {c.province})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dates fields */}
                  <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-550/5">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-400">วันที่คิกออฟเริ่มงาน</label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={`w-full p-2 text-xs font-semibold border rounded-lg ${
                          darkMode ? 'bg-[#15202B] border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-400">สิ้นสุดปฏิบัติงาน</label>
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={`w-full p-2 text-xs font-semibold border rounded-lg ${
                          darkMode ? 'bg-[#15202B] border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Action row footer */}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStudent(null)}
                      className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-500/10 cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      id="btn-match-submit"
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      อนุมัติการจับคู่สิทธิ์
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
