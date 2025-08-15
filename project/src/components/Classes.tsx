import React, { useState } from 'react';
import { BookOpen, Plus, Search, Edit, Trash2, Users, Clock, MapPin, Calendar } from 'lucide-react';
import { Class, Student } from '../types';

interface ClassesProps {
  classes: Class[];
  students: Student[];
  onAddClass: (classData: Omit<Class, 'id'>) => void;
  onUpdateClass: (id: string, classData: Partial<Class>) => void;
  onDeleteClass: (id: string) => void;
}

export default function Classes({ classes, students, onAddClass, onUpdateClass, onDeleteClass }: ClassesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    instructor: '',
    schedule: '',
    room: '',
    capacity: 0,
    enrolledStudents: [] as string[],
    startDate: '',
    endDate: ''
  });

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      instructor: '',
      schedule: '',
      room: '',
      capacity: 0,
      enrolledStudents: [],
      startDate: '',
      endDate: ''
    });
    setShowAddForm(false);
    setEditingClass(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      onUpdateClass(editingClass.id, formData);
    } else {
      onAddClass(formData);
    }
    resetForm();
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      subject: cls.subject,
      instructor: cls.instructor,
      schedule: cls.schedule,
      room: cls.room,
      capacity: cls.capacity,
      enrolledStudents: cls.enrolledStudents,
      startDate: cls.startDate,
      endDate: cls.endDate
    });
    setShowAddForm(true);
  };

  const handleStudentToggle = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      enrolledStudents: prev.enrolledStudents.includes(studentId)
        ? prev.enrolledStudents.filter(id => id !== studentId)
        : [...prev.enrolledStudents, studentId]
    }));
  };

  const getEnrolledStudentNames = (studentIds: string[]) => {
    return studentIds
      .map(id => students.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-teal-600" />
            Classes
          </h1>
          <p className="text-gray-600 mt-1">Manage class schedules and enrollment</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search classes by name, subject, or instructor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingClass ? 'Edit Class' : 'Add New Class'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input
                  type="text"
                  required
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Mon, Wed, Fri - 9:00 AM"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <input
                  type="text"
                  required
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Student Enrollment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Enrolled Students</label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {students.map(student => (
                  <label key={student.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.enrolledStudents.includes(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-900">{student.name} ({student.studentId})</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Selected: {formData.enrolledStudents.length} / {formData.capacity}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingClass ? 'Update Class' : 'Add Class'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{cls.name}</h3>
                <p className="text-sm text-teal-600 font-medium mb-2">{cls.subject}</p>
                <p className="text-sm text-gray-600 mb-3">Instructor: {cls.instructor}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cls)}
                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteClass(cls.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {cls.schedule}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {cls.room}
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {cls.enrolledStudents.length} / {cls.capacity} students
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(cls.startDate).toLocaleDateString()} - {new Date(cls.endDate).toLocaleDateString()}
              </div>
            </div>

            {cls.enrolledStudents.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Enrolled Students:</p>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {getEnrolledStudentNames(cls.enrolledStudents)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No classes found. Add your first class to get started.</p>
        </div>
      )}
    </div>
  );
}