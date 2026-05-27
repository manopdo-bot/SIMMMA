import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Users, 
  Phone, 
  Mail, 
  GraduationCap, 
  Filter, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  Info,
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
  AlertCircle
} from 'lucide-react';
import { Student } from '../types';

interface StudentsViewProps {
  darkMode: boolean;
  userRole: 'Admin' | 'Student';
}

export default function StudentsView({ darkMode, userRole }: StudentsViewProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  
  // Majors management states
  const [majors, setMajors] = useState<string[]>([]);
  const [isMajorsOpen, setIsMajorsOpen] = useState(false);
  const [newMajorName, setNewMajorName] = useState("");
  const [editingMajorOld, setEditingMajorOld] = useState<string | null>(null);
  const [editingMajorNew, setEditingMajorNew] = useState("");
  const [majorError, setMajorError] = useState("");

  const loadMajors = async () => {
    try {
      const res = await fetch("/api/majors");
      if (res.ok) {
        const list = await res.json();
        setMajors(list);
      }
    } catch (e) {
      console.error("Failed to load majors", e);
    }
  };

  // Dialog Open state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  
  // Add/Edit Student form fields
  const [formId, setFormId] = useState("");
  const [formFirst, setFormFirst] = useState("");
  const [formLast, setFormLast] = useState("");
  const [formMajor, setFormMajor] = useState("IT");
  const [formFaculty, setFormFaculty] = useState("เทคโนโลยีสารสนเทศ");
  const [formLevel, setFormLevel] = useState<'ปริญญาตรี' | 'ปวส'>("ปริญญาตรี");
  const [formYear, setFormYear] = useState(3);
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formInternYear, setFormInternYear] = useState(2026);
  const [formStatus, setFormStatus] = useState<'Planned' | 'Ongoing' | 'Completed'>("Planned");

  // BULK IMPORT upload state
  const [csvContent, setCsvContent] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [importSummary, setImportSummary] = useState<{added: number, duplicated: number} | null>(null);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  const loadStudents = async () => {
    try {
      const q = new URLSearchParams();
      if (searchQuery) q.set("search", searchQuery);
      if (selectedMajor) q.set("major", selectedMajor);
      if (selectedStatus) q.set("status", selectedStatus);
      if (selectedYear) q.set("year", selectedYear);

      const res = await fetch(`/api/students?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        setCurrentPage(1); // Reset to page 1 on filter
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStudents();
    loadMajors();
  }, [searchQuery, selectedMajor, selectedStatus, selectedYear]);

  const handleAddMajor = async (e: React.FormEvent) => {
    e.preventDefault();
    setMajorError("");
    if (!newMajorName.trim()) return;
    
    try {
      const res = await fetch("/api/majors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newMajorName.trim() })
      });
      if (res.ok) {
        setNewMajorName("");
        loadMajors();
      } else {
        const err = await res.json();
        setMajorError(err.error || "ไม่สามารถเพิ่มสาขาวิชาได้");
      }
    } catch (err) {
      setMajorError("เซิร์ฟเวอร์ขัดข้อง");
    }
  };

  const handleEditMajor = async (oldName: string) => {
    setMajorError("");
    if (!editingMajorNew.trim() || oldName === editingMajorNew.trim()) {
      setEditingMajorOld(null);
      return;
    }
    
    try {
      const res = await fetch("/api/majors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName, newName: editingMajorNew.trim() })
      });
      if (res.ok) {
        setEditingMajorOld(null);
        setEditingMajorNew("");
        loadMajors();
        loadStudents(); 
      } else {
        const err = await res.json();
        setMajorError(err.error || "ไม่สามารถแก้ไขสาขาวิชาได้");
      }
    } catch (err) {
      setMajorError("เซิร์ฟเวอร์ขัดข้อง");
    }
  };

  const handleDeleteMajor = async (name: string) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ที่จะลบสาขาวิชา "${name}"? การดำเนินการนี้จะถอนชื่อสาขาออกจากระบบ`)) {
      return;
    }
    setMajorError("");
    try {
      const res = await fetch("/api/majors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        loadMajors();
        loadStudents();
      } else {
        const err = await res.json();
        setMajorError(err.error || "ไม่สามารถลบสาขาวิชาได้");
      }
    } catch (err) {
      setMajorError("เซิร์ฟเวอร์ขัดข้อง");
    }
  };

  // Open Form Add
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormId("");
    setFormFirst("");
    setFormLast("");
    setFormMajor(majors && majors.length > 0 ? majors[0] : "IT");
    setFormFaculty("เทคโนโลยีสารสนเทศ");
    setFormLevel("ปริญญาตรี");
    setFormYear(3);
    setFormPhone("");
    setFormEmail("");
    setFormInternYear(2026);
    setFormStatus("Planned");
    setIsFormOpen(true);
  };

  // Open Form Edit
  const handleOpenEdit = (st: Student) => {
    setEditingStudent(st);
    setFormId(st.student_id);
    setFormFirst(st.first_name);
    setFormLast(st.last_name);
    setFormMajor(st.major);
    setFormFaculty(st.faculty);
    setFormLevel(st.education_level);
    setFormYear(st.year_level);
    setFormPhone(st.phone);
    setFormEmail(st.email);
    setFormInternYear(st.internship_year);
    setFormStatus(st.internship_status);
    setIsFormOpen(true);
  };

  // Save/Edit Student Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !formFirst || !formLast) {
      alert("กรุณากรอกข้อมูลที่สำคัญให้ครบถ้วน");
      return;
    }

    const payload = {
      student_id: formId,
      first_name: formFirst,
      last_name: formLast,
      major: formMajor,
      faculty: formFaculty,
      education_level: formLevel,
      year_level: Number(formYear),
      phone: formPhone,
      email: formEmail || `st.${formId}@university.ac.th`,
      internship_year: Number(formInternYear),
      internship_status: formStatus
    };

    try {
      let res;
      if (editingStudent) {
        res = await fetch(`/api/students/${formId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setIsFormOpen(false);
        setEditingStudent(null);
        loadStudents();
      } else {
        const err = await res.json();
        alert(err.error || "รหัสนักศึกษาลงทะเบียนซ้ำซ้อน");
      }
    } catch (e) {
      console.error(e);
      alert("เซิร์ฟเวอร์ขัดข้อง");
    }
  };

  // Delete Student
  const handleDelete = async (id: string, name: string) => {
    const isConfirm = window.confirm(`คุณแน่ใจหรือไม่ที่จะลบเอกสารนักศึกษา "${name}" (ID: ${id}) ออกจากโครงการฝึกงาน?`);
    if (!isConfirm) return;

    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadStudents();
      } else {
        alert("ลบนักศึกษาขัดข้อง");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Import Parser CSV logic
  const handleOnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleOnDragLeave = () => {
    setDragOver(false);
  };

  const handleOnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleParseFile(e.dataTransfer.files[0]);
    }
  };

  const handleOnFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleParseFile(e.target.files[0]);
    }
  };

  // Parse CSV template manually
  const handleParseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvContent(text);
      setImportError("");
      setImportSummary(null);
    };
    reader.onerror = () => {
      setImportError("ไม่สามารถอ่านไฟล์อัปโหลดได้");
    };
    reader.readAsText(file, "UTF-8");
  };

  const executeBulkImport = async () => {
    if (!csvContent) {
      setImportError("โปรดเลือกไฟล์หรือป้อนข้อความก่อนอัปโหลด");
      return;
    }

    try {
      const lines = csvContent.split(/\r?\n/);
      const parsedStudents: any[] = [];
      
      // Parse header line to determine matching
      // template format: student_id, first_name, last_name, major, education_level, year_level, phone, email, internship_year
      let startIdx = 1;
      const firstLine = lines[0].toLowerCase();
      if (!firstLine.includes("student_id") && !firstLine.includes("รหัส")) {
        // No header row, treat index 0 as data
        startIdx = 0;
      }

      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = line.split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
        if (cols.length < 3) continue; // Skip invalid columns (must at least contain id, first, last)
        
        parsedStudents.push({
          student_id: String(cols[0]),
          first_name: cols[1],
          last_name: cols[2],
          major: cols[3] || "IT",
          education_level: cols[4] === "ปวส" ? "ปวส" : "ปริญญาตรี",
          year_level: Number(cols[5]) || 3,
          phone: cols[6] || "-",
          email: cols[7] || `st.${cols[0]}@university.ac.th`,
          internship_year: Number(cols[8]) || 2026,
          internship_status: "Planned"
        });
      }

      if (parsedStudents.length === 0) {
        setImportError("ไม่พบข้อมูลนักศึกษาที่ประมวลผลได้ โปรดดูตัวอย่างโครงสร้างคอลัมน์");
        return;
      }

      const res = await fetch("/api/students/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: parsedStudents })
      });
      
      const data = await res.json();
      if (res.ok) {
        setImportSummary({ added: data.added, duplicated: data.duplicated });
        setCsvContent("");
        loadStudents();
      } else {
        setImportError(data.error || "อัปโหลดข้อมูลกลุ่มขัดข้อง");
      }
    } catch (err) {
      console.error(err);
      setImportError("ระบบประมวลผลไฟล์ล้มเหลว");
    }
  };

  // Pagination indexes
  const totalPages = Math.ceil(students.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = students.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 flex flex-col">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-500/10 pb-5">
        <div>
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase font-mono">
            Module 2 : Student Management
          </span>
          <h1 className={`text-2xl md:text-3xl font-sans font-bold tracking-tight mt-1 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            ทะเบียนนักศึกษาฝึกงาน
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            ฐานข้อมูลรวมประวัตินิสิต โครงการฝึกงาน แผนกวิชา และสิทธิ์การใช้งาน
          </p>
        </div>

        {userRole === 'Admin' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMajorsOpen(true)}
              id="btn-manage-majors"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                darkMode 
                  ? 'border-slate-800 text-slate-350 hover:bg-[#25303D]' 
                  : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50 shadow-sm'
              }`}
            >
              <GraduationCap size={14} className="text-indigo-500" />
              <span>จัดการสาขาวิชา</span>
            </button>

            <button
              onClick={() => setIsImportOpen(true)}
              id="btn-import-csv"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                darkMode 
                  ? 'border-slate-800 text-slate-350 hover:bg-[#25303D]' 
                  : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50 shadow-sm'
              }`}
            >
              <Upload size={14} />
              <span>นำเข้ากลุ่ม (Excel/CSV)</span>
            </button>
            
            <button
              onClick={handleOpenAdd}
              id="btn-add-student"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl cursor-pointer shadow-md transition-all duration-200 active:scale-95 text-xs"
            >
              <Plus size={16} />
              <span>เพิ่มนิสิตรายบุคคล</span>
            </button>
          </div>
        )}
      </div>

      {/* Filters panels */}
      <div className={`p-4 rounded-2xl border ${
        darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Keyword Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pr-3 pointer-events-none text-slate-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="ค้นหารหัสนิสิต / นามสกุล..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2 pl-9 pr-3 text-xs font-semibold rounded-xl outline-none border focus:ring-2 focus:ring-blue-500/20 transition-all ${
                darkMode 
                  ? 'bg-[#15202B] border-[#253341] text-gray-200 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-blue-400 focus:bg-white'
              }`}
            />
          </div>

          {/* Filter Major */}
          <div className="relative">
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className={`w-full py-2 px-3 text-xs font-semibold rounded-xl outline-none border focus:ring-2 focus:ring-blue-500/20 transition-all ${
                darkMode 
                  ? 'bg-[#15202B] border-[#253341] text-gray-300 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-150 text-slate-700 focus:border-blue-400 focus:bg-white'
              }`}
            >
              <option value="">สาขาวิชาเอก (ทั้งหมด)</option>
              {majors.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Filter Year level */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={`w-full py-2 px-3 text-xs font-semibold rounded-xl outline-none border focus:ring-2 focus:ring-blue-500/20 transition-all ${
                darkMode 
                  ? 'bg-[#15202B] border-[#253341] text-gray-300 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-150 text-slate-700 focus:border-blue-400 focus:bg-white'
              }`}
            >
              <option value="">ปีการศึกษาปฏิทิน (ทั้งหมด)</option>
              <option value="2025">2025 (พ.ศ. 2568)</option>
              <option value="2026">2026 (พ.ศ. 2569)</option>
              <option value="2027">2027 (พ.ศ. 2570)</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full py-2 px-3 text-xs font-semibold rounded-xl outline-none border focus:ring-2 focus:ring-blue-500/20 transition-all ${
                darkMode 
                  ? 'bg-[#15202B] border-[#253341] text-gray-300 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-150 text-slate-700 focus:border-blue-400 focus:bg-white'
              }`}
            >
              <option value="">สถานะฝึกงาน (ทั้งหมด)</option>
              <option value="Planned">Planned (วางแผนไว้)</option>
              <option value="Ongoing">Ongoing (กำลังฝึกอยู่)</option>
              <option value="Completed">Completed (ฝึกงานสำเร็จ)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Student list card or table */}
      <div className={`border rounded-2xl flex-1 transition-all overflow-hidden flex flex-col ${
        darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-150 shadow-sm'
      }`}>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-xs uppercase font-mono tracking-wider transition-colors font-bold ${
                darkMode ? 'border-slate-800 text-slate-400 bg-slate-500/5' : 'border-slate-100 text-slate-500 bg-slate-50'
              }`}>
                <th className="p-4 px-5">รหัสนักศึกษา</th>
                <th className="p-4">ชื่อ - นามสกุล</th>
                <th className="p-4">หลักสูตร / สาขาวิชา</th>
                <th className="p-4">ปีการศึกษา</th>
                <th className="p-4">การติดต่อสื่อสาร</th>
                <th className="p-4">สถานะสถานะการฝึกงาน</th>
                {userRole === 'Admin' && <th className="p-4 text-center shrink-0">การจัดการ</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/5 text-xs text-slate-300">
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Users size={32} className="mx-auto mb-2 text-slate-500" />
                    <p className="font-semibold">ไม่มีสารบบข้อมูลนักศึกษาฝึกงานสำหรับเกณฑ์ปัจจุบัน</p>
                  </td>
                </tr>
              ) : (
                currentRows.map((st) => {
                  const sColor = st.internship_status === "Completed" 
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                    : st.internship_status === "Ongoing" 
                      ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20" 
                      : "bg-slate-500/15 text-slate-400 border border-slate-500/20";
                  
                  return (
                    <tr key={st.student_id} className="hover:bg-slate-500/5 transition-colors">
                      <td className={`p-4 px-5 font-mono font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                        {st.student_id}
                      </td>
                      <td className="p-4">
                        <p className={`font-bold ${darkMode ? 'text-slate-100' : 'text-slate-850'}`}>
                          {st.education_level === "ปวส" ? "[ปวส.]" : ""} {st.first_name} {st.last_name}
                        </p>
                        <p className="text-[11px] text-slate-400">ชั้นปีที่ {st.year_level}</p>
                      </td>
                      <td className="p-4">
                        <p className={darkMode ? 'text-slate-200' : 'text-slate-700'}>{st.major}</p>
                        <p className="text-[10px] text-slate-400">{st.faculty}</p>
                      </td>
                      <td className="p-4 font-mono">
                        {st.internship_year} (พ.ศ. {st.internship_year + 543})
                      </td>
                      <td className="p-4">
                        <p className="flex items-center gap-1">
                          <Phone size={10} className="text-slate-400" />
                          <span>{st.phone}</span>
                        </p>
                        <p className="flex items-center gap-1 mt-0.5 max-w-[150px] truncate">
                          <Mail size={10} className="text-slate-400" />
                          <span className="truncate">{st.email}</span>
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] inline-block font-bold ${sColor}`}>
                          {st.internship_status === "Completed" ? "ฝึกงานสําเร็จ" : st.internship_status === "Ongoing" ? "กำลังฝึกงานอยู่" : "รอดำเนินการ"}
                        </span>
                      </td>
                      
                      {userRole === 'Admin' && (
                        <td className="p-4">
                          <div className="flex gap-2 justify-center items-center">
                            <button
                              onClick={() => handleOpenEdit(st)}
                              className="p-1.5 rounded-lg border border-slate-500/10 hover:bg-blue-500/10 text-blue-500"
                              title="แก้ไขประวัตินักศึกษา"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(st.student_id, `${st.first_name} ${st.last_name}`)}
                              className="p-1.5 rounded-lg border border-slate-500/10 hover:bg-red-500/10 text-red-500"
                              title="ลบนักศึกษา"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Traditional pagination details footer */}
        <div className={`p-4 border-t flex justify-between items-center text-xs font-semibold ${
          darkMode ? 'border-slate-800 text-slate-400 bg-slate-500/5' : 'border-slate-100 text-slate-500'
        }`}>
          <span>แสดงแถว {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, students.length)} จากทั้งหมด {students.length} ราย</span>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-slate-500/10 hover:bg-slate-500/20 disabled:opacity-40 cursor-pointer text-slate-400"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono bg-blue-500/10 text-blue-500 rounded p-1 px-2.5">
              หน้า {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-slate-500/10 hover:bg-slate-500/20 disabled:opacity-40 cursor-pointer text-slate-400"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* CSV Group Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-xl rounded-2xl border shadow-xl flex flex-col ${
            darkMode ? 'bg-[#1E2732] border-[#253341] text-gray-200' : 'bg-white border-slate-100 text-slate-800'
          }`}>
            
            <div className="p-5 border-b border-slate-100/10 flex justify-between items-center">
              <h3 className="font-sans font-bold text-lg flex items-center gap-2">
                <Upload size={18} className="text-blue-500" />
                <span>นำเข้านักศึกษาฝึกงานแบบ Excel/CSV กลุ่ม</span>
              </h3>
              <button 
                onClick={() => {
                  setIsImportOpen(false);
                  setImportSummary(null);
                  setCsvContent("");
                  setImportError("");
                }}
                className="p-1.5 rounded-full hover:bg-slate-500/10 cursor-pointer text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              
              {/* Structure Guidelines */}
              <div className={`p-4 rounded-xl border flex gap-3 ${
                darkMode ? 'bg-[#15202B] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-150 text-slate-600'
              }`}>
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">กฎคอลัมน์ในการจัดเรียงไฟล์ CSV:</p>
                  <p className="mt-1 leading-relaxed">
                    โปรดจัดเรียงคอลัมน์โดยไม่ใช้ตัวหนังสือชื่อคอลัมน์ หรือจัดโครงสร้างคีย์เป็น:
                    <br />
                    <span className="font-mono bg-slate-500/10 text-blue-500 p-0.5 rounded text-[11px] block mt-1 select-all">
                      student_id, first_name, last_name, major, education_level, year_level, phone, email, internship_year
                    </span>
                  </p>
                </div>
              </div>

              {/* Sample area to copy paste directly */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">ตัวอย่างตัวอักษร Copy วางทดสอบ (3 แถว):</span>
                <pre className="p-2.5 rounded border border-slate-500/10 bg-slate-500/5 font-mono text-[10px] text-slate-400 select-all whitespace-pre">
{`66010199,นิพนธ์,มุ่งมั่นวิทยา,IT,ปริญญาตรี,3,0899990101,nepon@example.com,2026
66010200,สิรินธร,ปิยเมสสะ,Software Engineering,ปริญญาตรี,3,0899990202,sirin@example.com,2026
66010201,จักรภพ,วัฒนาเรืองกุล,IT,ปวส,1,0899990303,jak@example.com,2026`}
                </pre>
              </div>

              {/* Real dropzone or text area */}
              <div 
                onDragOver={handleOnDragOver}
                onDragLeave={handleOnDragLeave}
                onDrop={handleOnDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver 
                    ? 'border-blue-500 bg-blue-500/5' 
                    : darkMode 
                      ? 'border-[#253341] hover:bg-[#15202B]/60' 
                      : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".csv,.txt"
                  className="hidden" 
                  onChange={handleOnFileInputChange}
                />
                
                <Upload size={32} className="mx-auto mb-2 text-slate-400" />
                <p className="font-semibold text-xs">ลากและวางไฟล์ CSV ของคุณที่นี่ หรือคลิกเพื่อเลือกไฟล์พิกัด</p>
                <p className="text-[10px] text-slate-500 mt-1">ขนาดไฟล์ต้องไม่เกิน 5MB รองรับเฉพาะรูปแบบ .csv และ .txt UTF-8</p>
              </div>

              {/* Selected Files preview or TextBox paste */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">หรือวางข้อความเนื้อความโดยตรงเพื่อประมวลผล:</span>
                <textarea
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="วางข้อความสอดคล้องกับคอลัมน์ด้านบนได้ทันที..."
                  rows={4}
                  className={`w-full p-2.5 font-mono text-[11px] border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    darkMode ? 'bg-[#15202B] border-[#253341] text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              {importError && (
                <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs flex gap-2 items-center">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importSummary && (
                <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs flex gap-2 items-center">
                  <Check size={14} className="shrink-0" />
                  <span>
                    นำเข้าข้อมูลประวัติสำเร็จ <strong>{importSummary.added}</strong> รายการ | รหัสซ้ำในระบบ <strong>{importSummary.duplicated}</strong> รายการ
                  </span>
                </div>
              )}

            </div>

            {/* Modal actions footer */}
            <div className="p-4 border-t border-slate-100/10 flex justify-end gap-2.5">
              <button
                onClick={() => {
                  setIsImportOpen(false);
                  setImportSummary(null);
                  setCsvContent("");
                  setImportError("");
                }}
                className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-500/10 cursor-pointer"
              >
                ยกเลิก
              </button>
              
              <button
                onClick={executeBulkImport}
                id="btn-import-submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                ยื่นเสนอและเพิ่มข้อมูลกลุ่ม
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Manual Add/Edit Student Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-lg rounded-2xl border shadow-xl flex flex-col ${
            darkMode ? 'bg-[#1E2732] border-[#253341] text-gray-200' : 'bg-white border-slate-100 text-slate-800'
          }`}>
            
            <div className="p-5 border-b border-slate-100/10 flex justify-between items-center">
              <h3 className="font-sans font-bold text-lg">
                {editingStudent ? 'แก้ไขประวัตินักศึกษา' : 'บันทึกประวัตินิสิตประจำปีใหม่'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 px-1.5 hover:bg-slate-500/10 rounded-full cursor-pointer text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                
                {/* Student ID */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">รหัสนักศึกษา ( 8 หลัก ) *</label>
                  <input
                    type="text"
                    required
                    disabled={editingStudent !== null}
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="เช่น 66010123"
                    className={`w-full p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-40 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Major */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">สาขาวิชาเอก *</label>
                  <select
                    value={formMajor}
                    onChange={(e) => setFormMajor(e.target.value)}
                    className={`w-full p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {majors.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* First name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ชื่อจริง *</label>
                  <input
                    type="text"
                    required
                    value={formFirst}
                    onChange={(e) => setFormFirst(e.target.value)}
                    placeholder="ป้อนชื่อต้น..."
                    className={`w-full p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Last name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={formLast}
                    onChange={(e) => setFormLast(e.target.value)}
                    placeholder="ป้อนนามสกุล..."
                    className={`w-full p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Edu level */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ระดับการศึกษา</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as 'ปริญญาตรี' | 'ปวส')}
                    className={`w-full p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="ปริญญาตรี">ปริญญาตรี</option>
                    <option value="ปวส">ปวส.</option>
                  </select>
                </div>

                {/* Year Level */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ชั้นปี (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className={`w-full p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">เบอร์ติดต่อมือถือ</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="เช่น 0891234567"
                    className={`w-full p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Internship Year */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ปีที่เข้าฝึกงาน (ค.ศ. )</label>
                  <input
                    type="number"
                    min="2020"
                    value={formInternYear}
                    onChange={(e) => setFormInternYear(Number(e.target.value))}
                    className={`w-full p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Email */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">อีเมลทางการศึกษาสถาบัน</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="เช่น st.66010123@university.ac.th"
                    className={`w-full p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Internship Status */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">สถานะโครงการฝึกงานปัจจุบัน</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Planned' | 'Ongoing' | 'Completed')}
                    className={`w-full p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Planned">Planned (ยังรอดำเนินการจัดสรร)</option>
                    <option value="Ongoing">Ongoing (กำลังดำเนินการฝึกงานอยู่)</option>
                    <option value="Completed">Completed (การฝึกเสร็จสมบูรณ์เรียบร้อยแล้ว)</option>
                  </select>
                </div>

              </div>

              {/* Form submit buttons */}
              <div className="pt-4 border-t border-slate-100/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-500/10 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  id="btn-save-st-form"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  บันทึกรายการ
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────┐
          │ DIALOG: MANAGE MAJORS (ADD, EDIT, DELETE)               │
          └──────────────────────────────────────────────────────── */}
      {isMajorsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${
            darkMode ? 'bg-[#1C242F] border-[#253341] text-white' : 'bg-white border-slate-100 text-slate-800'
          }`}>
            {/* Header */}
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <GraduationCap size={18} />
                <h3 className="text-sm font-bold">จัดการสาขาวิชาเอก</h3>
              </div>
              <button
                onClick={() => {
                  setIsMajorsOpen(false);
                  setMajorError("");
                  setEditingMajorOld(null);
                }}
                className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer animate-none"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content / Body */}
            <div className="p-6 space-y-6">
              
              {/* Add form */}
              <form onSubmit={handleAddMajor} className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">เพิ่มสาขาวิชาใหม่</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="เช่น AI and Robotics Engineering"
                    value={newMajorName}
                    onChange={(e) => setNewMajorName(e.target.value)}
                    className={`flex-1 p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341]' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 px-4 rounded-lg text-xs cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus size={14} />
                    <span>เพิ่ม</span>
                  </button>
                </div>
              </form>

              {majorError && (
                <p className="text-xs text-rose-500 font-sans font-medium">{majorError}</p>
              )}

              {/* Majors List */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">สาขาวิชาทั้งหมดในระบบ ({majors.length})</label>
                
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 border border-slate-500/5 rounded-lg p-2 bg-slate-500/5">
                  {majors.map((m) => {
                    const isEditing = editingMajorOld === m;
                    return (
                      <div
                        key={m}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                          darkMode ? 'bg-[#15202B] border-[#253341]' : 'bg-white border-slate-105 shadow-sm'
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1 mr-2">
                            <input
                              type="text"
                              value={editingMajorNew}
                              onChange={(e) => setEditingMajorNew(e.target.value)}
                              className={`flex-1 p-1 text-xs font-semibold border rounded focus:outline-none ${
                                darkMode ? 'bg-[#1E2732] border-[#253341] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                              }`}
                              autoFocus
                            />
                            <button
                              onClick={() => handleEditMajor(m)}
                              className="p-1 rounded bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                              title="บันทึก"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditingMajorOld(null)}
                              className="p-1 rounded bg-slate-500 hover:bg-slate-600 text-white cursor-pointer"
                              title="ยกเลิก"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="font-semibold">{m}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingMajorOld(m);
                                  setEditingMajorNew(m);
                                }}
                                className={`p-1.5 rounded-lg hover:text-blue-500 transition-colors cursor-pointer ${
                                  darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-50 text-slate-500'
                                }`}
                                title="แก้ไขชื่อสาขาวิชา"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteMajor(m)}
                                className={`p-1.5 rounded-lg hover:text-rose-500 transition-colors cursor-pointer ${
                                  darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-50 text-slate-500'
                                }`}
                                title="ลบสาขาวิชา"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                  {majors.length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-4">ไม่มีข้อมูลสาขาวิชา</p>
                  )}
                </div>

              </div>

            </div>

            {/* Footer */}
            <div className={`p-3 px-6 border-t flex justify-end ${
              darkMode ? 'border-slate-500/10 bg-[#15202B]/40' : 'border-slate-100 bg-slate-50/50'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setIsMajorsOpen(false);
                  setMajorError("");
                  setEditingMajorOld(null);
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
