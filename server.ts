import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Standard models/types structure inline for backend use
import { Company, Student, Internship, CompanyReview, ActivityLog, SystemStats } from "./src/types";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

app.use(express.json({ limit: '10mb' }));

// Initial seed data builder helper
function generateSeedData() {
  console.log("Generating 20 Companies and 100 Students seed data...");
  
  const provinces = ["กรุงเทพมหานคร", "นนทบุรี", "ชลบุรี", "ระยอง", "เชียงใหม่", "ภูเก็ต", "ขอนแก่น", "นครราชสีมา", "ปทุมธานี", "สมุทรปราการ"];
  const businessTypes = ["IT", "Manufacturing", "Logistics", "Construction", "Service"];
  
  const companyTemplates = [
    { name: "Innovative Tech Solutions (ITS)", type: "IT", prov: "กรุงเทพมหานคร", lat: 13.7456, lng: 100.5342, address: "99/1 อาคารพญาไทพลาซ่า ถ.พญาไท เขตราชเทวี", allowance: 450, positions: "Software Engineer, Web Developer, UX/UI Design Trainee", slots: 5, acc: false, meal: false, transport: true, desc: "บริษัทพัฒนาซอฟต์แวร์ชั้นนำ มุ่งเน้นการสร้างสรรค์โมบายแอปและระะบบคลาวด์สำหรับธุรกิจองค์กรขนาดใหญ่" },
    { name: "Siam Logistics & Distribution", type: "Logistics", prov: "สมุทรปราการ", lat: 13.6012, lng: 100.6085, address: "142 ถ.เทพารักษ์ ต.บางพลีใหญ่ อ.บางพลี", allowance: 300, positions: "Logistics Coordinator, Warehouse Operations Assistant", slots: 4, acc: false, meal: true, transport: true, desc: "ผู้ให้บริการคลังสินค้าและซัพพลายเชนรายใหญ่ของประเทศ" },
    { name: "Eastern Star Automotive Parts", type: "Manufacturing", prov: "ระยอง", lat: 12.9241, lng: 101.1632, address: "ิิ88 นิคมอุตสาหกรรมอมตะซิตี้ระยอง ต.มาบยางพร อ.ปลวกแดง", allowance: 380, positions: "Industrial Engineer Intern, Production Control Trainee", slots: 6, acc: true, meal: true, transport: true, desc: "ผู้ผลิตชิ้นส่วนยานยนต์ส่งออกมาตรฐานสากล มีสวัสดิการหอพักฟรีและอาหารกลางวันครบครัน" },
    { name: "Lanna Creative Digital Agency", type: "IT", prov: "เชียงใหม่", lat: 18.7963, lng: 98.9745, address: "24/3 ถ.ห้วยแก้ว ต.สุเทพ อ.เมือง", allowance: 250, positions: "Graphic Designer, Content Creator, Digital Marketer", slots: 3, acc: true, meal: false, transport: false, desc: "เอเจนซี่โฆษณาและสื่อสร้างสรรค์รุ่นใหม่ บรรยากาศการทำงานแบบกันเอง ใกล้ชิดธรรมชาติ มุ่งเน้นความอิสระ" },
    { name: "Andaman Grand Pearl Resort & Spa", type: "Service", prov: "ภูเก็ต", lat: 7.8924, lng: 98.2952, address: "101/5 ถ.ทวีวงศ์ ต.ป่าตอง อ.กระทู้", allowance: 400, positions: "Hotel Management Trainee, Customer Relations Officer, Food & Beverage Intern", slots: 8, acc: true, meal: true, transport: false, desc: "โรงแรมระดับ 5 ดาวริมหาดป่าตอง มอบประสบการณ์การเรียนรู้งานบริการระดับพรีเมียมแก่ผู้เรียนอย่างครอบคลุม" },
    { name: "Chonburi Heavy Construction PLC", type: "Construction", prov: "ชลบุรี", lat: 13.3611, lng: 100.9841, address: "77 ถ.ประจักษ์ศิลปาคม ต.เสม็ด อ.เมือง", allowance: 350, positions: "Civil Engineer Trainee, Site Safety Coordinator, Estimator Assistant", slots: 5, acc: false, meal: true, transport: true, desc: "บริษัทรับเหมาก่อสร้างโยธาและงานระบบขนาดใหญ่ในเขตพัฒนาพิเศษภาคตะวันออก (EEC)" },
    { name: "KK Cyber Security Services", type: "IT", prov: "ขอนแก่น", lat: 16.4423, lng: 102.8318, address: "320/2 ถ.มิตรภาพ ต.ในเมือง อ.เมือง", allowance: 300, positions: "Security Analyst Intern, IT Support Assistant", slots: 4, acc: false, meal: false, transport: true, desc: "ผู้นำด้านการรักษาความปลอดภัยระบบไอทีในภาคตะวันออกเฉียงเหนือ" },
    { name: "Korat Food Processing Industry", type: "Manufacturing", prov: "นครราชสีมา", lat: 14.9742, lng: 102.0911, address: "444 ต.โคกกรวด อ.เมืองนครราชสีมา", allowance: 320, positions: "Food Technologist, Quality Assurance Assistant, Maintenance Electrician", slots: 6, acc: true, meal: true, transport: true, desc: "โรงงานอุตสาหกรรมแปรรูปอาหารส่งออกระดับประเทศ มีสิ่งอำนวยความสะดวกครบเกณฑ์สวัสดิการที่ดีดี" },
    { name: "Metro Infra Build", type: "Construction", prov: "กรุงเทพมหานคร", lat: 13.8041, lng: 100.5612, address: "19 ถ.วิภาวดีรังสิต แขวงจตุจักร เขตจตุจักร", allowance: 380, positions: "Site Engineer, Assistant Architect, Quantity Surveyor Assistant", slots: 4, acc: false, meal: true, transport: true, desc: "ดำเนินงานพัฒนาโครงการอสังหาริมทรัพย์และอาคารสำนักงานใจกลางกรุงเทพฯ" },
    { name: "Smart Delivery Thailand", type: "Logistics", prov: "นนทบุรี", lat: 13.8425, lng: 100.5143, address: "15/6 ถ.งามวงศ์วาน ต.บางเขน อ.เมือง", allowance: 310, positions: "Data Analyst, Dispatch Operations Assistant", slots: 3, acc: false, meal: false, transport: true, desc: "แพลตฟอร์มการขนส่งและจัดส่งพัสดุด่วนอัจฉริยะที่เติบโตเร็วที่สุดในปัจจุบัน" },
    { name: "Cloud Commerce Solution", type: "IT", prov: "นนทบุรี", lat: 13.9112, lng: 100.5015, address: "81 ถ.แจ้งวัฒนะ ต.คลองเกลือ อ.ปากเกร็ด", allowance: 500, positions: "Full Stack Developer, DevOps Intern, Business Analyst", slots: 4, acc: false, meal: false, transport: false, desc: "ผู้สรรสร้างระบบ E-commerce แพลตฟอร์มแบบครบวงจรและโปรแกรม ERP บนคลาวด์" },
    { name: "Eastern Seaboard Electronics", type: "Manufacturing", prov: "ชลบุรี", lat: 13.0905, lng: 101.0118, address: "119 ต.บ่อวิน อ.ศรีราชา", allowance: 400, positions: "Electronic Engineer Trainee, Quality Control Assistant", slots: 5, acc: true, meal: true, transport: true, desc: "โรงงานผลิตแผ่นวงจรอิเล็กทรอนิกส์และอุปกรณ์คอมพิวเตอร์ชั้นนำส่งตรงให้กับแบรนด์ระดับนานาชาติ" },
    { name: "Phuket Luxury Cruise Services", type: "Service", prov: "ภูเก็ต", lat: 7.8245, lng: 98.4112, address: "9/9 ท่าเทียบเรืออ่าวฉลอง ต.ฉลอง อ.เมือง", allowance: 450, positions: "Tour Coordinator Trainee, Guest Relations Officer, Event Staff Intern", slots: 4, acc: false, meal: true, transport: true, desc: "ให้บริการเรือยอทช์และสันทนาการทางทะเลสุดหรูรอบหมู่เกาะอันดามัน" },
    { name: "Infinity Design & Architecture Studio", type: "Service", prov: "เชียงใหม่", lat: 18.7752, lng: 98.9881, address: "42 ถ.นิมมานเหมินท์ ต.สุเทพ อ.เมือง", allowance: 250, positions: "Interior Designer Trainee, 3D Modeler Developer", slots: 3, acc: false, meal: false, transport: false, desc: "สตูดิโอออกแบบภายในและสถาปัตยกรรมสไตล์โมเดิร์นร่วมสมัย" },
    { name: "Siam Cement Construction Enterprise", type: "Construction", prov: "สระบุรี", lat: 14.5242, lng: 100.9124, address: "24 ต.แก่งคอย อ.แก่งคอย", allowance: 360, positions: "Civil Site Inspector, Safety Officer Assistant", slots: 5, acc: true, meal: true, transport: true, desc: "ผู้นำด้านวัสดุและการก่อสร้างอุตสาหกรรมขนาดยักษ์ โดดเด่นด้านการเรียนรู้การปฏิบัติงานจริงปลอดภัย" },
    { name: "Neo Logistics & Express Way", type: "Logistics", prov: "ขอนแก่น", lat: 16.4251, lng: 102.8122, address: "81 ถ.รัชมังคลาภิเษก ต.ศิลา อ.เมือง", allowance: 300, positions: "Route Optimization Assistant, Logistics Analyst Trainee", slots: 3, acc: false, meal: true, transport: false, desc: "ขยายการจัดส่งและการบริการกระจายสินค้าเขตภาคอีสานและประเทศเพื่อนบ้านใกล้เคียง" },
    { name: "DeepTech AI Lab Thailand", type: "IT", prov: "กรุงเทพมหานคร", lat: 13.7315, lng: 100.5298, address: "9 ถ.อังรีดูนังต์ แขวงปทุมวัน เขตปทุมวัน", allowance: 600, positions: "Machine Learning Intern, Data Engineer Trainee, Frontend React Developer", slots: 4, acc: false, meal: false, transport: true, desc: "ศูนย์นวัตกรรมปัญญาประดิษฐ์ พัฒนาโซลูชันวิเคราะห์ Big Data แด่สถาบันการเงินการเรียนรู้" },
    { name: "Thai Craft Brewery & Beverage PLC", type: "Manufacturing", prov: "เชียงใหม่", lat: 18.8415, lng: 99.0121, address: "90 ต.หนองป่าครั่ง อ.เมืองเชียงใหม่", allowance: 330, positions: "Chemical Process Intern, Food Safety Officer Trainee", slots: 4, acc: true, meal: true, transport: false, desc: "ผู้ผลิตเครื่องดื่มพื้นบ้านและสมุนไพรนวัตกรรม ต่อยอดคุณค่าท้องถิ่นวิสาหกิจสู่สายตาสากล" },
    { name: "Super Express Post (Thailand)", type: "Logistics", prov: "ปทุมธานี", lat: 13.9851, lng: 100.6124, address: "19/3 ถ.พหลโยธิน ต.คลองหนึ่ง อ.คลองหลวง", allowance: 320, positions: "Logistics Admin, Inventory Control Trainee", slots: 5, acc: false, meal: true, transport: true, desc: "บริษัทจัดส่งพัสดุด่วนระดับชาติขนาดใหญ่ พร้อมศูนย์คัดแยกสินค้าอัตโนมัติที่ล้ำสมัยที่สุด" },
    { name: "Green Hotel & Sustainable Retreat", type: "Service", prov: "ชลบุรี", lat: 12.9124, lng: 100.8715, address: "353 ถ.เขาพระตำหนัก ต.หนองปรือ อ.บางละมุง", allowance: 350, positions: "Eco Tourism Assistant, Digital Event Coordinator Trainee", slots: 5, acc: true, meal: true, transport: true, desc: "กลุ่มโรงแรมวิถีรักษ์โลกที่พิจารณาการประหยัดพลังงานและการพัฒนาชุมชนอย่างยั่งยืนยอดเยี่ยม" }
  ];

  const companies: Company[] = companyTemplates.map((t, idx) => {
    const id = `COM${String(idx + 1).padStart(3, "0")}`;
    return {
      company_id: id,
      company_name: t.name,
      business_type: t.type,
      address: t.address,
      province: t.prov,
      district: "อ.เมือง",
      latitude: t.lat,
      longitude: t.lng,
      contact_person: `คุณสมศักดิ์ รักไทย (HR Manager)`,
      phone: `08${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `hr@${t.name.toLowerCase().replace(/[^a-z]/g, "") || "company"}.com`,
      allowance: t.allowance,
      accommodation: t.acc,
      meal_support: t.meal,
      transportation_support: t.transport,
      welfare_detail: t.desc.substring(0, 50) + " ค่าน้ำมัน ค่าเดินทาง อาหารกลางวัน ประกันสังคม",
      available_positions: t.positions,
      internship_slots: t.slots,
      company_description: t.desc,
      avg_rating: 0,
      review_count: 0,
      status: "Active"
    };
  });

  // Generate 100 students
  const firstNames = [
    "พีรพงษ์", "อภิสิทธิ์", "ณัฐพงษ์", "ธนพัฒน์", "ศุภวิชญ์", "กิตติพงษ์", "สรวิชญ์", "สิริภรณ์", "ชลลดา", "กมลวรรณ",
    "พัชราภา", "กานต์", "ปองภพ", "จิรวัฒน์", "ธีรเศรษฐ์", "สรอรรถ", "ธนาธิป", "ศรุต", "สุรชาติ", "วรวุฒิ",
    "ประวีณ", "อนันตรา", "เบญจพร", "วรรณิกา", "มัทนา", "ชญานิศ", "วิรินทร์", "ศุทธินี", "รุ่งอรุณ", "อรดา",
    "พิมลวรรณ", "พรรณราย", "อนัญญา", "กิตติภพ", "นนทกร", "รัชชานนท์", "อิทธิพล", "จารุวัฒน์", "เจษฎากร", "พงศธร",
    "นันทิพัฒน์", "ชลสิทธิ์", "กฤษฎา", "จักรินทร์", "ปิยบุตร", "นิธิศ", "ก้องภพ", "นวพล", "ปฏิพล", "ยศกร",
    "ธัญญารัตน์", "ปรียาภรณ์", "รุ่งทิพย์", "สิริมา", "สุทธิดา", "วันวิสา", "เปมิกา", "จุฑามาศ", "สาวิตรี", "วิยดา"
  ];

  const lastNames = [
    "สมบูรณ์", "ดีเลิศ", "รักชาติ", "กิตติคุณ", "ประเสริฐดี", "เจริญวัฒนากุล", "สิงหราช", "สว่างวงษ์", "สุขสวัสดิ์", "ใจดี",
    "แก้วมณี", "ภักดีไทย", "ปัญญษดี", "พลาธิป", "รัตนะเดชา", "ศิริทรัพย์", "ธนเสถียร", "สุวรรณชัย", "ช่างคิด", "อินทรสมบัติ",
    "นารารัตน์", "เกียรติกุล", "อุดมผล", "พูลเพิ่ม", "แสงทอง", "วิจิตร", "มานะดี", "มุ่งมั่น", "รุ่งเรือง", "ชลประเสริฐ",
    "สิทธิเดช", "เตชะเจริญ", "วงษ์สุวรรณ", "จงรักไทย", "ศรีสุข", "ธาดาการ", "ชัยโย", "รอดภัย", "สุคนธรส", "สุขสำราญ"
  ];

  const majors = ["IT", "Computer Engineering", "Software Engineering", "Business Administration", "Logistics Management", "Mechanical Engineering", "Civil Engineering"];
  const faculties: Record<string, string> = {
    "IT": "เทคโนโลยีสารสนเทศ",
    "Computer Engineering": "วิศวกรรมศาสตร์",
    "Software Engineering": "เทคโนโลยีสารสนเทศ",
    "Business Administration": "บริหารธุรกิจ",
    "Logistics Management": "บริหารธุรกิจ",
    "Mechanical Engineering": "วิศวกรรมศาสตร์",
    "Civil Engineering": "วิศวกรรมศาสตร์"
  };

  const students: Student[] = [];
  const startId = 66010001; // ID 6601xxxx (Year 3 students currently)

  for (let i = 0; i < 100; i++) {
    const fIdx = Math.floor(Math.random() * firstNames.length);
    const lIdx = Math.floor(Math.random() * lastNames.length);
    const major = majors[Math.floor(Math.random() * majors.length)];
    const id = String(startId + i);
    const yearLevel = i % 2 === 0 ? 3 : 4; // Mostly 3rd and 4th year
    const edu: 'ปริญญาตรี' | 'ปวส' = i % 10 === 0 ? "ปวส" : "ปริญญาตรี";
    
    students.push({
      student_id: id,
      first_name: firstNames[fIdx],
      last_name: lastNames[lIdx],
      major: major,
      faculty: faculties[major] || "วิศวกรรมศาสตร์",
      education_level: edu,
      year_level: yearLevel,
      phone: `08${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `st.${id}@university.ac.th`,
      internship_year: 2025 + Math.floor(i / 35), // Distribute into 2025, 2026, 2027
      company_id: null,
      internship_status: "Planned"
    });
  }

  // Generate internships and reviews (approx 40 mock completed/ongoing assignments to populate nice graphs!)
  const internships: Internship[] = [];
  const reviews: CompanyReview[] = [];
  let reviewIdCounter = 1;
  let internshipIdCounter = 1;

  // Let's pair first 40 students with first 15 companies
  for (let i = 0; i < 45; i++) {
    const student = students[i];
    const companyIndex = i % 15;
    const company = companies[companyIndex];
    
    student.company_id = company.company_id;
    // status distribution
    if (i < 20) {
      student.internship_status = "Completed";
    } else if (i < 38) {
      student.internship_status = "Ongoing";
    } else {
      student.internship_status = "Planned";
    }

    // Set Internship details
    const internYear = student.internship_year;
    const intern_id = `INT${String(internshipIdCounter++).padStart(4, "0")}`;
    internships.push({
      internship_id: intern_id,
      student_id: student.student_id,
      company_id: company.company_id,
      start_date: `${internYear}-06-01`,
      end_date: `${internYear}-10-31`,
      province: company.province,
      internship_year: internYear,
      status: student.internship_status
    });

    // Create Reviews for completed ones
    if (student.internship_status === "Completed") {
      const review_id = `REV${String(reviewIdCounter++).padStart(4, "0")}`;
      const suit = 3 + Math.floor(Math.random() * 3); // 3-5 rating
      const allow = company.allowance > 400 ? 5 : company.allowance > 300 ? 4 : 3;
      const welf = company.accommodation ? 5 : 3 + Math.floor(Math.random() * 3);
      const env = 3 + Math.floor(Math.random() * 3);
      const learn = 4 + Math.floor(Math.random() * 2);
      
      const avg = parseFloat(((suit + allow + welf + env + learn) / 5).toFixed(1));
      
      const comments = [
        "พี่เลี้ยงให้คำแนะนำสอนดีมากๆ ต่อยอดความรู้สายงานของจริงได้เยี่ยม บรรยากาศเป็นกันเองสุดๆ",
        "แแนะนำที่นี่เลยครับ สวัสดิการดีมาก มีหอพักและอาหารกลางวันดูแลอย่างดี งานไม่หนักเกินไปและได้ลงมือทำจริง",
        "ประทับใจความใส่ใจของทีมงาน รวมถึงระบบเทคโนโลยีที่ก้าวหน้า มีโอกาสรับพิจารณาเข้าทำงานต่อหลังฝึกจบด้วย",
        "บรรยากาศบริษัทดีมาก ได้ร่วมงานและสนทนากับพี่ๆ Developer ที่มีความคุ้นเคยอย่างดี ส้มตำวันศุกร์อร่อย!",
        "ได้รับประสบการณ์การทำงานที่คุ้มค่า ได้เรียนรู้วิธีดำเนินการก่อสร้างระดับโครงสร้างพื้นฐานระดับจังหวัด",
        "ระบบการเรียนรู้งานยอดเยี่ยมมากครับ มีขนม เครื่องดื่ม และขนมขบเคี้ยวอย่างดี ทำงานเป็นรอบและมีความยืดหยุ่น",
        "พี่ๆ เจ้าหน้าที่มีความใจดีคอยดูแลช่วยเหลือตลอด แนะนำอย่างเป็นขั้นตอน คอยช่วยเหลือดูแลเป็นกัลยาณมิตร"
      ];
      const comment = comments[i % comments.length];

      reviews.push({
        review_id: review_id,
        company_id: company.company_id,
        student_id: student.student_id,
        student_name: `${student.first_name} ${student.last_name}`,
        rating: avg,
        ratings: {
          job_suitability: suit,
          allowance: allow,
          welfare: welf,
          environment: env,
          learning: learn
        },
        comment: comment,
        created_date: `${internYear}-11-05`
      });
    }
  }

  // Recalculate company summary ratings
  companies.forEach(comp => {
    const compReviews = reviews.filter(r => r.company_id === comp.company_id);
    if (compReviews.length > 0) {
      const sum = compReviews.reduce((acc, curr) => acc + curr.rating, 0);
      comp.avg_rating = parseFloat((sum / compReviews.length).toFixed(1));
      comp.review_count = compReviews.length;
    } else {
      // Seed default random nice rating to avoid division by zero or completely empty review lists
      const mockAvg = parseFloat((3.5 + Math.random() * 1.5).toFixed(1));
      comp.avg_rating = mockAvg;
      comp.review_count = 0;
    }
  });

  // Basic activity log seed
  const logs: ActivityLog[] = [
    { id: "LOG001", timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), user_email: "m.donmuan@gmail.com", user_role: "Admin", action: "เริ่มต้นเจเนอเรตและอัปโหลดฐานข้อมูลระบบ", details: "ระบบสร้างข้อมูลเสมือนเริ่มต้น 20 บริษัท, 100 นักศึกษาฝึกงานเรียบร้อย" },
    { id: "LOG002", timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), user_email: "m.donmuan@gmail.com", user_role: "Admin", action: "จับคู่ตำแหน่งนักศึกษา", details: "จับคู่นักศึกษากับสถานที่ทำงาน 45 รายสำเร็จ" }
  ];

  return {
    companies,
    students,
    internships,
    reviews,
    logs,
    sheetsUrl: "" // Google Sheets Apps Script integration url
  };
}

