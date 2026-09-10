import React, { useState } from 'react';
import { Play, Pause, Volume2, Volume1, VolumeX, Sparkles, Sliders, Radio, Music } from 'lucide-react';
import { audioEngine, AmbientSoundType } from '../utils/audioEngine';
import { horrorSoundOptions, HorrorSoundOption } from '../data/sounds';

interface AmbientBannerProps {
  isPlaying: boolean;
  onToggle: () => void;
  title?: string;
  subtitle?: string;
  activeSoundType?: string;
  onChangeSoundType?: (type: AmbientSoundType | string) => void;
}

export const AmbientBanner: React.FC<AmbientBannerProps> = ({
  isPlaying,
  onToggle,
  title,
  subtitle,
  activeSoundType = 'wind',
  onChangeSoundType,
}) => {
  const [volume, setVolumeState] = useState<number>(audioEngine.getVolume());
  const [showControls, setShowControls] = useState<boolean>(false);

  // Find currently active sound option from horrorSoundOptions
  const currentSoundOption = horrorSoundOptions.find((s) => s.id === activeSoundType);
  const displayTitle = currentSoundOption?.name || title || 'ريح صرصر وأبواب تصرير';
  const displaySubtitle = currentSoundOption?.description || subtitle || 'مؤثر 8D سينمائي فائق الوضوح • أجواء كوابيس حية';

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolumeState(val);
    audioEngine.setVolume(val);
  };

  const handleSoundSelect = (option: HorrorSoundOption) => {
    if (onChangeSoundType) {
      onChangeSoundType(option.id as AmbientSoundType);
    } else {
      audioEngine.play(option.id, option.url);
    }
  };

  const handleTestSFX = (type: 'jumpscare' | 'footsteps' | 'screams') => {
    audioEngine.playSFX(type);
  };

  return (
    <section id="ambient-sound-banner" className="w-full select-none">
      <div className="relative overflow-hidden rounded-2xl bg-[#161518]/95 border border-red-900/40 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_20px_rgba(220,38,38,0.2)] p-3.5 md:p-4 flex flex-col gap-3">
        {/* Ambient Red Glow */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Main Row: Play button + Title + Equalizer + Controls toggle */}
        <div className="flex items-center justify-between gap-3 z-10">
          {/* Play Button & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              id="ambient-banner-play-btn"
              type="button"
              onClick={onToggle}
              aria-label={isPlaying ? 'إيقاف البث الصوتي' : 'تشغيل البث الصوتي الحي'}
              className={`relative w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 active:scale-95 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-red-600 shadow-[0_0_22px_rgba(220,38,38,0.85)] ring-2 ring-red-400'
                  : 'bg-red-700/90 hover:bg-red-600 shadow-[0_0_14px_rgba(220,38,38,0.5)]'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white text-white" />
              ) : (
                <Play className="w-5 h-5 fill-white text-white translate-x-[-1px]" />
              )}
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full bg-red-500 ${isPlaying ? 'animate-ping' : ''}`} />
                <span className="text-[10px] md:text-xs text-red-400 font-bold uppercase tracking-widest">
                  بث صوتي رعب محيطي
                </span>
                {currentSoundOption?.icon && (
                  <span className="text-xs">{currentSoundOption.icon}</span>
                )}
              </div>
              <span className="text-sm md:text-base font-bold text-white truncate">
                {displayTitle}
              </span>
              <span className="text-xs text-[#ac8884] truncate">
                {displaySubtitle}
              </span>
            </div>
          </div>

          {/* Equalizer Bars & Expand Settings Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Animated Equalizer Bars */}
            <div className="flex items-end gap-[3px] h-7 px-1">
              <span
                className={`w-[3px] rounded-full bg-red-500 ${
                  isPlaying ? 'h-4 animate-[pulse_0.8s_ease-in-out_infinite]' : 'h-1.5'
                }`}
              />
              <span
                className={`w-[3px] rounded-full bg-red-600 ${
                  isPlaying ? 'h-6 animate-[pulse_0.6s_ease-in-out_infinite]' : 'h-2'
                }`}
              />
              <span
                className={`w-[3px] rounded-full bg-red-400 ${
                  isPlaying ? 'h-5 animate-[pulse_1.1s_ease-in-out_infinite]' : 'h-1.5'
                }`}
              />
              <span
                className={`w-[3px] rounded-full bg-red-600 ${
                  isPlaying ? 'h-7 animate-[pulse_0.7s_ease-in-out_infinite]' : 'h-2.5'
                }`}
              />
              <span
                className={`w-[3px] rounded-full bg-red-500 ${
                  isPlaying ? 'h-3 animate-[pulse_1.3s_ease-in-out_infinite]' : 'h-1'
                }`}
              />
            </div>

            {/* Expand Controls Toggle */}
            <button
              type="button"
              onClick={() => setShowControls((prev) => !prev)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showControls
                  ? 'bg-red-950 border-red-600 text-white'
                  : 'bg-[#1c1b1f] border-white/10 text-[#ac8884] hover:text-white'
              }`}
              title="التحكم بمستوى الصوت والمؤثرات"
            >
              <Sliders className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">الأجواء ({horrorSoundOptions.length})</span>
            </button>
          </div>
        </div>

        {/* Expandable Audio Tuning & Horror Sound Options Drawer */}
        {showControls && (
          <div className="pt-2 border-t border-red-950/40 z-10 space-y-3 animate-in fade-in duration-200">
            {/* Volume Control Slider & SFX Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-[#111013] p-2.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold shrink-0">
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-zinc-500" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
                <span>مستوى الصوت: {Math.round(volume * 100)}%</span>
              </div>

              <input
                id="audio-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 accent-red-600 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                title="ضبط مستوى الصوت"
              />

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleTestSFX('footsteps')}
                  className="px-2 py-1 rounded-lg bg-[#201e24] hover:bg-red-950 border border-white/10 text-zinc-300 text-[11px] font-semibold transition-colors cursor-pointer"
                  title="تجربة صوت وقع أقدام"
                >
                  👣 خطوة
                </button>
                <button
                  type="button"
                  onClick={() => handleTestSFX('screams')}
                  className="px-2 py-1 rounded-lg bg-[#201e24] hover:bg-red-950 border border-white/10 text-zinc-300 text-[11px] font-semibold transition-colors cursor-pointer"
                  title="تجربة صدى صرخة بعيدة"
                >
                  😱 صرخة
                </button>
                <button
                  type="button"
                  onClick={() => handleTestSFX('jumpscare')}
                  className="px-2.5 py-1 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-700/60 text-red-300 text-[11px] font-bold transition-colors cursor-pointer"
                  title="تجربة فزعة فجائية"
                >
                  ⚡ فزعة
                </button>
              </div>
            </div>

            {/* horrorSoundOptions Selector Grid */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#ac8884] mb-1.5 font-semibold">
                <span>اختر المؤثر الصوتي المفضل:</span>
                <span className="text-[10px] text-zinc-500 font-mono">Web Audio + 8D Spatial</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {horrorSoundOptions.map((option) => {
                  const isOptionActive = activeSoundType === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSoundSelect(option)}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer text-right ${
                        isOptionActive && isPlaying
                          ? 'bg-red-950/80 text-white border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                          : isOptionActive
                          ? 'bg-red-950/40 text-red-300 border-red-800/60'
                          : 'bg-[#1b1a1f] text-[#ac8884] hover:text-white border-white/5 hover:border-red-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base shrink-0">{option.icon}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-white text-xs truncate">
                            {option.name}
                          </span>
                          <span className="text-[10px] text-[#8e858a] truncate">
                            {option.description}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-mono ${
                          isOptionActive && isPlaying
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-black/40 text-zinc-400'
                        }`}
                      >
                        {isOptionActive && isPlaying ? 'يعمل الآن' : 'تشغيل'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
