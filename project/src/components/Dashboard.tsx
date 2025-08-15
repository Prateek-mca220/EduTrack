import React from 'react';
import { Users, BookOpen, Calendar, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Student, Class, AttendanceRecord } from '../types';

interface DashboardProps {
  students: Student[];
  classes: Class[];
  attendance: AttendanceRecord[];
}

export default function Dashboard({ students, classes, attendance }: DashboardProps) {
  // Calculate stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalClasses = classes.length;
  
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === 'present').length;
  const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
  const lateToday = todayAttendance.filter(a => a.status === 'late').length;
  
  const overallAttendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.status === 'present' || a.status === 'late').length / attendance.length) * 100)
    : 0;

  const recentActivity = attendance
    .slice(-5)
    .reverse()
    .map(record => {
      const student = students.find(s => s.id === record.studentId);
      const classInfo = classes.find(c => c.id === record.classId);
      return { ...record, studentName: student?.name, className: classInfo?.name };
    });

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Classes',
      value: totalClasses,
      icon: BookOpen,
      color: 'bg-teal-500',
      textColor: 'text-teal-600'
    },
    {
      title: 'Present Today',
      value: presentToday,
      icon: Calendar,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Overall Attendance',
      value: `${overallAttendanceRate}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-50';
      case 'absent': return 'text-red-600 bg-red-50';
      case 'late': return 'text-yellow-600 bg-yellow-50';
      case 'excused': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Attendance Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Today's Attendance Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium">Present</span>
              <span className="text-green-800 font-bold">{presentToday}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-700 font-medium">Absent</span>
              <span className="text-red-800 font-bold">{absentToday}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-700 font-medium">Late</span>
              <span className="text-yellow-800 font-bold">{lateToday}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.studentName}</p>
                  <p className="text-xs text-gray-600">{activity.className}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                  <span className="text-xs text-gray-500">{activity.date}</span>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}