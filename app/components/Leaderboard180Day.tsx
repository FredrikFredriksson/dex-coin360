import { useState } from "react";
import { use180DayLeaderboard } from "@/hooks/use180DayLeaderboard";
import { LoadingSpinner } from "./LoadingSpinner";

type SortType = "ascending_realized_pnl" | "descending_realized_pnl" | "ascending_perp_volume" | "descending_perp_volume";

export function Leaderboard180Day() {
  const [sort, setSort] = useState<SortType>("descending_realized_pnl");
  const [page, setPage] = useState(1);
  const size = 20;

  const { data, isLoading, error } = use180DayLeaderboard(sort, page, size);

  const formatAddress = (address: string) => {
    if (!address) return "-";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatNumber = (value: number | undefined) => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleSortChange = (newSort: SortType) => {
    if (sort === newSort) {
      // Toggle between ascending and descending if clicking the same column
      if (newSort === "descending_realized_pnl") {
        setSort("ascending_realized_pnl");
      } else if (newSort === "ascending_realized_pnl") {
        setSort("descending_realized_pnl");
      } else if (newSort === "descending_perp_volume") {
        setSort("ascending_perp_volume");
      } else if (newSort === "ascending_perp_volume") {
        setSort("descending_perp_volume");
      }
    } else {
      setSort(newSort);
    }
    setPage(1);
  };

  return (
    <div className="oui-mt-8">
      <h2 className="oui-text-xl oui-font-semibold oui-mb-4 oui-text-base-contrast">
        180-Day Leaderboard
      </h2>
      
      {error && (
        <div className="oui-p-4 oui-mb-4 oui-bg-danger-10 oui-text-danger oui-rounded-lg">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="oui-flex oui-justify-center oui-items-center oui-py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="oui-overflow-x-auto">
            <table className="oui-w-full oui-border-collapse">
              <thead>
                <tr className="oui-border-b oui-border-base-contrast-12">
                  <th className="oui-px-4 oui-py-3 oui-text-left oui-text-sm oui-font-medium oui-text-base-contrast-54">
                    Rank
                  </th>
                  <th className="oui-px-4 oui-py-3 oui-text-left oui-text-sm oui-font-medium oui-text-base-contrast-54">
                    Address
                  </th>
                  <th
                    className="oui-px-4 oui-py-3 oui-text-right oui-text-sm oui-font-medium oui-text-base-contrast-54 oui-cursor-pointer hover:oui-text-base-contrast"
                    onClick={() => handleSortChange("descending_realized_pnl")}
                  >
                    Realized PnL
                    {sort === "descending_realized_pnl" && " ↓"}
                    {sort === "ascending_realized_pnl" && " ↑"}
                  </th>
                  <th
                    className="oui-px-4 oui-py-3 oui-text-right oui-text-sm oui-font-medium oui-text-base-contrast-54 oui-cursor-pointer hover:oui-text-base-contrast"
                    onClick={() => handleSortChange("descending_perp_volume")}
                  >
                    Perp Volume
                    {sort === "descending_perp_volume" && " ↓"}
                    {sort === "ascending_perp_volume" && " ↑"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="oui-px-4 oui-py-8 oui-text-center oui-text-base-contrast-54">
                      No data available
                    </td>
                  </tr>
                ) : (
                  data.map((entry, index) => {
                    const rank = (page - 1) * size + index + 1;
                    const pnl = entry.realized_pnl || 0;
                    const volume = entry.perp_volume || 0;
                    const isPositive = pnl >= 0;

                    return (
                      <tr
                        key={entry.address}
                        className="oui-border-b oui-border-base-contrast-12 hover:oui-bg-base-contrast-6"
                      >
                        <td className="oui-px-4 oui-py-3 oui-text-sm oui-text-base-contrast">
                          {rank}
                        </td>
                        <td className="oui-px-4 oui-py-3 oui-text-sm oui-text-base-contrast oui-font-mono">
                          {formatAddress(entry.address)}
                        </td>
                        <td
                          className={`oui-px-4 oui-py-3 oui-text-sm oui-text-right ${
                            isPositive ? "oui-text-profit" : "oui-text-loss"
                          }`}
                        >
                          {formatNumber(pnl)}
                        </td>
                        <td className="oui-px-4 oui-py-3 oui-text-sm oui-text-right oui-text-base-contrast">
                          {formatNumber(volume)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="oui-flex oui-justify-between oui-items-center oui-mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="oui-px-4 oui-py-2 oui-rounded oui-bg-base-contrast-12 hover:oui-bg-base-contrast-20 disabled:oui-opacity-50 disabled:oui-cursor-not-allowed oui-text-base-contrast"
            >
              Previous
            </button>
            <span className="oui-text-sm oui-text-base-contrast-54">
              Page {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={data.length < size || isLoading}
              className="oui-px-4 oui-py-2 oui-rounded oui-bg-base-contrast-12 hover:oui-bg-base-contrast-20 disabled:oui-opacity-50 disabled:oui-cursor-not-allowed oui-text-base-contrast"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}


