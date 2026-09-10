import React, { useState, useEffect } from 'react';
import { User, Heart, Bookmark, BookOpen, PlusCircle, Feather, Sparkles, Send, Skull, Settings, Camera, ShieldCheck, Volume2, VolumeX, Play, Square, Check, Headphones, Home, ArrowLeft } from 'lucide-react';
import { Story, HorrorCategory, UserProfile } from '../types';
import { StoryCard } from './StoryCard';
import { horrorSoundOptions, HorrorSoundOption, horrorSoundCategories } from '../data/sounds';
import { audioEngine } from '../utils/audioEngine';

interface ProfileViewProps {
  user: UserProfile;
  stories: Story[];
  likedStories: Story[];
  savedStories: Story[];
  userStories: Story[];
  onPublishStory: (newStory: Omit<Story, 'id' | 'createdAt' | 'likesCount' | 'isLiked' | 'isSaved'>) => void;
  activeStoryAudioId: string | null;
  onToggleAudio: (storyId: string, active: boolean) => void;
  onToggleLike: (storyId: string) => void;
  onToggleBookmark: (storyId: string) => void;
  onReadStory: (story: Story) => void;
  onOpenEditProfile: () => void;
  onNavigateHome?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  stories,
  likedStories,
  savedStories,
  userStories,
  onPublishStory,
  activeStoryAudioId,
  onToggleAudio,
  onToggleLike,
  onToggleBookmark,
  onReadStory,
  onOpenEditProfile,
  onNavigateHome,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'liked' | 'saved' | 'published' | 'create'>('liked');

  // Form state for creating a new horror story
  const [formTitle, setFormTitle] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<HorrorCategory>('haunted_houses');
  const [formAudioType, setFormAudioType] = useState<string>(horrorSoundOptions[0]?.id || 'wind_creak');
  const [previewingSoundId, setPreviewingSoundId] = useState<string | null>(null);
  const [soundCategoryFilter, setSoundCategoryFilter] = useState<string>('all');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  // 1. إيقاف تلقائي فوري وكامل عند مغادرة صفحة المعاينة أو الانتقال لأي مكان آخر (Unmount)
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  // 2. إيقاف المعاينة تلقائياً عند تغيير التبويب الفرعي بعيداً عن شاشة الإنشاء
  useEffect(() => {
    if (activeSubTab !== 'create') {
      audioEngine.stop();
      setPreviewingSoundId(null);
    }
  }, [activeSubTab]);

