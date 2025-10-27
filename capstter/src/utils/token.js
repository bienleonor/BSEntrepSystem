import {jwtDecode} from 'jwt-decode';

// src/utils/token.js
export function getToken() {
  return localStorage.getItem('token');
}

export function getRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || 'unknown';
  } catch (err) {
    console.error('Failed to decode token:', err);
    return 'unknown';
  }
}
