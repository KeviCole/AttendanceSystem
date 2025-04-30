'use client';
import { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5001/attendance', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAttendance(data));
  }, []);

  useEffect(() => {
    // Sample attendance data
    const sampleData = [
      { date: '2025-04-15', status: 'Absent' },
      { date: '2025-04-17', status: 'Present' },
      { date: '2025-04-22', status: 'Absent' },
      { date: '2025-04-24', status: 'Present' },
    ];
    setAttendance(sampleData);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
            {attendance.map((entry, i) => (
            <li key={i} style={{ fontWeight: 'bold', color: '#000' }}>
                {entry.date}: {entry.status}
            </li>
            ))}
        </ul>
    </div>
  );
}
