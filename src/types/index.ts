// StoryBox 知識盒子 type definitions

export interface Content {
  id: string;
  title: string;
  subtitle: string;
  iconUrl: string;
  imageUrl?: string;
  price?: number;
  rating?: number;
  ratingCount?: number;
  category?: string;
  contentType: 'APP' | 'MOVIE' | 'BOOK';
  genre?: string[];
  description?: string;
  version?: string;
  size?: string;
  screenshots?: string[];
  action?: ContentAction;
  // Book-specific
  publisher?: string;
  pages?: number;
  language?: string;
  isbn?: string;
  publishedDate?: string;
  // Detail extras
  whatsNew?: string;
  reviews?: Review[];
}

export interface ContentAction {
  label: string;
  subtitle?: string;
  loading?: boolean;
  onPress?: () => void;
}

export interface Story {
  id: string;
  title: string;
  subtitle?: string;
  legend?: string;
  imageUrl: string;
  backgroundColor?: string;
  hero?: boolean;
  content?: Content;
  contents?: Content[];
  date: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
}

export interface Collection {
  id: string;
  title: string;
  subtitle?: string;
  type: 'APP' | 'MOVIE' | 'BOOK';
  items: Content[];
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  items: Content[];
}

// UI State
export interface UIState {
  activeTab: TabType;
  isCardOpen: boolean;
  activeCardId: string | null;
  // Player state
  playingAppId: string | null;
  playingAppType: 'story' | 't2q_quiz' | null;
  // Detail screen before playing
  previewAppId: string | null;
  previewAppType: 'story' | 't2q_quiz' | null;
  showCreator: boolean;
  appFilter: string | null; // category filter for Apps tab
}

export type TabType = 'home' | 'search' | 'explore' | 'apps' | 'setting';

// Re-export T2Q types
export type {
  AppDocument,
  GameObject,
  Scene,
  ConversationScene,
  ConversationLine,
  QuizScene,
  ParseError,
  ParseResult,
} from './t2q';
