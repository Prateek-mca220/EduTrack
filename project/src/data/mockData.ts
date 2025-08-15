import { Student, Class, AttendanceRecord } from '../types';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    studentId: 'STU001',
    enrollmentDate: '2024-09-01',
    phone: '(555) 123-4567',
    grade: '10th Grade',
    status: 'active'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    studentId: 'STU002',
    enrollmentDate: '2024-09-01',
    phone: '(555) 234-5678',
    grade: '10th Grade',
    status: 'active'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol.davis@email.com',
    studentId: 'STU003',
    enrollmentDate: '2024-09-05',
    phone: '(555) 345-6789',
    grade: '11th Grade',
    status: 'active'
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    studentId: 'STU004',
    enrollmentDate: '2024-09-01',
    phone: '(555) 456-7890',
    grade: '10th Grade',
    status: 'active'
  },
  {
    id: '5',
    name: 'Emma Brown',
    email: 'emma.brown@email.com',
    studentId: 'STU005',
    enrollmentDate: '2024-09-03',
    phone: '(555) 567-8901',
    grade: '11th Grade',
    status: 'active'
  }
];

export const mockClasses: Class[] = [
  {
    id: '1',
    name: 'Mathematics 101',
    subject: 'Mathematics',
    instructor: 'Dr. Sarah Miller',
    schedule: 'Mon, Wed, Fri - 9:00 AM',
    room: 'Room 101',
    capacity: 30,
    enrolledStudents: ['1', '2', '4'],
    startDate: '2024-09-01',
    endDate: '2024-12-15'
  },
  {
    id: '2',
    name: 'English Literature',
    subject: 'English',
    instructor: 'Prof. Michael Chen',
    schedule: 'Tue, Thu - 10:30 AM',
    room: 'Room 205',
    capacity: 25,
    enrolledStudents: ['1', '3', '5'],
    startDate: '2024-09-01',
    endDate: '2024-12-15'
  },
  {
    id: '3',
    name: 'Chemistry Lab',
    subject: 'Chemistry',
    instructor: 'Dr. Lisa Anderson',
    schedule: 'Wed - 2:00 PM',
    room: 'Lab 301',
    capacity: 20,
    enrolledStudents: ['2', '3', '4', '5'],
    startDate: '2024-09-01',
    endDate: '2024-12-15'
  }
];

export const mockAttendance: AttendanceRecord[] = [
  // Mathematics 101 - Recent week
  { id: '1', studentId: '1', classId: '1', date: '2024-12-16', status: 'present' },
  { id: '2', studentId: '2', classId: '1', date: '2024-12-16', status: 'late' },
  { id: '3', studentId: '4', classId: '1', date: '2024-12-16', status: 'present' },
  
  { id: '4', studentId: '1', classId: '1', date: '2024-12-13', status: 'present' },
  { id: '5', studentId: '2', classId: '1', date: '2024-12-13', status: 'absent' },
  { id: '6', studentId: '4', classId: '1', date: '2024-12-13', status: 'present' },
  
  // English Literature
  { id: '7', studentId: '1', classId: '2', date: '2024-12-17', status: 'present' },
  { id: '8', studentId: '3', classId: '2', date: '2024-12-17', status: 'present' },
  { id: '9', studentId: '5', classId: '2', date: '2024-12-17', status: 'excused', notes: 'Medical appointment' },
  
  // Chemistry Lab
  { id: '10', studentId: '2', classId: '3', date: '2024-12-18', status: 'present' },
  { id: '11', studentId: '3', classId: '3', date: '2024-12-18', status: 'present' },
  { id: '12', studentId: '4', classId: '3', date: '2024-12-18', status: 'late' },
  { id: '13', studentId: '5', classId: '3', date: '2024-12-18', status: 'absent' }
];