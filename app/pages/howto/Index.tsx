import { Helmet } from "react-helmet-async";
import { Play, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@orderly.network/ui";

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl?: string; // YouTube embed URL (will be added later)
}

const tutorials: VideoTutorial[] = [
  {
    id: "1",
    title: "How to Deposit",
    description: "Learn how to deposit funds into your COIN360 account and get started with trading.",
    duration: "3:24",
    thumbnail: "https://img.youtube.com/vi/6IdkGbk4SXU/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/6IdkGbk4SXU",
  },
  {
    id: "2",
    title: "How to Swap, Check Markets, and Trade",
    description: "Discover how to swap tokens, check market data, and trade perpetual futures on COIN360 Perp DEX.",
    duration: "4:52",
    thumbnail: "https://img.youtube.com/vi/8jiuILbHZ3E/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/8jiuILbHZ3E",
  },
  {
    id: "3",
    title: "How to Earn Yield, Withdraw, and Get Referral Link",
    description: "Learn how to earn yield on your assets, withdraw funds, and get your referral link on COIN360 Perp DEX.",
    duration: "3:18",
    thumbnail: "https://img.youtube.com/vi/nhZssJlQHIw/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/nhZssJlQHIw",
  },
];

export default function HowToIndex() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial>(tutorials[0]);

  return (
    <>
      <Helmet>
        <title>How To - Tutorial Videos</title>
        <meta name="description" content="Learn how to use our DEX with step-by-step video tutorials" />
      </Helmet>

      <div className="oui-w-full oui-h-full oui-overflow-y-auto oui-bg-base-9">
        <div className="oui-max-w-[1200px] oui-mx-auto oui-px-4 sm:oui-px-6 lg:oui-px-8 oui-py-8">
          {/* Header */}
          <div className="oui-mb-8 oui-text-center">
            <h1 className="oui-text-4xl oui-font-bold oui-text-base-contrast-80 oui-mb-3">
              How To Use Our DEX
            </h1>
            <p className="oui-text-lg oui-text-base-contrast-54">
              Watch these quick tutorials to get started and master trading on our platform
            </p>
          </div>

          {/* Video Player with Sidebar */}
          <div className="oui-flex oui-flex-col lg:oui-flex-row oui-gap-6 oui-w-full">
            {/* Main Video Player */}
            <div className="oui-flex-1 oui-min-w-0">
              <div className="oui-bg-base-8 oui-rounded-lg oui-border oui-border-line-12 oui-overflow-hidden">
                {/* Video */}
                <div className="oui-w-full oui-bg-black" style={{ height: "500px" }}>
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    className="oui-w-full oui-h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Video Info */}
                <div className="oui-p-6">
                  <div className="oui-flex oui-items-center oui-gap-2 oui-mb-3">
                    <Clock className="oui-w-4 oui-h-4 oui-text-base-contrast-54" />
                    <span className="oui-text-sm oui-text-base-contrast-54">{selectedVideo.duration}</span>
                  </div>
                  <h2 className="oui-text-2xl oui-font-bold oui-text-base-contrast-80 oui-mb-3">
                    {selectedVideo.title}
                  </h2>
                  <p className="oui-text-base-contrast-54">{selectedVideo.description}</p>
                </div>
              </div>

              {/* Additional Help Section - Desktop */}
              <div className="oui-hidden lg:oui-block oui-mt-6 oui-p-6 oui-bg-base-8 oui-rounded-lg oui-border oui-border-line-12">
                <h2 className="oui-text-xl oui-font-semibold oui-text-base-contrast-80 oui-mb-3">
                  Need More Help?
                </h2>
                <p className="oui-text-base-contrast-54 oui-mb-4">
                  If you have questions or need additional support, check out our documentation or join our community.
                </p>
                <div className="oui-flex oui-gap-3 oui-flex-wrap">
                  <a
                    href="https://orderly.network/docs/home"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="oui-px-4 oui-py-2 oui-bg-base-7 hover:oui-bg-base-6 oui-rounded oui-text-base-contrast-80 oui-no-underline oui-transition-colors"
                  >
                    Read Documentation
                  </a>
                  <a
                    href="https://discord.gg/orderly"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="oui-px-4 oui-py-2 oui-bg-base-7 hover:oui-bg-base-6 oui-rounded oui-text-base-contrast-80 oui-no-underline oui-transition-colors"
                  >
                    Join Discord
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar - Video List */}
            <div className="lg:oui-w-[400px] oui-flex-shrink-0" style={{ width: '400px' }}>
              <div className="oui-bg-base-8 oui-rounded-lg oui-border oui-border-line-12 oui-p-3 lg:oui-sticky lg:oui-top-4">
                <h3 className="oui-text-lg oui-font-semibold oui-text-base-contrast-80 oui-mb-4">
                  All Tutorials
                </h3>
                <div className="oui-space-y-3">
                  {tutorials.map((tutorial, index) => (
                    <VideoListItem
                      key={tutorial.id}
                      tutorial={tutorial}
                      index={index + 1}
                      isActive={selectedVideo.id === tutorial.id}
                      onClick={() => setSelectedVideo(tutorial)}
                    />
                  ))}
                </div>
              </div>

              {/* Additional Help Section - Mobile */}
              <div className="lg:oui-hidden oui-mt-6 oui-p-6 oui-bg-base-8 oui-rounded-lg oui-border oui-border-line-12">
                <h2 className="oui-text-xl oui-font-semibold oui-text-base-contrast-80 oui-mb-3">
                  Need More Help?
                </h2>
                <p className="oui-text-base-contrast-54 oui-mb-4">
                  If you have questions or need additional support, check out our documentation or join our community.
                </p>
                <div className="oui-flex oui-gap-3 oui-flex-wrap">
                  <a
                    href="https://docs.orderly.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="oui-px-4 oui-py-2 oui-bg-base-7 hover:oui-bg-base-6 oui-rounded oui-text-base-contrast-80 oui-no-underline oui-transition-colors"
                  >
                    Read Documentation
                  </a>
                  <a
                    href="https://discord.gg/orderly"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="oui-px-4 oui-py-2 oui-bg-base-7 hover:oui-bg-base-6 oui-rounded oui-text-base-contrast-80 oui-no-underline oui-transition-colors"
                  >
                    Join Discord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface VideoListItemProps {
  tutorial: VideoTutorial;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

function VideoListItem({ tutorial, index, isActive, onClick }: VideoListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "oui-w-full oui-flex oui-gap-3 oui-p-3 oui-rounded-lg oui-transition-all",
        "oui-text-left oui-border",
        isActive
          ? "oui-bg-primary/10 oui-border-primary"
          : "oui-bg-base-7 oui-border-transparent hover:oui-bg-base-6 hover:oui-border-line-8"
      )}
    >
      {/* Thumbnail */}
      <div className="oui-relative oui-flex-shrink-0 oui-w-24 oui-aspect-video oui-rounded oui-overflow-hidden oui-bg-base-6">
        <img
          src={tutorial.thumbnail}
          alt={tutorial.title}
          className="oui-w-full oui-h-full oui-object-cover"
        />
        {/* Play Indicator */}
        <div className="oui-absolute oui-inset-0 oui-flex oui-items-center oui-justify-center oui-bg-black/30">
          {isActive ? (
            <div className="oui-w-6 oui-h-6 oui-rounded-full oui-bg-primary oui-flex oui-items-center oui-justify-center">
              <Play className="oui-w-3 oui-h-3 oui-text-white oui-fill-white oui-ml-0.5" />
            </div>
          ) : (
            <Play className="oui-w-6 oui-h-6 oui-text-white oui-opacity-80" />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="oui-flex-1 oui-min-w-0">
        <div className="oui-flex oui-items-start oui-gap-2 oui-mb-1">
          <span className={cn(
            "oui-flex-shrink-0 oui-text-xs oui-font-semibold",
            isActive ? "oui-text-primary" : "oui-text-base-contrast-36"
          )}>
            {index}.
          </span>
          <h4 className={cn(
            "oui-text-sm oui-font-semibold oui-line-clamp-2",
            isActive ? "oui-text-primary" : "oui-text-base-contrast-80"
          )}>
            {tutorial.title}
          </h4>
        </div>
        <div className="oui-flex oui-items-center oui-gap-1 oui-ml-5">
          <Clock className="oui-w-3 oui-h-3 oui-text-base-contrast-54" />
          <span className="oui-text-xs oui-text-base-contrast-54">{tutorial.duration}</span>
        </div>
      </div>
    </button>
  );
}

