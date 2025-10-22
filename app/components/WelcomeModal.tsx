import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@orderly.network/ui";
import { getHasSeenWelcome, setHasSeenWelcome } from "@/utils/storage";

interface TutorialVideo {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
}

const tutorialVideos: TutorialVideo[] = [
  {
    id: "1",
    title: "How to Deposit",
    youtubeId: "6IdkGbk4SXU",
    thumbnail: "https://img.youtube.com/vi/6IdkGbk4SXU/hqdefault.jpg",
  },
  {
    id: "2",
    title: "Swap, Markets & Trade",
    youtubeId: "8jiuILbHZ3E",
    thumbnail: "https://img.youtube.com/vi/8jiuILbHZ3E/hqdefault.jpg",
  },
  {
    id: "3",
    title: "Yield, Withdraw & Referral",
    youtubeId: "nhZssJlQHIw",
    thumbnail: "https://img.youtube.com/vi/nhZssJlQHIw/hqdefault.jpg",
  },
];

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen the welcome modal
    const hasSeenWelcome = getHasSeenWelcome();
    if (!hasSeenWelcome) {
      // Small delay before showing modal for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (dontShowAgain: boolean = false) => {
    setIsOpen(false);
    setIsVideoPlaying(false);
    if (dontShowAgain) {
      setHasSeenWelcome();
    }
  };

  const handleWatchTutorials = () => {
    setHasSeenWelcome();
    setIsOpen(false);
    navigate("/how-to");
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsVideoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % tutorialVideos.length);
    setIsVideoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + tutorialVideos.length) % tutorialVideos.length);
    setIsVideoPlaying(false);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="oui-fixed oui-inset-0 oui-z-[100] oui-flex oui-items-center oui-justify-center oui-p-4 oui-bg-black/60 oui-backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
        <div
          className={cn(
            "oui-relative oui-w-full oui-bg-base-8",
            "oui-rounded-2xl oui-shadow-2xl oui-overflow-hidden",
            "oui-border oui-border-line-12",
            "oui-animate-in oui-fade-in oui-zoom-in-95 oui-duration-200"
          )}
          style={{ maxWidth: '650px' }}
          role="dialog"
        >
        {/* Close Button */}
        <button
          onClick={() => handleClose(false)}
          className="oui-absolute oui-top-4 oui-right-4 oui-z-10 oui-w-8 oui-h-8 oui-rounded-full oui-bg-base-7 hover:oui-bg-base-6 oui-flex oui-items-center oui-justify-center oui-text-base-contrast-54 hover:oui-text-base-contrast-80 oui-transition-colors"
          aria-label="Close"
        >
          <X className="oui-w-5 oui-h-5" />
        </button>

        {/* Header */}
        <div className="oui-px-6 oui-pt-6 oui-pb-4 oui-text-center">
          <h2 id="welcome-modal-title" className="oui-text-2xl oui-font-bold oui-text-base-contrast-80 oui-mb-2">
            Welcome to Our DEX!
          </h2>
          <p className="oui-text-sm oui-text-base-contrast-54">
            Watch our quick tutorial videos to learn how to trade like a pro.
          </p>
        </div>

        {/* Video Carousel */}
        <div className="oui-px-6 oui-pb-4">
          <div className="oui-relative oui-rounded-lg oui-overflow-hidden oui-border oui-border-line-12 oui-bg-base-7" style={{ height: "300px" }}>
            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="oui-absolute oui-left-2 oui-top-1/2 oui-transform oui--translate-y-1/2 oui-w-8 oui-h-8 oui-rounded-full oui-bg-white/90 hover:oui-bg-white oui-flex oui-items-center oui-justify-center oui-transition-colors oui-shadow-lg oui-z-10"
            >
              <ChevronLeft className="oui-w-5 oui-h-5" style={{ color: '#000000' }} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="oui-absolute oui-right-2 oui-top-1/2 oui-transform oui--translate-y-1/2 oui-w-8 oui-h-8 oui-rounded-full oui-bg-white/90 hover:oui-bg-white oui-flex oui-items-center oui-justify-center oui-transition-colors oui-shadow-lg oui-z-10"
            >
              <ChevronRight className="oui-w-5 oui-h-5" style={{ color: '#000000' }} />
            </button>

            {/* Video Container with Transition */}
            <div 
              className="oui-relative oui-w-full oui-h-full oui-transition-transform oui-duration-300 oui-ease-in-out"
              style={{ 
                transform: `translateX(-${currentSlide * 100}%)`,
                display: 'flex'
              }}
            >
              {tutorialVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="oui-relative oui-w-full oui-h-full oui-flex-shrink-0"
                >
                  {isVideoPlaying && index === currentSlide ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title={video.title}
                      className="oui-w-full oui-h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="oui-w-full oui-h-full oui-object-cover"
                      />
                      <div className="oui-absolute oui-inset-0 oui-bg-black/30 oui-flex oui-items-center oui-justify-center">
                        <button
                          onClick={handleVideoPlay}
                          className="w-14 h-14 oui-rounded-full oui-bg-primary hover:oui-bg-primary-darken oui-flex oui-items-center oui-justify-center oui-transition-colors oui-shadow-lg"
                        >
                          <Play className="w-8 h-8 oui-text-white oui-fill-white oui-ml-1" />
                        </button>
                      </div>
                      <div className="oui-absolute oui-bottom-0 oui-left-0 oui-right-0 oui-p-4 oui-bg-gradient-to-t oui-from-white/90 oui-to-transparent">
                        <h3 className="oui-text-lg oui-font-bold oui-mb-1" style={{ color: '#000000' }}>
                          {video.title}
                        </h3>
                        <p className="oui-text-sm" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
                          Click to play this tutorial
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="oui-flex oui-justify-center oui-gap-2 oui-mt-4">
            {tutorialVideos.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={cn(
                  "oui-w-2 oui-h-2 oui-rounded-full oui-transition-colors",
                  index === currentSlide
                    ? "oui-bg-primary"
                    : "oui-bg-base-contrast-36 hover:oui-bg-base-contrast-54"
                )}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="oui-px-6 oui-pb-6 oui-flex oui-flex-col sm:oui-flex-row oui-gap-3">
          <button
            onClick={handleWatchTutorials}
            className={cn(
              "oui-flex-1 oui-px-6 oui-py-3 oui-rounded-lg",
              "oui-bg-primary hover:oui-bg-primary-darken",
              "oui-text-white oui-font-semibold",
              "oui-transition-colors oui-duration-200"
            )}
          >
            Watch Tutorials
          </button>
          <button
            onClick={() => handleClose(true)}
            className={cn(
              "oui-flex-1 oui-px-6 oui-py-3 oui-rounded-lg",
              "oui-bg-base-7 hover:oui-bg-base-6",
              "oui-text-base-contrast-80 oui-font-semibold",
              "oui-transition-colors oui-duration-200"
            )}
          >
            Maybe Later
          </button>
        </div>

        {/* Footer Note */}
        <div className="oui-px-6 oui-pb-4 oui-text-center">
          <p className="oui-text-xs oui-text-base-contrast-36">
            You can always access these tutorials from the &quot;How To&quot; menu
          </p>
        </div>
      </div>
    </div>
  );
}

