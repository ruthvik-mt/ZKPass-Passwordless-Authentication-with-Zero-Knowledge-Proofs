import axios, { AxiosInstance, AxiosError } from 'axios';
import { ethers } from 'ethers';

export type Environment = 'development' | 'staging' | 'production';

export interface ZKPassConfig {
  environment?: Environment;
  baseURL?: string;
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

export interface ErrorResponse {
  message: string;
  code?: string;
}

export class ZKPassError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ZKPassError';
  }
}

export class ZKPassClient {
  private client: AxiosInstance;
  private static readonly ENV_URLS = {
    development: 'http://localhost:3000/api',
    staging: 'https://staging-api.zkpass.com/api',
    production: 'https://api.zkpass.com/api'
  };

  constructor(config: ZKPassConfig) {
    const baseURL = config.baseURL || ZKPassClient.ENV_URLS[config.environment || 'production'];
    
    if (!baseURL) {
      throw new ZKPassError('Invalid configuration: Either baseURL or environment must be provided');
    }

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'X-API-Key': config.apiKey })
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError<ErrorResponse>) => {
        if (error.response?.data) {
          throw new ZKPassError(
            error.response.data.message || 'An error occurred',
            error.response.data.code
          );
        }
        throw new ZKPassError('Network error occurred');
      }
    );
  }

  /**
   * Register a new user with UID
   * @param uid The unique identifier for the user
   * @returns Promise with registration response including recovery phrase
   * @throws {ZKPassError} If registration fails
   */
  async register(uid: string): Promise<RegisterResponse> {
    try {
      const response = await this.client.post<RegisterResponse>('/auth/register', { uid });
      return response.data;
    } catch (error) {
      if (error instanceof ZKPassError) throw error;
      throw new ZKPassError('Registration failed');
    }
  }

  /**
   * Login with UID
   * @param uid The unique identifier for the user
   * @returns Promise with login response
   * @throws {ZKPassError} If login fails
   */
  async login(uid: string): Promise<LoginResponse> {
    try {
      const response = await this.client.post<LoginResponse>('/auth/login', { uid });
      return response.data;
    } catch (error) {
      if (error instanceof ZKPassError) throw error;
      throw new ZKPassError('Login failed');
    }
  }

  /**
   * Verify recovery phrase and derive UID
   * @param recoveryPhrase The recovery phrase to verify
   * @returns Promise with verification response including UID and public key
   * @throws {ZKPassError} If verification fails
   */
  async verifyRecovery(recoveryPhrase: string): Promise<VerifyRecoveryResponse> {
    try {
      const response = await this.client.post<VerifyRecoveryResponse>('/auth/verify-recovery', { recoveryPhrase });
      return response.data;
    } catch (error) {
      if (error instanceof ZKPassError) throw error;
      throw new ZKPassError('Recovery verification failed');
    }
  }
}

// Export a factory function for easier instantiation
export function createZKPassClient(config: ZKPassConfig): ZKPassClient {
  return new ZKPassClient(config);
}