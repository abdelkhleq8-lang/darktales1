import React from 'react';
import { Flame, Headphones, Radio, Heart, Bookmark, Share2, ArrowLeft, Feather } from 'lucide-react';
import { Story } from '../types';
import { CustomSwitch } from './CustomSwitch';

interface FeaturedSpotlightProps {
  story: Story;
  isAudioActive: boolean;
  onToggleAudio: (storyId: string, active: boolean) => void;
  onToggleLike: (storyId: string) => void;
  onToggleBookmark: (storyId: string) => void;
  onStartReading: (story: Story) => void;
}

export const FeaturedSpotlight: React.FC<FeaturedSpotlightProps> = ({
  story,
  isAudioActive,
  onToggleAudio,
  onToggleLike,
  onToggleBookmark,
  onStartReading,
}) => {
  return (
    <section
      id="featured-spotlight-section"
      className="relative w-full rounded-2xl overflow-hidden bg-[#18171a]/95 backdrop-blur-2xl border border-red-900/30 shadow-[0_12px_40px_rgba(0,0,0,0.95),0_0_24px_rgba(220,38,38,0.2)] flex flex-col"
    >
      {/* Top Visual Mask: Celtic Raven Artwork */}
      <div className="relative w-full h-64 md:h-80 bg-[#0e0e10] overflow-hidden">
        <img
          src={story.coverImage}
          alt={story.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-110 transition-transform duration-700"
        />

        {/* Gradient Scrims & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18171a] via-[#18171a]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.25),transparent_65%)]" />

        {/* Badges on Hero */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-red-800/40 text-red-400 text-xs font-semibold uppercase flex items-center gap-1.5 shadow-lg">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
            الكابوس الأبرز
          </span>
        </div>

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg">
            <Headphones className="w-3.5 h-3.5 text-red-400" />
            صوت 3D • ٥ دقائق
          </span>
        </div>

        {/* Floating Quick Audio Capsule */}
        <div className="absolute bottom-3 inset-x-3 md:inset-x-4 rounded-xl bg-black/70 border border-red-900/30 backdrop-blur-md p-2.5 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-700/50 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            </div>
            <span className="text-xs text-white/90 truncate font-medium">
              {story.ambientAudio.title}
            </span>
          </div>
          <span className="text-xs text-red-400 font-mono font-semibold shrink-0 pr-2">
            {story.ambientAudio.duration}
          </span>
        </div>
      </div>

      {/* Spotlight Content Details */}
      <div className="p-4 md:p-6 flex flex-col space-y-3.5">
        {/* Author Tag and Subgenre */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-red-950 border border-red-800/50 flex items-center justify-center text-red-300">
              <Feather className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs md:text-sm text-[#c8c0c4] font-medium">
              الكاتبة: {story.author.name}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-800/50 text-red-300 text-xs font-medium">
            {story.subGenreLabel}
          </span>
        </div>

        {/* Big Title */}
        <h2
          onClick={() => onStartReading(story)}
          className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug cursor-pointer hover:text-red-300 transition-colors"
        >
          {story.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm md:text-base text-[#c8c0c4] leading-relaxed line-clamp-3 select-text">
          {story.excerpt}
        </p>

        {/* Custom Audio Atmosphere Switch */}
        <div className="p-3 rounded-xl bg-[#232226]/90 border border-white/5 backdrop-blur-md">
          <CustomSwitch
            id="featured-audio-switch"
            checked={isAudioActive}
            onChange={(checked) => onToggleAudio(story.id, checked)}
            label="تفعيل مؤثرات الرعب المحيطية"
            sublabel="أصوات رياح وصرير متفاعلة بتقنية الصوت المجسم"
            icon={<Headphones className="w-4 h-4" />}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-1 gap-3">
          <div className="flex items-center gap-2">
            <button
              id="featured-like-btn"
              type="button"
              onClick={() => onToggleLike(story.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all active:scale-90 ${
                story.isLiked
                  ? 'bg-red-950/80 border border-red-700/60 text-red-400 shadow-[0_0_12px_rgba(220,38,38,0.35)]'
                  : 'bg-[#252428] text-[#ac8884] hover:text-white hover:bg-[#2f2e34]'
              }`}
              aria-label="إعجاب بالقصة المميزة"
            >
              <Heart
                className={`w-4 h-4 ${
                  story.isLiked ? 'fill-red-500 text-red-500' : ''
                }`}
              />
              <span>{story.likesCount.toLocaleString('ar-EG')}</span>
            </button>

            <button
              id="featured-bookmark-btn"
              type="button"
              onClick={() => onToggleBookmark(story.id)}
              className={`p-2 rounded-xl transition-colors ${
                story.isSaved
                  ? 'bg-red-950/80 text-red-400 border border-red-800/50'
                  : 'bg-[#252428] text-[#ac8884] hover:text-white hover:bg-[#2f2e34]'
              }`}
              aria-label="حفظ القصة"
            >
              <Bookmark className={`w-4 h-4 ${story.isSaved ? 'fill-red-500' : ''}`} />
            </button>

            <button
              id="featured-share-btn"
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: story.title, text: story.excerpt, url: window.location.href });
                }
              }}
              className="p-2 rounded-xl bg-[#252428] text-[#ac8884] hover:text-white hover:bg-[#2f2e34] transition-colors"
              aria-label="مشاركة القصة"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <button
            id="featured-read-btn"
            type="button"
            onClick={() => onStartReading(story)}
            className="flex-1 max-w-[160px] py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-[0_4px_18px_rgba(220,38,38,0.55)] active:scale-95 transition-all cursor-pointer"
          >
            <span>ابدأ الكابوس</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
