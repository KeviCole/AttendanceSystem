'use client';

import LoginView from '../../components/LoginView';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async ({ RFID, password }) => {
    const response = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ RFID, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    console.log('Login success, token:', data.access_token);

    // Optionally save token
    localStorage.setItem('token', data.access_token);

    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <LoginView onLogin={handleLogin} />
  );
}
