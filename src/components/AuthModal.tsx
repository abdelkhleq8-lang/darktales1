import React, { useState } from 'react';
import { X, Mail, Lock, User, Skull, ArrowRight, CheckCircle, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsLoading(true);
    audioEngine.playSFX('whoosh');

    // Simulate Google OAuth flow
    setTimeout(() => {
      const googleUser: UserProfile = {
        id: `user-google-${Date.now()}`,
        name: 'عبدالخالق (Google)',
        email: 'abdelkhleq8@gmail.com',
        handle: '@abdelkhleq',
        bio: 'مستكشف روايات الرعب وخوارق الطبيعة في DarkTales.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        membershipBadge: 'عضو موثق • Google OAuth',
        joinedDate: 'سبتمبر 2026',
        readCount: 28,
        immersionMinutes: 140,
        isLoggedIn: true,
      };

      onLoginSuccess(googleUser);
      setIsLoading(false);
      onClose();
    }, 600);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('يرجى ملء كافة الحقول المطلوبة');
      return;
    }

    if (tab === 'register' && !name.trim()) {
      setErrorMessage('يرجى إدخال اسمك للبدء');
      return;
    }

    setIsLoading(true);
    audioEngine.playSFX('whoosh');

    setTimeout(() => {
      const userName = tab === 'register' ? name.trim() : email.split('@')[0];
      const userHandle = handle.trim() ? `@${handle.replace('@', '')}` : `@${email.split('@')[0]}`;

      const authenticatedUser: UserProfile = {
        id: `user-email-${Date.now()}`,
        name: userName,
        email: email.trim(),
        handle: userHandle,
        bio: 'قارئ ومتابع لأحدث كوابيس وأساطير أرشيف DarkTales.',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        membershipBadge: 'عضو مسكون • DarkTales VIP',
        joinedDate: 'سبتمبر 2026',
        readCount: 16,
        immersionMinutes: 75,
        isLoggedIn: true,
      };

      onLoginSuccess(authenticatedUser);
      setIsLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-[#141316] border border-red-900/40 shadow-[0_0_50px_rgba(220,38,38,0.25)] p-5 md:p-7 overflow-hidden flex flex-col space-y-4">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-[#222125] text-[#ac8884] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            <Skull className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {tab === 'login' ? 'بوابة الدخول إلى DarkTales' : 'الانضمام إلى أرشيف الكوابيس'}
          </h2>
          <p className="text-xs text-[#ac8884] max-w-xs">
            سجل دخولك لحفظ كوابيسك المفضلة، نشر تجاربك، والمشاركة في همسات القراء.
          </p>
        </div>

        {/* Google OAuth Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1f1e23] hover:bg-[#28272c] active:scale-[0.98] border border-white/10 hover:border-red-600/40 text-white text-xs md:text-sm font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md"
          >
            {/* Google Icon SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>متابعة باستخدام حساب Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-red-950/60" />
          <span className="text-[10px] text-[#7a6f74] uppercase tracking-wider font-mono">
            أو عبر البريد الإلكتروني
          </span>
          <div className="flex-1 h-px bg-red-950/60" />
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#1b1a1e] p-1 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                : 'text-[#ac8884] hover:text-white'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                : 'text-[#ac8884] hover:text-white'
            }`}
          >
            حساب جديد
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {tab === 'register' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-white mb-1">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-2.5 w-4 h-4 text-[#8a7a7e]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="سفيان النجار"
                    className="w-full bg-[#1b1a1e] border border-red-950/60 focus:border-red-600 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-[#686266] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white mb-1">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@sofian_dark"
                  className="w-full bg-[#1b1a1e] border border-red-950/60 focus:border-red-600 rounded-xl px-3 py-2 text-xs text-white placeholder-[#686266] focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-white mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-2.5 w-4 h-4 text-[#8a7a7e]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@darktales.net"
                className="w-full bg-[#1b1a1e] border border-red-950/60 focus:border-red-600 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-[#686266] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-white mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-2.5 w-4 h-4 text-[#8a7a7e]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1b1a1e] border border-red-950/60 focus:border-red-600 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-[#686266] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{isLoading ? 'جاري التحقق...' : tab === 'login' ? 'دخول الأرشيف' : 'إنشاء الحساب وتوثيقه'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
