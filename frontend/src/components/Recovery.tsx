import { useState } from 'react';
import '../styles/Auth.css';

interface RecoveryProps {
  onRecoverySuccess: (uid: string) => void;
  onCancel: () => void;
}

const Recovery = ({ onRecoverySuccess, onCancel }: RecoveryProps) => {
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!recoveryPhrase.trim()) {
      setError('Recovery phrase is required');
      return;
    }
    
    try {
      setLoading(true);
      
      // Call backend API to verify recovery phrase
      const response = await fetch('http://localhost:3001/api/auth/verify-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recoveryPhrase }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Recovery failed');
      }
      
      // Recovery successful
      onRecoverySuccess(data.uid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recovery failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Recover Your UID</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="recoveryPhrase">Recovery Phrase</label>
          <input
            type="text"
            id="recoveryPhrase"
            value={recoveryPhrase}
            onChange={(e) => setRecoveryPhrase(e.target.value)}
            placeholder="Enter your recovery phrase"
            disabled={loading}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Recovering...' : 'Recover UID and Login'}
        </button>
        
        <button type="button" onClick={onCancel} className="cancel-button">
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default Recovery;