import { UIStoreProvider, useUIStore } from './store';
import { LanguageProvider } from './i18n';
import TabBar from './components/TabBarNav';
import DetailPage from './components/detail-page';
import HomeScreen from './screens/home';
import SearchScreen from './screens/search';
import ExploreScreen from './screens/explore';
import AppsScreen from './screens/apps';
import SettingScreen from './screens/setting';
import type { TabType } from './types';
import './App.css';

function ScreenRouter() {
  const { state } = useUIStore();

  const screens: Record<TabType, React.ReactNode> = {
    home: <HomeScreen />,
    search: <SearchScreen />,
    explore: <ExploreScreen />,
    apps: <AppsScreen />,
    setting: <SettingScreen />,
  };

  return (
    <>
      <main className="app-main">
        {screens[state.activeTab]}
        <TabBar />
      </main>
      <DetailPage />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <UIStoreProvider>
        <ScreenRouter />
      </UIStoreProvider>
    </LanguageProvider>
  );
}
