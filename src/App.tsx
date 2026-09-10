import React, { useState, useEffect } from 'react';
import { INITIAL_STORIES } from './data/stories';
import { INITIAL_COMMENTS } from './data/comments';
import { INITIAL_STORIES_24H } from './data/stories24h';
import { Story, HorrorCategory, Comment, UserProfile, Story24H } from './types';
import { audioEngine, AmbientSoundType } from './utils/audioEngine';
import { Navbar } from './components/Navbar';
import { Stories24hBar } from './components/Stories24hBar';
import { Story24hViewerModal } from './components/Story24hViewerModal';
import { CreateStory24hModal } from './components/CreateStory24hModal';
import { AmbientBanner } from './components/AmbientBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { FeaturedSpotlight } from './components/FeaturedSpotlight';
import { StoryCard } from './components/StoryCard';
import { AutoPlayStoryCard } from './components/AutoPlayStoryCard';
import { ImmersionWarning } from './components/ImmersionWarning';
import { StoryReaderModal } from './components/StoryReaderModal';
import { ProfileView } from './components/ProfileView';
import { BottomNav, NavTab } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';
import { EditProfileModal } from './components/EditProfileModal';
import { Compass, Bookmark, Radio, Flame, Volume2, Sparkles, Database } from 'lucide-react';
import { horrorSoundOptions } from './data/sounds';
import {
  fetchStoriesFromFirestore,
  addStoryToFirestore,
  seedStoriesIfEmpty,
} from './services/firestoreStories';

const STORAGE_KEYS = {
  STORIES: 'darktales_stories_v1',
  COMMENTS: 'darktales_comments_v1',
  PROFILE: 'darktales_user_profile_v1',
  STORIES_24H: 'darktales_stories_24h_v1',
};

const DEFAULT_USER: UserProfile = {
  id: 'user-abdelkhleq',
  name: 'عبدالخالق',
  email: 'abdelkhleq8@gmail.com',
  handle: '@abdelkhleq',
  bio: 'مستكشف روايات الرعب وخوارق الطبيعة في DarkTales. مطارد للأصوات المحيطية 8D والظواهر الغامضة.',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  membershipBadge: 'عضو مسكون • المستوى ٤',
  joinedDate: 'سبتمبر 2026',
  readCount: 34,
  immersionMinutes: 180,
  isLoggedIn: true,
};

