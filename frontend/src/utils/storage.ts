const ACCESS_TOKEN_KEY = "ihec_connect_token";
const CURRENT_USER_KEY = "ihec_connect_user";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: unknown) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function clearAuthStorage() {
  clearAccessToken();
  clearStoredUser();
}
