import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import type { AppDocument } from '../types/t2q';
import type { Collection, Story } from '../types';

const APPS_COLLECTION = 'apps';
const STORIES_COLLECTION = 'stories';
const COLLECTIONS_COLLECTION = 'collections';

function docToApp(docSnap: QueryDocumentSnapshot<DocumentData>): AppDocument {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title ?? '',
    description: data.description ?? '',
    thumbnail: data.thumbnail ?? '',
    appType: data.appType ?? 'story',
    t2qContent: data.t2qContent,
    storyContent: data.storyContent,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    createdBy: data.createdBy ?? '',
    creatorAvatar: data.creatorAvatar ?? '',
    isPublic: data.isPublic ?? false,
    rating: data.rating,
    ratingCount: data.ratingCount,
    version: data.version,
    size: data.size,
    views: data.views,
    contentRating: data.contentRating,
    category: data.category,
    tags: data.tags,
    reviews: data.reviews,
  };
}

/** Fetch all public apps from Firestore */
export async function fetchPublicApps(): Promise<AppDocument[]> {
  if (!db) return [];
  const q = query(
    collection(db, APPS_COLLECTION),
    where('isPublic', '==', true),
    limit(50),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToApp);
}

/** Fetch a single app by ID from Firestore */
export async function fetchAppById(id: string): Promise<AppDocument | null> {
  if (!db) return null;
  const docRef = doc(db, APPS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docToApp(docSnap as QueryDocumentSnapshot<DocumentData>);
  }
  return null;
}

/** Fetch all stories (hero banners & circles) from Firestore */
export async function fetchStories(): Promise<Story[]> {
  if (!db) return [];
  const snapshot = await getDocs(collection(db, STORIES_COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Story));
}

/** Fetch all collections from Firestore */
export async function fetchCollections(): Promise<Collection[]> {
  if (!db) return [];
  const snapshot = await getDocs(collection(db, COLLECTIONS_COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Collection));
}

/** Save a new app to Firestore */
export async function createApp(data: Omit<AppDocument, 'id' | 'createdAt'>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = await addDoc(collection(db, APPS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Update an existing app */
export async function updateApp(id: string, data: Partial<Omit<AppDocument, 'id' | 'createdAt'>>): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(db, APPS_COLLECTION, id);
  await updateDoc(docRef, { ...data });
}

/** Delete an app */
export async function deleteApp(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(db, APPS_COLLECTION, id);
  await deleteDoc(docRef);
}

/** Submit a rating and review for an app — saves the user's actual rating and review */
export async function submitReview(
  appId: string,
  review: { author: string; rating: number; title: string; content: string },
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(db, APPS_COLLECTION, appId);
  const now = new Date().toISOString();
  const newReview = {
    id: `r-${Date.now()}`,
    author: review.author,
    rating: review.rating,
    title: review.title,
    content: review.content,
    date: now,
  };

  // Get current doc to compute new average rating
  const docSnap = await getDoc(docRef);
  const existingReviews = docSnap.exists() ? (docSnap.data().reviews ?? []) : [];
  const allReviews = [...existingReviews, newReview];
  const avgRating = allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / allReviews.length;

  await updateDoc(docRef, {
    reviews: allReviews,
    rating: Math.round(avgRating * 10) / 10,
    ratingCount: allReviews.length,
  });
}

/** Save a quiz score session */
export async function saveScoreSession(
  appId: string,
  data: {
    userId: string;
    userName: string;
    score: number;
    total: number;
    percentage: number;
  },
): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = await addDoc(collection(db, 'scoreSessions'), {
    appId,
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Fetch apps created by a specific user */
export async function fetchUserApps(userId: string): Promise<AppDocument[]> {
  if (!db) return [];
  const q = query(
    collection(db, APPS_COLLECTION),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToApp);
}
