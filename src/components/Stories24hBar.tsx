import React from 'react';
import { Plus, Flame, Clock } from 'lucide-react';
import { Story24H } from '../types';

interface Stories24hBarProps {
  stories: Story24H[];
  myStory?: Story24H | null;
  onOpenStory: (story: Story24H) => void;
  onAddStory: () => void;
}

export const Stories24hBar: React.FC<Stories24hBarProps> = ({
  stories,
  myStory,
  onOpenStory,
  onAddStory,
}) => {
  return (
    <section id="stories-24h-bar" className="w-full">
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            كوابيس ٢٤ ساعة الحية
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#ac8884] flex items-center gap-1">
          <Clock className="w-3 h-3 text-red-400" />
          <span>تختفي تلقائياً</span>
        </span>
      </div>

      <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1 px-1">
        {/* User's Story / Add Story Circle */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 select-none">
          <button
            type="button"
            onClick={myStory ? () => onOpenStory(myStory) : onAddStory}
            className={`relative w-15 h-15 rounded-full p-[2.5px] cursor-pointer transition-transform active:scale-95 group ${
              myStory
                ? 'bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 shadow-[0_0_14px_rgba(220,38,38,0.6)]'
                : 'border border-dashed border-red-700/60 hover:border-red-500 bg-[#1a191d]'
            }`}
            title={myStory ? 'مشاهدة كابوسك' : 'نشر كابوس سريع (24 ساعة)'}
          >
            <div className="w-full h-full rounded-full bg-[#121113] overflow-hidden flex items-center justify-center relative">
              {myStory ? (
                <img
                  src={myStory.mediaUrl}
                  alt={myStory.authorName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-red-400 group-hover:text-red-300">
                  <Plus className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                </div>
              )}
            </div>

            {/* Plus Badge */}
            {!myStory && (
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-red-600 border-2 border-[#0e0e10] flex items-center justify-center text-white text-[11px] font-bold shadow-md">
                +
              </span>
            )}
            {myStory && (
              <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-red-600 border border-[#0e0e10] text-[9px] text-white font-bold">
                أنت
              </span>
            )}
          </button>
          <span className="text-[11px] text-white font-medium truncate max-w-[68px] text-center">
            {myStory ? 'كابوسي' : 'أضف كابوسك'}
          </span>
        </div>

        {/* Other Authors' 24H Stories */}
        {stories.map((story) => {
          const isViewed = story.isViewed;
          return (
            <div
              key={story.id}
              className="flex flex-col items-center gap-1.5 shrink-0 select-none"
            >
              <button
                type="button"
                onClick={() => onOpenStory(story)}
                className={`relative w-15 h-15 rounded-full p-[2.5px] cursor-pointer transition-all active:scale-95 group ${
                  isViewed
                    ? 'border border-zinc-700/60 bg-[#161518]'
                    : 'bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 shadow-[0_0_12px_rgba(220,38,38,0.5)] animate-[pulse_3s_ease-in-out_infinite]'
                }`}
                title={`كابوس ${story.authorName}`}
              >
                <div className="w-full h-full rounded-full bg-[#121113] overflow-hidden">
                  <img
                    src={story.authorAvatar}
                    alt={story.authorName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </button>
              <span
                className={`text-[11px] truncate max-w-[68px] text-center font-medium ${
                  isViewed ? 'text-[#8e7a78]' : 'text-white'
                }`}
              >
                {story.authorName.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