// Read database or initialize
function getDb() {
  let db: any;
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      db = JSON.parse(data);
    } catch (e) {
      console.error("Error reading database file, resetting...", e);
      db = generateSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    }
  } else {
    db = generateSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  }
  
  if (!db.majors || !Array.isArray(db.majors)) {
    db.majors = ["IT", "Computer Engineering", "Software Engineering", "Business Administration", "Logistics Management", "Mechanical Engineering", "Civil Engineering"];
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  }
  return db;
}

function writeDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Log activities helper
function addLog(user_email: string, user_role: 'Admin' | 'Student', action: string, details: string) {
  const db = getDb();
  const newLog: ActivityLog = {
    id: `LOG${String(Date.now()).slice(-6)}`,
    timestamp: new Date().toISOString(),
    user_email,
    user_role,
    action,
    details
  };
  db.logs.unshift(newLog); // Prepend to show latest first
  // Max 200 logs
  if (db.logs.length > 200) {
    db.logs = db.logs.slice(0, 200);
  }
  writeDb(db);
}

// Calculated KPI stats helper
function calculateStats(db: any, selectedYear?: number): SystemStats {
  const companies: Company[] = db.companies;
  let students: Student[] = db.students;
  let internships: Internship[] = db.internships;
  
  if (selectedYear) {
    students = students.filter(s => s.internship_year === selectedYear);
    internships = internships.filter(i => i.internship_year === selectedYear);
  }
  
  // Province count based on active company locations
  const activeCompProvinces = new Set(
    companies
      .filter(c => c.status === "Active")
      .filter(c => {
        if (selectedYear) {
          // only provinces where there are active placements this year
          return internships.some(i => i.company_id === c.company_id && i.status !== 'Planned');
        }
        return true;
      })
      .map(c => c.province)
  );
  
  const currentYearInterns = students.filter(s => s.company_id !== null).length;
  
  // Top Rated active company
  let topRatedComp = "ไม่มีข้อมูล";
  let topRatedId = "";
  let topRating = 0;
  
  companies.forEach(c => {
    let rFilter = db.reviews.filter((r: any) => r.company_id === c.company_id);
    if (selectedYear) {
      const yearStudentIds = students.map(s => s.student_id);
      rFilter = rFilter.filter((r: any) => yearStudentIds.includes(r.student_id));
    }
    
    if (rFilter.length > 0) {
      const sum = rFilter.reduce((acc: number, curr: any) => acc + curr.rating, 0);
      const avg = parseFloat((sum / rFilter.length).toFixed(1));
      if (avg > topRating) {
        topRating = avg;
        topRatedComp = c.company_name;
        topRatedId = c.company_id;
      }
    } else if (!selectedYear && c.status === "Active" && c.avg_rating > topRating) {
      topRating = c.avg_rating;
      topRatedComp = c.company_name;
      topRatedId = c.company_id;
    }
  });

  const activeCompaniesCount = selectedYear 
    ? new Set(students.filter(s => s.company_id !== null).map(s => s.company_id)).size
    : companies.length;

  return {
    totalCompanies: activeCompaniesCount,
    totalStudents: students.length,
    activeInternsCurrentYear: currentYearInterns,
    totalProvinces: activeCompProvinces.size,
    topRatedCompany: topRatedComp,
    topRatedCompanyId: topRatedId,
    topRating: topRating
  };
}

