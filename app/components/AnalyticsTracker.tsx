import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageview } from "@/utils/analytics";

/**
 * Sends page_view on route change (same pattern as coin360.com: pageview(router.asPath)).
 * Renders nothing. Mount once inside the router (e.g. in App).
 */
export function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname + location.search;
    pageview(path);
  }, [location.pathname, location.search]);

  return null;
}
