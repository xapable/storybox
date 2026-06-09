import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { UIState, TabType } from '../types';

// Actions
type UIAction =
  | { type: 'SET_TAB'; payload: TabType }
  | { type: 'SET_CARD_OPEN'; payload: { cardId: string; isOpen: boolean } };

// Initial state
const initialState: UIState = {
  activeTab: 'home',
  isCardOpen: false,
  activeCardId: null,
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
    default:
      return state;
  }
}

// Context
interface UIStoreContextValue {
  state: UIState;
  setTab: (tab: TabType) => void;
  setCardOpen: (cardId: string, isOpen: boolean) => void;
}

const UIStoreContext = createContext<UIStoreContextValue | null>(null);

// Provider
export function UIStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const setTab = (tab: TabType) => dispatch({ type: 'SET_TAB', payload: tab });
  const setCardOpen = (cardId: string, isOpen: boolean) =>
    dispatch({ type: 'SET_CARD_OPEN', payload: { cardId, isOpen } });

  return (
    <UIStoreContext.Provider value={{ state, setTab, setCardOpen }}>
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