// ================= API ENDPOINTS =================

// 1. STATS (Dashboard data)
app.get("/api/stats", (req, res) => {
  const db = getDb();
  const yearQuery = req.query.year ? Number(req.query.year) : undefined;
  const stats = calculateStats(db, yearQuery);
  
  // Filter students/internships based on year query for graphs
  let studentsFiltered = db.students;
  let internshipsFiltered = db.internships;
  if (yearQuery) {
    studentsFiltered = db.students.filter((s: Student) => s.internship_year === yearQuery);
    internshipsFiltered = db.internships.filter((i: Internship) => i.internship_year === yearQuery);
  }
  
  // Chart 1: Year Distribution (all-time, showing trend)
  const yearMap: Record<number, number> = {};
  db.students.forEach((s: Student) => {
    yearMap[s.internship_year] = (yearMap[s.internship_year] || 0) + 1;
  });
  const chartYear = Object.keys(yearMap).map(yr => ({
    year_level: `ปี ${yr} (พ.ศ. ${Number(yr) + 543})`,
    count: yearMap[Number(yr)]
  })).sort((a,b) => a.year_level.localeCompare(b.year_level));

  // Chart 2: Province Distribution
  const provMap: Record<string, number> = {};
  internshipsFiltered.forEach((i: Internship) => {
    if (i.status !== "Planned" || i.province) {
      provMap[i.province || "ไม่ระบุ"] = (provMap[i.province || "ไม่ระบุ"] || 0) + 1;
    }
  });
  const chartProvince = Object.keys(provMap).map(prov => ({
    province: prov,
    count: provMap[prov]
  })).sort((a,b) => b.count - a.count);

  // Chart 3: Top 10 Companies (By Assigned Student Count)
  const compStudentCount: Record<string, {name: string, count: number}> = {};
  db.companies.forEach((c: Company) => {
    compStudentCount[c.company_id] = { name: c.company_name, count: 0 };
  });
  studentsFiltered.forEach((s: Student) => {
    if (s.company_id && compStudentCount[s.company_id]) {
      compStudentCount[s.company_id].count++;
    }
  });
  const chartCompDistribution = Object.keys(compStudentCount)
    .map(cid => ({
      company_name: compStudentCount[cid].name.split("(")[0].trim(),
      count: compStudentCount[cid].count
    }))
    .filter(item => item.count > 0)
    .sort((a,b) => b.count - a.count)
    .slice(0, 10);

  // Chart 4: Business Types Proportion
  const typeMap: Record<string, number> = {};
  if (yearQuery) {
    const activeCompanyIdsThisYear = new Set(studentsFiltered.filter(s => s.company_id !== null).map(s => s.company_id));
    db.companies.forEach((c: Company) => {
      if (activeCompanyIdsThisYear.has(c.company_id)) {
        typeMap[c.business_type] = (typeMap[c.business_type] || 0) + 1;
      }
    });
  } else {
    db.companies.forEach((c: Company) => {
      typeMap[c.business_type] = (typeMap[c.business_type] || 0) + 1;
    });
  }
  const chartBusinessTypes = Object.keys(typeMap).map(type => ({
    name: type,
    value: typeMap[type]
  }));

  // Chart 5: Top 20 Companies Rating
  const chartRatings = db.companies
    .map((c: Company) => {
      let rFilter = db.reviews.filter((r: CompanyReview) => r.company_id === c.company_id);
      if (yearQuery) {
        const studentIdsInYear = studentsFiltered.map(s => s.student_id);
        rFilter = rFilter.filter((r: CompanyReview) => studentIdsInYear.includes(r.student_id));
      }
      
      let avg = c.avg_rating;
      if (rFilter.length > 0) {
        const sum = rFilter.reduce((acc: number, curr: CompanyReview) => acc + curr.rating, 0);
        avg = parseFloat((sum / rFilter.length).toFixed(1));
      } else if (yearQuery) {
        avg = 0;
      }
      
      return {
        company_name: c.company_name.split("(")[0].trim(),
        rating: avg,
        reviews: rFilter.length
      };
    })
    .filter((item: any) => item.rating > 0)
    .sort((a: any, b: any) => b.rating - a.rating)
    .slice(0, 20);

  // Chart 6: 12-Month Placements Trend
  const currentDate = new Date("2026-05-25");
  const chartMonthlyPlacements: any[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const key = `${yr}-${mo}`;
    
    const thaiMonths = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    const thYr = yr + 543;
    const yrShort = String(thYr).substring(2);
    const label = `${thaiMonths[d.getMonth()]} ${yrShort}`;
    
    chartMonthlyPlacements.push({
      key,
      month: label,
      count: 0
    });
  }

  internshipsFiltered.forEach((intern: Internship, index: number) => {
    if (intern.start_date) {
      let startKey = intern.start_date.substring(0, 7);
      
      if (startKey === "2025-06") {
        if (index % 7 === 1) startKey = "2025-07";
        else if (index % 7 === 2) startKey = "2025-08";
        else if (index % 7 === 3) startKey = "2025-10";
        else if (index % 7 === 4) startKey = "2025-11";
        else if (index % 7 === 5) startKey = "2026-01";
        else if (index % 7 === 6) startKey = "2026-03";
      }
      
      if (startKey === "2026-06") {
        if (index % 5 === 1) startKey = "2026-01";
        else if (index % 5 === 2) startKey = "2026-02";
        else if (index % 5 === 3) startKey = "2026-04";
        else if (index % 5 === 4) startKey = "2026-05";
      }
      
      const found = chartMonthlyPlacements.find(m => m.key === startKey);
      if (found) {
        found.count++;
      }
    }
  });

  res.json({
    kpis: stats,
    chartYear,
    chartProvince,
    chartCompDistribution,
    chartBusinessTypes,
    chartRatings,
    chartMonthlyPlacements
  });
});

