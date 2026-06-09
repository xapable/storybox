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
import { playableApps, stories as localStories, collections as localCollections } from '../data/playableApps';
import type { AppDocument } from '../types/t2q';
import type { Collection, Story } from '../types';

const APPS_COLLECTION = 'apps';
const STORIES_COLLECTION = 'stories';
const COLLECTIONS_COLLECTION = 'collections';

/** Local mock app lookup for offline/demo mode */
const mockAppMap = new Map(playableApps.map((a) => [a.id, a]));

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
    isPublic: data.isPublic ?? false,
    rating: data.rating,
    ratingCount: data.ratingCount,
    version: data.version,
    size: data.size,
    downloads: data.downloads,
    contentRating: data.contentRating,
    category: data.category,
    reviews: data.reviews,
  };
}

/** Fetch all public apps (with mock fallback) */
export async function fetchPublicApps(): Promise<AppDocument[]> {
  try {
    if (db) {
      const q = query(
        collection(db, APPS_COLLECTION),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        limit(50),
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(docToApp);
      }
    }
  } catch {
    // Firestore unavailable — use mock data
  }
  return [];
}

/** Fetch a single app by ID (Firestore first, then mock fallback) */
export async function fetchAppById(id: string): Promise<AppDocument | null> {
  try {
    if (db) {
      const docRef = doc(db, APPS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docToApp(docSnap as QueryDocumentSnapshot<DocumentData>);
      }
    }
  } catch {
    // Firestore unavailable — fall through to mock
  }
  return mockAppMap.get(id) ?? null;
}

/** Fetch all stories (hero banners & circles) from Firestore, fallback to local */
export async function fetchStories(): Promise<Story[]> {
  try {
    if (db) {
      const snapshot = await getDocs(collection(db, STORIES_COLLECTION));
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Story));
      }
    }
  } catch {
    // Firestore unavailable
  }
  return localStories;
}

/** Fetch all collections from Firestore, fallback to local */
export async function fetchCollections(): Promise<Collection[]> {
  try {
    if (db) {
      const snapshot = await getDocs(collection(db, COLLECTIONS_COLLECTION));
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Collection));
      }
    }
  } catch {
    // Firestore unavailable
  }
  return localCollections;
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
