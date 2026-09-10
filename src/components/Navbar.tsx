import React from 'react';
import { Skull, Play, Pause, User, LogIn, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  isGlobalAudioPlaying: boolean;
  onToggleGlobalAudio: () => void;
  activeAudioTitle?: string;
  onOpenProfile?: () => void;
  onHomeClick?: () => void;
  isLoggedIn: boolean;
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isGlobalAudioPlaying,
  onToggleGlobalAudio,
  activeAudioTitle = 'صرير الرياح وهمس الظلال',
  onOpenProfile,
  onHomeClick,
  isLoggedIn,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header
      id="main-app-header"
      className="fixed top-0 w-full z-40 bg-[#0e0e10]/90 backdrop-blur-2xl border-b border-red-950/40 shadow-[0_4px_30px_rgba(0,0,0,0.85)]"
    >
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={onHomeClick}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          title="العودة للرئيسية"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1c1b1d] border border-red-800/40 shadow-[0_0_15px_rgba(220,38,38,0.35)] group-hover:border-red-600 transition-colors">
            <Skull className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-wider text-white group-hover:text-red-300 transition-colors">
                DarkTales
              </span>
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-red-950/60 border border-red-800/40 text-red-300 font-mono"
                title="قاعدة بيانات Firebase Firestore متصلة مباشرة"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                DB
              </span>
            </div>
            <span className="text-[10px] tracking-wider text-red-400 font-serif font-semibold">
              أرشيف الرعب الحقيقي والتفاعلي
            </span>
          </div>
        </div>

        {/* Action Controls: Audio + Auth / Profile */}
        <div className="flex items-center gap-2">
          {/* Ambient Audio Stream Quick Pill */}
          <button
            id="header-ambient-audio-toggle"
            type="button"
            onClick={onToggleGlobalAudio}
            className={`min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 border cursor-pointer ${
              isGlobalAudioPlaying
                ? 'bg-red-950/80 border-red-600/70 text-white shadow-[0_0_15px_rgba(220,38,38,0.45)]'
                : 'bg-[#1c1b1d] border-white/10 text-[#ac8884] hover:text-white'
            }`}
            title={isGlobalAudioPlaying ? 'إيقاف البث الصوتي' : 'تشغيل البث الصوتي التفاعلي'}
            aria-label="تبديل البث الصوتي المباشر"
          >
            {/* Equalizer bars */}
            <div className="flex items-end gap-[2px] h-3 px-0.5">
              <span
                className={`w-[2px] rounded-full bg-red-500 ${
                  isGlobalAudioPlaying ? 'h-3 animate-pulse' : 'h-1.5'
                }`}
              />
              <span
                className={`w-[2px] rounded-full bg-red-400 ${
                  isGlobalAudioPlaying ? 'h-3.5 animate-pulse delay-75' : 'h-2'
                }`}
              />
              <span
                className={`w-[2px] rounded-full bg-red-500 ${
                  isGlobalAudioPlaying ? 'h-2 animate-pulse delay-150' : 'h-1'
                }`}
              />
            </div>

            <span className="text-xs font-medium hidden sm:inline">
              {isGlobalAudioPlaying ? '8D نشط' : 'بث محيطي'}
            </span>

            {isGlobalAudioPlaying ? (
              <Pause className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            )}
          </button>

          {/* Authentication State: Logged In vs Logged Out */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              {/* Profile Avatar Button */}
              <button
                id="header-profile-btn"
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 p-1 pr-2 rounded-full bg-[#1c1b1f] hover:bg-red-950/60 border border-white/10 hover:border-red-600/60 text-white transition-all cursor-pointer"
                title={`الملف الشخصي: ${currentUser.name}`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-red-900 border border-red-500/70 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{currentUser.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-xs font-semibold max-w-[80px] truncate hidden md:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              {/* Logout Button */}
              <button
                id="header-logout-btn"
                type="button"
                onClick={onLogout}
                className="p-2 rounded-full bg-[#1a191d] hover:bg-red-950/70 border border-white/10 hover:border-red-800 text-[#ac8884] hover:text-red-300 transition-colors cursor-pointer"
                title="تسجيل الخروج"
                aria-label="تسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Login Button (prominent) */
            <button
              id="header-login-btn"
              type="button"
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_14px_rgba(220,38,38,0.6)] transition-all cursor-pointer"
              title="تسجيل الدخول إلى DarkTales"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>دخول</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
