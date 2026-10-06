export type UserRole = "admin" | "guru";

// `user_id` adalah primary key (lihat 20260101000100_fix_profiles_pk.sql).
// Tabel ini tidak punya kolom `id`.
export type Profile = {
  user_id: string;
  role: UserRole;
  full_name: string | null;
  nip: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ClassRow = {
  id: string;
  name: string;
  level: "X" | "XI" | "XII";
  major: string | null;
  academic_year: string;
  homeroom_teacher_id: string | null;
  capacity: number | null;
};

export type Subject = {
  id: string;
  code: string;
  name: string;
  category: string | null;
  credits: number | null;
};

export type Teacher = {
  id: string;
  user_id: string | null;
  nip: string;
  full_name: string;
  gender: "L" | "P" | null;
  phone: string | null;
  email: string | null;
  subject_id: string | null;
  title: string | null;
  is_active: boolean;
  joined_at: string | null;
};

export type Student = {
  id: string;
  nis: string;
  nisn: string | null;
  full_name: string;
  gender: "L" | "P" | null;
  birth_place: string | null;
  birth_date: string | null;
  class_id: string | null;
  address: string | null;
  phone: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  status: "aktif" | "lulus" | "pindah" | "keluar";
  photo_url: string | null;
};

export type StudentWithClass = Student & {
  classes: Pick<ClassRow, "id" | "name"> | null;
};

export type Grade = {
  id: string;
  student_id: string;
  subject_id: string;
  class_id: string;
  teacher_id: string | null;
  academic_year: string;
  semester: "ganjil" | "genap";
  daily_quiz: number | null;
  assignment: number | null;
  mid_exam: number | null;
  final_exam: number | null;
  final_score: number | null;
  letter_grade: string | null;
  remarks: string | null;
};

export type NewsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  category: string;
  cover_url: string | null;
  status: "draft" | "published" | "archived";
  is_pinned: boolean;
  author_id: string | null;
  published_at: string | null;
  views: number;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  body: string;
  is_read: boolean;
  created_at: string;
};

export type SchoolSetting = {
  key: string;
  value: string | null;
};
