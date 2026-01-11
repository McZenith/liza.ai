"use client";

import { useTranslations } from "next-intl";

// Placeholder component for the Analytics tab
export default function AnalyticsContent() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">📊</span>
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">{t('analyticsTab.title')}</h2>
          <p className="text-[var(--text-muted)] text-sm">
            {t('analyticsTab.subtitle')}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: "totalViews", value: "--", icon: "👁" },
          { key: "subscribers", value: "--", icon: "👥" },
          { key: "watchTime", value: "--", icon: "⏱" },
          { key: "revenue", value: "--", icon: "💵" },
        ].map((stat) => (
          <div key={stat.key} className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-sm text-[var(--text-muted)]">{t(`analyticsTab.${stat.key}`)}</span>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{t('analyticsTab.viewsOverTime')}</h3>
        <div className="h-64 flex items-center justify-center bg-[var(--bg-surface)] rounded-xl">
          <div className="text-center">
            <span className="text-4xl mb-2 block">📈</span>
            <p className="text-[var(--text-muted)]">{t('analyticsTab.connectToSeeAnalytics')}</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Videos */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{t('analyticsTab.topPerformingVideos')}</h3>
          <div className="text-center py-8">
            <span className="text-3xl mb-2 block">🎬</span>
            <p className="text-[var(--text-muted)]">{t('analyticsTab.noVideosTracked')}</p>
          </div>
        </div>

        {/* Keyword Performance */}
        <div className="card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t('analyticsTab.keywordPerformance')}</h3>
            <p className="text-sm text-[var(--text-muted)]">{t('analyticsTab.keywordPerformanceDesc')}</p>
          </div>
          <div className="text-center py-8">
            <span className="text-3xl mb-2 block">🔍</span>
            <p className="text-[var(--text-muted)]">{t('analyticsTab.noKeywordData')}</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">{t('analyticsTab.researchKeywordsToTrack')}</p>
          </div>
        </div>
      </div>

      {/* Connect CTA */}
      <div className="card p-6 bg-gradient-to-br from-[#8B5CF6]/10 to-[#FF4F00]/10 border-[#8B5CF6]/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#FF4F00] flex items-center justify-center text-white text-2xl">
            📊
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)]">{t('analyticsTab.unlockFullAnalytics')}</h3>
            <p className="text-sm text-[var(--text-muted)]">
              {t('analyticsTab.connectForMetrics')}
            </p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-[#8B5CF6] text-white font-medium hover:bg-[#8B5CF6]/90 transition-colors opacity-50 cursor-not-allowed">
            {t('scheduleTab.connectYouTube')}
          </button>
        </div>
      </div>
    </div>
  );
}
