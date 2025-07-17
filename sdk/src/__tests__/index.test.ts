import { ZKPassSDK } from '../index';
import axios, { AxiosInstance, AxiosError } from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ZKPassSDK', () => {
  let client: ZKPassSDK;
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
    client = new ZKPassSDK({
      apiKey: 'test-api-key',
      baseUrl: 'https://api.zkpass.com'
    });
  });

  describe('constructor', () => {
    it('should create client with default baseUrl', () => {
      const sdk = new ZKPassSDK({ apiKey: 'test-api-key' });
      expect(sdk).toBeInstanceOf(ZKPassSDK);
    });
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const mockResponse = {
        data: {
          success: true,
          recoveryPhrase: 'test recovery phrase'
        }
      };
      mockAxiosInstance.post?.mockResolvedValue(mockResponse);

      const response = await client.register('user123');
      expect(response).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', { uid: 'user123' });
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
          uid: 'user123'
        }
      };
      mockAxiosInstance.post?.mockResolvedValue(mockResponse);

      const response = await client.login('user123');
      expect(response).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', { uid: 'user123' });
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
          uid: 'user123'
        }
      };
      mockAxiosInstance.post?.mockResolvedValue(mockResponse);

      const response = await client.verifyRecovery('test recovery phrase');
      expect(response).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/verify-recovery', { recoveryPhrase: 'test recovery phrase' });
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