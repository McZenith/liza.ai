"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Platform data
const PLATFORMS = [
  { id: "youtube", name: "YouTube", icon: "▶", color: "#FF0000", descKey: "videoPlatform" },
  { id: "tiktok", name: "TikTok", icon: "♪", color: "#000000", descKey: "shortFormVideo" },
  { id: "instagram", name: "Instagram", icon: "📷", color: "#E4405F", descKey: "reelsStories" },
  { id: "twitter", name: "X / Twitter", icon: "𝕏", color: "#1DA1F2", descKey: "microblogging" },
  { id: "linkedin", name: "LinkedIn", icon: "in", color: "#0077B5", descKey: "professionalNetwork" },
  { id: "facebook", name: "Facebook", icon: "f", color: "#1877F2", descKey: "socialNetwork" },
];

// Placeholder component for the Accounts tab
export default function AccountsContent() {
  const t = useTranslations('dashboard');
  const [connectedAccounts] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">🔗</span>
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">{t('accountsTab.title')}</h2>
          <p className="text-[var(--text-muted)] text-sm">
            {t('accountsTab.subtitle')}
          </p>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{t('accountsTab.connectedAccounts')}</h3>
        
        {connectedAccounts.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-2 block">🔌</span>
            <p className="text-[var(--text-secondary)] font-medium">{t('accountsTab.noAccountsConnected')}</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              {t('accountsTab.connectToUnlock')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Connected accounts would be listed here */}
          </div>
        )}
      </div>

      {/* Available Platforms */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{t('accountsTab.availablePlatforms')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.id}
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-light)] transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.icon}
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{platform.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{t(`accountsTab.${platform.descKey}`)}</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-[var(--bg-hover)] text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] transition-colors opacity-50 cursor-not-allowed">
                {t('accountsTab.connect')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{t('accountsTab.accountSettings')}</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)]">
            <div>
              <p className="font-medium text-[var(--text-primary)]">{t('accountsTab.autoPostEnabled')}</p>
              <p className="text-sm text-[var(--text-muted)]">{t('accountsTab.autoPostDesc')}</p>
            </div>
            <div className="w-12 h-6 rounded-full bg-[var(--bg-hover)] opacity-50 cursor-not-allowed" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)]">
            <div>
              <p className="font-medium text-[var(--text-primary)]">{t('accountsTab.postNotifications')}</p>
              <p className="text-sm text-[var(--text-muted)]">{t('accountsTab.postNotificationsDesc')}</p>
            </div>
            <div className="w-12 h-6 rounded-full bg-[var(--bg-hover)] opacity-50 cursor-not-allowed" />
          </div>
        </div>
      </div>
    </div>
  );
}
