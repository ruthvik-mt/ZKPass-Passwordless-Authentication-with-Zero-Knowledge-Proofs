import axios, { AxiosInstance } from 'axios';

export interface ZKPassConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface RegisterResponse {
  success: boolean;
  recoveryPhrase: string;
}

export interface LoginResponse {
  success: boolean;
  uid: string;
}

export interface VerifyRecoveryResponse {
  success: boolean;
  uid: string;
}

export class ZKPassSDK {
  private client: AxiosInstance;
  private static DEFAULT_BASE_URL = 'http://localhost:3001/api';

  constructor(config: ZKPassConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl || ZKPassSDK.DEFAULT_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      }
    });
  }

  /**
   * Register a new user with UID
   * @param uid - User identifier
   * @returns Promise with registration response including recovery phrase
   */
  async register(uid: string): Promise<RegisterResponse> {
    try {
      const { data } = await this.client.post('/auth/register', { uid });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  /**
   * Login with UID
   * @param uid - User identifier
   * @returns Promise with login response
   */
  async login(uid: string): Promise<LoginResponse> {
    try {
      const { data } = await this.client.post('/auth/login', { uid });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Verify recovery phrase and derive UID
   * @param recoveryPhrase - Recovery phrase to verify
   * @returns Promise with verification response including derived UID
   */
  async verifyRecovery(recoveryPhrase: string): Promise<VerifyRecoveryResponse> {
    try {
      const { data } = await this.client.post('/auth/verify-recovery', { recoveryPhrase });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Recovery verification failed');
    }
  }
}