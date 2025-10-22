export const DEFAULT_SYMBOL = "PERP_ETH_USDC";
export const ORDERLY_SYMBOL_KEY = "orderly-current-symbol";
export const WELCOME_MODAL_KEY = "orderly-has-seen-welcome";

export function getSymbol() {
  return localStorage.getItem(ORDERLY_SYMBOL_KEY) || DEFAULT_SYMBOL;
}

export function updateSymbol(symbol: string) {
  localStorage.setItem(ORDERLY_SYMBOL_KEY, symbol || DEFAULT_SYMBOL);
}

export function getHasSeenWelcome(): boolean {
  return localStorage.getItem(WELCOME_MODAL_KEY) === "true";
}

export function setHasSeenWelcome(): void {
  localStorage.setItem(WELCOME_MODAL_KEY, "true");
}
