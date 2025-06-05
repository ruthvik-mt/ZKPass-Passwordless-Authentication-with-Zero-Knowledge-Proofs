"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZKPassClient = exports.ZKPassError = void 0;
const axios_1 = __importDefault(require("axios"));
class ZKPassError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = 'ZKPassError';
    }
}
exports.ZKPassError = ZKPassError;
class ZKPassClient {
    constructor(config) {
        if (!config.baseURL) {
            throw new ZKPassError('baseURL is required in config');
        }
        this.client = axios_1.default.create({
            baseURL: config.baseURL,
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                ...(config.apiKey && { 'X-API-Key': config.apiKey })
            }
        });
        // Add response interceptor for error handling
        this.client.interceptors.response.use((response) => response, (error) => {
            if (error.response) {
                throw new ZKPassError(error.response.data.message || 'Request failed', error.response.status.toString());
            }
            throw new ZKPassError(error.message || 'Network error');
        });
    }
    /**
     * Register a new user with UID
     * @param uid The unique identifier for the user
     * @returns Promise with registration response including recovery phrase
     * @throws {ZKPassError} If registration fails
     */
    async register(uid) {
        try {
            const response = await this.client.post('/register', { uid });
            return response.data;
        }
        catch (error) {
            if (error instanceof ZKPassError)
                throw error;
            throw new ZKPassError('Registration failed');
        }
    }
    /**
     * Login with UID
     * @param uid The unique identifier for the user
     * @returns Promise with login response
     * @throws {ZKPassError} If login fails
     */
    async login(uid) {
        try {
            const response = await this.client.post('/login', { uid });
            return response.data;
        }
        catch (error) {
            if (error instanceof ZKPassError)
                throw error;
            throw new ZKPassError('Login failed');
        }
    }
    /**
     * Verify recovery phrase and derive UID
     * @param recoveryPhrase The recovery phrase to verify
     * @returns Promise with verification response including UID and public key
     * @throws {ZKPassError} If verification fails
     */
    async verifyRecovery(recoveryPhrase) {
        try {
            const response = await this.client.post('/verify-recovery', { recoveryPhrase });
            return response.data;
        }
        catch (error) {
            if (error instanceof ZKPassError)
                throw error;
            if (typeof error === 'object' &&
                error !== null &&
                'isAxiosError' in error &&
                error.isAxiosError) {
                const axiosError = error;
                const message = axiosError.response &&
                    axiosError.response.data &&
                    typeof axiosError.response.data === 'object' &&
                    'message' in axiosError.response.data
                    ? axiosError.response.data.message
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
exports.ZKPassClient = ZKPassClient;
