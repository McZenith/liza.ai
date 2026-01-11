"use client";

import { useTranslations } from "next-intl";

// Placeholder component for the Create tab
export default function CreateContent() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">✨</span>
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">{t('createTab.title')}</h2>
          <p className="text-[var(--text-muted)] text-sm">
            {t('createTab.subtitle')}
          </p>
        </div>
      </div>

      {/* Selected Keywords */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{t('createTab.selectedKeywords')}</h3>

        <div className="text-center py-8">
          <span className="text-4xl mb-2 block">🔑</span>
          <p className="text-[var(--text-secondary)] font-medium">{t('createTab.noKeywordsSelected')}</p>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            {t('createTab.goToExplore')}
          </p>
        </div>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Title Generator */}
        <div className="card p-6 opacity-50">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📝</span>
            <h3 className="font-semibold text-[var(--text-primary)]">{t('createTab.titleGenerator')}</h3>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {t('createTab.titleGeneratorDesc')}
          </p>
          <span className="inline-block mt-4 px-3 py-1 rounded-full bg-[var(--bg-surface)] text-xs text-[var(--text-muted)]">
            {t('createTab.comingSoon')}
          </span>
        </div>

        {/* Description Writer */}
        <div className="card p-6 opacity-50">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📄</span>
            <h3 className="font-semibold text-[var(--text-primary)]">{t('createTab.descriptionWriter')}</h3>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {t('createTab.descriptionWriterDesc')}
          </p>
          <span className="inline-block mt-4 px-3 py-1 rounded-full bg-[var(--bg-surface)] text-xs text-[var(--text-muted)]">
            {t('createTab.comingSoon')}
          </span>
        </div>

        {/* Tag Extractor */}
        <div className="card p-6 opacity-50">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🏷️</span>
            <h3 className="font-semibold text-[var(--text-primary)]">{t('createTab.tagExtractor')}</h3>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {t('createTab.tagExtractorDesc')}
          </p>
          <span className="inline-block mt-4 px-3 py-1 rounded-full bg-[var(--bg-surface)] text-xs text-[var(--text-muted)]">
            {t('createTab.comingSoon')}
          </span>
        </div>
      </div>

      {/* How It Works */}
      <div className="card p-6 bg-gradient-to-br from-[#FF4F00]/5 to-[#8B5CF6]/5">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">💡 {t('createTab.howItWorks')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-[#FF4F00]/15 text-[#FF4F00] flex items-center justify-center font-bold text-sm">
                {step}
              </span>
              <p className="text-sm text-[var(--text-secondary)] flex-1">
                {t(`createTab.step${step}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
