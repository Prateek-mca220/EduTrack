import React, { useState } from 'react';
import { GraduationCap, BarChart3, Users, BookOpen, Clock } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Classes from './components/Classes';
import Attendance from './components/Attendance';
import { Student, Class, AttendanceRecord } from './types';
import { mockStudents, mockClasses, mockAttendance } from './data/mockData';

type ActiveTab = 'dashboard' | 'students' | 'classes' | 'attendance';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);

  // Student handlers
  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString()
    };
    setStudents([...students, newStudent]);
  };

  const handleUpdateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    // Also remove from class enrollments
    setClasses(classes.map(c => ({
      ...c,
      enrolledStudents: c.enrolledStudents.filter(studentId => studentId !== id)
    })));
    // Remove attendance records
    setAttendance(attendance.filter(a => a.studentId !== id));
  };

  // Class handlers
  const handleAddClass = (classData: Omit<Class, 'id'>) => {
    const newClass: Class = {
      ...classData,
      id: Date.now().toString()
    };
    setClasses([...classes, newClass]);
  };

  const handleUpdateClass = (id: string, updates: Partial<Class>) => {
    setClasses(classes.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
    // Remove attendance records for this class
    setAttendance(attendance.filter(a => a.classId !== id));
  };

  // Attendance handler
  const handleMarkAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: Date.now().toString()
    };
    setAttendance([...attendance, newRecord]);
  };

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'classes', name: 'Classes', icon: BookOpen },
    { id: 'attendance', name: 'Attendance', icon: Clock }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard students={students} classes={classes} attendance={attendance} />;
      case 'students':
        return (
          <Students
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      case 'classes':
        return (
          <Classes
            classes={classes}
            students={students}
            onAddClass={handleAddClass}
            onUpdateClass={handleUpdateClass}
            onDeleteClass={handleDeleteClass}
          />
        );
      case 'attendance':
        return (
          <Attendance
            classes={classes}
            students={students}
            attendance={attendance}
            onMarkAttendance={handleMarkAttendance}
          />
        );
      default:
        return <Dashboard students={students} classes={classes} attendance={attendance} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">EduTrack</h1>
              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Student Attendance System
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id as ActiveTab)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === item.id
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;