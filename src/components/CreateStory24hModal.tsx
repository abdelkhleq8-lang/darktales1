import React, { useState, useRef } from 'react';
import { X, Flame, Image as ImageIcon, Send, Volume2, Upload } from 'lucide-react';
import { Story24H, UserProfile } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { horrorSoundOptions } from '../data/sounds';

interface CreateStory24hModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onPublishStory24h: (newStory: Story24H) => void;
}

const PRESET_BACKGROUNDS = [
  {
    id: 'bg-1',
    label: 'ممر مظلم',
    url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'bg-2',
    label: 'غابة مسكونة',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'bg-3',
    label: 'مرآة عتيقة',
    url: 'https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'bg-4',
    label: 'قبو مهجور',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=900&auto=format&fit=crop&q=80',
  },
];

export const CreateStory24hModal: React.FC<CreateStory24hModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPublishStory24h,
}) => {
  const [caption, setCaption] = useState('');
  const [selectedBg, setSelectedBg] = useState(PRESET_BACKGROUNDS[0].url);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [ambientSound, setAmbientSound] = useState<Story24H['ambientSound']>('wind');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomImage(reader.result);
          setSelectedBg(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSoundPreview = (sound: Story24H['ambientSound']) => {
    setAmbientSound(sound);
    if (sound === 'footsteps') {
      audioEngine.playSFX('footsteps');
    } else if (sound === 'screams') {
      audioEngine.playSFX('screams');
    } else if (sound === 'wind') {
      audioEngine.playSFX('creak');
    } else if (sound === 'whispers' || sound === 'whisper') {
      audioEngine.playSFX('whisper');
    } else {
      audioEngine.playSFX('jumpscare');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setIsSubmitting(true);
    audioEngine.playSFX('whisper');

    const now = Date.now();
    const newStory: Story24H = {
      id: `story-24-${now}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorBadge: currentUser.membershipBadge,
      mediaUrl: customImage || selectedBg,
      caption: caption.trim(),
      ambientSound,
      createdAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
      viewsCount: 1,
      isViewed: false,
      isMine: true,
    };

    setTimeout(() => {
      onPublishStory24h(newStory);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div
      id="create-story-24h-modal"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#151417] border border-red-900/40 shadow-[0_0_40px_rgba(220,38,38,0.25)] p-5 md:p-6 overflow-hidden flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-950/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">نشر كابوس سريع (٢٤ ساعة)</h3>
              <p className="text-[11px] text-[#ac8884]">
                تجربة فورية تختفي بعد يوم كامل من الأرشيف الحي
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#222126] text-[#ac8884] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Spooky Caption */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              نص الكابوس السريع (ما الذي تراه أو تسمعه الآن؟)
            </label>
            <textarea
              required
              rows={3}
              maxLength={220}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="مثال: صوت طرقات خافتة على زجاج نافذة غرفتي في الطابق الرابع..."
              className="w-full bg-[#1b1a1f] border border-red-950/60 focus:border-red-600 rounded-xl p-3 text-sm text-white placeholder-[#726b70] focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex justify-between items-center text-[10px] text-[#8e7a78] px-1 mt-1">
              <span>احرص على الإيجاز والتشويق</span>
              <span>{caption.length} / 220</span>
            </div>
          </div>

          {/* Background Selection & Custom Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-white">
                خلفية المشهد المرعب
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-semibold"
              >
                <Upload className="w-3 h-3" />
                <span>رفع صورة من جهازك</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {PRESET_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => {
                    setSelectedBg(bg.url);
                    setCustomImage(null);
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                    selectedBg === bg.url && !customImage
                      ? 'border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.7)] scale-95'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={bg.url}
                    alt={bg.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute inset-x-0 bottom-0 py-0.5 bg-black/75 text-[9px] text-white text-center truncate">
                    {bg.label}
                  </span>
                </button>
              ))}
            </div>

            {customImage && (
              <div className="mt-2 p-2 rounded-xl bg-red-950/30 border border-red-800/40 flex items-center gap-2">
                <img
                  src={customImage}
                  alt="Custom upload"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <span className="text-xs text-red-300">تم اختيار صورتك المخصصة بنجاح</span>
              </div>
            )}
          </div>

          {/* Horror Sound Effect */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              المؤثر الصوتي المرعب المرافق
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {horrorSoundOptions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSoundPreview(s.id as Story24H['ambientSound'])}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer text-right ${
                    ambientSound === s.id
                      ? 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_10px_rgba(220,38,38,0.4)]'
                      : 'bg-[#1e1d22] border-white/5 text-[#ac8884] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{s.icon}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-white truncate">{s.name}</span>
                      <span className="text-[10px] text-zinc-400 truncate">{s.description}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-red-400 font-mono shrink-0">
                    {ambientSound === s.id ? 'محدد' : 'معاينة'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
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
              disabled={isSubmitting || !caption.trim()}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'جاري النشر...' : 'نشر الكابوس الآن'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
