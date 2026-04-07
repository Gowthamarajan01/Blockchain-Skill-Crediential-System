import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Award, CheckCircle, Smartphone, Lock } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">Blockchain Powered</div>
          <h1 className="hero-title">
            Secure Your Skills with <span className="gradient-text">Immutable</span> Credentials
          </h1>
          <p className="hero-subtitle">
            The world's first decentralized-inspired skill verification platform. Earn, verify, and share your achievements with complete confidence.
          </p>
          
          <div className="role-selection">
            <div className="role-card student" onClick={() => navigate('/login?role=student')}>
              <div className="role-icon">
                <GraduationCap size={40} />
              </div>
              <h3>Student Portal</h3>
              <p>View your earned credentials, download certificates, and share your success.</p>
              <button className="role-btn">Get Started</button>
            </div>

            <div className="role-card admin" onClick={() => navigate('/login?role=admin')}>
              <div className="role-icon">
                <ShieldCheck size={40} />
              </div>
              <h3>Admin / Issuer</h3>
              <p>Issue tamper-proof credentials to students and manage skill portfolios.</p>
              <button className="role-btn">Issue Skills</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-grid">
        <div className="feature-item">
          <Award className="feature-icon" />
          <h3>Digital Badges</h3>
          <p>Earn verified badges for every skill you master.</p>
        </div>
        <div className="feature-item">
          <CheckCircle className="feature-icon" />
          <h3>Instance Verification</h3>
          <p>Public portal for anyone to verify your certificates instantly.</p>
        </div>
        <div className="feature-item">
          <Lock className="feature-icon" />
          <h3>Blockchain Hashing</h3>
          <p>Every credential is hashed and secured using cryptographic signatures.</p>
        </div>
      </section>
      
      <style jsx>{`
        .landing-container {
          min-height: 100vh;
          background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent),
                      radial-gradient(circle at bottom left, rgba(168, 85, 247, 0.15), transparent);
          padding: 2rem;
        }

        .hero {
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 20px;
          text-align: center;
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 100px;
          color: var(--primary-color);
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .gradient-text {
          background: linear-gradient(90deg, #6366f1, #a855f7);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 4rem;
          line-height: 1.6;
        }

        .role-selection {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .role-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem 2rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .role-card:hover {
          transform: translateY(-10px);
          border-color: var(--primary-color);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .role-card.student:hover {
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
        }

        .role-card.admin:hover {
          box-shadow: 0 20px 40px rgba(168, 85, 247, 0.2);
        }

        .role-icon {
          width: 80px;
          height: 80px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          color: var(--primary-color);
          transition: all 0.3s ease;
        }

        .role-card:hover .role-icon {
          transform: scale(1.1) rotate(5deg);
          background: var(--primary-color);
          color: white;
        }

        .role-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .role-card p {
          color: var(--text-muted);
          margin-bottom: 2rem;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .role-btn {
          padding: 0.75rem 2rem;
          background: transparent;
          border: 1px solid var(--primary-color);
          color: var(--primary-color);
          border-radius: 100px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .role-card:hover .role-btn {
          background: var(--primary-color);
          color: white;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1200px;
          margin: 4rem auto 0;
          padding-bottom: 100px;
        }

        .feature-item {
          text-align: center;
          padding: 2rem;
        }

        .feature-icon {
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .role-selection { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
