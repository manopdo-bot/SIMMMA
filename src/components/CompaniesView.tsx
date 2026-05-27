import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Trophy, 
  Star, 
  Filter, 
  Edit, 
  Trash2, 
  Sparkles, 
  X, 
  Sparkle,
  CheckCircle,
  HelpCircle,
  Home,
  Utensils,
  Car
} from 'lucide-react';
import { Company, CompanyReview } from '../types';

interface CompaniesViewProps {
  darkMode: boolean;
  userRole: 'Admin' | 'Student';
  userEmail: string;
}

export default function CompaniesView({ darkMode, userRole, userEmail }: CompaniesViewProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [minAllowance, setMinAllowance] = useState("");
  const [minRating, setMinRating] = useState("");
  
  // UI Dialog Controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyDetail, setCompanyDetail] = useState<Company | null>(null);
  
  // AI Analyze state
  const [aiReport, setAiReport] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  
  // Add/Edit Form State
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("IT");
  const [formAddress, setFormAddress] = useState("");
  const [formProvince, setFormProvince] = useState("กรุงเทพมหานคร");
  const [formLatitude, setFormLatitude] = useState(13.7563);
  const [formLongitude, setFormLongitude] = useState(100.5018);
  const [formContact, setFormContact] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAllowance, setFormAllowance] = useState(300);
  const [formAcc, setFormAcc] = useState(false);
  const [formMeal, setFormMeal] = useState(false);
  const [formTransport, setFormTransport] = useState(false);
  const [formPositions, setFormPositions] = useState("");
  const [formSlots, setFormSlots] = useState(2);
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>("Active");

  // Load companies & reviews
  const loadData = async () => {
    try {
      const q = new URLSearchParams();
      if (searchQuery) q.set("search", searchQuery);
      if (selectedProvince) q.set("province", selectedProvince);
      if (selectedType) q.set("business_type", selectedType);
      if (minAllowance) q.set("min_allowance", minAllowance);
      if (minRating) q.set("min_rating", minRating);
      
      const compRes = await fetch(`/api/companies?${q.toString()}`);
      const compData = await compRes.json();
      setCompanies(compData);

      const reviewRes = await fetch("/api/reviews");
      const rData = await reviewRes.json();
      setReviews(rData);
    } catch (e) {
      console.error("Error loading companies in client", e);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedProvince, selectedType, minAllowance, minRating]);

  // Open Form for Adding New Company
  const handleOpenAdd = () => {
    setEditingCompany(null);
    setFormName("");
    setFormType("IT");
    setFormAddress("");
    setFormProvince("กรุงเทพมหานคร");
    setFormLatitude(13.7563);
    setFormLongitude(100.5018);
    setFormContact("");
    setFormPhone("");
    setFormEmail("");
    setFormAllowance(300);
    setFormAcc(false);
    setFormMeal(false);
    setFormTransport(false);
    setFormPositions("");
    setFormSlots(2);
    setFormDescription("");
    setFormStatus("Active");
    setIsFormOpen(true);
  };

  // Open Form for Editing Company
  const handleOpenEdit = (comp: Company) => {
    setEditingCompany(comp);
    setFormName(comp.company_name);
    setFormType(comp.business_type);
    setFormAddress(comp.address);
    setFormProvince(comp.province);
    setFormLatitude(comp.latitude);
    setFormLongitude(comp.longitude);
    setFormContact(comp.contact_person);
    setFormPhone(comp.phone);
    setFormEmail(comp.email);
    setFormAllowance(comp.allowance);
    setFormAcc(comp.accommodation);
    setFormMeal(comp.meal_support);
    setFormTransport(comp.transportation_support);
    setFormPositions(comp.available_positions);
    setFormSlots(comp.internship_slots);
    setFormDescription(comp.company_description);
    setFormStatus(comp.status);
    setIsFormOpen(true);
  };

  // Submit Company Form (Create / Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formType) {
      alert("กรุณาระบุชื่อบริษัทและประเภทธุรกิจ");
      return;
    }

    const payload = {
      company_name: formName,
      business_type: formType,
      address: formAddress,
      province: formProvince,
      district: "อ.เมือง",
      latitude: Number(formLatitude),
      longitude: Number(formLongitude),
      contact_person: formContact,
      phone: formPhone,
      email: formEmail,
      allowance: Number(formAllowance),
      accommodation: formAcc,
      meal_support: formMeal,
      transportation_support: formTransport,
      welfare_detail: `${formAcc ? 'มีหอพัก': 'ไม่มีหอพัก'} | ${formMeal ? 'มีสวัสดิการอาหารกลางวัน': '-'} | ${formTransport ? 'มีรถรับส่ง': '-'}`,
      available_positions: formPositions,
      internship_slots: Number(formSlots),
      company_description: formDescription,
      status: formStatus
    };

    try {
      let res;
      if (editingCompany) {
        // Edit Company
        res = await fetch(`/api/companies/${editingCompany.company_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // Create Company
        res = await fetch("/api/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setIsFormOpen(false);
        setEditingCompany(null);
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
  };

  // Delete Company
  const handleDeleteCompany = async (id: string, name: string) => {
    const isConfirmed = window.confirm(`คุณแน่ใจหรือไม่ที่จะลบข้อมูลสถานประกอบการ "${name}" (ID: ${id}) ? การกระทำนี้ไม่สามารถย้อนกลับได้`);
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadData();
        if (companyDetail?.company_id === id) {
          setCompanyDetail(null);
        }
      } else {
        alert("ลบข้อมูลไม่สำเร็จ");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run AI Summary Analysis with Gemini Client API proxy Endpoint
  const handleAiAnalyze = async (cid: string) => {
    try {
      setAiLoading(true);
      setAiReport("");
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "company-report", companyId: cid })
      });
      
      const data = await res.json();
      if (res.ok) {
        setAiReport(data.text);
      } else {
        setAiReport(`❌ ล้มเหลว: ${data.error || "โปรดใส่ GEMINI_API_KEY ลงในระบบตั้งค่า"}`);
      }
    } catch (err: any) {
      setAiReport("❌ เกิดข้อผิดพลาดทางเทคนิคในการติดต่อประมวลผลด้วยโมเดล Gemini");
    } finally {
      setAiLoading(false);
    }
  };

  const provinces = ["กรุงเทพมหานคร", "นนทบุรี", "ชลบุรี", "ระยอง", "เชียงใหม่", "ภูเก็ต", "ขอนแก่น", "นครราชสีมา", "ปทุมธานี", "สมุทรปราการ"];
  const businessTypes = ["IT", "Manufacturing", "Logistics", "Construction", "Service"];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 flex flex-col">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-500/10 pb-5">
        <div>
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase font-mono">
            Module 1 : Company Management
          </span>
          <h1 className={`text-2xl md:text-3xl font-sans font-bold tracking-tight mt-1 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            ทะเบียนสถานประกอบการฝึกงาน
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            ค้นหาข้อมูลสวัสดิการ ค่าตอบแทน ตำแหน่งเปิดรับ และรายงานคะแนนรีวิวจากนักศึกษารุ่นพี่
          </p>
        </div>

        {userRole === 'Admin' && (
          <button
            onClick={handleOpenAdd}
            id="btn-add-company"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl cursor-pointer shadow-md transition-all duration-200 active:scale-95"
          >
            <Plus size={18} />
            <span>เพิ่มสถานประกอบการ</span>
          </button>
        )}
      </div>

      {/* Filter and Search controls */}
      <div className={`p-4 rounded-2xl border ${
        darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <span className="absolute inset-y-0 left-3 flex items-center pr-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="ค้นหาชื่อบริษัท / ตำแหน่งฝึกงาน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2.5 pl-10 pr-4 text-xs font-medium rounded-xl outline-none border focus:ring-2 focus:ring-blue-500/20 transition-all ${
                darkMode 
                  ? 'bg-[#15202B] border-[#253341] text-gray-200 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-blue-400 focus:bg-white'
              }`}
            />
          </div>

          {/* Filter Province */}
          <div className="relative">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className={`w-full py-2.5 px-3 text-xs font-semibold rounded-xl outline-none border focus:ring-2 focus:ring-blue-500/20 transition-all ${
                darkMode 
                  ? 'bg-[#15202B] border-[#253341] text-gray-300 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-150 text-slate-700 focus:border-blue-400 focus:bg-white'
              }`}
            >
              <option value="">กรองตามจังหวัด (ทั้งหมด)</option>
              {provinces.map(prov => <option key={prov} value={prov}>{prov}</option>)}
            </select>
          </div>

          {/* Filter Business Type */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`w-full py-2.5 px-3 text-xs font-semibold rounded-xl outline-none border focus:ring-2 focus:ring-blue-500/20 transition-all ${
                darkMode 
                  ? 'bg-[#15202B] border-[#253341] text-gray-300 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-150 text-slate-700 focus:border-blue-400 focus:bg-white'
              }`}
            >
              <option value="">ประเภทอุตสาหกรรม (ทั้งหมด)</option>
              {businessTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          {/* Filter Allowance */}
          <div className="relative">
            <select
              value={minAllowance}
              onChange={(e) => setMinAllowance(e.target.value)}
              className={`w-full py-2.5 px-3 text-xs font-semibold rounded-xl outline-none border focus:ring-2 focus:ring-blue-500/20 transition-all ${
                darkMode 
                  ? 'bg-[#15202B] border-[#253341] text-gray-300 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-150 text-slate-700 focus:border-blue-400 focus:bg-white'
              }`}
            >
              <option value="">ค่าตอบแทนขั้นต่ำ (ทั้งหมด)</option>
              <option value="1">มีค่าเบี้ยเลี้ยงรายวัน</option>
              <option value="300">300 บาทขึ้นไป / วัน</option>
              <option value="400">400 บาทขึ้นไป / วัน</option>
              <option value="500">500 บาทขึ้นไป / วัน</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Companies Panel & Detailed Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
        
        {/* Companies List view (Left) */}
        <div className="lg:col-span-2 space-y-4 max-h-[620px] overflow-y-auto pr-1">
          {companies.length === 0 ? (
            <div className={`p-12 text-center border rounded-2xl border-dashed ${
              darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
            }`}>
              <Building2 size={40} className="mx-auto mb-3" />
              <p className="font-semibold text-sm">ไม่พบทะเบียนข้อมูลสถานประกอบการที่ระบุ</p>
              <p className="text-xs">ลองล้างการค้นหาหรือเพิ่มบริษัทใหม่ในระบบ</p>
            </div>
          ) : (
            companies.map((comp) => {
              const isActive = companyDetail?.company_id === comp.company_id;
              
              return (
                <div
                  key={comp.company_id}
                  onClick={() => {
                    setCompanyDetail(comp);
                    setAiReport("");
                  }}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    isActive
                      ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/30'
                      : darkMode 
                        ? 'bg-[#1E2732] border-[#253341] hover:bg-[#25303D]' 
                        : 'bg-white border-slate-150/80 hover:border-slate-250'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">
                          {comp.company_id}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          comp.business_type === 'IT' 
                            ? 'bg-blue-600/10 text-blue-500' 
                            : comp.business_type === 'Manufacturing' 
                              ? 'bg-amber-600/10 text-amber-500'
                              : 'bg-slate-500/10 text-slate-500'
                        }`}>
                          {comp.business_type}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          comp.status === 'Active' 
                            ? 'bg-emerald-500/15 text-emerald-500' 
                            : 'bg-red-500/15 text-red-500'
                        }`}>
                          {comp.status === 'Active' ? 'เปิดรับ' : 'ปิดชั่วคราว'}
                        </span>
                      </div>
                      
                      <h3 className={`font-sans font-bold text-base mt-2 truncate ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                        {comp.company_name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-sans">
                        <MapPin size={12} className="text-red-500 shrink-0" />
                        <span className="truncate">{comp.address}</span>
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="flex items-center justify-end text-amber-500 text-sm gap-0.5">
                        <span>⭐</span>
                        <span className="font-bold font-mono">{comp.avg_rating || "N/A"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">({comp.review_count} รีวิว)</span>
                    </div>
                  </div>

                  {/* Highlights widgets */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-500/5 text-xs text-slate-400">
                    <div>
                      <span className="block text-[10px] uppercase font-mono text-slate-400">เบี้ยเลี้ยง</span>
                      <span className={`font-bold mt-0.5 block ${comp.allowance > 0 ? "text-emerald-500" : ""}`}>
                        {comp.allowance > 0 ? `฿${comp.allowance}/วัน` : "ไม่มีเบี้ยเลี้ยง"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-mono text-slate-400">โควต้าฝึกงาน</span>
                      <span className={`font-bold mt-0.5 block ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                        {comp.internship_slots} ตำแหน่ง
                      </span>
                    </div>

                    <div className="truncate">
                      <span className="block text-[10px] uppercase font-mono text-slate-400">สวัสดิการหลัก</span>
                      <span className="mt-0.5 block font-medium truncate">
                        {comp.accommodation ? '🏠 หอพักฟรี ' : ''}
                        {comp.meal_support ? '🍱 อาหารกลางวัน ' : ''}
                        {!comp.accommodation && !comp.meal_support && 'ทั่วไป'}
                      </span>
                    </div>
                  </div>

                  {userRole === 'Admin' && (
                    <div className="flex justify-end gap-2 mt-3 pt-2.5 border-t border-slate-500/5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(comp);
                        }}
                        className="p-1 px-2.5 rounded-lg border border-slate-500/15 hover:bg-indigo-500/10 text-indigo-500 text-xs font-semibold flex items-center gap-1 shrink-0"
                      >
                        <Edit size={12} />
                        <span>แก้ไข</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCompany(comp.company_id, comp.company_name);
                        }}
                        className="p-1 px-2.5 rounded-lg border border-slate-500/15 hover:bg-red-500/10 text-red-500 text-xs font-semibold flex items-center gap-1 shrink-0"
                      >
                        <Trash2 size={12} />
                        <span>ลบ</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Detailed Screen / Right Split View Panel */}
        <div className="col-span-1 space-y-4">
          {companyDetail ? (
            <div className={`p-6 rounded-2xl border text-left flex flex-col ${
              darkMode ? 'bg-[#1E2732] border-blue-500/20' : 'bg-white border-slate-150 shadow-md'
            }`}>
              
              {/* Card Title Header */}
              <div className="flex justify-between items-start border-b border-slate-500/10 pb-4">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-indigo-500 font-mono">
                    รายละเอียดสถานประกอบการ
                  </span>
                  <h2 className={`font-sans font-black text-lg truncate mt-1 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    {companyDetail.company_name}
                  </h2>
                </div>
                <button 
                  onClick={() => setCompanyDetail(null)}
                  className="p-1.5 rounded-full hover:bg-slate-500/10 text-slate-400 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Main Attributes */}
              <div className="mt-5 space-y-4 flex-1 text-slate-400">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold">ข้อมูลองค์กรเบื้องต้น</span>
                  <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {companyDetail.company_description || "ยังไม่มีข้อมูลคำแนะนำประกอบธุรกิจหลัก"}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-500/5">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold">ตำแหน่งเปิดรับ</span>
                  <p className={`text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {companyDetail.available_positions || "ระบุทั่วไป"}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-500/5 space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold block mb-1">สวัสดิการที่จัดเตรียมให้</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center gap-1.5 ${companyDetail.accommodation ? "text-emerald-500" : "text-slate-400 opacity-60"}`}>
                      <Home size={14} />
                      <span className="font-semibold">หอพักพนักงาน/ค่าเช่า</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${companyDetail.meal_support ? "text-emerald-500" : "text-slate-400 opacity-60"}`}>
                      <Utensils size={14} />
                      <span className="font-semibold">สวัสดิการเบิกอาหาร</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${companyDetail.transportation_support ? "text-emerald-500" : "text-slate-400 opacity-60"}`}>
                      <Car size={14} />
                      <span className="font-semibold">รถรับส่งประจำวัน</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-500/5">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold block">ช่องทางติดต่อประสานงาน</span>
                  <div className="space-y-1.5 text-xs">
                    <p className="flex items-center gap-2">
                      <Phone size={13} className="text-slate-400" />
                      <span className={darkMode ? 'text-slate-250':'text-slate-700'}>{companyDetail.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail size={13} className="text-slate-400" />
                      <span className={darkMode ? 'text-slate-250':'text-slate-700'}>{companyDetail.email}</span>
                    </p>
                  </div>
                </div>

                {/* Gemini AI Summary Integration */}
                <div className={`mt-4 p-4 rounded-xl border border-dashed text-left ${
                  darkMode ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-indigo-50/40 border-indigo-100'
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-indigo-500 text-xs font-bold">
                      <Sparkles size={14} className="animate-spin-slow" />
                      <span>วิเคราะห์สรุปความเห็นด้วย AI</span>
                    </div>
                    
                    <button
                      onClick={() => handleAiAnalyze(companyDetail.company_id)}
                      disabled={aiLoading}
                      id="btn-ai-analyze"
                      className="text-[10px] bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/40 text-white font-bold py-1 px-2.5 rounded shadow cursor-pointer transition-colors duration-200"
                    >
                      {aiLoading ? 'กำลังประมวลผล...' : 'วิเคราะห์ข้อมูล'}
                    </button>
                  </div>

                  {aiReport ? (
                    <div className="mt-3 text-xs leading-relaxed text-slate-300 border-t border-slate-500/10 pt-2.5 font-sans">
                      <p className={`whitespace-pre-line text-[11.5px] ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {aiReport}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1.5">
                      กดปุ่มขับเคลื่อนด้วยโมเดล Gemini 2.5-flash เพื่อประเมินสรุปข้อคิดเห็นจากรีวิวทักษะการเรียนรู้, สวัสดิการ, ค่าตอบแทนสะสมของสถานประกอบการแห่งนี้อย่างอัจฉริยะ
                    </p>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className={`p-8 text-center border rounded-2xl border-dashed h-full flex flex-col justify-center items-center ${
              darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-150 text-slate-400'
            }`}>
              <Building2 size={36} className="mb-2" />
              <p className="text-xs font-bold">โปรดเลือกสถานประกอบการหลัก</p>
              <p className="text-[11px] max-w-[200px] mt-1 text-center mx-auto">คลิกเลือกบริษัททางซ้ายมือเพื่อให้ระบบวิเคราะห์รายละเอียดทางเทคนิคและสวัสดิการเชื่องช้า</p>
            </div>
          )}
        </div>

      </div>

      {/* Form Dialog Modal for Add/Edit Company */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className={`w-full max-w-xl rounded-2xl border shadow-xl flex flex-col my-8 ${
            darkMode ? 'bg-[#1E2732] border-[#253341] text-gray-200' : 'bg-white border-slate-100 text-slate-800'
          }`}>
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100/10 flex justify-between items-center">
              <h3 className="font-sans font-bold text-lg">
                {editingCompany ? 'แก้ไขรายละเอียดบริษัท' : 'เพิ่มสถานประกอบการฝึกงานใหม่'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 px-1.5 hover:bg-slate-500/10 rounded-full cursor-pointer text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto max-h-[500px]">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ชื่อสภานประกอบการ *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="เช่น บริษัท อินโนเวทีฟเทค (ประเทศไทย) จำกัด"
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-55 bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ประเภทธุรกิจ *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {businessTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">สถานะรับนิสิต</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Active">Active (เปิดรับ)</option>
                    <option value="Inactive">Inactive (ปิดรับชั่วคราว)</option>
                  </select>
                </div>

                {/* Province */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">จังหวัด *</label>
                  <select
                    value={formProvince}
                    onChange={(e) => setFormProvince(e.target.value)}
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {provinces.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                  </select>
                </div>

                {/* Slots */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">จำนวนที่รับสมัคร ( slots )</label>
                  <input
                    type="number"
                    min="1"
                    value={formSlots}
                    onChange={(e) => setFormSlots(Number(e.target.value))}
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Allowance */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ค่าตอบแทน (บาm/วัน)</label>
                  <input
                    type="number"
                    min="0"
                    value={formAllowance}
                    onChange={(e) => setFormAllowance(Number(e.target.value))}
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Latitude / Longitude */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">พิกัดละติจูด (Lat)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formLatitude}
                    onChange={(e) => setFormLatitude(Number(e.target.value))}
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">พิกัดลองจิจูด (Lng)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formLongitude}
                    onChange={(e) => setFormLongitude(Number(e.target.value))}
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Available positions */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ตำแหน่งงานเปิดรับสมัคร *</label>
                  <input
                    type="text"
                    required
                    value={formPositions}
                    onChange={(e) => setFormPositions(e.target.value)}
                    placeholder="เช่น Full Stack Developer, Network Trainee (คั่นด้วยคอมมา)"
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">บุคคลผู้ติดต่อ</label>
                  <input
                    type="text"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    placeholder="เช่น คุณชมพูนุช รักเรียน (HR)"
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">เบอร์ติดต่อประสานงาน</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="เช่น 0812345678"
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Email */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">อีเมลติดต่อบริษัท</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="เช่น hr@corporative.com"
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Address */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">ที่อยู่ที่ดำเนินงานหลัก *</label>
                  <textarea
                    required
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="เช่น 123/4 อาคารไอที ถ.แจ้งวัฒนะ ต.เสม็ด อ.บางแสน..."
                    rows={2}
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Desc */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">รายละเอียดบริษัทเพิ่มเติม</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="เล่าประวัติความเป็นมาและโครงข่ายการให้บริการของสถานประกอบการสั้นๆ..."
                    rows={3}
                    className={`w-full p-2 text-xs font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                {/* Tick Support Services */}
                <div className="col-span-2 py-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">สวัสดิการสิทธิ์พิเศษ</label>
                  <div className="flex gap-4 text-xs font-semibold">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formAcc}
                        onChange={(e) => setFormAcc(e.target.checked)}
                      />
                      <span>มีที่พักให้ฟรี</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formMeal}
                        onChange={(e) => setFormMeal(e.target.checked)}
                      />
                      <span>มีอาหารกลางวันบริการ</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formTransport}
                        onChange={(e) => setFormTransport(e.target.checked)}
                      />
                      <span>มีรถรับส่ง</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Form Buttons */}
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
                  id="btn-save-form"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  บันทึกข้อมูลสถานประกอบการ
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
