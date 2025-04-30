'use client';
import { useState, useEffect } from 'react';
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import './dashboard.css';

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser(payload);
  }, []);

  if (!user) return <div className="modal-container"><div className="modal-box">Loading...</div></div>;

  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="header">
          <h1>{user?.role === 'teacher' ? 'Manage Student Attendance' : 'Your Attendance'}</h1>
        </div>
        {user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
      </div>
    </div>
  );
}
