import { useState, useRef } from 'react';
import { Download, Share2, Image as ImageIcon, FileText, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

export default function CredentialCard({ credential, isAdmin, onDelete }) {
  const certificateRef = useRef(null);

  const handleImageDownload = async (e, imageUrl, skillName) => {
    e.preventDefault();
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Extract file extension or default to png
      const ext = imageUrl.split('.').pop() || 'png';
      link.download = `${skillName}-certificate.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download certificate image.');
    }
  };

  const downloadPDF = async () => {
    const element = certificateRef.current;
    
    // Create a temporary clone for rendering if needed, but since it's hidden, 
    // it's better to render it off-screen. We use a hidden wrapper.
    element.style.display = 'block';
    
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${credential.skillName}-certificate.pdf`);
    
    element.style.display = 'none';
  };

  const copyLink = () => {
    const link = `${window.location.origin}/verify?id=${credential.credentialId}`;
    navigator.clipboard.writeText(link);
    alert('Verification link copied to clipboard!');
  };

  return (
    <div className="cred-card">
      <div className="cred-header">
        <h3 style={{ color: 'var(--primary-color)' }}>{credential.skillName}</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {new Date(credential.issueDate).toLocaleDateString()}
        </span>
      </div>
      <div className="cred-body">
        <p><strong>ID:</strong> {credential.credentialId}</p>
        <p><strong>Issuer:</strong> {credential.issuer?.name || 'Admin'}</p>
        <p style={{ wordBreak: 'break-all', fontSize: '0.8rem' }}><strong>Hash:</strong> {credential.blockchainHash}</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        {credential.certificateImage ? (
          <div style={{ display: 'flex', gap: '5px', flex: 1 }}>
            <a 
              href={`http://localhost:5000/${credential.certificateImage}`} 
              target="_blank" 
              rel="noreferrer"
              className="btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1, justifyContent: 'center', textDecoration: 'none' }}
            >
              {credential.certificateImage.match(/\.(pdf|doc|docx)$/i) ? (
                  <><FileText size={16} /> View</>
              ) : (
                  <><ImageIcon size={16} /> View</>
              )}
            </a>
            <button 
              onClick={(e) => handleImageDownload(e, `http://localhost:5000/${credential.certificateImage}`, credential.skillName)}
              className="btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1, justifyContent: 'center', textDecoration: 'none', background: 'var(--primary-color)', cursor: 'pointer', border: 'none', color: 'white' }}
            >
              <Download size={16} /> DL
            </button>
          </div>
        ) : (
          <button className="btn" onClick={downloadPDF} style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1, justifyContent: 'center' }}>
            <Download size={16} /> PDF
          </button>
        )}
        <button className="btn" onClick={copyLink} style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1, justifyContent: 'center', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>
          <Share2 size={16} /> Share
        </button>
        {isAdmin && onDelete && (
          <button className="btn" onClick={() => onDelete(credential.credentialId)} style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1, justifyContent: 'center', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}>
            <Trash2 size={16} /> Delete
          </button>
        )}
      </div>

      {/* Hidden Certificate Template for PDF Generation */}
      <div style={{ display: 'none' }}>
        <div 
          ref={certificateRef}
          style={{
            width: '800px',
            height: '600px',
            padding: '40px',
            background: 'linear-gradient(135deg, #1e1b4b, #0f172a)',
            color: '#fff',
            fontFamily: 'sans-serif',
            position: 'relative',
            border: '10px solid #6366f1',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ textAlign: 'center', border: '2px solid rgba(255,255,255,0.2)', height: '100%', padding: '20px' }}>
            <h1 style={{ fontSize: '40px', color: '#c084fc', marginBottom: '10px' }}>Certificate of Achievement</h1>
            <p style={{ fontSize: '20px', color: '#94a3b8' }}>This is to certify that</p>
            <h2 style={{ fontSize: '36px', margin: '20px 0', borderBottom: '2px solid #6366f1', display: 'inline-block', paddingBottom: '10px' }}>
              {credential.userName}
            </h2>
            <p style={{ fontSize: '20px', color: '#94a3b8' }}>has successfully achieved the skill</p>
            <h3 style={{ fontSize: '32px', color: '#10b981', margin: '20px 0' }}>{credential.skillName}</h3>
            
            <div style={{ position: 'absolute', bottom: '60px', left: '60px', textAlign: 'left' }}>
              <p><strong>ID:</strong> {credential.credentialId}</p>
              <p><strong>Date:</strong> {new Date(credential.issueDate).toLocaleDateString()}</p>
              <p><strong>Issuer:</strong> {credential.issuer?.name || 'Admin'}</p>
            </div>
            
            <div style={{ position: 'absolute', bottom: '60px', right: '60px', background: '#fff', padding: '10px', borderRadius: '8px' }}>
              <QRCodeSVG value={`${window.location.origin}/verify?id=${credential.credentialId}`} size={80} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
