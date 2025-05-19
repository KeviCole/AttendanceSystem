'use client';
import { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState([]);
  // Gets Attendance
  useEffect(() => {
    fetch('http://localhost:5001/attendance', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setAttendance(data));
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
            {attendance?.map((entry, i) => (
            <li key={i} style={{ fontWeight: 'bold', color: '#000' }}>
                {entry?.date}: {entry?.status}
            </li>
            ))}
        </ul>
    </div>
  );
}
