import { useState, useEffect } from 'react';
import { loginUser } from '../services/api';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn, Eye, EyeOff, GraduationCap, ShieldCheck } from 'lucide-react';

export default function Login({ onSetUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      onSetUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
                width: '60px', height: '60px', background: 'rgba(99, 102, 241, 0.1)', 
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem', color: 'var(--primary-color)'
            }}>
                {initialRole === 'admin' ? <ShieldCheck size={32} /> : <GraduationCap size={32} />}
            </div>
            <h2 className="title" style={{ margin: 0, fontSize: '1.75rem' }}>
                {initialRole === 'admin' ? 'Admin Login' : 'Student Login'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Secure gateway for {initialRole === 'admin' ? 'credential issuance' : 'skill management'}
            </p>
        </div>
        {error && <p className="p-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ paddingRight: '40px' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', 
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' 
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn">Sign In</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to={`/register${initialRole ? `?role=${initialRole}` : ''}`}>Register here</Link>
          <br/>
          Want to verify a credential? <Link to="/verify">Verify Portal</Link>
          <br/>
          <Link to="/" style={{ fontSize: '0.85rem', display: 'block', marginTop: '1rem', opacity: 0.7 }}>← Switch Role</Link>
        </p>
      </div>
    </div>
  );
}
