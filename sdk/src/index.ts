import axios, { AxiosInstance } from 'axios';
import { ethers } from 'ethers';

export interface ZKPassConfig {
  baseURL: string;
  apiKey?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  recoveryPhrase: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  uid: string;
}

export interface VerifyRecoveryResponse {
  success: boolean;
  message: string;
  uid: string;
  publicKey: string;
}

export class ZKPassClient {
  private client: AxiosInstance;

  constructor(config: ZKPassConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'X-API-Key': config.apiKey })
      }
    });
  }

  /**
   * Register a new user with UID
   * @param uid The unique identifier for the user
   * @returns Promise with registration response including recovery phrase
   */
  async register(uid: string): Promise<RegisterResponse> {
    const response = await this.client.post<RegisterResponse>('/auth/register', { uid });
    return response.data;
  }

  /**
   * Login with UID
   * @param uid The unique identifier for the user
   * @returns Promise with login response
   */
  async login(uid: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', { uid });
    return response.data;
  }

  /**
   * Verify recovery phrase and derive UID
   * @param recoveryPhrase The recovery phrase to verify
   * @returns Promise with verification response including UID and public key
   */
  async verifyRecovery(recoveryPhrase: string): Promise<VerifyRecoveryResponse> {
    const response = await this.client.post<VerifyRecoveryResponse>('/auth/verify-recovery', { recoveryPhrase });
    return response.data;
  }
}

// Export a factory function for easier instantiation
export function createZKPassClient(config: ZKPassConfig): ZKPassClient {
  return new ZKPassClient(config);
}