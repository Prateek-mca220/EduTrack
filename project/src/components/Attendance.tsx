import React, { useState } from 'react';
import { Calendar, Users, Clock, FileText, Download } from 'lucide-react';
import { Class, Student, AttendanceRecord, AttendanceStats } from '../types';

interface AttendanceProps {
  classes: Class[];
  students: Student[];
  attendance: AttendanceRecord[];
  onMarkAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
}

export default function Attendance({ classes, students, attendance, onMarkAttendance }: AttendanceProps) {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState<'mark' | 'reports'>('mark');

  const selectedClassData = classes.find(c => c.id === selectedClass);
  const enrolledStudents = selectedClassData 
    ? students.filter(s => selectedClassData.enrolledStudents.includes(s.id))
    : [];

  const existingAttendance = attendance.filter(
    a => a.classId === selectedClass && a.date === selectedDate
  );

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    const existing = existingAttendance.find(a => a.studentId === studentId);
    
    if (existing) {
      // In a real app, you'd update the existing record
      return;
    }

    onMarkAttendance({
      studentId,
      classId: selectedClass,
      date: selectedDate,
      status,
    });
  };

  const getAttendanceStatus = (studentId: string) => {
    const record = existingAttendance.find(a => a.studentId === studentId);
    return record?.status || '';
  };

  const calculateStats = (studentId: string): AttendanceStats => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    const totalClasses = studentAttendance.length;
    const present = studentAttendance.filter(a => a.status === 'present').length;
    const absent = studentAttendance.filter(a => a.status === 'absent').length;
    const late = studentAttendance.filter(a => a.status === 'late').length;
    const excused = studentAttendance.filter(a => a.status === 'excused').length;
    
    return {
      totalClasses,
      present,
      absent,
      late,
      excused,
      attendanceRate: totalClasses > 0 ? Math.round(((present + late) / totalClasses) * 100) : 0
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-600 text-white';
      case 'absent': return 'bg-red-600 text-white';
      case 'late': return 'bg-yellow-600 text-white';
      case 'excused': return 'bg-blue-600 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Clock className="w-8 h-8 mr-3 text-orange-600" />
            Attendance
          </h1>
          <p className="text-gray-600 mt-1">Track and manage student attendance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('mark')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'mark' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setView('reports')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === 'reports' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Reports
          </button>
        </div>
      </div>

      {view === 'mark' ? (
        <>
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Choose a class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.instructor}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Attendance Grid */}
          {selectedClass && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-600" />
                  {selectedClassData?.name} - {new Date(selectedDate).toLocaleDateString()}
                </h2>
                <p className="text-gray-600 mt-1">{enrolledStudents.length} students enrolled</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {enrolledStudents.map((student) => {
                    const currentStatus = getAttendanceStatus(student.id);
                    return (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium text-sm">
                              {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.studentId}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {['present', 'absent', 'late', 'excused'].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleAttendanceChange(student.id, status as any)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition-colors ${
                                currentStatus === status 
                                  ? getStatusColor(status)
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Reports View */
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-gray-900">{students.filter(s => s.status === 'active').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{attendance.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Overall Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {attendance.length > 0 
                      ? Math.round((attendance.filter(a => a.status === 'present' || a.status === 'late').length / attendance.length) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Attendance Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Student Attendance Reports</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 font-medium text-gray-900">Student</th>
                      <th className="text-center p-3 font-medium text-gray-900">Total Classes</th>
                      <th className="text-center p-3 font-medium text-gray-900">Present</th>
                      <th className="text-center p-3 font-medium text-gray-900">Absent</th>
                      <th className="text-center p-3 font-medium text-gray-900">Late</th>
                      <th className="text-center p-3 font-medium text-gray-900">Excused</th>
                      <th className="text-center p-3 font-medium text-gray-900">Attendance Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.filter(s => s.status === 'active').map((student) => {
                      const stats = calculateStats(student.id);
                      return (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-600">{student.studentId}</p>
                            </div>
                          </td>
                          <td className="p-3 text-center text-gray-900">{stats.totalClasses}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {stats.present}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                              {stats.absent}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                              {stats.late}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {stats.excused}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              stats.attendanceRate >= 90 
                                ? 'bg-green-100 text-green-800'
                                : stats.attendanceRate >= 75 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {stats.attendanceRate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedClass && view === 'mark' && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Select a class to mark attendance</p>
        </div>
      )}
    </div>
  );
}