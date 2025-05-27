import { useState } from 'react';
import '../styles/Auth.css';

interface LoginProps {
  onLoginSuccess: (uid: string) => void;
  onForgotUID: () => void;
}

const Login = ({ onLoginSuccess, onForgotUID }: LoginProps) => {
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!uid.trim()) {
      setError('UID is required');
      return;
    }
    
    try {
      setLoading(true);
      
      // Call backend API to login - proof generation handled by backend
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Login successful
      onLoginSuccess(data.uid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="uid">Unique Identifier (UID)</label>
          <input
            type="text"
            id="uid"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Enter your UID"
            disabled={loading}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="forgot-link">
          <button type="button" onClick={onForgotUID} className="text-button" >
            Forgot UID?
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;