export default function App() {
  // 1. Stories State
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORIES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_STORIES;
  });

  // 2. Comments State
  const [commentsByStoryId, setCommentsByStoryId] = useState<Record<string, Comment[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_COMMENTS;
  });

  // 3. User Profile State (Auth & Settings)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_USER;
  });

  // 4. Stories 24H State
  const [stories24h, setStories24h] = useState<Story24H[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORIES_24H);
      if (saved) {
        const parsed: Story24H[] = JSON.parse(saved);
        const now = Date.now();
        const unexpired = parsed.filter((s) => s.expiresAt > now);
        if (unexpired.length > 0) return unexpired;
      }
    } catch {
      // Fallback
    }
    return INITIAL_STORIES_24H;
  });

  // App UI & Audio State
  const [selectedCategory, setSelectedCategory] = useState<HorrorCategory>('all');
  const [exploreCategory, setExploreCategory] = useState<HorrorCategory>('all');
  const [exploreSort, setExploreSort] = useState<'newest' | 'popular'>('newest');
  const [activeStoryAudioId, setActiveStoryAudioId] = useState<string | null>(null);
  const [isGlobalAudioPlaying, setIsGlobalAudioPlaying] = useState<boolean>(false);
  const [activeSoundType, setActiveSoundType] = useState<AmbientSoundType | string>('wind');
  const [readingStory, setReadingStory] = useState<Story | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('stories');
  const [isAutoPlayScrollMode, setIsAutoPlayScrollMode] = useState<boolean>(false);
  const [isFirestoreLoading, setIsFirestoreLoading] = useState<boolean>(true);

  // Fetch real stories from Firestore upon opening
  useEffect(() => {
    let isMounted = true;
    async function loadFirestoreStories() {
      try {
        let fetched = await fetchStoriesFromFirestore();
        if (fetched.length === 0) {
          await seedStoriesIfEmpty();
          fetched = await fetchStoriesFromFirestore();
        }
        if (isMounted && fetched.length > 0) {
          setStories(fetched);
        }
      } catch (error) {
        console.warn('Notice: Using local stories data while Firestore syncs:', error);
      } finally {
        if (isMounted) {
          setIsFirestoreLoading(false);
        }
      }
    }

    loadFirestoreStories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);
  const [isCreateStory24hOpen, setIsCreateStory24hOpen] = useState<boolean>(false);
  const [active24hStoryId, setActive24hStoryId] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
    } catch {
      // Ignore quota error
    }
  }, [stories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(commentsByStoryId));
    } catch {
      // Ignore quota error
    }
  }, [commentsByStoryId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch {
      // Ignore quota error
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STORIES_24H, JSON.stringify(stories24h));
    } catch {
      // Ignore quota error
    }
  }, [stories24h]);

  // Clean up expired 24h stories periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setStories24h((prev) => prev.filter((s) => s.expiresAt > now));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Compute story counts per category
  const storyCounts = React.useMemo(() => {
    const counts: Record<HorrorCategory, number> = {
      all: stories.length,
      haunted_houses: 0,
      folk_legends: 0,
      dark_entities: 0,
      mysterious_crimes: 0,
      psychological: 0,
    };
    stories.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [stories]);

  // Filtered stories
  const filteredStories = React.useMemo(() => {
    if (selectedCategory === 'all') return stories;
    return stories.filter((s) => s.category === selectedCategory);
  }, [stories, selectedCategory]);

  // Filtered stories for Explore tab (posts only, no standalone audio stations)
  const exploreStories = React.useMemo(() => {
    let list = exploreCategory === 'all'
      ? [...stories]
      : stories.filter((s) => s.category === exploreCategory);

    if (exploreSort === 'popular') {
      return [...list].sort((a, b) => b.likesCount - a.likesCount);
    }
    return list;
  }, [stories, exploreCategory, exploreSort]);

  const featuredStory = stories.find((s) => s.featured) || stories[0];
  const regularStories = filteredStories.filter((s) => !s.featured);

  // Filtered stories for profile tab
  const likedStories = stories.filter((s) => s.isLiked);
  const savedStories = stories.filter((s) => s.isSaved);
  const userStories = stories.filter((s) => s.author.id === userProfile.id);

  // User's own 24h story
  const myStory24h = stories24h.find((s) => s.authorId === userProfile.id) || null;
  const otherStories24h = stories24h.filter((s) => s.authorId !== userProfile.id);

  // Audio Handlers
  const handleToggleStoryAudio = (storyId: string, active: boolean) => {
    if (active) {
      const targetStory = stories.find((s) => s.id === storyId);
      if (targetStory) {
        audioEngine.play(targetStory.ambientAudio.type, targetStory.audioUrl);
        setActiveStoryAudioId(storyId);
        setIsGlobalAudioPlaying(true);
      }
    } else {
      audioEngine.stop();
      setActiveStoryAudioId(null);
      setIsGlobalAudioPlaying(false);
    }
  };

  // Immediate Audio Cutoff on Navigation / Tab Change
  const handleNavigateTab = (tab: NavTab) => {
    // يضمن الإيقاف التلقائي الفوري والتام لأي صوت معاينة أو مؤثرات صوتية نشطة بمجرد الانتقال لأي صفحة أو العودة للرئيسية
    audioEngine.stop();
    setIsGlobalAudioPlaying(false);
    setActiveStoryAudioId(null);
    setActiveTab(tab);
  };

  const handleToggleGlobalAudio = () => {
    if (isGlobalAudioPlaying) {
      audioEngine.stop();
      setIsGlobalAudioPlaying(false);
      setActiveStoryAudioId(null);
    } else {
      audioEngine.play(activeSoundType);
      setIsGlobalAudioPlaying(true);
      setActiveStoryAudioId('global-stream');
    }
  };

  const handleChangeSoundType = (type: AmbientSoundType | string) => {
    setActiveSoundType(type);
    const soundOpt = horrorSoundOptions.find((s) => s.id === type);
    audioEngine.play(type, soundOpt?.url);
    setIsGlobalAudioPlaying(true);
    setActiveStoryAudioId('global-stream');
  };

  // Interactions with SFX
  const handleToggleLike = (storyId: string) => {
    audioEngine.playSFX('heartbeat');
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          const isLiked = !s.isLiked;
          return {
            ...s,
            isLiked,
            likesCount: isLiked ? s.likesCount + 1 : Math.max(0, s.likesCount - 1),
          };
        }
        return s;
      })
    );
  };

  const handleToggleBookmark = (storyId: string) => {
    audioEngine.playSFX('creak');
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          return {
            ...s,
            isSaved: !s.isSaved,
          };
        }
        return s;
      })
    );
  };

  const handleAddComment = (storyId: string, content: string) => {
    audioEngine.playSFX('whisper');
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      storyId,
      authorName: userProfile.name,
      avatarColor: 'bg-red-700',
      content,
      createdAt: 'الآن',
      likesCount: 0,
    };

    setCommentsByStoryId((prev) => ({
      ...prev,
      [storyId]: [newComment, ...(prev[storyId] || [])],
    }));
  };

  const handlePublishStory = async (
    newStoryData: Omit<Story, 'id' | 'createdAt' | 'likesCount' | 'isLiked' | 'isSaved'>
  ) => {
    audioEngine.playSFX('whoosh');
    try {
      const docId = await addStoryToFirestore({
        title: newStoryData.title,
        content: newStoryData.content,
        excerpt: newStoryData.excerpt,
        authorName: newStoryData.author.name,
        authorBadge: newStoryData.author.badge,
        audioUrl: newStoryData.audioUrl,
        ambientAudioType: newStoryData.ambientAudio?.type,
        ambientAudioTitle: newStoryData.ambientAudio?.title,
        category: newStoryData.category,
        categoryLabel: newStoryData.categoryLabel,
        subGenreLabel: newStoryData.subGenreLabel,
        coverImage: newStoryData.coverImage,
        readTimeMinutes: newStoryData.readTimeMinutes,
      });

      const newStory: Story = {
        ...newStoryData,
        id: docId,
        likesCount: 0,
        isLiked: false,
        isSaved: false,
        createdAt: 'الآن',
      };

      setStories((prev) => [newStory, ...prev]);
    } catch (err) {
      console.error('Error saving story to Firestore, saving locally:', err);
      const newStory: Story = {
        ...newStoryData,
        id: `story-user-${Date.now()}`,
        likesCount: 0,
        isLiked: false,
        isSaved: false,
        createdAt: 'الآن',
      };
      setStories((prev) => [newStory, ...prev]);
    }

    setUserProfile((prev) => ({
      ...prev,
      readCount: prev.readCount + 1,
    }));
  };

  const handleReadStory = (story: Story) => {
    audioEngine.playSFX('whoosh');
    setReadingStory(story);

    // 1. التشغيل التلقائي عند الدخول: بمجرد أن يضغط المستخدم على زر "اقرأ القصة" وتفتح نافذة القراءة، تبدأ أصوات ومؤثرات الرعب بالعمل تلقائياً
    const matchedSound = horrorSoundOptions.find(
      (opt) =>
        opt.id === story.ambientAudio?.type ||
        opt.url === story.audioUrl ||
        opt.name === story.ambientAudio?.title
    ) || horrorSoundOptions[0];

    const soundType = matchedSound.id;
    const soundUrl = story.audioUrl || matchedSound.url;

    audioEngine.play(soundType, soundUrl);
    setActiveStoryAudioId(story.id);
    setIsGlobalAudioPlaying(true);

    setUserProfile((prev) => ({
      ...prev,
      readCount: prev.readCount + 1,
      immersionMinutes: prev.immersionMinutes + story.readTimeMinutes,
    }));
  };

  const handleCloseReader = () => {
    // 2. الإيقاف التلقائي الفوري عند الخروج: عندما يضغط المستخدم على زر الإغلاق (X) للخروج من نافذة القصة، يتوقف الصوت تماماً وينقطع بشكل فوري وتلقائي
    audioEngine.stop();
    setActiveStoryAudioId(null);
    setIsGlobalAudioPlaying(false);
    setReadingStory(null);
  };

  // 24H Stories Handlers
  const handleOpen24hStory = (story: Story24H) => {
    setActive24hStoryId(story.id);
  };

  const handlePublish24hStory = (newStory: Story24H) => {
    setStories24h((prev) => [newStory, ...prev.filter((s) => s.id !== newStory.id)]);
  };

  const handleMark24hStoryViewed = (storyId: string) => {
    setStories24h((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, isViewed: true, viewsCount: s.viewsCount + 1 } : s))
    );
  };

  // Auth Handlers
  const handleLoginSuccess = (authenticatedUser: UserProfile) => {
    setUserProfile(authenticatedUser);
    audioEngine.playSFX('whoosh');
  };

  const handleLogout = () => {
    audioEngine.playSFX('creak');
    setUserProfile((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
  };

  // Profile Edit Handler
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  if (isFirestoreLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-600 font-serif animate-pulse gap-4 select-none">
        <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
        <p className="text-xl md:text-2xl font-bold tracking-wider text-center">
          جاري استدعاء الأرواح وتحميل القصص...
        </p>
        <span className="text-xs text-zinc-500 font-mono">Firebase Firestore Connected</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0e0e10] text-[#e5e1e4] flex flex-col selection:bg-red-900 selection:text-white font-sans">
      {/* Cinematic Dark Ambience Background Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.18),transparent_70%)] z-0" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,rgba(153,27,27,0.12),transparent_60%)] z-0" />

      {/* Top Fixed Navbar */}
      <Navbar
        isGlobalAudioPlaying={isGlobalAudioPlaying}
        onToggleGlobalAudio={handleToggleGlobalAudio}
        onOpenProfile={() => handleNavigateTab('profile')}
        onHomeClick={() => handleNavigateTab('stories')}
        isLoggedIn={Boolean(userProfile.isLoggedIn)}
        currentUser={userProfile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto pt-20 pb-28 px-4 relative z-10">
        {/* STORIES TAB */}
        {activeTab === 'stories' && (
          <div className="flex flex-col space-y-6">
            {/* 24H Stories Horizontal Bar (Top of Feed) */}
            <Stories24hBar
              stories={otherStories24h}
              myStory={myStory24h}
              onOpenStory={handleOpen24hStory}
              onAddStory={() => setIsCreateStory24hOpen(true)}
            />

            {/* Ambient Audio Banner with Volume Slider & Presets */}
            <AmbientBanner
              isPlaying={isGlobalAudioPlaying}
              onToggle={handleToggleGlobalAudio}
              activeSoundType={activeSoundType}
              onChangeSoundType={handleChangeSoundType}
            />

            {/* Category Filter Pills */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              storyCounts={storyCounts}
            />

            {/* Featured Story Spotlight */}
            {selectedCategory === 'all' && featuredStory && (
              <FeaturedSpotlight
                story={featuredStory}
                isAudioActive={activeStoryAudioId === featuredStory.id}
                onToggleAudio={handleToggleStoryAudio}
                onToggleLike={handleToggleLike}
                onToggleBookmark={handleToggleBookmark}
                onStartReading={handleReadStory}
              />
            )}

            {/* Real Horror Archive Section Title & AutoPlay Scroll Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-red-600 rounded-full shadow-[0_0_8px_#dc2626]" />
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  أرشيف الكوابيس الحقيقية
                </h2>
              </div>

              {/* AutoPlay on Scroll Switch Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAutoPlayScrollMode(!isAutoPlayScrollMode)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isAutoPlayScrollMode
                      ? 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                      : 'bg-[#1e1d21] border-white/10 text-[#ac8884] hover:text-white'
                  }`}
                  title="تشغيل الأصوات تلقائياً عند تمرير القصة وظهور 60% منها على الشاشة"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAutoPlayScrollMode ? 'bg-red-500 animate-ping' : 'bg-zinc-600'
                    }`}
                  />
                  <span>
                    {isAutoPlayScrollMode
                      ? 'نمط التمرير التلقائي (AutoPlay) مفعّل'
                      : 'تفعيل التشغيل التلقائي عند التمرير'}
                  </span>
                </button>
                <span className="text-[11px] font-mono text-red-400 uppercase tracking-wider hidden md:inline">
                  ({regularStories.length.toLocaleString('ar-EG')})
                </span>
              </div>
            </div>

            {/* Story Cards List */}
            <div className="flex flex-col space-y-4">
              {regularStories.map((story) =>
                isAutoPlayScrollMode ? (
                  <AutoPlayStoryCard
                    key={story.id}
                    story={{
                      id: story.id,
                      title: story.title,
                      content: story.content,
                      authorName: story.author.name,
                      audioUrl: story.audioUrl || 'https://example.com/audio/creaking-door-wind.mp3',
                      categoryLabel: story.categoryLabel,
                    }}
                  />
                ) : (
                  <StoryCard
                    key={story.id}
                    story={story}
                    isAudioActive={activeStoryAudioId === story.id}
                    onToggleAudio={handleToggleStoryAudio}
                    onToggleLike={handleToggleLike}
                    onToggleBookmark={handleToggleBookmark}
                    onReadStory={handleReadStory}
                  />
                )
              )}

              {regularStories.length === 0 && (
                <div className="p-12 text-center rounded-2xl bg-[#161518]/80 border border-red-950/60 text-[#ac8884] flex flex-col items-center gap-4">
                  <p className="text-base text-zinc-400 font-serif leading-relaxed">
                    لا توجد قصص مرعبة هنا بعد... الميدان خالي، كن أول من ينشر قصة رعب!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-[0_0_16px_rgba(220,38,38,0.5)] cursor-pointer transition-all active:scale-95"
                  >
                    انشر قصة رعب الآن في السجل
                  </button>
                </div>
              )}
            </div>

            {/* Audio Immersion Warning Box */}
            <ImmersionWarning />
          </div>
        )}

        {/* EXPLORE TAB */}
        {activeTab === 'explore' && (
          <div className="flex flex-col space-y-5 animate-in fade-in duration-300">
            {/* Header: Focused purely on exploring written posts and stories */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-950/30 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Compass className="w-6 h-6 text-red-500" />
                  <h2 className="text-2xl font-bold text-white">استكشاف أحدث المنشورات والقصص</h2>
                </div>
                <p className="text-sm text-[#ac8884] leading-relaxed">
                  تصفح أحدث الكوابيس والقصص المرعبة المكتوبة بقلم كتاب ورواة مجتمع DarkTales
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-900/40 text-xs font-semibold text-red-300">
                  {exploreStories.length} قصة منشورة
                </span>
                <button
                  type="button"
                  onClick={() => handleNavigateTab('profile')}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  نشر كابوس جديد
                </button>
              </div>
            </div>

            {/* Category Filter and Sorting for Explore Stories */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CategoryFilter
                selectedCategory={exploreCategory}
                onSelectCategory={setExploreCategory}
                storyCounts={storyCounts}
              />
              <div className="flex items-center gap-1.5 self-end sm:self-auto bg-[#1e1d21] p-1 rounded-xl border border-white/5 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setExploreSort('newest')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    exploreSort === 'newest'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-[#ac8884] hover:text-white'
                  }`}
                >
                  الأحدث نشراً
                </button>
                <button
                  type="button"
                  onClick={() => setExploreSort('popular')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    exploreSort === 'popular'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-[#ac8884] hover:text-white'
                  }`}
                >
                  الأكثر تفاعلاً
                </button>
              </div>
            </div>

            {/* Stories Feed (Posts only, no standalone audio stations) */}
            <div className="space-y-4 pt-1">
              {exploreStories.length > 0 ? (
                exploreStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    isAudioActive={activeStoryAudioId === story.id}
                    onToggleAudio={handleToggleStoryAudio}
                    onToggleLike={handleToggleLike}
                    onToggleBookmark={handleToggleBookmark}
                    onReadStory={handleReadStory}
                  />
                ))
              ) : (
                <div className="p-10 text-center rounded-2xl bg-[#161518]/60 border border-red-900/20 flex flex-col items-center justify-center space-y-3">
                  <Compass className="w-10 h-10 text-red-500/40" />
                  <h4 className="text-white font-bold text-base">لا توجد قصص في هذا التصنيف حالياً</h4>
                  <p className="text-xs text-[#ac8884] max-w-sm">
                    كن أول من يكتب وينشر قصة رعب جديدة في هذا التصنيف مع دمج الصوت المرعب المناسب لها!
                  </p>
                  <button
                    type="button"
                    onClick={() => handleNavigateTab('profile')}
                    className="mt-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md active:scale-95 cursor-pointer"
                  >
                    نشر قصة الآن
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SAVED BOOKMARKS TAB */}
        {activeTab === 'saved' && (
          <div className="flex flex-col space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-red-500 fill-red-500" />
              <h2 className="text-2xl font-bold text-white">المحفوظات الشخصية</h2>
            </div>
            <p className="text-sm text-[#ac8884]">
              القصص التي قمت بحفظها للرجوع إليها وقراءتها في أوقاتك المفضلة.
            </p>

            {savedStories.length > 0 ? (
              <div className="flex flex-col space-y-4 pt-1">
                {savedStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    isAudioActive={activeStoryAudioId === story.id}
                    onToggleAudio={handleToggleStoryAudio}
                    onToggleLike={handleToggleLike}
                    onToggleBookmark={handleToggleBookmark}
                    onReadStory={handleReadStory}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#161518]/80 border border-white/5 flex flex-col items-center space-y-3">
                <Bookmark className="w-10 h-10 text-[#544f52]" />
                <h4 className="text-base font-bold text-white">لا توجد قصص محفوظة بعد</h4>
                <p className="text-xs text-[#ac8884] max-w-xs">
                  اضغط على أيقونة الحفظ بجانب أي قصة لإضافتها إلى قائمة كوابيسك المفضلة.
                </p>
                <button
                  type="button"
                  onClick={() => handleNavigateTab('stories')}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold cursor-pointer"
                >
                  استكشف القصص الآن
                </button>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <ProfileView
            user={userProfile}
            stories={stories}
            likedStories={likedStories}
            savedStories={savedStories}
            userStories={userStories}
            onPublishStory={handlePublishStory}
            activeStoryAudioId={activeStoryAudioId}
            onToggleAudio={handleToggleStoryAudio}
            onToggleLike={handleToggleLike}
            onToggleBookmark={handleToggleBookmark}
            onReadStory={handleReadStory}
            onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
            onNavigateHome={() => handleNavigateTab('stories')}
          />
        )}
      </main>

      {/* 24H Story Fullscreen Viewer Modal */}
      <Story24hViewerModal
        stories={stories24h}
        initialStoryId={active24hStoryId}
        isOpen={Boolean(active24hStoryId)}
        onClose={() => setActive24hStoryId(null)}
        onMarkAsViewed={handleMark24hStoryViewed}
      />

      {/* 24H Story Creation Modal */}
      <CreateStory24hModal
        isOpen={isCreateStory24hOpen}
        onClose={() => setIsCreateStory24hOpen(false)}
        currentUser={userProfile}
        onPublishStory24h={handlePublish24hStory}
      />

      {/* Auth Modal (Google OAuth & Email) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Edit Profile & Settings Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        currentUser={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Interactive Story Reader Modal */}
      <StoryReaderModal
        story={readingStory}
        isOpen={Boolean(readingStory)}
        onClose={handleCloseReader}
        isAudioActive={activeStoryAudioId === readingStory?.id}
        onToggleAudio={handleToggleStoryAudio}
        onToggleLike={handleToggleLike}
        onToggleBookmark={handleToggleBookmark}
        comments={commentsByStoryId[readingStory?.id || ''] || []}
        onAddComment={handleAddComment}
      />

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleNavigateTab}
        savedCount={savedStories.length}
      />
    </div>
  );
}
