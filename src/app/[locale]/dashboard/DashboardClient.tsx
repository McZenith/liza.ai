"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import DashboardSidebar, { TabType } from "./DashboardSidebar";
import ResearchContent from "./ResearchContent";
import ExploreContent, { addToSearchHistory } from "./ExploreContent";
import CreateContent from "./CreateContent";
import ScheduleContent from "./ScheduleContent";
import AnalyticsContent from "./AnalyticsContent";
import AccountsContent from "./AccountsContent";
import SettingsContent from "./SettingsContent";
import LanguageThemeSwitcher from "@/components/LanguageThemeSwitcher";

interface DashboardClientProps {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
  translations: {
    welcome: string;
    subtitle: string;
    signOut: string;
    quickActions: string;
    researchContent: string;
    schedulePosts: string;
    viewAnalytics: string;
    manageAccounts: string;
    explore?: string;
    research?: string;
    exploreSubtitle?: string;
    settings?: string;
    create?: string;
  };
}

export default function DashboardClient({ user, translations }: DashboardClientProps) {
  const t = useTranslations('dashboard');
  const [activeTab, setActiveTab] = useState<TabType>("explore");
  const [initialKeyword, setInitialKeyword] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Tab subtitles using translations
  const getTabSubtitle = (tab: TabType): string => {
    const subtitles: Record<TabType, string> = {
      explore: t('exploreSubtitle'),
      research: t('researchTab.subtitle'),
      create: t('createTab.subtitle'),
      schedule: t('scheduleTab.subtitle'),
      analytics: t('analyticsTab.subtitle'),
      accounts: t('accountsTab.subtitle'),
      settings: t('settingsTab.subtitle'),
    };
    return subtitles[tab];
  };

  // Handle keyword click from Explore tab - switch to Research and start analysis
  const handleKeywordClick = (keyword: string) => {
    addToSearchHistory(keyword);
    setInitialKeyword(keyword);
    setActiveTab("research");
  };

  // Handle tab change from sidebar
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== "research") {
      setInitialKeyword(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#FF4F00] blur-[180px] opacity-5" />
        <div className="absolute bottom-[30%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#8B5CF6] blur-[200px] opacity-5" />
      </div>

      {/* Sidebar */}
      <DashboardSidebar
        user={user}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        translations={{
          signOut: translations.signOut,
          researchContent: translations.researchContent,
          schedulePosts: translations.schedulePosts,
          viewAnalytics: translations.viewAnalytics,
          manageAccounts: translations.manageAccounts,
          explore: translations.explore,
          settings: translations.settings,
          create: translations.create,
        }}
      />

      {/* Main Content - Dynamic padding based on sidebar state */}
      <main className={`pt-16 lg:pt-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          {/* Welcome Section with Language/Theme Switcher */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                {translations.welcome}, {user.name.split(" ")[0]}! 👋
              </h1>
              <p className="text-[var(--text-secondary)]">
                {getTabSubtitle(activeTab)}
              </p>
            </div>
            <div className="hidden lg:block">
              <LanguageThemeSwitcher />
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "explore" && (
            <ExploreContent onKeywordClick={handleKeywordClick} />
          )}

          {activeTab === "research" && (
            <ResearchContent
              key={initialKeyword || "default"}
              initialKeyword={initialKeyword}
            />
          )}

          {activeTab === "create" && <CreateContent />}

          {activeTab === "schedule" && <ScheduleContent />}

          {activeTab === "analytics" && <AnalyticsContent />}

          {activeTab === "accounts" && <AccountsContent />}

          {activeTab === "settings" && <SettingsContent />}
        </div>
      </main>
    </div>
  );
}
