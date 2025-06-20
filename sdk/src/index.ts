import axios, { AxiosInstance, AxiosError } from 'axios';

export interface ZKPassConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
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

export class ZKPassError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ZKPassError';
  }
}

export class ZKPassClient {
  private client: AxiosInstance;

  constructor(config: ZKPassConfig) {
    if (!config.baseURL) {
      throw new ZKPassError('baseURL is required in config');
    }

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'X-API-Key': config.apiKey })
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          throw new ZKPassError(
            error.response.data.message || 'Request failed',
            error.response.status.toString()
          );
        }
        throw new ZKPassError(error.message || 'Network error');
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
      const response = await this.client.post<RegisterResponse>('/register', { uid });
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
      const response = await this.client.post<LoginResponse>('/login', { uid });
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
      const response = await this.client.post<VerifyRecoveryResponse>('/verify-recovery', { recoveryPhrase });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof ZKPassError) throw error;
      if (
        typeof error === 'object' &&
        error !== null &&
        'isAxiosError' in error &&
        (error as AxiosError).isAxiosError
      ) {
        const axiosError = error as AxiosError;
        const message =
          axiosError.response &&
          axiosError.response.data &&
          typeof axiosError.response.data === 'object' &&
          'message' in axiosError.response.data
            ? (axiosError.response.data as { message: string }).message
            : undefined;
        if (message) {
          throw new ZKPassError(message);
        }
      }
      if (error instanceof Error) {
        throw new ZKPassError(error.message);
      }
      throw new ZKPassError('Recovery verification failed');
    }
  }
} 