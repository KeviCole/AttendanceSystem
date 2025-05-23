'use client';

import { useState } from 'react';
import './login.css';

export default function LoginPage() {
  const [rfid, setRFID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Sends login information
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ rfid_id: rfid, password }),
    });

    const data = await res.json();

    // Redirect is login is successful
    if (res.ok) {
      window.location.href = '/dashboard';
    } else {
      setError(data.msg || 'Login failed');
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-box">
        <div className="header">
          <h1>UHere Login</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>RFID</label>
            <input type="text" value={rfid} onChange={(e) => setRFID(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="login-btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

