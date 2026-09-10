import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Eye, Flame, Sparkles } from 'lucide-react';
import { Story24H } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface Story24hViewerModalProps {
  stories: Story24H[];
  initialStoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsViewed: (storyId: string) => void;
}

export const Story24hViewerModal: React.FC<Story24hViewerModalProps> = ({
  stories,
  initialStoryId,
  isOpen,
  onClose,
  onMarkAsViewed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [reactions, setReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const timerRef = useRef<number | null>(null);

  // Sync index with initialStoryId
  useEffect(() => {
    if (initialStoryId && stories.length > 0) {
      const idx = stories.findIndex((s) => s.id === initialStoryId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [initialStoryId, stories]);

  const currentStory = stories[currentIndex];

  // Play atmospheric sound effect on story switch
  useEffect(() => {
    if (!isOpen || !currentStory) return;

    onMarkAsViewed(currentStory.id);
    setProgress(0);

    if (!isMuted) {
      if (currentStory.ambientSound === 'footsteps') {
        audioEngine.playSFX('footsteps');
      } else if (currentStory.ambientSound === 'screams') {
        audioEngine.playSFX('screams');
      } else if (currentStory.ambientSound === 'wind') {
        audioEngine.playSFX('creak');
      } else if (currentStory.ambientSound === 'heartbeat') {
        audioEngine.playSFX('heartbeat');
      } else if (currentStory.ambientSound === 'creak') {
        audioEngine.playSFX('creak');
      } else if (currentStory.ambientSound === 'jumpscare') {
        audioEngine.playSFX('jumpscare');
      } else {
        audioEngine.playSFX('whisper');
      }
    }
  }, [currentIndex, isOpen, isMuted, currentStory?.id]);

  // Story Progress Timer (6 seconds)
  useEffect(() => {
    if (!isOpen || isPaused || !currentStory) return;

    const intervalTime = 50; // Update every 50ms
    const totalDuration = 6500; // 6.5s per story
    const step = (intervalTime / totalDuration) * 100;

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story or close if last
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPaused, currentIndex, stories.length, currentStory]);

  if (!isOpen || !currentStory) return null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
      setProgress(0);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleSendReaction = (emoji: string) => {
    audioEngine.playSFX('heartbeat');
    const newReaction = {
      id: Date.now(),
      emoji,
      x: 30 + Math.random() * 40,
    };
    setReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 1800);
  };

  // Calculate remaining hours
  const remainingHours = Math.max(
    1,
    Math.round((currentStory.expiresAt - Date.now()) / (1000 * 60 * 60))
  );

  return (
    <div
      id="story-24h-viewer"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center select-none"
      onClick={handleNext}
    >
      {/* Floating Animated Reactions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
        {reactions.map((r) => (
          <span
            key={r.id}
            style={{ left: `${r.x}%` }}
            className="absolute bottom-20 text-4xl animate-[bounce_1.5s_ease-out_forwards] transition-all opacity-90"
          >
            {r.emoji}
          </span>
        ))}
      </div>

      {/* Main Container Phone Frame / Card */}
      <div
        className="relative w-full max-w-md h-[92vh] max-h-[820px] rounded-3xl overflow-hidden bg-[#111012] border border-red-900/40 shadow-[0_0_40px_rgba(220,38,38,0.3)] flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Image / Media */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentStory.mediaUrl}
            alt={currentStory.authorName}
            className="w-full h-full object-cover brightness-[0.75] contrast-[1.1]"
            referrerPolicy="no-referrer"
          />
          {/* Dark Red Atmospheric Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
        </div>

        {/* Top Header: Progress Bars & Author Details */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5 w-full">
            {stories.map((s, idx) => {
              let width = '0%';
              if (idx < currentIndex) width = '100%';
              else if (idx === currentIndex) width = `${progress}%`;

              return (
                <div
                  key={s.id}
                  className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden"
                >
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-75"
                    style={{ width }}
                  />
                </div>
              );
            })}
          </div>

          {/* Author info & Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full p-0.5 bg-red-600 border border-red-400 overflow-hidden shadow-[0_0_10px_rgba(220,38,38,0.7)]">
                <img
                  src={currentStory.authorAvatar}
                  alt={currentStory.authorName}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white leading-tight">
                    {currentStory.authorName}
                  </span>
                  {currentStory.isMine && (
                    <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                      قصتي
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#ac8884]">
                  <span>{currentStory.authorBadge || 'كاتب رعب'}</span>
                  <span>•</span>
                  <span className="text-red-400 font-mono">
                    ينتهي بعد {remainingHours.toLocaleString('ar-EG')} ساعة
                  </span>
                </div>
              </div>
            </div>

            {/* Controls: Audio Mute & Close */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsMuted((prev) => !prev)}
                className="w-8 h-8 rounded-full bg-black/50 text-white hover:bg-red-950 flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
                title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-[#ac8884]" /> : <Volume2 className="w-4 h-4 text-red-400" />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/50 text-white hover:bg-red-900 flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Story Body Caption */}
        <div className="relative z-20 px-6 pb-6 pt-16 flex flex-col justify-end space-y-4">
          <div className="p-4 rounded-2xl bg-[#141316]/80 backdrop-blur-md border border-red-900/40 shadow-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span>مؤثر صوتي مفعّل ({currentStory.ambientSound})</span>
            </div>
            <p className="text-sm md:text-base text-white font-serif leading-relaxed select-text">
              {currentStory.caption}
            </p>
          </div>

          {/* Quick Reactions Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#ac8884] flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-red-400" />
                <span>{currentStory.viewsCount.toLocaleString('ar-EG')} مشاهدة</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {['😱', '🩸', '💀', '🕯️'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleSendReaction(emoji)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600/60 active:scale-125 border border-white/10 flex items-center justify-center text-lg transition-transform cursor-pointer"
                  title="تفاعل سريع"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation tap areas & Chevrons */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center border border-white/10 hover:bg-red-950 transition-all z-30 cursor-pointer ${
            currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-80 hover:opacity-100'
          }`}
          title="الكابوس السابق"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center border border-white/10 hover:bg-red-950 transition-all z-30 cursor-pointer opacity-80 hover:opacity-100"
          title="الكابوس التالي"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