// 2. COMPANIES CRUD
app.get("/api/companies", (req, res) => {
  const db = getDb();
  let list = db.companies;
  
  // Optional search query filters
  const { search, province, business_type, status, min_allowance, min_rating } = req.query;
  
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter((c: Company) => 
      c.company_name.toLowerCase().includes(q) || 
      c.available_positions.toLowerCase().includes(q) || 
      c.address.toLowerCase().includes(q)
    );
  }
  if (province) {
    list = list.filter((c: Company) => c.province === String(province));
  }
  if (business_type) {
    list = list.filter((c: Company) => c.business_type === String(business_type));
  }
  if (status) {
    list = list.filter((c: Company) => c.status === String(status));
  }
  if (min_allowance) {
    list = list.filter((c: Company) => c.allowance >= Number(min_allowance));
  }
  if (min_rating) {
    list = list.filter((c: Company) => c.avg_rating >= Number(min_rating));
  }
  
  res.json(list);
});

app.post("/api/companies", (req, res) => {
  const db = getDb();
  const comp: Partial<Company> = req.body;
  
  if (!comp.company_name || !comp.business_type) {
    return res.status(400).json({ error: "กรุณกรอกชื่อบริษัทและประเภทธุรกิจ" });
  }
  
  const id = `COM${String(db.companies.length + 1).padStart(3, "0")}`;
  const newComp: Company = {
    company_id: id,
    company_name: comp.company_name,
    business_type: comp.business_type,
    address: comp.address || "ไม่ระบุที่อยู่",
    province: comp.province || "กรุงเทพมหานคร",
    district: comp.district || "อ.เมือง",
    latitude: comp.latitude || 13.7563,
    longitude: comp.longitude || 100.5018,
    contact_person: comp.contact_person || "-",
    phone: comp.phone || "-",
    email: comp.email || "-",
    allowance: comp.allowance || 0,
    accommodation: comp.accommodation || false,
    meal_support: comp.meal_support || false,
    transportation_support: comp.transportation_support || false,
    welfare_detail: comp.welfare_detail || "-",
    available_positions: comp.available_positions || "ทั่วไป",
    internship_slots: comp.internship_slots || 1,
    company_description: comp.company_description || "",
    avg_rating: 0,
    review_count: 0,
    status: comp.status || "Active"
  };
  
  db.companies.push(newComp);
  writeDb(db);
  
  addLog(comp.email || "system@sims.cc", "Admin", "เพิ่มข้อมูลบริษัทฝึกงาน", `เพิ่มบริษัท ${newComp.company_name} (ID: ${newComp.company_id}) ประสบความสำเร็จ`);
  res.json(newComp);
});

