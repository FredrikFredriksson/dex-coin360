export const DEFAULT_SYMBOL = "PERP_ETH_USDC";
export const ORDERLY_SYMBOL_KEY = "orderly-current-symbol";
export const WELCOME_MODAL_KEY = "orderly-has-seen-welcome";

export function getSymbol() {
  return localStorage.getItem(ORDERLY_SYMBOL_KEY) || DEFAULT_SYMBOL;
}

export function updateSymbol(symbol: string) {
  localStorage.setItem(ORDERLY_SYMBOL_KEY, symbol || DEFAULT_SYMBOL);
}

// Cookie utility functions
function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function getHasSeenWelcome(): boolean {
  return getCookie(WELCOME_MODAL_KEY) === "true";
}

export function setHasSeenWelcome(): void {
  // Set cookie for 1 year (365 days)
  setCookie(WELCOME_MODAL_KEY, "true", 365);
}
