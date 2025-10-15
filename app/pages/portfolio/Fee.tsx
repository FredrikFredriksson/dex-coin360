import { generatePageTitle } from "@/utils/utils";
import { getPageMeta } from "@/utils/seo";
import { renderSEOTags } from "@/utils/seo-tags";
import { FeeTierModule } from "@orderly.network/portfolio";
import { useAccountInfo, usePrivateQuery } from "@orderly.network/hooks";

// Your actual broker fee tier configuration
const brokerFeeTierData = [
  {
    tier: "1",
    volume_min: 0,
    volume_max: 500000,
    maker_fee: 0.03,
    taker_fee: 0.06,
  },
  {
    tier: "2", 
    volume_min: 500000,
    volume_max: 2500000,
    maker_fee: 0.02,
    taker_fee: 0.05,
  },
  {
    tier: "3",
    volume_min: 2500000,
    volume_max: 10000000,
    maker_fee: 0.015,
    taker_fee: 0.045,
  },
  {
    tier: "4",
    volume_min: 10000000,
    volume_max: 50000000,
    maker_fee: 0.01,
    taker_fee: 0.04,
  },
  {
    tier: "5",
    volume_min: 50000000,
    volume_max: 125000000,
    maker_fee: 0.005,
    taker_fee: 0.035,
  },
  {
    tier: "6",
    volume_min: 125000000,
    volume_max: null,
    maker_fee: 0,
    taker_fee: 0.03,
  },
];

// Type for client statistics response
interface ClientStatisticsResponse {
  days_since_registration: number;
  fees_paid_last_30_days: number;
  perp_fees_paid_last_30_days: number;
  perp_trading_volume_last_24_hours: number;
  perp_trading_volume_last_30_days: number;
  perp_trading_volume_ytd: number;
  trading_volume_last_24_hours: number;
  trading_volume_last_30_days: number;
  trading_volume_ytd: number;
  perp_trading_volume_last_7_days?: number;
  perp_trading_volume_ltd?: number;
}

export default function PortfolioFee() {
  const pageMeta = getPageMeta();
  const pageTitle = generatePageTitle("Fee");

  // Get user data
  const { data: accountInfo } = useAccountInfo();
  const { data: clientStats } = usePrivateQuery<ClientStatisticsResponse>("/v1/client/statistics");

  // Calculate user's actual tier based on your broker's volume thresholds
  const getUserCurrentTier = () => {
    if (!clientStats) return "1";
    
    const volume = clientStats.perp_trading_volume_last_30_days || 0;
    
    // Find tier based on your broker's volume thresholds
    for (let i = brokerFeeTierData.length - 1; i >= 0; i--) {
      const tier = brokerFeeTierData[i];
      if (volume >= tier.volume_min && (tier.volume_max === null || volume <= tier.volume_max)) {
        return tier.tier;
      }
    }
    return "1";
  };

  const userCurrentTier = getUserCurrentTier();
  const userVolume = clientStats?.perp_trading_volume_last_30_days || 0;

  // Format volume range for display
  const formatVolumeRange = (min: number, max: number | null) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
      }
      return num.toString();
    };

    if (max === null) {
      return `Above ${formatNumber(min)}`;
    }
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  // Format fee percentage
  const formatFee = (fee: number) => {
    return `${fee}%`;
  };

  // Console.log for debugging
  console.log("=== BROKER FEE TIER DATA ===");
  console.log("User Current Tier:", userCurrentTier);
  console.log("User Volume:", userVolume);
  console.log("Account Info:", accountInfo);
  console.log("Client Stats:", clientStats);

  return (
    <>
      {renderSEOTags(pageMeta, pageTitle)}
      <div className="fee-tier-page">
        <FeeTierModule.FeeTierPage 
          dataAdapter={() => ({
            columns: [
              {
                title: "Tier",
                dataIndex: "tier",
                key: "tier",
                align: "left",
              },
              {
                title: "30 day volume (USDC)",
                dataIndex: "volume_range",
                key: "volume_range",
                align: "left",
              },
              {
                title: "Maker",
                dataIndex: "maker_fee",
                key: "maker_fee",
                align: "center",
              },
              {
                title: "Taker",
                dataIndex: "taker_fee",
                key: "taker_fee",
                align: "right",
              },
            ],
            dataSource: brokerFeeTierData.map((tier) => ({
              key: tier.tier,
              tier: tier.tier,
              volume_range: formatVolumeRange(tier.volume_min, tier.volume_max),
              maker_fee: formatFee(tier.maker_fee),
              taker_fee: formatFee(tier.taker_fee),
            })),
          })}
        />
      </div>
    </>
  );
}