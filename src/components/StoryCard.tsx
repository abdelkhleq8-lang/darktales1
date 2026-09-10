import React from 'react';
import { Heart, Bookmark, Share2, ArrowLeft, Feather } from 'lucide-react';
import { Story } from '../types';
import { CustomSwitch } from './CustomSwitch';
import { horrorSoundOptions } from '../data/sounds';

interface StoryCardProps {
  story: Story;
  isAudioActive: boolean;
  onToggleAudio: (storyId: string, active: boolean) => void;
  onToggleLike: (storyId: string) => void;
  onToggleBookmark: (storyId: string) => void;
  onReadStory: (story: Story) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  isAudioActive,
  onToggleAudio,
  onToggleLike,
  onToggleBookmark,
  onReadStory,
}) => {
  const matchedSound = horrorSoundOptions.find(
    (opt) =>
      opt.id === story.ambientAudio?.type ||
      opt.url === story.audioUrl ||
      opt.name === story.ambientAudio?.title
  ) || horrorSoundOptions[0];

  return (
    <article
      id={`story-card-${story.id}`}
      className="group relative rounded-2xl overflow-hidden bg-[#1a191c]/85 backdrop-blur-xl border border-red-900/20 hover:border-red-600/40 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.85)] p-4 md:p-5 flex flex-col space-y-3.5"
    >
      {/* Subtle Crimson Ambient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-600/10 transition-colors" />

      {/* Top Header: Badge, Title & Cover Thumbnail */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex flex-col space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-red-950/60 border border-red-800/40 text-red-300 text-xs font-medium">
              {story.categoryLabel}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#252428] text-[#ac8884] text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {story.subGenreLabel}
            </span>
          </div>

          <h3
            onClick={() => onReadStory(story)}
            className="text-lg md:text-xl font-bold text-white hover:text-red-300 transition-colors cursor-pointer line-clamp-1 pt-1"
          >
            {story.title}
          </h3>
        </div>

        {/* Story Thumbnail Image */}
        <div
          onClick={() => onReadStory(story)}
          className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 bg-[#252428] border border-white/5 cursor-pointer group-hover:scale-105 transition-transform duration-300 shadow-md relative"
        >
          <img
            src={story.coverImage}
            alt={story.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Author & Reading Time Row */}
      <div className="flex items-center gap-2 text-xs text-[#ac8884] relative z-10">
        <div className="flex items-center gap-1.5">
          <Feather className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[#e5e1e4] font-medium">{story.author.name}</span>
        </div>
        <span className="text-white/20">•</span>
        <span>قراءة {story.readTimeMinutes} دقائق</span>
        <span className="text-white/20">•</span>
        <span className="text-[11px] text-[#8e7a78]">{story.createdAt}</span>
      </div>

      {/* Excerpt */}
      <p className="text-sm text-[#c8c0c4] leading-relaxed line-clamp-2 select-text relative z-10">
        {story.excerpt}
      </p>

      {/* Custom Switch Component for Horror Audio Ambience */}
      <div className="p-2.5 rounded-xl bg-[#201f23]/90 border border-white/5 backdrop-blur-md relative z-10">
        <CustomSwitch
          id={`audio-switch-${story.id}`}
          size="sm"
          checked={isAudioActive}
          onChange={(checked) => onToggleAudio(story.id, checked)}
          label={matchedSound.name}
          sublabel={`${matchedSound.category} • ${matchedSound.frequencyBand}`}
          icon={<span className="text-sm">{matchedSound.icon}</span>}
        />
      </div>

      {/* Action Footer: Likes, Bookmarks, Share, and Read CTA */}
      <div className="flex items-center justify-between pt-1 relative z-10">
        <div className="flex items-center gap-1.5">
          {/* Like Button */}
          <button
            id={`like-btn-${story.id}`}
            type="button"
            onClick={() => onToggleLike(story.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-90 ${
              story.isLiked
                ? 'bg-red-950/70 border border-red-700/60 text-red-400 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                : 'bg-[#252428]/80 text-[#ac8884] hover:text-white hover:bg-[#2e2d33]'
            }`}
            aria-label="إعجاب بالقصة"
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                story.isLiked ? 'fill-red-500 text-red-500 scale-110' : ''
              }`}
            />
            <span>{story.likesCount.toLocaleString('ar-EG')}</span>
          </button>

          {/* Bookmark Button */}
          <button
            id={`bookmark-btn-${story.id}`}
            type="button"
            onClick={() => onToggleBookmark(story.id)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              story.isSaved
                ? 'bg-red-950/70 text-red-400 border border-red-800/50'
                : 'bg-[#252428]/80 text-[#ac8884] hover:text-white hover:bg-[#2e2d33]'
            }`}
            aria-label="حفظ القصة"
          >
            <Bookmark className={`w-4 h-4 ${story.isSaved ? 'fill-red-500' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            id={`share-btn-${story.id}`}
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: story.title, text: story.excerpt, url: window.location.href });
              }
            }}
            className="p-1.5 rounded-lg bg-[#252428]/80 text-[#ac8884] hover:text-white hover:bg-[#2e2d33] transition-colors"
            aria-label="مشاركة القصة"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Read Story CTA */}
        <button
          id={`read-story-btn-${story.id}`}
          type="button"
          onClick={() => onReadStory(story)}
          className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_12px_rgba(220,38,38,0.45)] active:scale-95 transition-all cursor-pointer"
        >
          <span>اقرأ القصة</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
