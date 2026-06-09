import { useUIStore } from '../../store';
import type { TabType } from '../../types';
import './TabBar.css';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'movies', label: 'Movies', icon: '🎬' },
  { id: 'books', label: 'Books', icon: '📚' },
  { id: 'apps', label: 'Apps', icon: '📱' },
  { id: 'search', label: 'Search', icon: '🔍' },
];

export default function TabBar() {
  const { state, setTab } = useUIStore();

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab-bar__item ${state.activeTab === tab.id ? 'tab-bar__item--active' : ''}`}
          onClick={() => setTab(tab.id)}
        >
          <span className="tab-bar__icon">{tab.icon}</span>
          <span className="tab-bar__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
