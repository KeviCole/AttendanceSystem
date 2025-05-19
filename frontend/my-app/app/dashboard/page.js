import { cookies } from 'next/headers';
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import './dashboard.css';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // Get the cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token_cookie')?.value;

  // Redirect if no token
  if (!token) {
    redirect('/login');
  }

  // Decode the token
  const base64Payload = token.split('.')[1];
  const jsonPayload = Buffer.from(base64Payload, 'base64').toString();
  const user = JSON.parse(jsonPayload);

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