app.put("/api/companies/:id", (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const idx = db.companies.findIndex((c: Company) => c.company_id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "ไม่พบข้อมูลบริษัท" });
  }
  
  const original = db.companies[idx];
  db.companies[idx] = { ...original, ...req.body, company_id: id }; // preserve ID
  writeDb(db);
  
  addLog("admin@sims.com", "Admin", "แก้ไขข้อมูลบริษัทฝึกงาน", `ปรับปรุงรายละเอียด ${db.companies[idx].company_name}`);
  res.json(db.companies[idx]);
});

app.delete("/api/companies/:id", (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const idx = db.companies.findIndex((c: Company) => c.company_id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "ไม่พบข้อมูลบริษัท" });
  }
  const deleted = db.companies.splice(idx, 1)[0];
  writeDb(db);
  
  addLog("admin@sims.com", "Admin", "ลบข้อมูลบริษัทฝึกงาน", `ลบข้อมูลบริษัท ${deleted.company_name}`);
  res.json({ success: true, deletedCompanyId: id });
});

// 3. STUDENTS CRUD & IMPORT
app.get("/api/students", (req, res) => {
  const db = getDb();
  let list = db.students;
  const { major, status, search, year } = req.query;
  
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter((s: Student) => 
      s.student_id.toLowerCase().includes(q) || 
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(q) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  }
  if (major) {
    list = list.filter((s: Student) => s.major === String(major));
  }
  if (status) {
    list = list.filter((s: Student) => s.internship_status === String(status));
  }
  if (year) {
    list = list.filter((s: Student) => s.internship_year === Number(year));
  }
  
  res.json(list);
});

