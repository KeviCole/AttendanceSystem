'use client';
import { useEffect, useState } from 'react';

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // TEMP: simulate backend data
    const mockData = [
      { id: 1, time: '2025-04-28 08:30', status: 'Present' },
      { id: 2, time: '2025-04-28 08:35', status: 'Absent' },
      { id: 3, time: '2025-04-28 08:40', status: 'Present' },
    ];
    setStudents(mockData);
  }, []);

  const updateStatus = (studentId, newStatus) => {
    // TEMP: Update locally for demo
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
    // In real use, uncomment to push to backend:
    /*
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5001/attendance/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    */
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
        {students.map((student, i) => (
          <li key={i} style={{ fontWeight: 'bold', color: '#000', marginBottom: '20px' }}>
            {student.id} – {student.time} – <em>{student.status}</em>
            <div style={{ marginTop: '8px' }}>
              <button 
                onClick={() => updateStatus(student.id, 'Present')} 
                style={{
                    marginRight: '10px',
                    border: '1px solid #000',
                    background: 'transparent',
                    padding: '6px 12px',
                    cursor: 'pointer'
                  }}
            >
                Present
              </button>
              <button 
                onClick={() => updateStatus(student.id, 'Absent')} 
                style={{
                    border: '1px solid #000', 
                    background: 'transparent', 
                    padding: '6px 12px',
                    cursor: 'pointer'
                }}>
                Absent
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
  
}

