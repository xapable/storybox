import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { UIState, TabType, UserApp, Theme } from '../types';

// Actions
type UIAction =
  | { type: 'SET_TAB'; payload: TabType }
  | { type: 'SET_CARD_OPEN'; payload: { cardId: string; isOpen: boolean } }
  | { type: 'PLAY_APP'; payload: { appId: string; appType: 'story' | 't2q_quiz'; content?: string } | null }
  | { type: 'PREVIEW_APP'; payload: { appId: string; appType: 'story' | 't2q_quiz' } | null }
  | { type: 'TOGGLE_CREATOR'; payload: boolean }
  | { type: 'SET_APP_FILTER'; payload: string | null }
  | { type: 'SET_MY_APPS'; payload: UserApp[] }
  | { type: 'CREATE_APP'; payload: UserApp }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_THEME'; payload: Theme };

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('storybox-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

// Initial state
const initialState: UIState = {
  activeTab: 'home',
  isCardOpen: false,
  activeCardId: null,
  theme: getInitialTheme(),
  playingAppId: null,
  playingAppType: null,
  playingAppContent: null,
  previewAppId: null,
  previewAppType: null,
  showCreator: false,
  appFilter: null,
  createdApps: [],
  favorites: [],
};

// Reducer
function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_CARD_OPEN':
      return {
        ...state,
        isCardOpen: action.payload.isOpen,
        activeCardId: action.payload.isOpen ? action.payload.cardId : null,
      };
    case 'PLAY_APP':
      return {
        ...state,
        playingAppId: action.payload?.appId ?? null,
        playingAppType: action.payload?.appType ?? null,
        playingAppContent: action.payload?.content ?? null,
        previewAppId: null,
        previewAppType: null,
      };
    case 'PREVIEW_APP':
      return {
        ...state,
        previewAppId: action.payload?.appId ?? null,
        previewAppType: action.payload?.appType ?? null,
      };
    case 'TOGGLE_CREATOR':
      return { ...state, showCreator: action.payload };
    case 'SET_APP_FILTER':
      return { ...state, appFilter: action.payload };
    case 'SET_MY_APPS':
      return { ...state, createdApps: action.payload };
    case 'CREATE_APP':
      return { ...state, createdApps: [action.payload, ...state.createdApps] };
    case 'TOGGLE_FAVORITE': {
      const id = action.payload;
      const has = state.favorites.includes(id);
      return {
        ...state,
        favorites: has ? state.favorites.filter((fid) => fid !== id) : [...state.favorites, id],
      };
    }
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

// Context
interface UIStoreContextValue {
  state: UIState;
  setTab: (tab: TabType) => void;
  setCardOpen: (cardId: string, isOpen: boolean) => void;
  playApp: (appId: string | null, appType?: 'story' | 't2q_quiz', content?: string) => void;
  previewApp: (appId: string, appType: 'story' | 't2q_quiz') => void;
  closePreview: () => void;
  toggleCreator: (show: boolean) => void;
  setAppFilter: (filter: string | null) => void;
  setMyApps: (apps: UserApp[]) => void;
  createApp: (app: UserApp) => void;
  toggleFavorite: (id: string) => void;
  setTheme: (theme: Theme) => void;
}

const UIStoreContext = createContext<UIStoreContextValue | null>(null);

// Provider
export function UIStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const setTab = (tab: TabType) => dispatch({ type: 'SET_TAB', payload: tab });
  const setCardOpen = (cardId: string, isOpen: boolean) =>
    dispatch({ type: 'SET_CARD_OPEN', payload: { cardId, isOpen } });
  const playApp = (appId: string | null, appType?: 'story' | 't2q_quiz', content?: string) =>
    dispatch({ type: 'PLAY_APP', payload: appId ? { appId, appType: appType ?? 't2q_quiz', content } : null });
  const previewApp = (appId: string, appType: 'story' | 't2q_quiz') =>
    dispatch({ type: 'PREVIEW_APP', payload: { appId, appType } });
  const closePreview = () =>
    dispatch({ type: 'PREVIEW_APP', payload: null });
  const toggleCreator = (show: boolean) =>
    dispatch({ type: 'TOGGLE_CREATOR', payload: show });
  const setAppFilter = (filter: string | null) =>
    dispatch({ type: 'SET_APP_FILTER', payload: filter });
  const setMyApps = (apps: UserApp[]) =>
    dispatch({ type: 'SET_MY_APPS', payload: apps });
  const createApp = (app: UserApp) =>
    dispatch({ type: 'CREATE_APP', payload: app });
  const toggleFavorite = (id: string) =>
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  const setTheme = (theme: Theme) =>
    dispatch({ type: 'SET_THEME', payload: theme });

  // Sync theme to <html> data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('storybox-theme', state.theme);
  }, [state.theme]);

  return (
    <UIStoreContext.Provider value={{ state, setTab, setCardOpen, playApp, previewApp, closePreview, toggleCreator, setAppFilter, setMyApps, createApp, toggleFavorite, setTheme }}>
      {children}
    </UIStoreContext.Provider>
  );
}

// Hook
export function useUIStore() {
  const context = useContext(UIStoreContext);
  if (!context) {
    throw new Error('useUIStore must be used within a UIStoreProvider');
  }
  return context;
}
