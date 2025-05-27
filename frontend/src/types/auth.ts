/**
 * Types for authentication
 */

/**
 * Authentication response from the server
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  uid?: string;
  recoveryPhrase?: string;
}