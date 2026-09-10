'use client';
import React, { useState, useRef, useEffect } from 'react';
import { audioEngine } from '../utils/audioEngine';

export interface StoryCardProps {
  key?: React.Key;
  story: {
    id: string;
    title: string;
    content: string;
    authorName?: string;
    audioUrl?: string;
    categoryLabel?: string;
  };
}

export default function AutoPlayStoryCard({ story }: StoryCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const currentCard = cardRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const audioEl = audioRef.current;

        if (entry.isIntersecting) {
          // 1. التشغيل التلقائي عند الدخول: بمجرد ظهور كارت القصة على الشاشة
          if (audioEl && story.audioUrl) {
            audioEl
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {
                // If direct HTML audio is blocked, use Web Audio procedural synthesizer
                audioEngine.play('wind_whisper');
                setIsPlaying(true);
              });
          } else {
            audioEngine.play('wind_whisper');
            setIsPlaying(true);
          }
        } else {
          // 2. الإيقاف التلقائي الفوري عند الخروج أو التمرير بعيداً: ينقطع الصوت فوراً ويعود للبداية
          if (audioEl) {
            try {
              audioEl.pause();
              audioEl.currentTime = 0;
            } catch {
              // Ignore
            }
          }
          audioEngine.stop();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    if (currentCard) {
      observer.observe(currentCard);
    }

    return () => {
      if (currentCard) {
        observer.unobserve(currentCard);
      }
      const audioEl = audioRef.current;
      if (audioEl) {
        try {
          audioEl.pause();
          audioEl.currentTime = 0;
        } catch {
          // Ignore
        }
      }
      audioEngine.stop();
      setIsPlaying(false);
    };
  }, [story.audioUrl]);

  return (
    <div
      ref={cardRef}
      id={`autoplay-story-card-${story.id}`}
      className="relative w-full max-w-xl mx-auto my-8 p-6 rounded-2xl bg-black/70 border border-red-950 backdrop-blur-xl shadow-2xl shadow-red-950/30 text-white overflow-hidden transition-all"
    >
      <div className="absolute top-4 left-4 flex items-center space-x-2 space-x-reverse bg-red-950/60 border border-red-800/50 px-3 py-1 rounded-full">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isPlaying ? 'bg-red-500 animate-ping' : 'bg-zinc-600'
          }`}
        ></span>
        <span className="text-xs font-serif text-red-300">
          {isPlaying ? 'يتم التشغيل الآن...' : 'متوقف'}
        </span>
      </div>

      <h2 className="text-2xl font-bold font-serif text-red-500 mb-3">{story.title}</h2>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-sans text-sm md:text-base mb-4">
        {story.content}
      </p>

      <div className="text-xs text-zinc-500 border-t border-zinc-900 pt-3 flex justify-between items-center">
        <span>بواسطة: {story.authorName || 'مجهول'}</span>
        {story.categoryLabel && (
          <span className="text-red-400">{story.categoryLabel}</span>
        )}
      </div>

      {story.audioUrl && (
        <audio
          ref={audioRef}
          src={story.audioUrl}
          loop
          preload="auto"
        />
      )}
    </div>
  );
}

export { AutoPlayStoryCard };

