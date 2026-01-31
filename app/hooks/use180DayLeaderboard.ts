import { useState, useEffect } from "react";
import { getRuntimeConfig } from "@/utils/runtime-config";

interface LeaderboardEntry {
  address: string;
  realized_pnl?: number;
  perp_volume?: number;
  [key: string]: unknown;
}

interface LeaderboardResponse {
  success: boolean;
  data?: {
    rows?: LeaderboardEntry[];
    meta?: {
      total: number;
      page: number;
      size: number;
    };
  };
  rows?: LeaderboardEntry[]; // Alternative structure
  timestamp?: number;
  message?: string;
  error?: string;
}

interface Use180DayLeaderboardResult {
  data: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches leaderboard data for 180 days by making 2 API calls (90 days each)
 * and aggregating the results by address
 */
export function use180DayLeaderboard(
  sort: "ascending_realized_pnl" | "descending_realized_pnl" | "ascending_perp_volume" | "descending_perp_volume" = "descending_realized_pnl",
  page: number = 1,
  size: number = 100
): Use180DayLeaderboardResult {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const brokerId = getRuntimeConfig("VITE_ORDERLY_BROKER_ID");
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        
        // Calculate dates for two 90-day periods covering 180 days total
        // API requires dates to be within 90 days (inclusive)
        // When counting inclusively: from day N to day M, we have (M - N + 1) days
        // So for exactly 90 days: M - N = 89
        
        // First period: 180 days ago to 91 days ago (90 days inclusive)
        // Days: -180, -179, ..., -91 = 90 days
        const firstPeriodEnd = new Date(today);
        firstPeriodEnd.setTime(today.getTime() - 91 * 24 * 60 * 60 * 1000); // 91 days ago
        const firstPeriodStart = new Date(today);
        firstPeriodStart.setTime(today.getTime() - 180 * 24 * 60 * 60 * 1000); // 180 days ago

        // Second period: 90 days ago to yesterday (90 days inclusive)
        // Days: -90, -89, ..., -1 = 90 days
        const secondPeriodStart = new Date(today);
        secondPeriodStart.setTime(today.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
        const secondPeriodEnd = new Date(today);
        secondPeriodEnd.setTime(today.getTime() - 1 * 24 * 60 * 60 * 1000); // Yesterday

        const firstPeriodStartStr = firstPeriodStart.toISOString().split("T")[0];
        const firstPeriodEndStr = firstPeriodEnd.toISOString().split("T")[0];
        const secondPeriodStartStr = secondPeriodStart.toISOString().split("T")[0];
        const secondPeriodEndStr = secondPeriodEnd.toISOString().split("T")[0];

        // Build query parameters - fetch all data (no pagination in API calls)
        // Note: We don't pass sort to API since we'll sort after aggregation
        const buildQueryParams = (startDate: string, endDate: string) => {
          const params = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
            page: "1",
            size: "1000", // Fetch large number to get all entries
          });
          if (brokerId) {
            params.append("broker_id", brokerId);
          }
          return params.toString();
        };

        // Build URLs for debugging
        const firstUrl = `https://api.orderly.org/v1/broker/leaderboard/daily?${buildQueryParams(firstPeriodStartStr, firstPeriodEndStr)}`;
        const secondUrl = `https://api.orderly.org/v1/broker/leaderboard/daily?${buildQueryParams(secondPeriodStartStr, secondPeriodEndStr)}`;

        console.log("Fetching first period:", firstUrl);
        console.log("Fetching second period:", secondUrl);

        // Make both API calls in parallel
        const [firstResponse, secondResponse] = await Promise.all([
          fetch(firstUrl),
          fetch(secondUrl),
        ]);

        // Check HTTP status
        if (!firstResponse.ok) {
          const firstErrorText = await firstResponse.text();
          console.error("First API call failed:", firstResponse.status, firstErrorText);
          throw new Error(`First API call failed: ${firstResponse.status} - ${firstErrorText}`);
        }

        if (!secondResponse.ok) {
          const secondErrorText = await secondResponse.text();
          console.error("Second API call failed:", secondResponse.status, secondErrorText);
          throw new Error(`Second API call failed: ${secondResponse.status} - ${secondErrorText}`);
        }

        const firstData: LeaderboardResponse = await firstResponse.json();
        const secondData: LeaderboardResponse = await secondResponse.json();

        console.log("First API response:", firstData);
        console.log("Second API response:", secondData);

        if (!firstData.success) {
          const errorMsg = (firstData as unknown as { message?: string; error?: string }).message || 
                          (firstData as unknown as { error?: string }).error || 
                          "Unknown error";
          throw new Error(`First API returned unsuccessful response: ${errorMsg}`);
        }

        if (!secondData.success) {
          const errorMsg = (secondData as unknown as { message?: string; error?: string }).message || 
                          (secondData as unknown as { error?: string }).error || 
                          "Unknown error";
          throw new Error(`Second API returned unsuccessful response: ${errorMsg}`);
        }

        // Extract rows from response (handle different response structures)
        const firstRows = firstData.data?.rows || firstData.rows || [];
        const secondRows = secondData.data?.rows || secondData.rows || [];

        if (!Array.isArray(firstRows) || !Array.isArray(secondRows)) {
          console.error("Unexpected data structure - rows not an array:", { firstRows, secondRows });
          throw new Error("API returned unexpected data structure - rows is not an array");
        }

        // Aggregate data by address
        const aggregatedMap = new Map<string, LeaderboardEntry>();

        // Process first period
        firstRows.forEach((entry) => {
          const existing = aggregatedMap.get(entry.address);
          if (existing) {
            existing.realized_pnl = (existing.realized_pnl || 0) + (entry.realized_pnl || 0);
            existing.perp_volume = (existing.perp_volume || 0) + (entry.perp_volume || 0);
          } else {
            aggregatedMap.set(entry.address, {
              ...entry,
              realized_pnl: entry.realized_pnl || 0,
              perp_volume: entry.perp_volume || 0,
            });
          }
        });

        // Process second period
        secondRows.forEach((entry) => {
          const existing = aggregatedMap.get(entry.address);
          if (existing) {
            existing.realized_pnl = (existing.realized_pnl || 0) + (entry.realized_pnl || 0);
            existing.perp_volume = (existing.perp_volume || 0) + (entry.perp_volume || 0);
          } else {
            aggregatedMap.set(entry.address, {
              ...entry,
              realized_pnl: entry.realized_pnl || 0,
              perp_volume: entry.perp_volume || 0,
            });
          }
        });

        // Convert map to array and sort
        let aggregatedArray = Array.from(aggregatedMap.values());

        // Sort based on the sort parameter
        if (sort === "descending_realized_pnl") {
          aggregatedArray.sort((a, b) => (b.realized_pnl || 0) - (a.realized_pnl || 0));
        } else if (sort === "ascending_realized_pnl") {
          aggregatedArray.sort((a, b) => (a.realized_pnl || 0) - (b.realized_pnl || 0));
        } else if (sort === "descending_perp_volume") {
          aggregatedArray.sort((a, b) => (b.perp_volume || 0) - (a.perp_volume || 0));
        } else if (sort === "ascending_perp_volume") {
          aggregatedArray.sort((a, b) => (a.perp_volume || 0) - (b.perp_volume || 0));
        }

        // Apply pagination
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const paginatedData = aggregatedArray.slice(startIndex, endIndex);

        setData(paginatedData);
      } catch (err) {
        console.error("Error fetching 180-day leaderboard:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [sort, page, size]);

  return { data, isLoading, error };
}