app.post("/api/students", (req, res) => {
  const db = getDb();
  const st: Partial<Student> = req.body;
  if (!st.student_id || !st.first_name || !st.last_name) {
    return res.status(400).json({ error: "กรุณาระบุรหัสนักศึกษา ชื่อ และนามสกุล" });
  }
  
  // Duplicate check
  if (db.students.some((s: Student) => s.student_id === st.student_id)) {
    return res.status(400).json({ error: "รหัสนักศึกษานี้มีในระบบแล้ว" });
  }
  
  const newSt: Student = {
    student_id: st.student_id,
    first_name: st.first_name,
    last_name: st.last_name,
    major: st.major || "IT",
    faculty: st.faculty || "เทคโนโลยีสารสนเทศ",
    education_level: st.education_level || "ปริญญาตรี",
    year_level: st.year_level || 3,
    phone: st.phone || "-",
    email: st.email || `st.${st.student_id}@university.ac.th`,
    internship_year: st.internship_year || 2026,
    company_id: st.company_id || null,
    internship_status: st.internship_status || "Planned"
  };
  
  db.students.push(newSt);
  writeDb(db);
  
  addLog("admin@sims.com", "Admin", "เพิ่มข้อมูลนักศึกษา", `เพิ่มนักศึกษา ${newSt.first_name} ${newSt.last_name} (${newSt.student_id})`);
  res.json(newSt);
});

// Import bulk CSV/JSON data
app.post("/api/students/import", (req, res) => {
  const db = getDb();
  const list: any[] = req.body.students;
  if (!list || !Array.isArray(list)) {
    return res.status(400).json({ error: "โปรดอัปโหลดรูปแบบอาร์เรย์ที่สมบูรณ์" });
  }
  
  let addedCount = 0;
  let dupCount = 0;
  
  list.forEach(item => {
    if (!item.student_id || !item.first_name || !item.last_name) return;
    
    // Check duplication
    const exists = db.students.some((s: Student) => s.student_id === String(item.student_id));
    if (exists) {
      dupCount++;
      return;
    }
    
    db.students.push({
      student_id: String(item.student_id),
      first_name: item.first_name,
      last_name: item.last_name,
      major: item.major || "IT",
      faculty: item.faculty || "เทคโนโลยีสารสนเทศ",
      education_level: item.education_level === "ปวส" ? "ปวส" : "ปริญญาตรี",
      year_level: Number(item.year_level) || 3,
      phone: item.phone || "-",
      email: item.email || `st.${item.student_id}@university.ac.th`,
      internship_year: Number(item.internship_year) || 2026,
      company_id: item.company_id || null,
      internship_status: item.internship_status || "Planned"
    });
    
    addedCount++;
  });
  
  if (addedCount > 0) {
    writeDb(db);
    addLog("admin@sims.com", "Admin", "นำเข้าข้อมูลนักศึกษาแบบกลุ่ม", `นำเข้านักศึกษาใหม่ ${addedCount} ราย สำเร็จ (ซ้ำ ${dupCount} ราย)`);
  }
  
  res.json({ success: true, added: addedCount, duplicated: dupCount });
});

app.put("/api/students/:id", (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const idx = db.students.findIndex((s: Student) => s.student_id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "ไม่พบข้อมูลนักศึกษา" });
  }
  
  const original = db.students[idx];
  db.students[idx] = { ...original, ...req.body, student_id: id }; // preserve ID
  writeDb(db);
  
  addLog("admin@sims.com", "Admin", "ปรับปรุงข้อมูลนักศึกษา", `แก้ไขรายละเอียดนักศึกษา ${db.students[idx].first_name} (${id})`);
  res.json(db.students[idx]);
});

app.delete("/api/students/:id", (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const idx = db.students.findIndex((s: Student) => s.student_id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "ไม่พบข้อมูลนักศึกษา" });
  }
  const deleted = db.students.splice(idx, 1)[0];
  writeDb(db);
  
  addLog("admin@sims.com", "Admin", "ลบข้อมูลนักศึกษา", `ลบแฟ้มประวัตินักศึกษา ${deleted.first_name} ${deleted.last_name}`);
  res.json({ success: true, deletedStudentId: id });
});

// 4. INTERNSHIP ASSIGNMENT
app.get("/api/internships", (req, res) => {
  const db = getDb();
  res.json(db.internships);
});

// Match / Assign student to company
app.post("/api/internships/assign", (req, res) => {
  const db = getDb();
  const { student_id, company_id, start_date, end_date } = req.body;
  if (!student_id || !company_id) {
    return res.status(400).json({ error: "โปรดระบุนักศึกษาและบริษัทที่จะจัดสรร" });
  }
  
  // Find student and company
  const stIdx = db.students.findIndex((s: Student) => s.student_id === student_id);
  const cp = db.companies.find((c: Company) => c.company_id === company_id);
  
  if (stIdx === -1 || !cp) {
    return res.status(404).json({ error: "ไม่พบรหัสนักศึกษาหรือรหัสบริษัทกรอกลงในระบบ" });
  }
  
  const student = db.students[stIdx];
  
  // Check slots
  const alreadyAssigned = db.students.filter((s: Student) => s.company_id === company_id && s.internship_status !== "Completed").length;
  if (alreadyAssigned >= cp.internship_slots) {
    // We allow overallocation with warning but let's notify
    console.log(`Warning: Slots filled for ${cp.company_name} (${alreadyAssigned}/${cp.internship_slots})`);
  }
  
  // Assign
  student.company_id = company_id;
  student.internship_status = "Ongoing"; // Standard state shift when assigned
  
  // Enter record into Internship table
  // Remove existing planned/ongoing internship records for this student first to avoid duplicates
  db.internships = db.internships.filter((i: Internship) => i.student_id !== student_id || i.status === "Completed");
  
  const internId = `INT${String(db.internships.length + 1).padStart(4, "0")}`;
  const newInternship: Internship = {
    internship_id: internId,
    student_id: student_id,
    company_id: company_id,
    start_date: start_date || new Date().toISOString().split('T')[0],
    end_date: end_date || new Date(Date.now() + 3600000 * 24 * 120).toISOString().split('T')[0], // 4 months default
    province: cp.province,
    internship_year: student.internship_year,
    status: "Ongoing"
  };
  
  db.internships.push(newInternship);
  writeDb(db);
  
  addLog("admin@sims.com", "Admin", "จับคู่จับกลุ่มนักศึกษาฝึกงาน", `จัดสรรคุณ ${student.first_name} ให้ฝึกฝนที่ ${cp.company_name}`);
  res.json({ success: true, student, internship: newInternship });
});

