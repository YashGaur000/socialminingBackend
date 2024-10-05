import crypto from 'crypto';

export function generateCodeVerifier(length: number = 128): string {
  return crypto.randomBytes(length).toString('base64url');
}

export function generateCodeChallenge(codeVerifier: string): string {
  return crypto.createHash('sha256').update(codeVerifier).digest('base64url');
}

export const generateRandomState = (): string => crypto.randomBytes(16).toString('hex');