  // 3. إيقاف فوري عند مغادرة نافذة المتصفح أو إخفاء الصفحة
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioEngine.stop();
        setPreviewingSoundId(null);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleVisibilityChange);
    };
  }, []);

  const handleTabChange = (tab: 'liked' | 'saved' | 'published' | 'create') => {
    if (previewingSoundId) {
      audioEngine.stop();
      setPreviewingSoundId(null);
    }
    setActiveSubTab(tab);
  };

  const handleNavigateHome = () => {
    if (previewingSoundId) {
      audioEngine.stop();
      setPreviewingSoundId(null);
    }
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const handleReadStoryFromProfile = (story: Story) => {
    if (previewingSoundId) {
      audioEngine.stop();
      setPreviewingSoundId(null);
    }
    onReadStory(story);
  };

  const handleOpenEditProfileFromProfile = () => {
    if (previewingSoundId) {
      audioEngine.stop();
      setPreviewingSoundId(null);
    }
    onOpenEditProfile();
  };

  const handleToggleSoundPreview = (opt: HorrorSoundOption, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (previewingSoundId === opt.id) {
      audioEngine.stop();
      setPreviewingSoundId(null);
    } else {
      audioEngine.stop();
      audioEngine.play(opt.id, opt.url);
      setPreviewingSoundId(opt.id);
    }
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (previewingSoundId) {
      audioEngine.stop();
      setPreviewingSoundId(null);
    }

    const categoryLabels: Record<HorrorCategory, { main: string; sub: string }> = {
      all: { main: 'رعب عام', sub: 'كوابيس منوعة' },
      haunted_houses: { main: 'بيوت مسكونة', sub: 'أشباح وشهقات' },
      folk_legends: { main: 'أساطير شعبية', sub: 'نبوءات الموت' },
      dark_entities: { main: 'كيانات مظلمة', sub: 'ظواهر خارقة' },
      mysterious_crimes: { main: 'جرائم غامضة', sub: 'أسرار سرية' },
      psychological: { main: 'رعب نفسي', sub: 'هلوسات ليلية' },
    };

    const matchedSound = horrorSoundOptions.find(
      (opt) => opt.id === formAudioType
    ) || horrorSoundOptions[0];
    const resolvedAudioUrl = matchedSound.url;

    onPublishStory({
      title: formTitle.trim(),
      excerpt: formExcerpt.trim() || formContent.slice(0, 140) + '...',
      content: formContent.trim(),
      coverImage:
        formCategory === 'haunted_houses'
          ? 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=900&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80',
      author: {
        id: user.id,
        name: user.name,
        badge: user.membershipBadge,
      },
      category: formCategory,
      categoryLabel: categoryLabels[formCategory].main,
      subGenreLabel: categoryLabels[formCategory].sub,
      readTimeMinutes: Math.max(3, Math.ceil(formContent.length / 300)),
      audioUrl: resolvedAudioUrl,
      ambientAudio: {
        title: matchedSound.name,
        duration: '05:00',
        type: matchedSound.id,
        defaultActive: true,
      },
    });

    setFormTitle('');
    setFormExcerpt('');
    setFormContent('');
    setIsSuccessMessage(true);
    setTimeout(() => {
      setIsSuccessMessage(false);
      setActiveSubTab('published');
    }, 1200);
  };

  return (
    <div id="profile-page-view" className="flex flex-col space-y-6 animate-in fade-in duration-300">
      {/* User Info Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#171619]/90 border border-red-900/30 p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.85)] flex flex-col space-y-4">
        <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-red-950/80 border border-red-700/60 overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.35)] shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-red-400 font-bold text-2xl">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-red-600 border-2 border-[#171619] flex items-center justify-center text-[9px] text-white">
                ✓
              </span>
            </div>

            {/* Name, Handle, Bio */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl md:text-2xl font-bold text-white truncate">
                  {user.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-950/70 border border-red-800/50 text-[10px] text-red-300 font-mono">
                  {user.membershipBadge}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-red-400 font-mono mt-0.5">
                <span>{user.handle}</span>
                {user.email && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400 text-[11px] truncate max-w-[150px]">{user.email}</span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#b8aeb2] mt-1.5 line-clamp-2 leading-relaxed">
                {user.bio}
              </p>
            </div>
          </div>

          {/* Edit Profile CTA Button */}
          <button
            id="edit-profile-btn"
            type="button"
            onClick={handleOpenEditProfileFromProfile}
            className="self-stretch sm:self-auto px-4 py-2 rounded-xl bg-[#222126] hover:bg-red-950/80 border border-white/10 hover:border-red-600/70 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0 active:scale-95"
          >
            <Settings className="w-3.5 h-3.5 text-red-400" />
            <span>تعديل الملف الشخصي</span>
          </button>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-1 relative z-10">
          <div className="p-3 rounded-xl bg-[#201f23] border border-white/5 text-center">
            <span className="text-lg md:text-xl font-bold text-red-400 font-mono">
              {likedStories.length.toLocaleString('ar-EG')}
            </span>
            <span className="block text-[11px] text-[#ac8884] mt-0.5">أعجب بها</span>
          </div>
          <div className="p-3 rounded-xl bg-[#201f23] border border-white/5 text-center">
            <span className="text-lg md:text-xl font-bold text-white font-mono">
              {savedStories.length.toLocaleString('ar-EG')}
            </span>
            <span className="block text-[11px] text-[#ac8884] mt-0.5">محفوظة</span>
          </div>
          <div className="p-3 rounded-xl bg-[#201f23] border border-white/5 text-center">
            <span className="text-lg md:text-xl font-bold text-red-300 font-mono">
              {userStories.length.toLocaleString('ar-EG')}
            </span>
            <span className="block text-[11px] text-[#ac8884] mt-0.5">نشرتها</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Liked, Saved, Published, Create */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-red-950/40 pb-2">
        <button
          type="button"
          onClick={() => handleTabChange('liked')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'liked'
              ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]'
              : 'bg-[#1a191c] text-[#ac8884] hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>القصص المعجب بها ({likedStories.length.toLocaleString('ar-EG')})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('saved')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'saved'
              ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]'
              : 'bg-[#1a191c] text-[#ac8884] hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>المحفوظات ({savedStories.length.toLocaleString('ar-EG')})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('published')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'published'
              ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]'
              : 'bg-[#1a191c] text-[#ac8884] hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>قصصي المنشورة ({userStories.length.toLocaleString('ar-EG')})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('create')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'create'
              ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]'
              : 'bg-red-950/40 text-red-400 border border-red-800/40 hover:bg-red-900/40'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>نشر كابوس جديد</span>
        </button>
      </div>

      {/* Tab 1: Liked Stories */}
      {activeSubTab === 'liked' && (
        <div className="flex flex-col space-y-4 animate-in fade-in duration-200">
          {likedStories.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#161518]/60 border border-white/5 text-[#ac8884] text-xs">
              لم تسجل إعجابك بأي قصة حتى الآن. تصفح القصص واضغط على زر القلب!
            </div>
          ) : (
            likedStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                isAudioActive={activeStoryAudioId === story.id}
                onToggleAudio={onToggleAudio}
                onToggleLike={onToggleLike}
                onToggleBookmark={onToggleBookmark}
                onReadStory={handleReadStoryFromProfile}
              />
            ))
          )}
        </div>
      )}

      {/* Tab 2: Saved Stories */}
      {activeSubTab === 'saved' && (
        <div className="flex flex-col space-y-4 animate-in fade-in duration-200">
          {savedStories.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#161518]/60 border border-white/5 text-[#ac8884] text-xs">
              لا توجد قصص محفوظة حالياً في أرشيفك الشخصي.
            </div>
          ) : (
            savedStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                isAudioActive={activeStoryAudioId === story.id}
                onToggleAudio={onToggleAudio}
                onToggleLike={onToggleLike}
                onToggleBookmark={onToggleBookmark}
                onReadStory={handleReadStoryFromProfile}
              />
            ))
          )}
        </div>
      )}

      {/* Tab 3: Published Stories */}
      {activeSubTab === 'published' && (
        <div className="flex flex-col space-y-4 animate-in fade-in duration-200">
          {userStories.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#161518]/60 border border-white/5 flex flex-col items-center space-y-3">
              <Feather className="w-8 h-8 text-[#605a5d]" />
              <p className="text-xs text-[#ac8884]">
                لم تقم بنشر أي كابوس بعد. كن مؤلفاً وشارك القراء تجاربك المرعبة!
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('create')}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold cursor-pointer"
              >
                اكتب قصتك الأولى الآن
              </button>
            </div>
          ) : (
            userStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                isAudioActive={activeStoryAudioId === story.id}
                onToggleAudio={onToggleAudio}
                onToggleLike={onToggleLike}
                onToggleBookmark={onToggleBookmark}
                onReadStory={handleReadStoryFromProfile}
              />
            ))
          )}
        </div>
      )}

      {/* Tab 4: Create Horror Story Form */}
      {activeSubTab === 'create' && (
        <form
          onSubmit={handleCreateStory}
          className="p-5 md:p-6 rounded-2xl bg-[#161518]/95 border border-red-900/30 flex flex-col space-y-4 animate-in fade-in duration-200 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-red-950/40 pb-3">
            <div className="flex items-center gap-2">
              <Feather className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-white text-base">نشر كابوس في DarkTales</h3>
            </div>
            {onNavigateHome && (
              <button
                type="button"
                id="publisher-back-to-home-btn"
                onClick={handleNavigateHome}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222126] hover:bg-red-950/70 border border-white/10 hover:border-red-600/50 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
                title="العودة للصفحة الرئيسية وإيقاف أي معاينة صوتية"
              >
                <Home className="w-3.5 h-3.5 text-red-400" />
                <span>العودة للرئيسية</span>
              </button>
            )}
          </div>

          {isSuccessMessage && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-700 text-red-300 text-xs font-semibold text-center animate-bounce">
              تم نشر قصتك بنجاح وإضافتها إلى أرشيف الكوابيس!
            </div>
          )}

          {/* Story Title */}
          <div>
            <label className="block text-xs font-semibold text-[#c8c0c4] mb-1.5">
              عنوان القصة
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="مثال: أصابع خلف الستار، صوت في البئر..."
              className="w-full bg-[#1e1d21] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#6c666a] focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Story Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#c8c0c4] mb-1.5">
              تصنيف الرعب
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as HorrorCategory)}
              className="w-full bg-[#1e1d21] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
            >
              <option value="haunted_houses">بيوت مسكونة (أشباح وشهقات)</option>
              <option value="folk_legends">أساطير شعبية (نبوءات الموت)</option>
              <option value="dark_entities">كيانات مظلمة (ظواهر خارقة)</option>
              <option value="mysterious_crimes">جرائم غامضة (أسرار سرية)</option>
              <option value="psychological">رعب نفسي (هلوسات ليلية)</option>
            </select>
          </div>

          {/* 20 Horror Sounds Studio - Publisher Exclusive Selection */}
          <div className="rounded-2xl bg-[#17161a] border border-red-900/40 p-4 space-y-3.5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-bold text-white">
                    قائمة مؤثرات الرعب (20 صوتاً)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-700/50 text-[10px] text-red-300 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-red-400" />
                    صلاحية حصرية للناشر
                  </span>
                </div>
                <p className="text-xs text-[#a0989c] mt-1">
                  الناشر هو الوحيد القادر على اختيار وتحديد الصوت المدمج مع القصة. سيعمل تلقائياً عند فتح القارئ للقصة.
                </p>
              </div>

              {/* Currently Selected Sound Pill */}
              {(() => {
                const activeOpt = horrorSoundOptions.find((o) => o.id === formAudioType) || horrorSoundOptions[0];
                return (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/70 border border-red-700/60 text-xs text-red-200 shrink-0">
                    <span className="text-base">{activeOpt.icon}</span>
                    <span className="font-bold truncate max-w-[150px]">{activeOpt.name}</span>
                    <Check className="w-3.5 h-3.5 text-red-400" />
                  </div>
                );
              })()}
            </div>

            {/* Sound Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              <button
                type="button"
                onClick={() => setSoundCategoryFilter('all')}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap text-xs font-semibold ${
                  soundCategoryFilter === 'all'
                    ? 'bg-red-900/80 border-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]'
                    : 'bg-[#1f1e22] border-white/5 text-[#a0989c] hover:text-white'
                }`}
              >
                الكل (20)
              </button>
              {horrorSoundCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSoundCategoryFilter(cat.name)}
                  className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap text-xs font-semibold flex items-center gap-1.5 ${
                    soundCategoryFilter === cat.name
                      ? 'bg-red-900/80 border-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]'
                      : 'bg-[#1f1e22] border-white/5 text-[#a0989c] hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* 20 Horror Sounds Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {horrorSoundOptions
                .filter((opt) => soundCategoryFilter === 'all' || opt.category === soundCategoryFilter)
                .map((opt) => {
                  const isSelected = formAudioType === opt.id;
                  const isPreviewing = previewingSoundId === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => setFormAudioType(opt.id)}
                      className={`relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 text-right ${
                        isSelected
                          ? 'bg-red-950/70 border-red-500/80 shadow-[0_0_16px_rgba(220,38,38,0.35)] ring-1 ring-red-500/50'
                          : 'bg-[#1b1a1e] border-white/5 hover:border-white/20 hover:bg-[#201f24]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{opt.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{opt.name}</span>
                              {isSelected && (
                                <span className="px-1.5 py-0.2 rounded bg-red-800 text-[9px] text-white font-mono">
                                  مختار
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-red-300/80">
                                {opt.category}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-white/5 text-amber-300/80 font-mono">
                                {opt.frequencyBand}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Live Preview Button for Publisher */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleSoundPreview(opt, e)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[11px] font-semibold ${
                            isPreviewing
                              ? 'bg-red-600 text-white border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.6)] animate-pulse'
                              : 'bg-[#252429] border-white/10 text-[#ac8884] hover:text-white'
                          }`}
                          title={isPreviewing ? 'إيقاف المعاينة' : 'معاينة الصوت قبل الدمج'}
                        >
                          {isPreviewing ? (
                            <>
                              <Square className="w-3 h-3 fill-current" />
                              <span className="text-[10px]">إيقاف</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span className="text-[10px]">معاينة</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-[#9b9498] leading-tight">
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-[#c8c0c4] mb-1.5">
              نبذة تشويقية سريعة (سطرين)
            </label>
            <input
              type="text"
              value={formExcerpt}
              onChange={(e) => setFormExcerpt(e.target.value)}
              placeholder="عبارة تمهيدية تخطف أنفاس القارئ قبل بدء الكابوس..."
              className="w-full bg-[#1e1d21] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#6c666a] focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs font-semibold text-[#c8c0c4] mb-1.5">
              نص القصة الكامل
            </label>
            <textarea
              required
              rows={6}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="اكتب تفاصيل الكابوس هنا بدقة وعناية..."
              className="w-full bg-[#1e1d21] border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-[#6c666a] focus:outline-none focus:border-red-600 resize-none leading-relaxed font-serif"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-[0_0_16px_rgba(220,38,38,0.5)] active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>نشر الكابوس في الأرشيف</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
