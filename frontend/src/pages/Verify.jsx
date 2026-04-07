import { useState, useEffect } from 'react';
import { verifyCredential } from '../services/api';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle, XCircle } from 'lucide-react';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  
  const [query, setQuery] = useState(initialId);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialId) {
      handleVerify(null, initialId);
    }
  }, [initialId]);

  const handleVerify = async (e, idToVerify = query) => {
    if (e) e.preventDefault();
    if (!idToVerify) return;

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const data = await verifyCredential(idToVerify);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Invalid ID or Hash.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="glass-card wide">
        <h2 className="title" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <Search /> Blockchain Verification Portal
        </h2>
        
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Enter a Credential ID or Blockchain Hash to verify its authenticity.
        </p>

        <form onSubmit={handleVerify} style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. CRED-A1B2C3D4 or 0x..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required 
          />
          <button type="submit" className="btn" style={{ width: 'auto', padding: '0 2rem' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        {error && (
          <div className="verify-status verify-invalid">
            <XCircle size={48} color="var(--error)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'var(--error)' }}>Verification Failed</h3>
            <p>{error}</p>
          </div>
        )}

        {result && result.valid && (
          <div className="verify-status verify-valid">
            <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Authentic Credential</h3>
            
            <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--card-border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p><strong>Student:</strong> {result.credential.userName}</p>
                <p><strong>Skill:</strong> {result.credential.skillName}</p>
                <p><strong>Issued By:</strong> {result.credential.issuer?.name}</p>
              </div>
              <div>
                <p><strong>Credential ID:</strong> {result.credential.credentialId}</p>
                <p><strong>Issue Date:</strong> {new Date(result.credential.issueDate).toLocaleString()}</p>
                <p><strong>Tx ID:</strong> <span style={{ fontSize: '0.8rem' }}>{result.transaction.transactionId}</span></p>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <p><strong>Blockchain Hash:</strong></p>
                <p style={{ wordBreak: 'break-all', fontSize: '0.85rem', color: 'var(--primary-color)', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
                  {result.credential.blockchainHash}
                </p>
              </div>
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              This record matches the immutable blockchain transaction signature.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
