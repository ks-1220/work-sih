// Base URL for the Swasth Infinity backend.
//
// This used to be derived from `window.location.hostname` at module scope,
// which throws during the Next.js server render because `window` does not
// exist there. Reading it from the environment keeps the value available on
// both the server and the client.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://sih24-backend.onrender.com';

export const AUTH_API_URL = `${API_BASE_URL}/api/auth`;
export const ADMIN_API_URL = `${API_BASE_URL}/api/admin`;
