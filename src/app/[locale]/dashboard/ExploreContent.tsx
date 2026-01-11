"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { graphqlFetch, GET_TRENDING_KEYWORDS_QUERY, GET_TRENDING_VIDEOS_QUERY, TrendingKeyword, TrendingVideo } from "@/lib/graphql";

// User preferences interface
interface UserPreferences {
  niches: string[];
  region: string;
  autoDetect: boolean;
}

// Search history item
interface SearchHistoryItem {
  keyword: string;
  searchedAt: string;
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
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "IN", label: "India" },
  { code: "BR", label: "Brazil" },
  { code: "JP", label: "Japan" },
  { code: "KR", label: "South Korea" },
];

// Format volume (K, M for large numbers)
const formatVolume = (vol: number | undefined | null): string => {
  const v = vol ?? 0;
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return v.toLocaleString();
};

// Grade styling config
const gradeConfig: Record<string, { bg: string; text: string; border: string }> = {
  A: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/40" },
  B: { bg: "bg-lime-500/15", text: "text-lime-400", border: "border-lime-500/40" },
  C: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/40" },
  D: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/40" },
  F: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/40" },
};

interface ExploreContentProps {
  onKeywordClick: (keyword: string) => void;
}

export default function ExploreContent({ onKeywordClick }: ExploreContentProps) {
  const t = useTranslations('dashboard');
  const [trendingKeywords, setTrendingKeywords] = useState<TrendingKeyword[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<TrendingVideo[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    niches: [],
    region: "US",
    autoDetect: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect region on mount
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

    // Load search history
    const savedHistory = localStorage.getItem("liza-search-history");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save preferences when they change
  const savePreferences = useCallback((newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    localStorage.setItem("liza-user-preferences", JSON.stringify(newPrefs));
  }, []);

  // Fetch trending data
  useEffect(() => {
    const fetchTrendingData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch trending keywords and videos in parallel
        const [keywordsRes, videosRes] = await Promise.all([
          graphqlFetch<{ trendingKeywords: TrendingKeyword[] }>(
            GET_TRENDING_KEYWORDS_QUERY,
            { regionCode: preferences.region }
          ),
          graphqlFetch<{ trendingVideos: TrendingVideo[] }>(
            GET_TRENDING_VIDEOS_QUERY,
            { regionCode: preferences.region }
          ),
        ]);

        if (keywordsRes.data?.trendingKeywords) {
          setTrendingKeywords(keywordsRes.data.trendingKeywords);
        }

        if (videosRes.data?.trendingVideos) {
          setTrendingVideos(videosRes.data.trendingVideos.slice(0, 12));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch trending data");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []); // No dependencies, fetches once on mount for default region

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("liza-search-history");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            🔥 {t('explore')}
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            {t('discoverWhatsHot')} {t(`regions.${preferences.region}`)}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[var(--border)] rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-[#FF4F00] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-[var(--text-muted)]">{t('createTab.comingSoon')}...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-medium">Failed to load trending data</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Trending Keywords Section */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💎</span>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t('trendingKeywords')}</h3>
                <p className="text-sm text-[var(--text-muted)]">{t('preAnalyzedOpportunities')}</p>
              </div>
            </div>

            {trendingKeywords.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)]">
                <p>{t('noTrendingKeywords')}</p>
                <p className="text-sm mt-1">{t('dataUpdatesDaily')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {trendingKeywords.slice(0, 12).map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => onKeywordClick(kw.keyword)}
                    className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[#FF4F00] transition-all text-left group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-[var(--text-primary)] group-hover:text-[#FF4F00] transition-colors">
                        {kw.keyword}
                      </span>
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${gradeConfig[kw.grade]?.bg} ${gradeConfig[kw.grade]?.text}`}>
                        {kw.grade}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                      <span>📊 {formatVolume(kw.searchVolume)}</span>
                      <span className="text-emerald-400">↑ {kw.opportunity}%</span>
                      <span className="text-orange-400">⚡ {kw.difficulty}%</span>
                    </div>
                    {kw.trendingVideoCount > 0 && (
                      <p className="mt-2 text-xs text-[var(--text-muted)]">
                        📹 {t('trendingIn', { count: kw.trendingVideoCount })}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🕒</span>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t('recentSearches')}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{t('noRecentSearches').split('.')[0]}</p>
                  </div>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-sm text-[var(--text-muted)] hover:text-red-400 transition-colors"
                >
                  {t('clearHistory')}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 20).map((item, i) => (
                  <button
                    key={i}
                    onClick={() => onKeywordClick(item.keyword)}
                    className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-[#FF4F00] hover:border-[#FF4F00] transition-all"
                  >
                    {item.keyword}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎬</span>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t('trendingVideos')}</h3>
                <p className="text-sm text-[var(--text-muted)]">{t('topTrendingContent')}</p>
              </div>
            </div>

            {trendingVideos.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)]">
                <p>No trending videos available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingVideos.map((video, i) => (
                  <a
                    key={i}
                    href={`https://youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] overflow-hidden hover:border-[#FF4F00] transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-[var(--bg-hover)] relative">
                      {video.thumbnailMedium ? (
                        <img
                          src={video.thumbnailMedium}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h4 className="font-medium text-[var(--text-primary)] text-sm line-clamp-2 group-hover:text-[#FF4F00] transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{video.channelTitle}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                        <span>👁 {formatVolume(video.viewCount)}</span>
                        <span>👍 {formatVolume(video.likeCount)}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Export helper to add to search history (used by ResearchContent)
export function addToSearchHistory(keyword: string) {
  const savedHistory = localStorage.getItem("liza-search-history");
  const history: SearchHistoryItem[] = savedHistory ? JSON.parse(savedHistory) : [];

  // Remove duplicate if exists
  const filtered = history.filter(h => h.keyword.toLowerCase() !== keyword.toLowerCase());

  // Add new item at the beginning
  const newHistory = [
    { keyword, searchedAt: new Date().toISOString() },
    ...filtered,
  ].slice(0, 50); // Keep max 50 items

  localStorage.setItem("liza-search-history", JSON.stringify(newHistory));
}
