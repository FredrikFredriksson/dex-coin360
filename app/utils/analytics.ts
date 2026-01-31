/**
 * GTM + GA (gtag) analytics – same pattern as coin360.com
 * - Google Tag Manager script in head + noscript fallback
 * - gtag.js with GA4 config (send_page_view: false; we send pageview on route change)
 * - pageview(path) and event() for tracking
 */

import { getRuntimeConfig } from "./runtime-config";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "config" | "event" | "js",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

const GTM_KEY = "VITE_TAG_MANAGER";
const GA_KEY = "VITE_ANALYTICS";

function getGtmId(): string | undefined {
  return getRuntimeConfig(GTM_KEY) || undefined;
}

function getGaId(): string | undefined {
  return getRuntimeConfig(GA_KEY) || undefined;
}

let initialized = false;

/**
 * Initialize GTM and gtag (GA). Safe to call multiple times; runs once.
 * Call after runtime config is loaded (e.g. in main.tsx after loadRuntimeConfig()).
 */
export function initAnalytics(): void {
  if (typeof window === "undefined" || initialized) return;

  const gtmId = getGtmId();
  const gaId = getGaId();

  if (!gtmId && !gaId) return;

  window.dataLayer = window.dataLayer || [];

  const gtag: Window["gtag"] = function (
    command: "config" | "event" | "js",
    targetId: string,
    config?: Record<string, unknown>
  ): void {
    window.dataLayer!.push(arguments as unknown as unknown[]);
  };
  window.gtag = gtag;

  // GTM script (head)
  if (gtmId) {
    const gtmScript = document.createElement("script");
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.appendChild(gtmScript);

    // Noscript fallback (body)
    const noscript = document.createElement("noscript");
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
  }

  // gtag (GA4) – config with send_page_view: false so we send pageview on SPA route change
  if (gaId) {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + gaId;
    document.head.appendChild(gaScript);

    window.gtag("js", new Date() as unknown as string);
    window.gtag("config", gaId, {
      send_page_view: false,
    });
  }

  initialized = true;
}

/**
 * Send a page_view event (for initial load and on route change).
 * @param path – page path (e.g. router pathname + search, or pathname only)
 */
export function pageview(path: string): void {
  if (typeof window === "undefined" || !window.gtag) return;
  const gaId = getGaId();
  if (!gaId) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.origin + path,
  });
}

/**
 * Send a custom event to GA/GTM.
 */
export function event(
  name: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params as Record<string, unknown>);
}