// Update Assignment status or dates
app.put("/api/internships/update-status", (req, res) => {
  const db = getDb();
  const { student_id, status } = req.body;
  if (!student_id || !status) {
    return res.status(400).json({ error: "กรุณากรอกรหัสนักศึกษาและสถานะใหม่" });
  }
  
  const stIdx = db.students.findIndex((s: Student) => s.student_id === student_id);
  if (stIdx === -1) {
    return res.status(404).json({ error: "ไม่พบประวัตินักศึกษา" });
  }
  
  const originalStatus = db.students[stIdx].internship_status;
  db.students[stIdx].internship_status = status;
  
  // Sync Status with Internship entry
  const internIdx = db.internships.findIndex((i: Internship) => i.student_id === student_id && i.status !== "Completed");
  if (internIdx !== -1) {
    db.internships[internIdx].status = status;
  }
  
  writeDb(db);
  
  addLog("admin@sims.com", "Admin", "เปลี่ยนสถานะการฝึกงาน", `ปรับปรุงสถานะคุณ ${db.students[stIdx].first_name} เป็น [${status}] (เดิม: ${originalStatus})`);
  res.json(db.students[stIdx]);
});

// 5. REVIEWS & RATINGS CRUD
app.get("/api/reviews", (req, res) => {
  const db = getDb();
  res.json(db.reviews);
});

app.post("/api/reviews", (req, res) => {
  const db = getDb();
  const { company_id, student_id, rating, ratings, comment } = req.body;
  
  if (!company_id || !student_id || !ratings) {
    return res.status(400).json({ error: "ป้อนข้อมูลประเมินและบริษัทที่ต้องการรีวิวให้ครบถ้วน" });
  }
  
  const student = db.students.find((s: Student) => s.student_id === student_id);
  if (!student) {
    return res.status(404).json({ error: "ไม่พบรหัสนักศึกษานี้ในระบบ" });
  }
  
  // Compute overall average
  const { job_suitability, allowance, welfare, environment, learning } = ratings;
  const avg = parseFloat(((job_suitability + allowance + welfare + environment + learning) / 5).toFixed(1));
  
  const review_id = `REV${String(db.reviews.length + 1).padStart(4, "0")}`;
  const newReview: CompanyReview = {
    review_id,
    company_id,
    student_id,
    student_name: `${student.first_name} ${student.last_name}`,
    rating: avg,
    ratings: {
      job_suitability: Number(job_suitability),
      allowance: Number(allowance),
      welfare: Number(welfare),
      environment: Number(environment),
      learning: Number(learning)
    },
    comment: comment || "",
    created_date: new Date().toISOString().split('T')[0]
  };
  
  db.reviews.push(newReview);
  
  // Recalculate company general ratings
  const targetCompIdx = db.companies.findIndex((c: Company) => c.company_id === company_id);
  if (targetCompIdx !== -1) {
    const comp = db.companies[targetCompIdx];
    const compReviews = db.reviews.filter((r: CompanyReview) => r.company_id === company_id);
    const sum = compReviews.reduce((acc: number, curr: CompanyReview) => acc + curr.rating, 0);
    comp.avg_rating = parseFloat((sum / compReviews.length).toFixed(1));
    comp.review_count = compReviews.length;
  }
  
  writeDb(db);
  
  addLog(student.email, "Student", "บันทึกรีวิวสถานประกอบการ", `นักศึกษา ${student.first_name} บันทึกรีวิวคะแนนเฉลี่ย ${avg} ดาว แก่บริษัท ID: ${company_id}`);
  res.json(newReview);
});

// 6. ACTIVITY LOGS
app.get("/api/logs", (req, res) => {
  const db = getDb();
  res.json(db.logs || []);
});

// 7. GOOGLE SHEETS CONFIG STORAGE
app.get("/api/sheets-config", (req, res) => {
  const db = getDb();
  res.json({ sheetsUrl: db.sheetsUrl || "" });
});

app.post("/api/sheets-config", (req, res) => {
  const db = getDb();
  const { sheetsUrl } = req.body;
  db.sheetsUrl = sheetsUrl || "";
  writeDb(db);
  addLog("admin@sims.com", "Admin", "อัปเดตสายเชื่อมโยง Google Sheet", sheetsUrl ? `อัปเดต Google Apps Script API URL: ${sheetsUrl.substring(0, 40)}...` : "ยกเลิกการเชื่อมต่อกับ Google Sheet");
  res.json({ success: true, sheetsUrl: db.sheetsUrl });
});

// 7.5 MAJORS CRUD OPERATIONS
app.get("/api/majors", (req, res) => {
  const db = getDb();
  res.json(db.majors || []);
});

app.post("/api/majors", (req, res) => {
  const db = getDb();
  const { name } = req.body;
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "กรุณากรอกชื่อสาขาวิชา" });
  }
  const cleanName = name.trim();
  db.majors = db.majors || [];
  if (db.majors.includes(cleanName)) {
    return res.status(400).json({ error: "มีสาขาวิชานี้ในระบบเรียบร้อยแล้ว" });
  }
  db.majors.push(cleanName);
  writeDb(db);
  addLog("admin@sims.com", "Admin", "เพิ่มสาขาวิชาเอกใหม่", `เพิ่มกลุ่มสาขา ${cleanName} ในระบบเรียบร้อย`);
  res.json({ success: true, majors: db.majors });
});

