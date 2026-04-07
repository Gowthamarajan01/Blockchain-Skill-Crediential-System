import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, LogOut, Menu, X } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <ShieldCheck color="var(--primary-color)" size={28} />
        <span>BlockCred</span>
      </div>
      
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
        <Link to="/verify" onClick={() => setMobileOpen(false)}>Verify</Link>
        <div style={{ color: 'var(--text-muted)' }}>
          Welcome, <strong>{user?.name}</strong> ({user?.role})
        </div>
        <button onClick={() => { onLogout(); setMobileOpen(false); }} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
}
