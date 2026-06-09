import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { UIState, TabType, UserApp } from '../types';

// Actions
type UIAction =
  | { type: 'SET_TAB'; payload: TabType }
  | { type: 'SET_CARD_OPEN'; payload: { cardId: string; isOpen: boolean } }
  | { type: 'PLAY_APP'; payload: { appId: string; appType: 'story' | 't2q_quiz' } | null }
  | { type: 'PREVIEW_APP'; payload: { appId: string; appType: 'story' | 't2q_quiz' } | null }
  | { type: 'TOGGLE_CREATOR'; payload: boolean }
  | { type: 'SET_APP_FILTER'; payload: string | null }
  | { type: 'SET_MY_APPS'; payload: UserApp[] }
  | { type: 'CREATE_APP'; payload: UserApp };

// Initial state
const initialState: UIState = {
  activeTab: 'home',
  isCardOpen: false,
  activeCardId: null,
  playingAppId: null,
  playingAppType: null,
  previewAppId: null,
  previewAppType: null,
  showCreator: false,
  appFilter: null,
  createdApps: [],
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
    default:
      return state;
  }
}

// Context
interface UIStoreContextValue {
  state: UIState;
  setTab: (tab: TabType) => void;
  setCardOpen: (cardId: string, isOpen: boolean) => void;
  playApp: (appId: string | null, appType?: 'story' | 't2q_quiz') => void;
  previewApp: (appId: string, appType: 'story' | 't2q_quiz') => void;
  closePreview: () => void;
  toggleCreator: (show: boolean) => void;
  setAppFilter: (filter: string | null) => void;
  setMyApps: (apps: UserApp[]) => void;
  createApp: (app: UserApp) => void;
}

const UIStoreContext = createContext<UIStoreContextValue | null>(null);

// Provider
export function UIStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const setTab = (tab: TabType) => dispatch({ type: 'SET_TAB', payload: tab });
  const setCardOpen = (cardId: string, isOpen: boolean) =>
    dispatch({ type: 'SET_CARD_OPEN', payload: { cardId, isOpen } });
  const playApp = (appId: string | null, appType?: 'story' | 't2q_quiz') =>
    dispatch({ type: 'PLAY_APP', payload: appId ? { appId, appType: appType ?? 't2q_quiz' } : null });
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

  return (
    <UIStoreContext.Provider value={{ state, setTab, setCardOpen, playApp, previewApp, closePreview, toggleCreator, setAppFilter, setMyApps, createApp }}>
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
