import {jwtDecode} from 'jwt-decode';

export function getToken() {
  return localStorage.getItem('token');
}

export function decodeToken() {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function isAuthenticated() {
  return !! decodeToken();
}

export function getBusinessId() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.business_id || null; // adjust key if needed
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}


export function getUserId() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.user_id || null;
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
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
