"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";

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

const quickActions = [
  {
    key: "researchContent",
    icon: "🔍",
    color: "#8B5CF6",
    href: "/dashboard/research",
  },
  {
    key: "schedulePosts",
    icon: "📅",
    color: "#22D3EE",
    href: "/dashboard/schedule",
  },
  {
    key: "viewAnalytics",
    icon: "📊",
    color: "#22C55E",
    href: "/dashboard/analytics",
  },
  {
    key: "manageAccounts",
    icon: "🔗",
    color: "#F97316",
    href: "/dashboard/accounts",
  },
];

export default function DashboardClient({ user, translations }: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#FF4F00] blur-[180px] opacity-5" />
        <div className="absolute bottom-[30%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#8B5CF6] blur-[200px] opacity-5" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#FF4F00] to-[#FF7A33] flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white font-bold text-lg md:text-xl">L</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
              Liza<span className="text-[#FF4F00]">.ai</span>
            </span>
          </a>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
            </div>
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full border-2 border-[var(--border)]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4F00] to-[#FF7A33] flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium hover:border-[var(--border-light)] hover:text-[var(--text-primary)] transition-all"
            >
              {translations.signOut}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
            {translations.welcome}, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-[var(--text-secondary)]">{translations.subtitle}</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            {translations.quickActions}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <a
                key={action.key}
                href={action.href}
                className="card p-6 flex flex-col items-center text-center hover:border-[var(--card-hover-border)] transition-all group"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${action.color}20` }}
                >
                  {action.icon}
                </div>
                <span className="text-[var(--text-primary)] font-medium">
                  {translations[action.key as keyof typeof translations]}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Placeholder for more dashboard content */}
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Coming Soon
          </h3>
          <p className="text-[var(--text-secondary)]">
            Your AI-powered content dashboard is being built. Stay tuned!
          </p>
        </div>
      </main>
    </div>
  );
}
