'use client';

import { useState } from 'react';

const LoginView = ({ onLogin }) => {
  const [RFID, setRFID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await onLogin({ RFID, password });
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 shadow-md rounded-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
        <input
          type="RFID"
          placeholder="RFID"
          className="border p-2 rounded"
          value={RFID}
          onChange={(e) => setRFID(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginView;
