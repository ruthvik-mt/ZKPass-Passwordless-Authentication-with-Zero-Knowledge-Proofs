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
export declare class ZKPassError extends Error {
    code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
export declare class ZKPassClient {
    private client;
    constructor(config: ZKPassConfig);
    /**
     * Register a new user with UID
     * @param uid The unique identifier for the user
     * @returns Promise with registration response including recovery phrase
     * @throws {ZKPassError} If registration fails
     */
    register(uid: string): Promise<RegisterResponse>;
    /**
     * Login with UID
     * @param uid The unique identifier for the user
     * @returns Promise with login response
     * @throws {ZKPassError} If login fails
     */
    login(uid: string): Promise<LoginResponse>;
    /**
     * Verify recovery phrase and derive UID
     * @param recoveryPhrase The recovery phrase to verify
     * @returns Promise with verification response including UID and public key
     * @throws {ZKPassError} If verification fails
     */
    verifyRecovery(recoveryPhrase: string): Promise<VerifyRecoveryResponse>;
}
