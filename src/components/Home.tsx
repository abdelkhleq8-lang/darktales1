'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { AutoPlayStoryCard } from './AutoPlayStoryCard';
import { seedStoriesIfEmpty } from '../services/firestoreStories';

export interface Story {
  id: string;
  title: string;
  content: string;
  authorName: string;
  audioUrl?: string;
  categoryLabel?: string;
}

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب القصص الحقيقية من قاعدة البيانات عند فتح الصفحة
  useEffect(() => {
    async function fetchStories() {
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedStories: Story[] = [];
        querySnapshot.forEach((doc) => {
          fetchedStories.push({ id: doc.id, ...doc.data() } as Story);
        });

        // إذا كانت قاعدة البيانات فارغة للمرة الأولى، نهيئ القصص الأولية تلقائياً
        if (fetchedStories.length === 0) {
          const seeded = await seedStoriesIfEmpty();
          if (seeded) {
            const retrySnapshot = await getDocs(q);
            retrySnapshot.forEach((doc) => {
              fetchedStories.push({ id: doc.id, ...doc.data() } as Story);
            });
          }
        }

        setStories(fetchedStories);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-600 font-serif animate-pulse text-lg">
        جاري استدعاء الأرواح وتحميل القصص...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <header className="max-w-xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold font-serif text-red-600 tracking-wider">DarkTales</h1>
        <p className="text-zinc-500 text-sm mt-2">أرشيف الرعب الحقيقي والتفاعلي</p>
      </header>

      {stories.length === 0 ? (
        <div className="text-center py-20 text-zinc-600 font-serif">
          لا توجد قصص مرعبة هنا بعد... الميدان خالي، كن أول من ينشر قصة رعب!
        </div>
      ) : (
        <div className="space-y-12">
          {stories.map((story) => (
            <AutoPlayStoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </main>
  );
}
