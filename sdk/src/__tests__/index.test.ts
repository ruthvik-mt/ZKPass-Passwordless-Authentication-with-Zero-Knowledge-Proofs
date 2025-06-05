import { ZKPassClient } from '../index';
import axios, { AxiosInstance, AxiosError } from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ZKPassClient', () => {
  let client: ZKPassClient;
  const mockAxiosInstance: Partial<AxiosInstance> = {
    post: jest.fn(),
    interceptors: {
      response: {
        use: jest.fn()
      }
    }
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock axios.create to return our mock instance
    mockedAxios.create.mockReturnValue(mockAxiosInstance as AxiosInstance);
    
    // Create a new client instance for each test
    client = new ZKPassClient({
      baseURL: 'https://api.zkpass.com'
    });
  });

  describe('constructor', () => {
    it('should throw error if baseURL is not provided', () => {
      expect(() => new ZKPassClient({} as { baseURL: string })).toThrow('baseURL is required in config');
    });

    it('should create client with default timeout', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 30000
        })
      );
    });

    it('should create client with custom timeout', () => {
      new ZKPassClient({
        baseURL: 'https://api.zkpass.com',
        timeout: 5000
      });
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 5000
        })
      );
    });
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Registration successful',
          recoveryPhrase: 'test recovery phrase'
        }
      };
      mockAxiosInstance.post?.mockResolvedValue(mockResponse);

      const response = await client.register('user123');
      expect(response).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/register', { uid: 'user123' });
    });

    it('should handle registration failure', async () => {
      mockAxiosInstance.post?.mockRejectedValue({
        response: {
          data: {
            message: 'Registration failed'
          },
          status: 400
        }
      });

      await expect(client.register('user123')).rejects.toThrow('Registration failed');
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Login successful',
          uid: 'user123'
        }
      };
      mockAxiosInstance.post?.mockResolvedValue(mockResponse);

      const response = await client.login('user123');
      expect(response).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/login', { uid: 'user123' });
    });

    it('should handle login failure', async () => {
      mockAxiosInstance.post?.mockRejectedValue({
        response: {
          data: {
            message: 'Login failed'
          },
          status: 401
        }
      });

      await expect(client.login('user123')).rejects.toThrow('Login failed');
    });
  });

  describe('verifyRecovery', () => {
    it('should successfully verify recovery phrase', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Recovery successful',
          uid: 'user123',
          publicKey: '0x123...'
        }
      };
      mockAxiosInstance.post?.mockResolvedValue(mockResponse);

      const response = await client.verifyRecovery('test recovery phrase');
      expect(response).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/verify-recovery', { recoveryPhrase: 'test recovery phrase' });
    });

    it('should handle recovery verification failure', async () => {
      // Properly mock an AxiosError
      const axiosError = Object.assign(new Error('Invalid recovery phrase'), {
        isAxiosError: true,
        response: {
          data: {
            message: 'Invalid recovery phrase'
          },
          status: 400
        }
      }) as AxiosError;

      mockAxiosInstance.post?.mockRejectedValue(axiosError);

      await expect(client.verifyRecovery('invalid phrase')).rejects.toThrow('Invalid recovery phrase');
    });
  });
}); 