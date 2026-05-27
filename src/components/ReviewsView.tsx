import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Plus, 
  MessageSquare, 
  Award, 
  ChevronRight, 
  Check, 
  X,
  Building,
  User,
  ShieldAlert,
  ThumbsUp
} from 'lucide-react';
import { CompanyReview, Company, Student } from '../types';

interface ReviewsViewProps {
  darkMode: boolean;
  userRole: 'Admin' | 'Student';
  userEmail: string;
}

export default function ReviewsView({ darkMode, userRole, userEmail }: ReviewsViewProps) {
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Submit Review Form State
  const [formStudentId, setFormStudentId] = useState("");
  const [formCompanyId, setFormCompanyId] = useState("");
  const [suitability, setSuitability] = useState(5);
  const [allowance, setAllowance] = useState(5);
  const [welfare, setWelfare] = useState(5);
  const [environment, setEnvironment] = useState(5);
  const [learning, setLearning] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Global Average aggregates
  const [aspectAverages, setAspectAverages] = useState({
    suitability: 0,
    allowance: 0,
    welfare: 0,
    environment: 0,
    learning: 0,
  });

  const loadData = async () => {
    try {
      const [revRes, compRes, stRes] = await Promise.all([
        fetch("/api/reviews"),
        fetch("/api/companies"),
        fetch("/api/students")
      ]);
      
      if (revRes.ok && compRes.ok && stRes.ok) {
        const rData = await revRes.json();
        const cData = await compRes.json();
        const sData = await stRes.json();
        
        setReviews(rData);
        setCompanies(cData);
        setStudents(sData);

        // Precalculate aspect-by-aspect average across all system reviews
        if (rData.length > 0) {
          const sumSuit = rData.reduce((acc: number, item: any) => acc + (item.ratings?.job_suitability || 0), 0);
          const sumAllow = rData.reduce((acc: number, item: any) => acc + (item.ratings?.allowance || 0), 0);
          const sumWelf = rData.reduce((acc: number, item: any) => acc + (item.ratings?.welfare || 0), 0);
          const sumEnv = rData.reduce((acc: number, item: any) => acc + (item.ratings?.environment || 0), 0);
          const sumLearn = rData.reduce((acc: number, item: any) => acc + (item.ratings?.learning || 0), 0);
          
          setAspectAverages({
            suitability: parseFloat((sumSuit / rData.length).toFixed(1)),
            allowance: parseFloat((sumAllow / rData.length).toFixed(1)),
            welfare: parseFloat((sumWelf / rData.length).toFixed(1)),
            environment: parseFloat((sumEnv / rData.length).toFixed(1)),
            learning: parseFloat((sumLearn / rData.length).toFixed(1)),
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddReview = () => {
    if (userRole === "Student") {
      // Find matching student email if they are simulate logged in as a student
      const regex = /st\.(\d+)@/;
      const match = userEmail.match(regex);
      if (match && match[1]) {
        setFormStudentId(match[1]); // Pre-populate Student ID
      } else {
        // Find if we have any students in base or use first student's ID
        const matchedSt = students.find(s => s.email === userEmail);
        setFormStudentId(matchedSt?.student_id || students[0]?.student_id || "");
      }
    } else {
      setFormStudentId(students[0]?.student_id || "");
    }
    setFormCompanyId(companies[0]?.company_id || "");
    setSuitability(5);
    setAllowance(5);
    setWelfare(5);
    setEnvironment(5);
    setLearning(5);
    setComment("");
    setIsFormOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentId || !formCompanyId) {
      alert("กรุณาระบุข้อมูลนักศึกษาและผู้ประกอบการ");
      return;
    }

    // Verify student exists in system
    const studentExists = students.some(s => s.student_id === formStudentId);
    if (!studentExists) {
      alert("ไม่พบรหัสนักศึกษานี้ในแฟ้มประวัติ โปรดตรวจสอบความถูกต้อง");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: formCompanyId,
          student_id: formStudentId,
          ratings: {
            job_suitability: suitability,
            allowance: allowance,
            welfare: welfare,
            environment: environment,
            learning: learning
          },
          comment: comment
        })
      });

      if (res.ok) {
        setIsFormOpen(false);
        loadData();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "เกิดข้อผิดพลาดในการบันทึกรีวิว");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const absolute = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-sm ${i <= absolute ? 'text-amber-500' : 'text-slate-600'}`}>⭐</span>
      );
    }
    return stars;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 flex flex-col">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-500/10 pb-5">
        <div>
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase font-mono">
            Module 4 : Company Rating & Reviews System
          </span>
          <h1 className={`text-2xl md:text-3xl font-sans font-bold tracking-tight mt-1 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            คะแนนรีวิว & ความเหมาะสมสวัสดิการ
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            รายงานประเมินความพึงพอใจการปฏิบัติงานสหกิจ ค้นหาคะแนนรวม และการกระจายความเหมาะสมสิทธิ์ต่างๆ
          </p>
        </div>

        <button
          onClick={handleOpenAddReview}
          id="btn-write-review"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl cursor-pointer shadow-md transition-all duration-200 text-xs active:scale-95"
        >
          <Plus size={16} />
          <span>เขียนรีวิวให้คะแนน (Review)</span>
        </button>
      </div>

      {/* Aggregate Aspects Display */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-150 shadow-sm'
      }`}>
        <h3 className={`font-sans font-bold text-sm leading-tight flex items-center gap-2 ${darkMode?'text-slate-200':'text-slate-800'}`}>
          <Award size={18} className="text-amber-500" />
          <span>สรุปภาพรวมแยกแต่ละแผนกประเมิน (Aspect Averages)</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mt-6">
          
          {/* Suitability */}
          <div className="text-center p-3 rounded-xl bg-slate-500/5 Border border-slate-500/10">
            <span className="text-[10px] text-slate-400 font-bold block mb-1">ความเหมาะสมงาน</span>
            <span className={`text-2xl font-mono font-black ${darkMode?'text-white':'text-slate-800'}`}>{aspectAverages.suitability || "N/A"}</span>
            <div className="flex justify-center mt-1">{renderStars(aspectAverages.suitability)}</div>
          </div>

          {/* Allowance */}
          <div className="text-center p-3 rounded-xl bg-slate-500/5 border border-slate-500/10">
            <span className="text-[10px] text-slate-400 font-bold block mb-1">ค่าตอบแทน/เบี้ยเลี้ยง</span>
            <span className={`text-2xl font-mono font-black ${darkMode?'text-white':'text-slate-800'}`}>{aspectAverages.allowance || "N/A"}</span>
            <div className="flex justify-center mt-1">{renderStars(aspectAverages.allowance)}</div>
          </div>

          {/* Welfare */}
          <div className="text-center p-3 rounded-xl bg-slate-500/5 border border-slate-500/10">
            <span className="text-[10px] text-slate-400 font-bold block mb-1">สวัสดิการหอพัก</span>
            <span className={`text-2xl font-mono font-black ${darkMode?'text-white':'text-slate-800'}`}>{aspectAverages.welfare || "N/A"}</span>
            <div className="flex justify-center mt-1">{renderStars(aspectAverages.welfare)}</div>
          </div>

          {/* Environment */}
          <div className="text-center p-3 rounded-xl bg-slate-500/5 border border-slate-500/10">
            <span className="text-[10px] text-slate-400 font-bold block mb-1">สภาพแวดล้อมพี่เลี้ยง</span>
            <span className={`text-2xl font-mono font-black ${darkMode?'text-white':'text-slate-800'}`}>{aspectAverages.environment || "N/A"}</span>
            <div className="flex justify-center mt-1">{renderStars(aspectAverages.environment)}</div>
          </div>

          {/* Learning */}
          <div className="text-center p-3 rounded-xl bg-slate-500/5 border border-slate-500/10">
            <span className="text-[10px] text-slate-400 font-bold block mb-1">ความรู้และประสบการณ์</span>
            <span className={`text-2xl font-mono font-black ${darkMode?'text-white':'text-slate-800'}`}>{aspectAverages.learning || "N/A"}</span>
            <div className="flex justify-center mt-1">{renderStars(aspectAverages.learning)}</div>
          </div>

        </div>
      </div>

      {/* Review Cards Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start flex-1 max-h-[500px] overflow-y-auto pr-1">
        {reviews.length === 0 ? (
          <div className="col-span-2 text-center p-12 text-slate-400 border border-dashed rounded-2xl border-slate-500/10">
            <MessageSquare size={36} className="mx-auto mb-2 text-slate-500" />
            <p className="font-bold">ยังไม่มีข้อมูลคะแนนรีวิวจากนิสิต</p>
          </div>
        ) : (
          reviews.map((rev) => {
            const comp = companies.find(c => c.company_id === rev.company_id);
            return (
              <div
                key={rev.review_id}
                className={`p-5 rounded-2xl border text-left space-y-3.5 hover:shadow transition-shadow ${
                  darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-150 shadow-sm'
                }`}
              >
                
                {/* Review Card Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className={`font-sans font-bold text-xs truncate text-indigo-400`}>
                      🏢 {comp?.company_name || rev.company_id}
                    </p>
                    <p className={`text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5`}>
                      <User size={11} />
                      <span>{rev.student_name} (ID: {rev.student_id})</span>
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-500 font-bold text-xs">
                    <span>⭐</span>
                    <span className="font-mono">{rev.rating}</span>
                  </div>
                </div>

                {/* Comment Text */}
                <p className={`text-xs leading-relaxed italic ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  "{rev.comment || "ไม่มีตัวเขียนกำกับเพิ่มเติม"}"
                </p>

                {/* Breakdown aspect badges */}
                <div className="grid grid-cols-5 gap-1 pt-3 border-t border-slate-500/5 text-[9px] text-center font-bold text-slate-400 leading-none">
                  <div className="p-1 px-1.5 rounded bg-slate-500/5 border border-slate-550/10">
                    <span>งาน</span>
                    <strong className="block text-slate-200 mt-1">{rev.ratings?.job_suitability || 5}</strong>
                  </div>
                  <div className="p-1 px-1.5 rounded bg-slate-500/5 border border-slate-550/10">
                    <span>เงิน</span>
                    <strong className="block text-slate-200 mt-1">{rev.ratings?.allowance || 5}</strong>
                  </div>
                  <div className="p-1 px-1.5 rounded bg-slate-500/5 border border-slate-550/10">
                    <span>สิทธิ</span>
                    <strong className="block text-slate-200 mt-1">{rev.ratings?.welfare || 5}</strong>
                  </div>
                  <div className="p-1 px-1.5 rounded bg-slate-500/5 border border-slate-550/10">
                    <span>ตึก</span>
                    <strong className="block text-slate-200 mt-1">{rev.ratings?.environment || 5}</strong>
                  </div>
                  <div className="p-1 px-1.5 rounded bg-slate-500/5 border border-slate-550/10">
                    <span>เรียน</span>
                    <strong className="block text-slate-200 mt-1">{rev.ratings?.learning || 5}</strong>
                  </div>
                </div>

                {/* Footer and thumbs-up */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>📅 ปีบันทึก: {rev.created_date}</span>
                  <button className="flex items-center gap-1 bg-slate-500/5 hover:bg-blue-500/10 p-1 px-2 rounded-lg text-[10px] transition-colors cursor-pointer text-slate-400 hover:text-blue-500">
                    <ThumbsUp size={11} />
                    <span>มีประโยชน์</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Write a review Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-2xl border shadow-xl flex flex-col ${
            darkMode ? 'bg-[#1E2732] border-[#253341] text-gray-200' : 'bg-white border-slate-100 text-slate-800'
          }`}>
            
            <div className="p-5 border-b border-slate-100/10 flex justify-between items-center">
              <h3 className="font-sans font-bold text-base flex items-center gap-2">
                <Star size={16} className="text-amber-500" />
                <span>ร่วมให้คะแนนสถานประกอบการ (Review Form)</span>
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 px-1.5 hover:bg-slate-500/10 rounded-full cursor-pointer text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4 text-xs font-semibold">
              
              <div className="grid grid-cols-2 gap-3.5">
                
                {/* Student ID */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">รหัสนักศึกษาผู้เขียนรีวิว *</label>
                  <input
                    type="text"
                    required
                    value={formStudentId}
                    onChange={(e) => setFormStudentId(e.target.value)}
                    placeholder="เช่น 66010123"
                    className={`w-full p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-250 text-slate-800'
                    }`}
                  />
                </div>

                {/* Target Company selection */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">ระบุสถานประกอบการสังกัด *</label>
                  <select
                    required
                    value={formCompanyId}
                    onChange={(e) => setFormCompanyId(e.target.value)}
                    className={`w-full p-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-250 text-slate-800'
                    }`}
                  >
                    {companies.map(c => (
                      <option key={c.company_id} value={c.company_id}>{c.company_name}</option>
                    ))}
                  </select>
                </div>

                {/* Rating 5 sliders/stars selectors for each aspect */}
                <div className="col-span-2 space-y-3 py-2 border-t border-b border-slate-500/5">
                  <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1">หัวข้อเกณฑ์การประเมิน (Aspect 1-5 Stars)</span>
                  
                  {/* Aspect 1 */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">1. ความเหมาะสมของสายงานปฏิบัติ</span>
                    <input 
                      type="range" min="1" max="5" value={suitability} 
                      onChange={(e) => setSuitability(Number(e.target.value))}
                      className="w-24 cursor-pointer accent-blue-500" 
                    />
                    <span className="w-8 text-right font-bold text-blue-500">{suitability} ⭐</span>
                  </div>

                  {/* Aspect 2 */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">2. ความสมน้ำสมเนื้อของเบี้ยเลี้ยง</span>
                    <input 
                      type="range" min="1" max="5" value={allowance} 
                      onChange={(e) => setAllowance(Number(e.target.value))}
                      className="w-24 cursor-pointer accent-blue-500" 
                    />
                    <span className="w-8 text-right font-bold text-blue-500">{allowance} ⭐</span>
                  </div>

                  {/* Aspect 3 */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">3. สวัสดิการสิทธิ์หลักหอพัก</span>
                    <input 
                      type="range" min="1" max="5" value={welfare} 
                      onChange={(e) => setWelfare(Number(e.target.value))}
                      className="w-24 cursor-pointer accent-blue-500" 
                    />
                    <span className="w-8 text-right font-bold text-blue-500">{welfare} ⭐</span>
                  </div>

                  {/* Aspect 4 */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">4. สภาพแวดล้อมพี่เลี้ยงเพื่อนร่วมงาน</span>
                    <input 
                      type="range" min="1" max="5" value={environment} 
                      onChange={(e) => setEnvironment(Number(e.target.value))}
                      className="w-24 cursor-pointer accent-blue-500" 
                    />
                    <span className="w-8 text-right font-bold text-blue-500">{environment} ⭐</span>
                  </div>

                  {/* Aspect 5 */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">5. โอกาสในการเรียนรู้งานสะสม</span>
                    <input 
                      type="range" min="1" max="5" value={learning} 
                      onChange={(e) => setLearning(Number(e.target.value))}
                      className="w-24 cursor-pointer accent-blue-500" 
                    />
                    <span className="w-8 text-right font-bold text-blue-500">{learning} ⭐</span>
                  </div>

                </div>

                {/* Comment */}
                <div className="col-span-2 space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-450 mb-1">บันทึกความเห็น/คําแนะนํารองรับน้องๆ</label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="เขียนระบุเล่าประสบการณ์การฝึกงานเบื้องต้น สิทธิประโยชน์และบรรยากาศ..."
                    rows={3.5}
                    className={`w-full p-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      darkMode ? 'bg-[#15202B] border-[#253341] text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

              </div>

              {/* Submit actions buttons */}
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
                  disabled={submitting}
                  id="btn-submit-review"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  {submitting ? 'กำลังส่งข้อมูล...' : 'ส่งรีวิวประเมินผล'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
