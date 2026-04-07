import { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, GraduationCap, ShieldCheck } from 'lucide-react';

export default function Register({ onSetUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') || 'student';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(name, email, password, role);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      onSetUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
                {role === 'admin' ? <ShieldCheck size={32} /> : <GraduationCap size={32} />}
            </div>
            <h2 className="title" style={{ margin: 0, fontSize: '1.75rem' }}>
                {role === 'admin' ? 'Admin Registration' : 'Student Registration'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Join the blockchain network as a {role === 'admin' ? 'Issuer' : 'Learner'}
            </p>
        </div>
        {error && <p className="p-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
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
          <div className="form-group">
            <label>Role</label>
            <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student / User</option>
              <option value="admin">Admin / Issuer</option>
            </select>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                {role === 'admin' ? 'Issuer accounts can create and verify credentials.' : 'Student accounts can earn and share credentials.'}
            </p>
          </div>
          <button type="submit" className="btn">Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to={`/login${role ? `?role=${role}` : ''}`}>Login here</Link>
          <br/>
          <Link to="/" style={{ fontSize: '0.85rem', display: 'block', marginTop: '1rem', opacity: 0.7 }}>← Switch Role</Link>
        </p>
      </div>
    </div>
  );
}
