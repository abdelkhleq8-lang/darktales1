import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Story } from '../types';
import { INITIAL_STORIES } from '../data/stories';

export interface FirestoreStory {
  id: string;
  title: string;
  content: string;
  authorName: string;
  audioUrl?: string;
  category?: string;
  categoryLabel?: string;
  subGenreLabel?: string;
  likesCount?: number;
  readTimeMinutes?: number;
  coverImage?: string;
  createdAt?: any;
}

const STORIES_COLLECTION = 'stories';

/**
 * Fetch all stories from Firestore ordered by createdAt descending
 */
export async function fetchStoriesFromFirestore(): Promise<Story[]> {
  try {
    const q = query(
      collection(db, STORIES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const stories: Story[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      stories.push({
        id: docSnap.id,
        title: data.title || '',
        excerpt: data.excerpt || (data.content ? data.content.slice(0, 140) + '...' : ''),
        content: data.content || '',
        coverImage: data.coverImage || 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=900&auto=format&fit=crop&q=80',
        author: {
          id: data.authorId || 'author-anon',
          name: data.authorName || 'مجهول',
          badge: data.authorBadge || 'كاتب رعب',
        },
        category: data.category || 'haunted_houses',
        categoryLabel: data.categoryLabel || 'رعب عام',
        subGenreLabel: data.subGenreLabel || 'أرشيف موثق',
        readTimeMinutes: data.readTimeMinutes || 5,
        likesCount: data.likesCount || 0,
        isLiked: false,
        isSaved: false,
        featured: data.featured || false,
        audioUrl: data.audioUrl,
        ambientAudio: {
          title: data.ambientAudioTitle || 'مؤثرات تفاعلية',
          duration: '05:00',
          type: data.ambientAudioType || 'wind_whisper',
          defaultActive: false,
        },
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('ar-EG') : (data.createdAt || 'الآن'),
      });
    });

    return stories;
  } catch (error) {
    console.error('Error fetching stories from Firestore:', error);
    return [];
  }
}

/**
 * Publish a new story to Firestore
 */
export async function addStoryToFirestore(storyData: {
  title: string;
  content: string;
  excerpt?: string;
  authorName: string;
  authorBadge?: string;
  audioUrl?: string;
  ambientAudioType?: string;
  ambientAudioTitle?: string;
  category?: string;
  categoryLabel?: string;
  subGenreLabel?: string;
  coverImage?: string;
  readTimeMinutes?: number;
}): Promise<string> {
  const docRef = await addDoc(collection(db, STORIES_COLLECTION), {
    title: storyData.title,
    content: storyData.content,
    excerpt: storyData.excerpt || storyData.content.slice(0, 140) + '...',
    authorName: storyData.authorName,
    authorBadge: storyData.authorBadge || 'كاتب جديد',
    audioUrl: storyData.audioUrl || '',
    ambientAudioType: storyData.ambientAudioType || 'wind_creak',
    ambientAudioTitle: storyData.ambientAudioTitle || 'مؤثر صوتي رعب',
    category: storyData.category || 'dark_entities',
    categoryLabel: storyData.categoryLabel || 'كيانات مظلمة',
    subGenreLabel: storyData.subGenreLabel || 'محاضر موثقة',
    coverImage: storyData.coverImage || 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=900&auto=format&fit=crop&q=80',
    readTimeMinutes: storyData.readTimeMinutes || 5,
    likesCount: 0,
    featured: false,
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
}

/**
 * Seeds initial horror stories to Firestore if collection is currently empty
 */
export async function seedStoriesIfEmpty(): Promise<boolean> {
  try {
    const existingSnap = await getDocs(collection(db, STORIES_COLLECTION));
    if (existingSnap.empty) {
      console.log('Seeding initial stories to Firestore...');
      for (const story of INITIAL_STORIES) {
        await setDoc(doc(db, STORIES_COLLECTION, story.id), {
          title: story.title,
          excerpt: story.excerpt,
          content: story.content,
          authorName: story.author.name,
          authorBadge: story.author.badge,
          audioUrl: story.audioUrl || 'https://example.com/audio/creaking-door-wind.mp3',
          category: story.category,
          categoryLabel: story.categoryLabel,
          subGenreLabel: story.subGenreLabel,
          coverImage: story.coverImage,
          readTimeMinutes: story.readTimeMinutes,
          likesCount: story.likesCount,
          featured: story.featured || false,
          createdAt: new Date().toISOString(),
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error seeding stories to Firestore:', error);
    return false;
  }
}
