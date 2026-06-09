import { useUIStore } from '../store';
import { useLanguage, tKey } from '../i18n';

const tabKeys = ['home', 'search', 'explore', 'apps', 'setting'] as const;

const icons: Record<string, string> = {
  home:    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1',
  search:  'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  explore: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  apps:    'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  setting: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81a.484.484 0 00-.41-.31h-3.98a.49.49 0 00-.43.32l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.7 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.2.24.34.43.34h3.98c.2 0 .38-.13.43-.32l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
};

export default function TabBar() {
  const { state, setTab } = useUIStore();
  const { lang } = useLanguage();

  return (
    <nav className="tab-bar">
      {tabKeys.map((key) => {
        const active = state.activeTab === key;
        return (
          <button
            key={key}
            type="button"
            className={`tab-bar__item ${active ? 'tab-bar__item--active' : ''}`}
            onClick={() => setTab(key as never)}
          >
            <svg
              className="tab-bar__icon"
              width="24" height="24" viewBox="0 0 24 24"
              fill="none"
              stroke={active ? '#01875f' : '#9aa0a6'}
              strokeWidth={active ? 2.5 : 1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={icons[key]} />
            </svg>
            <span className="tab-bar__label">{tKey(`tab_${key}`, lang)}</span>
          </button>
        );
      })}
    </nav>
  );
}
