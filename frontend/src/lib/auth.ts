export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem("fleet_access_token");
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("fleet_access_token", token);
  }
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("fleet_access_token");
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}
