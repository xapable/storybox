// T2Q (Text-to-Quiz) type definitions

/** A Firestore document in the `apps` collection */
export interface AppDocument {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  appType: 'story' | 't2q_quiz';
  t2qContent?: string;
  storyContent?: string;
  createdAt: Date;
  createdBy: string;
  creatorAvatar?: string;
  isPublic: boolean;
  // App store details
  rating?: number;
  ratingCount?: number;
  version?: string;
  size?: string;
  views?: string;
  contentRating?: string;
  category?: string;
  tags?: string[];
  reviews?: AppReview[];
}

export interface AppReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
}

/** The parsed game object produced by parseT2Q */
export interface GameObject {
  scenes: Scene[];
}

export type Scene = ConversationScene | QuizScene;

export interface ConversationScene {
  type: 'conversation';
  lines: ConversationLine[];
}

export interface ConversationLine {
  speaker: string;
  text: string;
}

export interface QuizScene {
  type: 'quiz';
  question: string;
  options: string[];
  correctIndex: number; // 0-based
}

/** A parse error with line number and message */
export interface ParseError {
  line: number;
  message: string;
}

/** Result of parsing — either success with GameObject or failure with errors */
export type ParseResult =
  | { ok: true; game: GameObject }
  | { ok: false; errors: ParseError[] };
