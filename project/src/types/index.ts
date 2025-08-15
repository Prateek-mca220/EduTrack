export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  enrollmentDate: string;
  phone: string;
  grade: string;
  status: 'active' | 'inactive';
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  instructor: string;
  schedule: string;
  room: string;
  capacity: number;
  enrolledStudents: string[];
  startDate: string;
  endDate: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface AttendanceStats {
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}