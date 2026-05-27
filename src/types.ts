export interface Company {
  company_id: string; // "COM001", "COM002", etc.
  company_name: string;
  business_type: string; // "Manufacturing" | "Logistics" | "IT" | "Construction" | "Service" | etc.
  address: string;
  province: string;
  district: string;
  latitude: number;
  longitude: number;
  contact_person: string;
  phone: string;
  email: string;
  allowance: number; // Daily allowance in Baht (0 if none)
  accommodation: boolean; // Yes = true, No = false
  meal_support: boolean;
  transportation_support: boolean;
  welfare_detail: string;
  available_positions: string; // e.g. "Software Engineer, UI Designer"
  internship_slots: number; // Available slots
  company_description: string;
  avg_rating: number; // 0 to 5
  review_count: number;
  status: 'Active' | 'Inactive';
}

export interface Student {
  student_id: string; // "65010123"
  first_name: string;
  last_name: string;
  major: string; // "IT" | "Computer Engineering" | "Software Engineering" | "Information Systems" | "Multimedia" | etc.
  faculty: string; // "Engineering" | "Science and Technology" | "Business Administration" | etc.
  education_level: 'ปริญญาตรี' | 'ปวส';
  year_level: number; // 1-5
  phone: string;
  email: string;
  internship_year: number; // e.g. 2026 or 2569 (standardized to BE or AD - we will use AD like 2026 for consistency, display as 2569/2026)
  company_id: string | null; // Associated company if assigned
  internship_status: 'Planned' | 'Ongoing' | 'Completed';
}

export interface Internship {
  internship_id: string;
  student_id: string;
  company_id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  province: string;
  internship_year: number;
  status: 'Planned' | 'Ongoing' | 'Completed';
}

export interface ReviewRating {
  job_suitability: number; // 1-5
  allowance: number; // 1-5
  welfare: number; // 1-5
  environment: number; // 1-5
  learning: number; // 1-5
}

export interface CompanyReview {
  review_id: string;
  company_id: string;
  student_id: string;
  student_name: string; // Pre-joined for easier display
  rating: number; // Overall average of individual ratings (or standalone)
  ratings: ReviewRating; // Break down
  comment: string;
  created_date: string; // YYYY-MM-DD
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user_email: string;
  user_role: 'Admin' | 'Student';
  action: string; // e.g., "เพิ่มข้อมูลบริษัท COM01", "จับคู่นักศึกษา 640102"
  details: string;
}

export interface SystemStats {
  totalCompanies: number;
  totalStudents: number;
  activeInternsCurrentYear: number;
  totalProvinces: number;
  topRatedCompany: string;
  topRatedCompanyId: string;
  topRating: number;
}