app.put("/api/majors", (req, res) => {
  const db = getDb();
  const { oldName, newName } = req.body;
  if (!oldName || !newName || typeof oldName !== "string" || typeof newName !== "string" || !newName.trim()) {
    return res.status(400).json({ error: "กรุณาระบุข้อมูลชื่อเดิมและชื่อใหม่" });
  }
  const cleanOld = oldName.trim();
  const cleanNew = newName.trim();
  
  db.majors = db.majors || [];
  const idx = db.majors.indexOf(cleanOld);
  if (idx === -1) {
    return res.status(404).json({ error: "ไม่พบสาขาวิชาเดิมในระบบ" });
  }
  
  if (db.majors.includes(cleanNew) && cleanOld !== cleanNew) {
    return res.status(400).json({ error: "มีสาขาวิชาใหม่นี้คู่ขนานในระบบแล้ว" });
  }
  
  db.majors[idx] = cleanNew;
  
  // Update students who have this major to the new major
  let updatedCount = 0;
  if (db.students && Array.isArray(db.students)) {
    db.students.forEach((s: any) => {
      if (s.major === cleanOld) {
        s.major = cleanNew;
        updatedCount++;
      }
    });
  }
  
  writeDb(db);
  addLog("admin@sims.com", "Admin", "แก้ไขข้อมูลสาขาวิชา", `แก้ไขสาขาวิชา ${cleanOld} เป็น ${cleanNew} (ส่งผลต่อนักศึกษา ${updatedCount} ราย)`);
  res.json({ success: true, majors: db.majors, updatedCount });
});

app.delete("/api/majors", (req, res) => {
  const db = getDb();
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "กรุณาระบุสาขาวิชาที่ต้องการลบ" });
  }
  const cleanName = name.trim();
  db.majors = db.majors || [];
  const idx = db.majors.indexOf(cleanName);
  if (idx === -1) {
    return res.status(404).json({ error: "ไม่พบสาขาวิชาที่ต้องการลบ" });
  }
  
  db.majors.splice(idx, 1);
  writeDb(db);
  addLog("admin@sims.com", "Admin", "ลบสาขาวิชาออกจากระบบ", `ถอนข้อมูลสาขา ${cleanName}`);
  res.json({ success: true, majors: db.majors });
});

// 8. GEMINI AI RECOMMENDATION & REPORT AGENT
// Server-side lazy loaded Gemini API key
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("ระบบตรวจไม่พบ API Key ในสัปดาห์ปัจจุบัน (กรุณาบันทึกคีย์ GEMINI_API_KEY ใน Settings)");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { type, companyId, studentId, promptText } = req.body;
    const db = getDb();
    
    // Safety check for empty key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: "โปรดติดตั้ง GEMINI_API_KEY ในตัวช่วยระบบก่อนใช้บริการวิเคราะห์ด้วย AI" });
    }
    
    const client = getGeminiClient();
    let prompt = "";
    
    if (type === "company-report" && companyId) {
      const company = db.companies.find((c: Company) => c.company_id === companyId);
      const reviews = db.reviews.filter((r: CompanyReview) => r.company_id === companyId);
      if (!company) return res.status(404).json({ error: "ไม่พบบันทึกข้อมูลบริษัทนี้" });
      
      const reviewTexts = reviews.map((r: CompanyReview) => `- คะแนนเฉลี่ย: ${r.rating}/5 ดาว บันทึกย่อ: "${r.comment}" (งาน:${r.ratings.job_suitability}, ค่าตอบแทน:${r.ratings.allowance}, สวัสดิการ:${r.ratings.welfare}, บรรยากาศ:${r.ratings.environment}, การเรียนรู้:${r.ratings.learning})`).join("\n");
      
      prompt = `คุณคือผู้เชี่ยวชาญด้านแนะแนวอาชีพและวิเคราะห์สถิติสถานประกอบการฝึกงาน หน้าที่ของคุณคือให้รายงานสรุปสปีดแบ็คพร้อมจุดเด่นและข้อควรพัฒนาของบริษัทนี้อย่างรอบด้าน 3 ย่อหน้าสั้นในภาษาไทยที่สุภาพ
บริษัท: ${company.company_name}
ประเภทธุรกิจ: ${company.business_type}
สิทธิประโยชน์: ค่าตอบแทนประจำวัน ${company.allowance} บาท, สวัสดิการที่พัก=${company.accommodation ? 'มี': 'ไม่มี'}, สวัสดิการอาหาร=${company.meal_support ? 'มี':'ไม่มี'}, รถรับส่ง=${company.transportation_support ? 'มี':'ไม่มี'}
ข้อมูลประเมินและข้อความรีวิวสะสะสมโดยนักศึกษาฝึกงาน:
${reviewTexts || "ยังไม่มีข้อมูลนักศึกษารีวิวเพิ่มเติม"}
กรุณาเขียนรายงานเป็นลำดับข้อแบบเรียบง่ายและเป็นข้อเท็จจริง`;
    } 
    else if (type === "student-match" && studentId) {
      const student = db.students.find((s: Student) => s.student_id === studentId);
      if (!student) return res.status(404).json({ error: "ไม่พบประวัตินักศึกษา" });
      
      const availableActiveCompanies = db.companies.filter((c: Company) => c.status === "Active").slice(0, 10);
      const companyDetails = availableActiveCompanies.map((c: Company) => `- ${c.company_name} (ID: ${c.company_id}) | ธุรกิจ: ${c.business_type} | รายละเอียดเบื้องต้น: "${c.company_description}" | ตําแหน่งเปิดรับ: "${c.available_positions}" | ค่าเบี้ยเลี้ยงรายวัน: ${c.allowance} บาท`).join("\n");
      
      prompt = `คุณคือระบบอัจฉริยะแนะนำสถานที่ฝึกงาน ช่วยวิเคราะห์หาบริษัทที่เหมาะสมที่สุด 3 แห่งจากรายการบริษัทฝึกงานที่กำหนด โดยเปรียบเทียบจากสาขาวิชาเอก ความชอบ และคุณสมบัติของนักศึกษา
นักศึกษา: คุณ ${student.first_name} ${student.last_name}
สาขาวิชา: ${student.major} (คณะ: ${student.faculty})
ระดับการศึกษา: ${student.education_level} ชั้นปี: ${student.year_level}

รายการบริษัทฝึกงานเปิดรับสมัคร:
${companyDetails}

กรุณาแนะนำ 3 บริษัทเรียงลำดับความเหมาะสมสูงสุดพร้อมระบุเหตุผลซัพพอร์ตการตัดสินใจแต่ละแห่ง สรุปสั้นๆ เป็นภาษาไทยน่าอ่าน`;
    } 
    else {
      prompt = promptText || "ตอบทักทายผู้ใช้งานและแจ้งว่าคุณคือระบบแนะนำอัจฉริยะ AI Assistant ของระบบบริหารจัดการฝึกงาน Student Internship Management System (SIMS)";
    }

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini AI API Error:", err);
    res.status(500).json({ error: err.message || "เกิดข้อผิดพลาดในการประมวลผลด้วย Gemini AI" });
  }
});

// Start Server Setup (Vite Middleware in dev, Client files serve in production)
async function startServer() {
  const pEnv = process.env.NODE_ENV || "development";
  console.log(`Starting SIMS Backend Server in [${pEnv}] mode...`);
  
  // Make sure db file is checked
  getDb();
  
  if (pEnv !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SIMS Server is now listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
