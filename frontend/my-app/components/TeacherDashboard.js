'use client';
import { useEffect, useState } from 'react';

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5001/attendance', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        // Format the data if needed
        const formatted = data.map(entry => ({
          id: entry.student_id,
          time: entry.date,
          status: entry.status,
        }));
        setStudents(formatted);
      })
      .catch(err => {
        console.error('Failed to fetch attendance:', err);
      });
  }, []);

  const updateStatus = (studentId, newStatus) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );

    const token = localStorage.getItem('token');
    fetch(`http://localhost:5001/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ student_id: studentId, status: newStatus }),
    }).catch(err => console.error('Failed to update attendance:', err));
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


