"use client";

import { useState, useEffect, useCallback } from "react";

// User preferences interface
interface UserPreferences {
  niches: string[];
  region: string;
  autoDetect: boolean;
}

// Available niches
const NICHE_OPTIONS = [
  { id: "tech", label: "Technology", icon: "💻" },
  { id: "gaming", label: "Gaming", icon: "🎮" },
  { id: "lifestyle", label: "Lifestyle", icon: "✨" },
  { id: "finance", label: "Finance", icon: "💰" },
  { id: "education", label: "Education", icon: "📚" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "travel", label: "Travel", icon: "✈️" },
  { id: "food", label: "Food & Cooking", icon: "🍳" },
  { id: "health", label: "Health & Fitness", icon: "💪" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "business", label: "Business", icon: "📈" },
];

// Available regions  
const REGION_OPTIONS = [
  { code: "US", label: "United States", flag: "🇺🇸" },
  { code: "GB", label: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", label: "Germany", flag: "🇩🇪" },
  { code: "FR", label: "France", flag: "🇫🇷" },
  { code: "IN", label: "India", flag: "🇮🇳" },
  { code: "BR", label: "Brazil", flag: "🇧🇷" },
  { code: "JP", label: "Japan", flag: "🇯🇵" },
  { code: "KR", label: "South Korea", flag: "🇰🇷" },
];

export default function SettingsContent() {
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
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h2>
            <p className="text-[var(--text-muted)] text-sm">
              Customize your Liza.ai experience
            </p>
          </div>
        </div>
        {saved && (
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-sm font-medium">
            ✓ Saved
          </span>
        )}
      </div>

      {/* Region Selection */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🌍</span>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Region</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Select your region for trending content and search data
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {REGION_OPTIONS.map(region => (
            <button
              key={region.code}
              onClick={() => savePreferences({ ...preferences, region: region.code })}
              className={`p-4 rounded-xl text-left transition-all ${
                preferences.region === region.code
                  ? "bg-[#FF4F00]/15 border-2 border-[#FF4F00] text-[var(--text-primary)]"
                  : "bg-[var(--bg-surface)] border-2 border-transparent hover:border-[var(--border)] text-[var(--text-secondary)]"
              }`}
            >
              <span className="text-2xl mb-2 block">{region.flag}</span>
              <span className="font-medium text-sm">{region.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Niche Selection */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🎯</span>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Your Niches</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Select your content niches to personalize recommendations
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {NICHE_OPTIONS.map(niche => (
            <button
              key={niche.id}
              onClick={() => toggleNiche(niche.id)}
              className={`p-4 rounded-xl transition-all flex items-center gap-3 ${
                preferences.niches.includes(niche.id)
                  ? "bg-[#FF4F00]/15 border-2 border-[#FF4F00] text-[var(--text-primary)]"
                  : "bg-[var(--bg-surface)] border-2 border-transparent hover:border-[var(--border)] text-[var(--text-secondary)]"
              }`}
            >
              <span className="text-xl">{niche.icon}</span>
              <span className="font-medium text-sm">{niche.label}</span>
            </button>
          ))}
        </div>

        {preferences.niches.length > 0 && (
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            {preferences.niches.length} niche{preferences.niches.length > 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      {/* Data & Privacy */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl">🔒</span>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Data & Privacy</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Manage your data and privacy settings
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
              <span className="font-medium text-[var(--text-primary)]">Clear Search History</span>
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
              <span className="font-medium text-[var(--text-primary)]">Reset Preferences</span>
            </div>
            <span className="text-[var(--text-muted)]">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
