"use client";

import DashboardSidebar from "./DashboardSidebar";
import ResearchContent from "./ResearchContent";

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
  };
}

export default function DashboardClient({ user, translations }: DashboardClientProps) {
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
        translations={{
          signOut: translations.signOut,
          researchContent: translations.researchContent,
          schedulePosts: translations.schedulePosts,
          viewAnalytics: translations.viewAnalytics,
          manageAccounts: translations.manageAccounts,
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
            <p className="text-[var(--text-secondary)]">{translations.subtitle}</p>
          </div>

          {/* Research Content */}
          <ResearchContent />
        </div>
      </main>
    </div>
  );
}
