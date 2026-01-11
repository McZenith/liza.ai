"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

// User preferences interface
interface UserPreferences {
  niches: string[];
  region: string;
  autoDetect: boolean;
}

// Available niches (IDs only, labels come from translations)
const NICHE_IDS = ["tech", "gaming", "lifestyle", "finance", "education", "entertainment", "music", "travel", "food", "health", "sports", "business"];

// Niche icons
const NICHE_ICONS: Record<string, string> = {
    tech: "💻", gaming: "🎮", lifestyle: "✨", finance: "💰",
    education: "📚", entertainment: "🎬", music: "🎵", travel: "✈️",
    food: "🍳", health: "💪", sports: "⚽", business: "📈",
};

// Region flags
const REGION_FLAGS: Record<string, string> = {
    US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷", IN: "🇮🇳", BR: "🇧🇷", JP: "🇯🇵", KR: "🇰🇷",
};

const REGION_CODES = ["US", "GB", "DE", "FR", "IN", "BR", "JP", "KR"];

export default function SettingsContent() {
    const t = useTranslations('dashboard');
  const [preferences, setPreferences] = useState<UserPreferences>({
    niches: [],
    region: "US",
    autoDetect: true,
  });
  const [saved, setSaved] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem("liza-user-preferences");
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    } else {
      // Auto-detect region from browser
      const browserLang = navigator.language;
      const regionMap: Record<string, string> = {
        "en-US": "US", "en-GB": "GB", "de-DE": "DE", "de": "DE",
        "fr-FR": "FR", "fr": "FR", "hi-IN": "IN", "pt-BR": "BR",
        "ja-JP": "JP", "ja": "JP", "ko-KR": "KR", "ko": "KR",
      };
      const detectedRegion = regionMap[browserLang] || "US";
      setPreferences(prev => ({ ...prev, region: detectedRegion }));
    }
  }, []);

  // Save preferences
  const savePreferences = useCallback((newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    localStorage.setItem("liza-user-preferences", JSON.stringify(newPrefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  // Toggle niche selection
  const toggleNiche = (nicheId: string) => {
    const newNiches = preferences.niches.includes(nicheId)
      ? preferences.niches.filter(n => n !== nicheId)
      : [...preferences.niches, nicheId];
    savePreferences({ ...preferences, niches: newNiches });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚙️</span>
          <div>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)]">{t('settingsTab.title')}</h2>
            <p className="text-[var(--text-muted)] text-sm">
                          {t('settingsTab.subtitle')}
            </p>
          </div>
        </div>
        {saved && (
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-sm font-medium">
                      ✓ {t('settingsTab.saved')}
          </span>
        )}
      </div>

      {/* Region Selection */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🌍</span>
          <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t('settingsTab.region')}</h3>
            <p className="text-sm text-[var(--text-muted)]">
                          {t('settingsTab.regionDesc')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {REGION_CODES.map(code => (
            <button
                  key={code}
                  onClick={() => savePreferences({ ...preferences, region: code })}
              className={`p-4 rounded-xl text-left transition-all ${
                  preferences.region === code
                  ? "bg-[#FF4F00]/15 border-2 border-[#FF4F00] text-[var(--text-primary)]"
                  : "bg-[var(--bg-surface)] border-2 border-transparent hover:border-[var(--border)] text-[var(--text-secondary)]"
              }`}
            >
                  <span className="text-2xl mb-2 block">{REGION_FLAGS[code]}</span>
                  <span className="font-medium text-sm">{t(`regions.${code}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Niche Selection */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🎯</span>
          <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t('settingsTab.yourNiches')}</h3>
            <p className="text-sm text-[var(--text-muted)]">
                          {t('settingsTab.nichesDesc')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {NICHE_IDS.map(nicheId => (
            <button
                  key={nicheId}
                  onClick={() => toggleNiche(nicheId)}
              className={`p-4 rounded-xl transition-all flex items-center gap-3 ${
                  preferences.niches.includes(nicheId)
                  ? "bg-[#FF4F00]/15 border-2 border-[#FF4F00] text-[var(--text-primary)]"
                  : "bg-[var(--bg-surface)] border-2 border-transparent hover:border-[var(--border)] text-[var(--text-secondary)]"
              }`}
            >
                  <span className="text-xl">{NICHE_ICONS[nicheId]}</span>
                  <span className="font-medium text-sm">{t(`niches.${nicheId}`)}</span>
            </button>
          ))}
        </div>

        {preferences.niches.length > 0 && (
          <p className="mt-4 text-sm text-[var(--text-muted)]">
                      {preferences.niches.length} {t('settingsTab.nichesSelected')}
          </p>
        )}
      </div>

      {/* Data & Privacy */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🔒</span>
          <div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t('settingsTab.dataPrivacy')}</h3>
            <p className="text-sm text-[var(--text-muted)]">
                          {t('settingsTab.dataPrivacyDesc')}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => {
              localStorage.removeItem("liza-search-history");
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🗑</span>
                          <span className="font-medium text-[var(--text-primary)]">{t('settingsTab.clearSearchHistory')}</span>
            </div>
            <span className="text-[var(--text-muted)]">→</span>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("liza-user-preferences");
              setPreferences({ niches: [], region: "US", autoDetect: true });
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🔄</span>
                          <span className="font-medium text-[var(--text-primary)]">{t('settingsTab.resetPreferences')}</span>
            </div>
            <span className="text-[var(--text-muted)]">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
