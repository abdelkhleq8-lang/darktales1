import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, Bookmark, Feather, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { Story, Comment } from '../types';
import { CustomSwitch } from './CustomSwitch';
import { CommentsSection } from './CommentsSection';
import { horrorSoundOptions } from '../data/sounds';
import { audioEngine } from '../utils/audioEngine';

interface StoryReaderModalProps {
  story: Story | null;
  isOpen: boolean;
  onClose: () => void;
  isAudioActive: boolean;
  onToggleAudio: (storyId: string, active: boolean) => void;
  onToggleLike: (storyId: string) => void;
  onToggleBookmark: (storyId: string) => void;
  comments: Comment[];
  onAddComment: (storyId: string, content: string) => void;
}

export const StoryReaderModal: React.FC<StoryReaderModalProps> = ({
  story,
  isOpen,
  onClose,
  isAudioActive,
  onToggleAudio,
  onToggleLike,
  onToggleBookmark,
  comments,
  onAddComment,
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Identify the exact sound chosen by the publisher from the 20 horror sound library
  const publisherSound = horrorSoundOptions.find(
    (opt) =>
      opt.id === story?.ambientAudio?.type ||
      opt.url === story?.audioUrl ||
      opt.name === story?.ambientAudio?.title
  ) || horrorSoundOptions[0];

  const soundType = publisherSound.id;
  const soundUrl = story?.audioUrl || publisherSound.url;

  // Stop all audio completely and reset currentTime to start
  const handleClose = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {
        // Ignore
      }
    }
    audioEngine.stop();
    if (story) {
      onToggleAudio(story.id, false);
    }
    onClose();
  };

  // Reader mute/unmute toggle: readers cannot change sound, only mute or unmute
  const handleToggleMute = (newActiveState: boolean) => {
    if (!story) return;

    if (!newActiveState) {
      // User muted the audio
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch {
          // Ignore
        }
      }
      audioEngine.stop();
      onToggleAudio(story.id, false);
    } else {
      // User unmuted the audio
      onToggleAudio(story.id, true);
      if (soundUrl && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          audioEngine.play(soundType, soundUrl);
        });
      } else {
        audioEngine.play(soundType, soundUrl);
      }
    }
  };

  // Auto-play on entry, immediate cutoff on exit/unmount, and Escape key listener
  useEffect(() => {
    if (!isOpen || !story) return;

    // 1. التشغيل التلقائي عند الدخول: بمجرد فتح نافذة القراءة تبدأ المؤثرات بالعمل تلقائياً
    onToggleAudio(story.id, true);

    if (soundUrl && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch(() => {
          // If HTMLAudio playback is restricted, smoothly fallback to Web Audio procedural synthesis
          audioEngine.play(soundType, soundUrl);
        });
    } else {
      audioEngine.play(soundType, soundUrl);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 2. الإيقاف التلقائي الفوري عند الخروج/التنقل بعيداً
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch {
          // Ignore
        }
      }
      audioEngine.stop();
      if (story) {
        onToggleAudio(story.id, false);
      }
    };
  }, [isOpen, story?.id]);

  if (!isOpen || !story) return null;

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-base leading-relaxed';
      case 'lg':
        return 'text-xl leading-loose';
      default:
        return 'text-lg leading-loose';
    }
  };

  return (
    <div
      id="story-reader-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex justify-center p-0 sm:p-4 animate-in fade-in duration-300"
    >
      {/* Floating Side Mute/Unmute Switch Button for Readers */}
      <aside
        aria-label="التحكم الجانبي بالصوت"
        className="fixed z-50 left-3 md:left-8 top-20 md:top-24 flex flex-col items-center gap-1.5 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          id="reader-side-mute-toggle"
          onClick={() => handleToggleMute(!isAudioActive)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-bold text-xs shadow-2xl transition-all cursor-pointer border active:scale-95 ${
            isAudioActive
              ? 'bg-red-950/95 text-red-200 border-red-600/80 shadow-[0_0_20px_rgba(220,38,38,0.5)] ring-2 ring-red-600/40'
              : 'bg-[#1e1d21]/95 text-zinc-400 border-white/10 hover:text-white hover:border-white/20'
          }`}
          title={isAudioActive ? 'اضغط لكتم المؤثرات الصوتية' : 'اضغط لتشغيل المؤثرات الصوتية'}
        >
          {isAudioActive ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <Volume2 className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">كتم الصوت الجانبي</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-zinc-400" />
              <span className="hidden sm:inline">تفعيل الصوت</span>
            </>
          )}
        </button>
        <span className="text-[10px] text-zinc-400 bg-black/80 px-2 py-0.5 rounded-md border border-white/5 shadow hidden md:inline">
          تحكم جانبي للقارئ
        </span>
      </aside>

      <div className="relative w-full max-w-2xl bg-[#121114] border-x sm:border border-red-900/30 sm:rounded-2xl min-h-screen sm:min-h-0 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
        {/* Top Sticky Bar */}
        <div className="sticky top-0 z-30 bg-[#161518]/95 backdrop-blur-xl border-b border-red-900/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl bg-[#252428] text-white hover:bg-red-900/50 transition-colors cursor-pointer"
              aria-label="إغلاق القارئ"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs text-[#ac8884] font-medium hidden sm:inline truncate max-w-[200px]">
              {story.title}
            </span>
          </div>

          {/* Reading Controls: Font Size and Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Audio Mute Toggle in Header */}
            <button
              type="button"
              onClick={() => handleToggleMute(!isAudioActive)}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isAudioActive
                  ? 'bg-red-950/80 text-red-300 border border-red-700/50'
                  : 'bg-[#252428] text-[#ac8884] hover:text-white'
              }`}
              title={isAudioActive ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
            >
              {isAudioActive ? (
                <>
                  <Volume2 className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="hidden md:inline">صوت مفعّل</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#ac8884]" />
                  <span className="hidden md:inline">مكتوم</span>
                </>
              )}
            </button>

            {/* Font Size Selector */}
            <div className="flex items-center rounded-lg bg-[#252428] p-1 text-xs">
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded font-mono cursor-pointer ${
                  fontSize === 'sm' ? 'bg-red-700 text-white' : 'text-[#ac8884]'
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('md')}
                className={`px-2 py-0.5 rounded font-mono cursor-pointer ${
                  fontSize === 'md' ? 'bg-red-700 text-white' : 'text-[#ac8884]'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded font-mono cursor-pointer ${
                  fontSize === 'lg' ? 'bg-red-700 text-white' : 'text-[#ac8884]'
                }`}
              >
                A+
              </button>
            </div>

            {/* Like */}
            <button
              type="button"
              onClick={() => onToggleLike(story.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                story.isLiked ? 'bg-red-900/70 text-red-400' : 'bg-[#252428] text-[#ac8884]'
              }`}
            >
              <Heart className={`w-4 h-4 ${story.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>

            {/* Bookmark */}
            <button
              type="button"
              onClick={() => onToggleBookmark(story.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                story.isSaved ? 'bg-red-900/70 text-red-400' : 'bg-[#252428] text-[#ac8884]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${story.isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Reader Body */}
        <div className="p-5 md:p-8 flex flex-col space-y-6 flex-1">
          {/* Cover Hero in Reader */}
          <div className="relative w-full h-52 md:h-64 rounded-xl overflow-hidden bg-black border border-red-950">
            <img
              src={story.coverImage}
              alt={story.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121114] via-transparent to-transparent" />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-red-950/80 border border-red-700/50 text-red-300 text-xs font-semibold">
                {story.categoryLabel}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-black/75 text-[#ac8884] text-xs">
                {story.readTimeMinutes} دقائق قراءة
              </span>
            </div>
          </div>

          {/* Title and Author */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {story.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-[#ac8884]">
              <Feather className="w-4 h-4 text-red-400" />
              <span>بقلم: <strong className="text-white">{story.author.name}</strong></span>
              {story.author.badge && (
                <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-400">
                  {story.author.badge}
                </span>
              )}
            </div>
          </div>

          {/* Publisher-Selected Audio Ambience Display & Reader Mute Control */}
          <div className="p-4 rounded-xl bg-[#1c1b1e] border border-red-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-950/80 border border-red-700/40 flex items-center justify-center text-2xl shrink-0">
                {publisherSound.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">
                    {publisherSound.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-900/40 border border-red-700/30 text-[10px] text-red-300 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-red-400" />
                    صوت مدمج بواسطة الناشر
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/50 border border-white/5 text-[10px] text-amber-300/90 font-mono">
                    {publisherSound.category} • {publisherSound.frequencyBand}
                  </span>
                </div>
                <p className="text-xs text-[#a0989c]">
                  {publisherSound.description} • تم ضبطه حصرياً بواسطة الناشر (يمكنك كتمه أو تفعيله جانباً)
                </p>
              </div>
            </div>

            {/* Reader's Mute/Unmute Switch */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
              <CustomSwitch
                id="reader-ambient-switch"
                checked={isAudioActive}
                onChange={handleToggleMute}
                label={isAudioActive ? 'المؤثرات تعمل' : 'الصوت مكتوم'}
                sublabel="زر جانبي لكتم الصوت للقارئ"
              />
            </div>
          </div>

          {/* Hidden audio element for story audioUrl */}
          {soundUrl && (
            <audio
              ref={audioRef}
              src={soundUrl}
              loop
              preload="auto"
            />
          )}

          {/* Narrative Content */}
          <div className={`text-[#d7d0d4] font-serif space-y-4 whitespace-pre-line select-text ${getFontSizeClass()}`}>
            {story.content}
          </div>

          <div className="my-6 border-t border-red-900/20" />

          {/* End of Story Warning & Disclaimer */}
          <div className="rounded-xl p-4 bg-red-950/30 border border-red-900/40 text-xs text-[#c8a09b] leading-relaxed">
            تم توثيق هذا الكابوس في أرشيف DarkTales. يُمنع إعادة النشر دون موافقة الكاتب المعتمد.
          </div>

          {/* Comments Section */}
          <CommentsSection
            storyId={story.id}
            storyTitle={story.title}
            comments={comments}
            onAddComment={onAddComment}
          />
        </div>
      </div>
    </div>
  );
};

