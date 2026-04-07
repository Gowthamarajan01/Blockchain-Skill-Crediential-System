import { useState, useEffect } from 'react';
import { getMyCredentials, getAllCredentials, issueCredential, deleteCredential } from '../services/api';
import CredentialCard from '../components/CredentialCard';
import { Award, Users, FileText, Loader2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard({ user }) {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin form state
  const [userEmail, setUserEmail] = useState('');
  const [skillName, setSkillName] = useState('');
  const [certificateImage, setCertificateImage] = useState(null);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      if (user.role === 'admin') {
        const data = await getAllCredentials();
        setCredentials(data);
      } else {
        const data = await getMyCredentials();
        setCredentials(data);
      }
    } catch (err) {
      setError('Failed to fetch credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setIssuing(true);
    const toastId = toast.loading('Issuing credential...');
    try {
      if (certificateImage) {
        const formData = new FormData();
        formData.append('userEmail', userEmail);
        formData.append('skillName', skillName);
        formData.append('certificateImage', certificateImage);
        
        const uploadRes = await fetch('http://localhost:5000/api/credentials/upload-certificate', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        
        if (!uploadRes.ok) {
            let errMsg = 'Failed to issue credential';
            try {
               const errData = await uploadRes.json();
               errMsg = errData.message || errMsg;
            } catch (e) {
               // Ignore parse error
            }
            throw new Error(errMsg);
        }
      } else {
        await issueCredential(userEmail, skillName);
      }
      
      toast.success('Credential issued successfully!', { id: toastId });
      setUserEmail('');
      setSkillName('');
      setCertificateImage(null);
      fetchCredentials(); // Refresh list
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to issue credential';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIssuing(false);
    }
  };

  const handleDelete = async (credentialId) => {
    if (!window.confirm('Are you sure you want to delete this credential?')) return;
    const toastId = toast.loading('Deleting credential...');
    try {
      await deleteCredential(credentialId);
      toast.success('Credential deleted successfully!', { id: toastId });
      fetchCredentials(); // Refresh list after deletion
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete credential';
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="main-container">
      <div className="glass-card wide">
        <h2 className="title" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', fontSize: '1.5rem', marginBottom: '2rem' }}>
          {user.role === 'admin' ? <Users /> : <Award />}
          {user.role === 'admin' ? 'Admin Dashboard' : 'My Credentials'}
        </h2>

        {user.role === 'admin' && (
          <div style={{ marginBottom: '3rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText /> Issue New Credential
            </h3>
            <form onSubmit={handleIssue} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>User Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)} 
                    required 
                    placeholder="student@example.com"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Skill Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={skillName} 
                    onChange={(e) => setSkillName(e.target.value)} 
                    required 
                    placeholder="e.g. React Developer"
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Certificate Document/Image (Optional)</label>
                  <label style={{
                      display: 'flex', alignItems: 'center', gap: '10px', 
                      background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', 
                      border: '1px dashed var(--primary-color)', borderRadius: '8px',
                      cursor: 'pointer', justifyContent: 'center'
                  }}>
                      <Upload size={20} />
                      {certificateImage ? certificateImage.name : 'Click to select JPG / PNG / PDF / DOC'}
                      <input 
                          type="file" 
                          accept="image/*,.pdf,.doc,.docx"
                          style={{ display: 'none' }}
                          onChange={(e) => setCertificateImage(e.target.files[0])}
                      />
                  </label>
              </div>
              <button type="submit" className="btn" disabled={issuing} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                {issuing ? <Loader2 className="spinner" /> : 'Issue Credential'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 className="spinner" size={40} color="var(--primary-color)" />
          </div>
        ) : credentials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(0,0,0,0.1)', borderRadius: '12px' }}>
            <Award size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No credentials found. You haven't earned or issued any skills yet.</p>
          </div>
        ) : (
          <div>
            <h3>{user.role === 'admin' ? 'All Issued Credentials' : 'Your Earned Skills'}</h3>
            <div className="grid-container">
              {credentials.map(cred => (
                <CredentialCard key={cred._id} credential={cred} isAdmin={user.role === 'admin'} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
