import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../lib/api';
import { setSession, useAuthSession } from '../lib/auth';
import type { AuthResult } from '../types';
import { ErrorBanner, Spinner } from '../components/ui';

export function LoginPage() {
  const session = useAuthSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigate('/', { replace: true });
    }
  }, [session, navigate]);

  if (session) return <Navigate to="/" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post<{ success: boolean; data: AuthResult }>('/auth/login', {
        email,
        password,
      });
      const result = data.data;
      if (result.user.role !== 'admin') {
        setError('This account does not have admin access.');
        return;
      }
      setSession(result);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <span className="brand-mark">CN</span>
          <h1>Campus News Admin</h1>
          <p>Sign in to manage the campus news &amp; announcement system.</p>
        </div>
        {error ? <ErrorBanner message={error} /> : null}
        <label className="field">
          <span className="field-label">Email</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@campus.edu"
          />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? <Spinner /> : 'Sign in'}
        </button>
      </form>
    </div>
  );
}