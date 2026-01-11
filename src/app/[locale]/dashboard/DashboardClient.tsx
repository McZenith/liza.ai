"use client";

import { useState, useRef } from "react";
import DashboardSidebar from "./DashboardSidebar";
import ResearchContent from "./ResearchContent";
import ExploreContent, { addToSearchHistory } from "./ExploreContent";

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
  };
}

type TabType = "explore" | "research";

export default function DashboardClient({ user, translations }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("explore");
  const [initialKeyword, setInitialKeyword] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const exploreRef = useRef<{ openPreferences: () => void }>(null);

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

  // Handle settings click from sidebar
  const handleOpenSettings = () => {
    // Switch to Explore tab and open preferences panel
    setActiveTab("explore");
    setShowSettings(true);
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
        onOpenSettings={handleOpenSettings}
        translations={{
          signOut: translations.signOut,
          researchContent: translations.researchContent,
          schedulePosts: translations.schedulePosts,
          viewAnalytics: translations.viewAnalytics,
          manageAccounts: translations.manageAccounts,
          explore: translations.explore,
          settings: translations.settings,
        }}
      />

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
              {translations.welcome}, {user.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-[var(--text-secondary)]">
              {activeTab === "explore"
                ? (translations.exploreSubtitle || "Discover trending topics and opportunities in your niche")
                : translations.subtitle
              }
            </p>
          </div>

          {/* Tab Content */}
          {activeTab === "explore" && (
            <ExploreContent
              onKeywordClick={handleKeywordClick}
              autoOpenPreferences={showSettings}
              onPreferencesOpened={() => setShowSettings(false)}
            />
          )}

          {activeTab === "research" && (
            <ResearchContent
              key={initialKeyword || "default"}
              initialKeyword={initialKeyword}
            />
          )}
        </div>
      </main>
    </div>
  );
}
