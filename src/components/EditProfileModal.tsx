import React, { useState, useRef } from 'react';
import { X, Upload, Check, User, AtSign, FileText, Camera, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

const AVATAR_PRESETS = [
  {
    id: 'av-1',
    label: 'جمجمة مقدسة',
    url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-2',
    label: 'شبح الظلال',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-3',
    label: 'غراب الليل',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-4',
    label: 'كاهن الأسرار',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [handle, setHandle] = useState(currentUser.handle.replace('@', ''));
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar || AVATAR_PRESETS[0].url);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          audioEngine.playSFX('whoosh');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playSFX('whoosh');

    const updatedProfile: UserProfile = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      handle: `@${handle.trim().replace('@', '') || 'reader'}`,
      bio: bio.trim(),
      avatar,
    };

    onSaveProfile(updatedProfile);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div
      id="edit-profile-modal"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#141316] border border-red-900/40 shadow-[0_0_50px_rgba(220,38,38,0.3)] p-5 md:p-6 overflow-hidden flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-950/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">تعديل الملف الشخصي والإعدادات</h3>
              <p className="text-[11px] text-[#ac8884]">
                تحديث هويتك في أرشيف كوابيس DarkTales
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#222125] text-[#ac8884] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSavedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs font-semibold text-center animate-bounce">
            تم حفظ التعديلات في الملف الشخصي وقاعدة البيانات بنجاح!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar Edit Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-2xl bg-[#1a191d] border border-white/5">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-red-950 border-2 border-red-600/70 overflow-hidden shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-red-400 font-bold text-xl">
                    {name.charAt(0)}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] cursor-pointer"
                title="تغيير الصورة"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span>رفع</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarFileUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-2 text-center sm:text-right">
              <div>
                <span className="text-xs font-semibold text-white block">
                  الصورة الشخصية (Avatar)
                </span>
                <span className="text-[11px] text-[#ac8884]">
                  اختر صورة مرعبة من الأرشيف أو ارفع صورتك من جهازك
                </span>
              </div>

              {/* Avatar Presets */}
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                {AVATAR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setAvatar(p.url);
                      audioEngine.playSFX('whoosh');
                    }}
                    className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      avatar === p.url
                        ? 'border-red-500 scale-105 shadow-[0_0_10px_rgba(220,38,38,0.6)]'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                    title={p.label}
                  >
                    <img
                      src={p.url}
                      alt={p.label}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-800/40 text-red-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
                  title="رفع صورة خاصة"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Name & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                الاسم الظاهر
              </label>
              <div className="relative">
                <User className="absolute right-3 top-2.5 w-4 h-4 text-[#8a7a7e]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اسمك أو لقبك المستعار"
                  className="w-full bg-[#1c1b20] border border-red-950/60 focus:border-red-600 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-[#686266] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                اسم المستخدم (Handle)
              </label>
              <div className="relative">
                <AtSign className="absolute right-3 top-2.5 w-4 h-4 text-[#8a7a7e]" />
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="username"
                  className="w-full bg-[#1c1b20] border border-red-950/60 focus:border-red-600 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-[#686266] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              النبذة التعريفية (Bio)
            </label>
            <textarea
              rows={3}
              maxLength={260}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="اكتب نبذة عن اهتمامك بالقصص والرعب أو التجارب الخارقة..."
              className="w-full bg-[#1c1b20] border border-red-950/60 focus:border-red-600 rounded-xl p-3 text-xs md:text-sm text-white placeholder-[#686266] focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex justify-between items-center text-[10px] text-[#8e7a78] px-1 mt-1">
              <span>تظهر هذه النبذة للقراء في صفحتك وأسفل مساهماتك</span>
              <span>{bio.length} / 260</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-red-950/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#ac8884] hover:text-white transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs md:text-sm flex items-center gap-1.5 shadow-[0_0_16px_rgba(220,38,38,0.5)] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديلات فوراً</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
