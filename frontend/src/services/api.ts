const API_BASE_URL = 'http://localhost:3001/api';

export const authApi = {
  /**
   * Register a new user with UID
   */
  register: async (uid: string): Promise<{ success: boolean; recoveryPhrase: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  },
  
  /**
   * Login with UID - proof generation handled by backend
   */
  login: async (uid: string): Promise<{ success: boolean; uid: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  },
  
  /**
   * Verify recovery phrase and derive UID
   */
  verifyRecovery: async (recoveryPhrase: string): Promise<{ success: boolean; uid: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-recovery`, {
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
    
    return data;
  },
};