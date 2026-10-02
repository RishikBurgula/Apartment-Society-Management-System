import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BG = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80';

const label = {
  display: 'block',
  color: '#c7d2fe',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 6,
};

const input = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  marginBottom: 18,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.35)',
  background: 'rgba(255,255,255,0.12)',
  color: '#ffffff',
  fontSize: 15,
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Wrong email or password');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background:
          'linear-gradient(rgba(5,6,15,0.6), rgba(49,46,129,0.8)), url(' + BG + ') center/cover, #1e1b4b',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: '100%',
          maxWidth: 380,
          padding: 32,
          borderRadius: 24,
          background: 'rgba(10,12,28,0.92)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
            <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
          </svg>
          <h1 style={{ color: '#ffffff', fontSize: 26, fontWeight: 800, margin: '10px 0 4px' }}>
            Society Portal
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: 14, margin: 0 }}>Sign in to your account</p>
        </div>

        <label style={label}>Email</label>
        <input
          style={input}
          placeholder="admin@society.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={label}>Password</label>
        <input
          style={input}
          type="password"
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p
            style={{
              background: 'rgba(244,63,94,0.2)',
              border: '1px solid rgba(244,63,94,0.5)',
              color: '#fecdd3',
              fontSize: 14,
              padding: 10,
              borderRadius: 10,
              textAlign: 'center',
              margin: '0 0 16px',
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 14,
            border: 'none',
            borderRadius: 12,
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}