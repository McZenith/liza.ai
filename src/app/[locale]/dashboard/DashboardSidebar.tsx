"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
  translations: {
    signOut: string;
    researchContent: string;
    schedulePosts: string;
    viewAnalytics: string;
    manageAccounts: string;
    explore?: string;
    settings?: string;
  };
  activeTab?: "explore" | "research";
  onTabChange?: (tab: "explore" | "research") => void;
  onOpenSettings?: () => void;
}

const navItems = [
  {
    key: "explore",
    icon: "🔥",
    color: "#FF4F00",
    isTab: true,
    tab: "explore" as const,
  },
  {
    key: "researchContent",
    icon: "🔍",
    color: "#8B5CF6",
    isTab: true,
    tab: "research" as const,
  },
  {
    key: "schedulePosts",
    icon: "📅",
    href: "/dashboard/schedule",
    color: "#22D3EE",
  },
  {
    key: "viewAnalytics",
    icon: "📊",
    href: "/dashboard/analytics",
    color: "#22C55E",
  },
  {
    key: "manageAccounts",
    icon: "🔗",
    href: "/dashboard/accounts",
    color: "#F97316",
  },
];

export default function DashboardSidebar({ user, translations, activeTab, onTabChange, onOpenSettings }: SidebarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = () => {
    // TODO: Implement actual sign out
    window.location.href = `/${locale}`;
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isTab && item.tab && onTabChange) {
      onTabChange(item.tab);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--border)] flex items-center justify-between px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF4F00] to-[#FF7A33] flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">
            Liza<span className="text-[#FF4F00]">.ai</span>
          </span>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border)]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-[var(--bg-elevated)] border-r border-[var(--border)] transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } ${collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border)]">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4F00] to-[#FF7A33] flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              {!collapsed && (
                <span className="text-xl font-bold text-[var(--text-primary)]">
                  Liza<span className="text-[#FF4F00]">.ai</span>
                </span>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const href = item.href ? `/${locale}${item.href}` : `/${locale}/dashboard`;
              const isActive = item.isTab
                ? (activeTab === item.tab || (!activeTab && item.tab === "explore"))
                : pathname === href;

              const NavContent = (
                <>
                  <span
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-transform group-hover:scale-110 ${isActive ? "" : "bg-[var(--bg-surface)]"
                      }`}
                    style={isActive ? { background: `${item.color}20` } : {}}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="font-medium">
                      {translations[item.key as keyof typeof translations] || item.key}
                    </span>
                  )}
                </>
              );

              if (item.isTab) {
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isActive
                        ? "bg-[var(--primary)] bg-opacity-10 text-[var(--primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                      }`}
                    style={isActive ? { backgroundColor: `${item.color}15`, color: item.color } : {}}
                  >
                    {NavContent}
                  </button>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                    isActive
                      ? "bg-[var(--primary)] bg-opacity-10 text-[var(--primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {NavContent}
                </Link>
              );
            })}
          </nav>

          {/* Settings Button */}
          {onOpenSettings && (
            <div className="px-3 pb-2">
              <button
                onClick={onOpenSettings}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] group"
              >
                <span className="w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-[var(--bg-surface)] transition-transform group-hover:scale-110">
                  ⚙️
                </span>
                {!collapsed && (
                  <span className="font-medium">
                    {translations.settings || "Settings"}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* User Section */}
          <div className="p-4 border-t border-[var(--border)]">
            <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-[var(--border)]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4F00] to-[#FF7A33] flex items-center justify-center text-white font-bold flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.name}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={handleSignOut}
                className="mt-3 w-full py-2 px-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium hover:border-[var(--border-light)] hover:text-[var(--text-primary)] transition-all"
              >
                {translations.signOut}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}
