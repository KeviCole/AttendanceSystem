'use client';
import { useEffect, useState } from 'react';

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  // Gets all students attendance
  useEffect(() => {
    fetch('http://localhost:5001/attendance', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        // Formats the data
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

  // Sorts date and time field, defaults to midnight time until RFID set up
  const formatDateToMySQL = (isoString) => {
    const d = new Date(isoString);
    d.setHours(0, 0, 0, 0);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = '00';
    const mi = '00';
    const ss = '00';

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  };

  const updateStatus = (studentId, time, newStatus) => {
    // PUT method to update status in backend
    fetch(`http://localhost:5001/attendance/${studentId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: formatDateToMySQL(time), status: newStatus })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update attendance");
        setStudents(prev =>
          prev.map(student =>
            student.id === studentId && student.time === time
              ? { ...student, status: newStatus }
              : student
          )
        );
      })
      .catch(err => {
        console.error(err);
        alert("Could not update attendance. Please try again.");
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
        {students.map((student, i) => (
          <li key={i} style={{ fontWeight: 'bold', color: '#000', marginBottom: '20px' }}>
            {student.id} – {student.time} – <em>{student.status}</em>
            <div style={{ marginTop: '8px' }}>
              <button 
                onClick={() => updateStatus(student.id, student.time, 'present')} 
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
                onClick={() => updateStatus(student.id, student.time, 'absent')}
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


