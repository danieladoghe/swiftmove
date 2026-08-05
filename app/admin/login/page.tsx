'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/admin';
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Login failed.');
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0e1013', color: '#f2f0ec', fontFamily: 'Inter, system-ui, sans-serif', padding: 24 }}>
      <form onSubmit={onSubmit} style={{ width: '100%', maxWidth: 360, background: '#181b20', border: '1px solid #2a2e35', borderRadius: 16, padding: 28 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 22 }}>Mo&apos;s Yard — Admin</h1>
        <p style={{ margin: '0 0 20px', color: '#9aa0a8', fontSize: 14 }}>Sign in to manage requests and orders.</p>

        <label style={{ fontSize: 13, color: '#9aa0a8' }}>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          style={inputStyle}
        />

        <label style={{ fontSize: 13, color: '#9aa0a8' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          style={inputStyle}
        />

        {error && <p style={{ color: '#ff6b6b', fontSize: 13, margin: '4px 0 0' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 18, width: '100%', padding: '11px 16px', borderRadius: 10, border: 'none', background: '#f5921e', color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  margin: '6px 0 16px',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #2a2e35',
  background: '#0e1013',
  color: '#f2f0ec',
  fontSize: 15,
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
