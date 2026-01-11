"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { graphqlFetch, subscribeToLongTailAnalysis, ANALYZE_KEYWORD_QUERY, GET_AUTOCOMPLETE_QUERY, LongTailUpdate } from "@/lib/graphql";
import { useDebounce } from "@/hooks/useDebounce";

interface KeywordAnalysisResult {
    keyword: string;
    analyzedAt: string;
    searchDemand: {
        volume: number;
        trendType: string;
        momentum: number;
        seasonalPeak: string | null;
    };
    contentSupply: {
        videoCount: number;
        totalSearchResults: number;
        contentGapScore: number;
        competitionLevel: string;
        avgCompetitorViews: number;
        videosUploadedToday: number;
        videosLast3Days: number;
        videosThisWeek: number;
        videosThisMonth: number;
        videosThisYear: number;
        isDormantOpportunity: boolean;
        contentActivityLevel: string;
    };
    scores: {
        opportunity: number;
        difficulty: number;
        grade: string;
    };
    recommendations: {
        titlePatterns: string[];
        mustHaveTags: string[];
        optimalLengthSeconds: number;
        topQuestions: string[];
        relatedKeywords: string[];
    };
}

interface AutocompleteSuggestions {
    youtube: string[];
    google: string[];
}

interface LongTailResult {
    keyword: string;
    grade: string;
    opportunity: number;
    difficulty: number;
    searchVolume: number;
    source: string;
}

interface CartItem {
    keyword: string;
    grade: string;
    opportunity: number;
    searchVolume: number;
}

interface FlyingItem {
    id: string;
    startX: number;
    startY: number;
    keyword: string;
}

// Format volume (K, M for large numbers)
const formatVolume = (vol: number | undefined | null): string => {
    const v = vol ?? 0;
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return v.toLocaleString();
};

const gradeConfig: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    A: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/40", glow: "shadow-emerald-500/20" },
    B: { bg: "bg-lime-500/15", text: "text-lime-400", border: "border-lime-500/40", glow: "shadow-lime-500/20" },
    C: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/40", glow: "shadow-amber-500/20" },
    D: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/40", glow: "shadow-orange-500/20" },
    F: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/40", glow: "shadow-red-500/20" },
};

export default function ResearchContent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [result, setResult] = useState<KeywordAnalysisResult | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [longTails, setLongTails] = useState<LongTailResult[]>([]);
    const [longTailProgress, setLongTailProgress] = useState({ current: 0, total: 0 });
    const [longTailLoading, setLongTailLoading] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
    const [cartBounce, setCartBounce] = useState(false);
    const debouncedQuery = useDebounce(searchQuery, 300);
    const unsubscribeRef = useRef<(() => void) | null>(null);
    const cartRef = useRef<HTMLButtonElement>(null);

    // Cleanup subscription on unmount
    useEffect(() => {
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, []);

    // Fetch autocomplete suggestions
    useEffect(() => {
        if (debouncedQuery.length >= 2) {
            graphqlFetch<{ getAutocompleteSuggestions: AutocompleteSuggestions }>(
                GET_AUTOCOMPLETE_QUERY,
                { query: debouncedQuery }
            )
                .then((res) => {
                    const data = res.data?.getAutocompleteSuggestions;
                    const all = [...new Set([...(data?.youtube || []), ...(data?.google || [])])].slice(0, 8);
                    setSuggestions(all);
                })
                .catch(() => setSuggestions([]));
        } else {
            setSuggestions([]);
        }
    }, [debouncedQuery]);

    const addToCart = useCallback((item: CartItem, event: React.MouseEvent) => {
        // Check if already in cart
        if (cart.some(c => c.keyword === item.keyword)) return;

        const button = event.currentTarget as HTMLElement;
        const rect = button.getBoundingClientRect();
        const id = `${item.keyword}-${Date.now()}`;

        // Create flying item
        setFlyingItems(prev => [...prev, {
            id,
            startX: rect.left + rect.width / 2,
            startY: rect.top + rect.height / 2,
            keyword: item.keyword,
        }]);

        // Add to cart after animation starts
        setTimeout(() => {
            setCart(prev => [...prev, item]);
            setCartBounce(true);
            setTimeout(() => setCartBounce(false), 300);
        }, 400);

        // Remove flying item after animation
        setTimeout(() => {
            setFlyingItems(prev => prev.filter(f => f.id !== id));
        }, 600);
    }, [cart]);

    const removeFromCart = useCallback((keyword: string) => {
        setCart(prev => prev.filter(c => c.keyword !== keyword));
    }, []);

    const isInCart = useCallback((keyword: string) => {
        return cart.some(c => c.keyword === keyword);
    }, [cart]);

    const handleSearch = useCallback(async (keyword: string) => {
        // Cleanup previous subscription
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
        }

        setSearchQuery(keyword);
        setShowSuggestions(false);
        setAnalyzing(true);
        setError(null);
        setLongTails([]);
        setLongTailProgress({ current: 0, total: 0 });
        setLongTailLoading(false);

        try {
            const res = await graphqlFetch<{ analyzeKeyword: KeywordAnalysisResult }>(
                ANALYZE_KEYWORD_QUERY,
                { keyword, maxLongTails: 15 }
            );

            if (res.errors && res.errors.length > 0) {
                setError(res.errors[0].message);
                setAnalyzing(false);
                return;
            }

            setResult(res.data.analyzeKeyword);
            setAnalyzing(false);

            // Subscribe to long-tail updates for ALL grades for consistent UI
            setLongTailLoading(true);
            try {
                unsubscribeRef.current = subscribeToLongTailAnalysis(
                    keyword,
                    (update: LongTailUpdate) => {
                        setLongTailProgress({ current: update.analyzedCount, total: update.totalCount });
                        if (update.allResults) {
                            setLongTails(update.allResults);
                        }
                    },
                    () => {
                        setLongTailLoading(false);
                    },
                    (err) => {
                        console.error("Subscription error:", err);
                        setLongTailLoading(false);
                    }
                );
            } catch (subErr) {
                console.error("Subscription setup failed:", subErr);
                setLongTailLoading(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to analyze keyword");
            setAnalyzing(false);
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            handleSearch(searchQuery.trim());
        }
    };

    // Filter long-tails for good grades (A, B)
    const goldKeywords = longTails.filter(lt => lt.grade === "A" || lt.grade === "B");
    const otherKeywords = longTails.filter(lt => lt.grade !== "A" && lt.grade !== "B");

    // Get cart target position
    const getCartPosition = () => {
        if (cartRef.current) {
            const rect = cartRef.current.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
        return { x: window.innerWidth - 100, y: 100 };
    };

    return (
        <div className="space-y-8 relative">
            {/* Floating Cart Button */}
            <button
                ref={cartRef}
                onClick={() => setShowCart(!showCart)}
                className={`fixed top-4 right-4 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF4F00] to-[#FF7A33] text-white shadow-lg shadow-orange-500/30 flex items-center justify-center transition-transform ${cartBounce ? "scale-125" : "scale-100"}`}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-[#FF4F00] text-xs font-bold flex items-center justify-center shadow">
                        {cart.length}
                    </span>
                )}
            </button>

            {/* Flying Items Animation */}
            {flyingItems.map(item => {
                const target = getCartPosition();
                return (
                    <div
                        key={item.id}
                        className="fixed z-[100] pointer-events-none"
                        style={{
                            left: item.startX,
                            top: item.startY,
                            animation: "flyToCart 0.5s ease-in-out forwards",
                            ["--target-x" as string]: `${target.x - item.startX}px`,
                            ["--target-y" as string]: `${target.y - item.startY}px`,
                        }}
                    >
                        <div className="px-3 py-1.5 rounded-full bg-[#FF4F00] text-white text-sm font-medium shadow-lg whitespace-nowrap">
                            {item.keyword.length > 15 ? item.keyword.slice(0, 15) + "..." : item.keyword}
                        </div>
                    </div>
                );
            })}

            {/* Cart Drawer */}
            {showCart && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCart(false)} />
                    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg-elevated)] z-50 shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-[var(--border)]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                                    🛒 Keyword Cart
                                    <span className="text-sm font-normal text-[var(--text-muted)]">({cart.length})</span>
                                </h3>
                                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-[var(--bg-hover)] rounded-lg">
                                    <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="text-5xl">🛒</span>
                                    <p className="mt-4 text-[var(--text-muted)]">Your cart is empty</p>
                                    <p className="text-sm text-[var(--text-muted)]">Add keywords from the analysis</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${gradeConfig[item.grade]?.bg} ${gradeConfig[item.grade]?.text}`}>
                                                    {item.grade}
                                                </span>
                                                <div>
                                                    <p className="font-medium text-[var(--text-primary)]">{item.keyword}</p>
                                                    <p className="text-xs text-[var(--text-muted)]">{formatVolume(item.searchVolume)} vol • {item.opportunity}% opp</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.keyword)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-[var(--border)]">
                                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF4F00] to-[#FF7A33] text-white font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                                    Export {cart.length} Keywords
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Hero Search */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4F00]/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
                <div className="relative bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-6 md:p-8">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">🔬 Keyword Research Lab</h2>
                    <p className="text-[var(--text-muted)] mb-6">Analyze any keyword to find hidden opportunities</p>

                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            placeholder="Enter a keyword to analyze..."
                            className="w-full px-6 py-4 pl-14 rounded-2xl bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#FF4F00] focus:ring-2 focus:ring-[#FF4F00]/20 transition-all text-lg"
                        />
                        <svg
                            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <button
                            onClick={() => searchQuery.trim() && handleSearch(searchQuery.trim())}
                            disabled={!searchQuery.trim() || analyzing}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4F00] to-[#FF7A33] text-white font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {analyzing ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Analyzing</span>
                                </div>
                            ) : (
                                "Analyze"
                            )}
                        </button>

                        {/* Autocomplete */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden">
                                {suggestions.map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onMouseDown={() => handleSearch(suggestion)}
                                        className="w-full px-4 py-3 text-left text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-3"
                                    >
                                        <span className="text-[var(--text-muted)]">🔍</span>
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                        <p className="font-medium">Analysis Failed</p>
                        <p className="text-sm opacity-80">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading */}
            {analyzing && (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-[var(--border)] rounded-full" />
                        <div className="absolute inset-0 w-20 h-20 border-4 border-[#FF4F00] border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="mt-6 text-[var(--text-secondary)] font-medium">Analyzing keyword...</p>
                    <p className="text-sm text-[var(--text-muted)]">Checking search demand, competition & opportunities</p>
                </div>
            )}

            {/* Results */}
            {result && !analyzing && (
                <div className="space-y-6">
                    {/* Grade Hero */}
                    <div className="relative overflow-hidden">
                        <div className={`absolute inset-0 ${gradeConfig[result.scores.grade]?.bg || ""} blur-3xl opacity-50`} />
                        <div className="relative card p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <p className="text-[var(--text-muted)] text-sm mb-1">Keyword Analysis</p>
                                    <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">{result.keyword}</h2>

                                    {/* Score Bars */}
                                    <div className="grid grid-cols-2 gap-6 max-w-md">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-[var(--text-muted)]">Opportunity</span>
                                                <span className="text-emerald-400 font-bold">{result.scores.opportunity}%</span>
                                            </div>
                                            <div className="h-3 rounded-full bg-[var(--bg-base)] overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
                                                    style={{ width: `${result.scores.opportunity}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-[var(--text-muted)]">Difficulty</span>
                                                <span className="text-orange-400 font-bold">{result.scores.difficulty}%</span>
                                            </div>
                                            <div className="h-3 rounded-full bg-[var(--bg-base)] overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-700"
                                                    style={{ width: `${result.scores.difficulty}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grade Badge + Add to Cart */}
                                <div className="flex flex-col items-center gap-3">
                                    <div
                                        className={`w-28 h-28 md:w-32 md:h-32 rounded-3xl flex flex-col items-center justify-center border-2 shadow-2xl ${gradeConfig[result.scores.grade]?.bg || "bg-gray-500/10"
                                            } ${gradeConfig[result.scores.grade]?.border || "border-gray-500/30"} ${gradeConfig[result.scores.grade]?.glow || ""
                                            }`}
                                    >
                                        <span className={`text-5xl md:text-6xl font-black ${gradeConfig[result.scores.grade]?.text || "text-gray-400"}`}>
                                            {result.scores.grade}
                                        </span>
                                        <span className="text-xs text-[var(--text-muted)] mt-1">Grade</span>
                                    </div>
                                    <button
                                        onClick={(e) => addToCart({
                                            keyword: result.keyword,
                                            grade: result.scores.grade,
                                            opportunity: result.scores.opportunity,
                                            searchVolume: result.searchDemand.volume,
                                        }, e)}
                                        disabled={isInCart(result.keyword)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${isInCart(result.keyword)
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                            : "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[#FF4F00] hover:text-[#FF4F00]"
                                            }`}
                                    >
                                        {isInCart(result.keyword) ? (
                                            <>✓ In Cart</>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid with Velocity */}
                    <div className="card p-5">
                        {/* Main Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {[
                                { label: "Search Volume", value: formatVolume(result.searchDemand.volume), icon: "📊" },
                                { label: "Videos", value: (result.contentSupply.totalSearchResults || result.contentSupply.videoCount).toLocaleString(), icon: "🎬" },
                                { label: "Competition", value: result.contentSupply.competitionLevel, icon: "⚔️" },
                                { label: "Trend", value: result.searchDemand.trendType, icon: result.searchDemand.momentum > 0 ? "📈" : result.searchDemand.momentum < 0 ? "📉" : "➡️" },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <span className="text-lg">{stat.icon}</span>
                                        <p className="text-[var(--text-muted)] text-xs">{stat.label}</p>
                                    </div>
                                    <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Velocity Bar - Compact Inline */}
                        <div className="pt-4 border-t border-[var(--border)]">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-6">
                                    <span className="text-xs text-[var(--text-muted)] font-medium">📅 Uploads:</span>
                                    {[
                                        { label: "Today", value: result.contentSupply.videosUploadedToday || 0 },
                                        { label: "3d", value: result.contentSupply.videosLast3Days || 0 },
                                        { label: "7d", value: result.contentSupply.videosThisWeek || 0 },
                                        { label: "30d", value: result.contentSupply.videosThisMonth || 0 },
                                        { label: "1y", value: result.contentSupply.videosThisYear || 0 },
                                    ].map((period, i) => (
                                        <div key={i} className="text-center">
                                            <p className="text-sm font-bold text-[var(--text-primary)]">{period.value}</p>
                                            <p className="text-[10px] text-[var(--text-muted)]">{period.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    {result.contentSupply.isDormantOpportunity && (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/30">
                                            🔥 Dormant
                                        </span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${result.contentSupply.contentActivityLevel === "Hot" ? "bg-red-500/15 text-red-400 border border-red-500/30" :
                                            result.contentSupply.contentActivityLevel === "Active" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" :
                                                result.contentSupply.contentActivityLevel === "Moderate" ? "bg-blue-500/15 text-blue-400 border border-blue-500/30" :
                                                    result.contentSupply.contentActivityLevel === "Slow" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" :
                                                        "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                                        }`}>
                                        {result.contentSupply.contentActivityLevel || "Unknown"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Long-tail Keywords - Gold Nuggets */}
                    {(longTailLoading || longTails.length > 0) && (
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">💎</span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Hidden Opportunities</h3>
                                        <p className="text-sm text-[var(--text-muted)]">Long-tail keywords with better chances</p>
                                    </div>
                                </div>
                                {longTailLoading && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-[#FF4F00] border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm text-[var(--text-muted)]">
                                            {longTailProgress.current}/{longTailProgress.total}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Keywords Table */}
                            {longTails.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-[var(--border)]">
                                                <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Grade</th>
                                                <th className="text-left py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Keyword</th>
                                                <th className="text-right py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Volume</th>
                                                <th className="text-right py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                                                    <span className="text-emerald-400">Opp</span>
                                                </th>
                                                <th className="text-right py-3 px-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                                                    <span className="text-orange-400">Dif</span>
                                                </th>
                                                <th className="py-3 px-2 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {longTails.map((kw, i) => (
                                                <tr
                                                    key={i}
                                                    className={`border-b border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors ${(kw.grade === "A" || kw.grade === "B") ? "bg-emerald-500/5" : ""
                                                        }`}
                                                >
                                                    <td className="py-3 px-2">
                                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${gradeConfig[kw.grade]?.bg} ${gradeConfig[kw.grade]?.text}`}>
                                                            {kw.grade}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <button
                                                            onClick={() => handleSearch(kw.keyword)}
                                                            className="text-[var(--text-primary)] hover:text-[#FF4F00] transition-colors text-left font-medium"
                                                        >
                                                            {kw.keyword}
                                                        </button>
                                                    </td>
                                                    <td className="py-3 px-2 text-right text-sm text-[var(--text-muted)]">
                                                        {formatVolume(kw.searchVolume)}
                                                    </td>
                                                    <td className="py-3 px-2 text-right">
                                                        <span className="text-sm font-medium text-emerald-400">{kw.opportunity}%</span>
                                                    </td>
                                                    <td className="py-3 px-2 text-right">
                                                        <span className="text-sm font-medium text-orange-400">{kw.difficulty}%</span>
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <button
                                                            onClick={(e) => addToCart({
                                                                keyword: kw.keyword,
                                                                grade: kw.grade,
                                                                opportunity: kw.opportunity,
                                                                searchVolume: kw.searchVolume,
                                                            }, e)}
                                                            disabled={isInCart(kw.keyword)}
                                                            className={`p-2 rounded-lg transition-all ${isInCart(kw.keyword)
                                                                ? "bg-emerald-500/20 text-emerald-400"
                                                                : "bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[#FF4F00] hover:bg-[#FF4F00]/10"
                                                                }`}
                                                        >
                                                            {isInCart(kw.keyword) ? (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {longTails.length === 0 && longTailLoading && (
                                <div className="text-center py-8 text-[var(--text-muted)]">
                                    <p>Discovering hidden opportunities...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Recommendations */}
                    {result.recommendations && (
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                <span>💡</span> Recommendations
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {result.recommendations.titlePatterns.length > 0 && (
                                    <div>
                                        <p className="text-[var(--text-muted)] text-sm mb-3">Title Patterns That Work</p>
                                        <div className="space-y-2">
                                            {result.recommendations.titlePatterns.slice(0, 3).map((pattern, i) => (
                                                <p key={i} className="text-[var(--text-primary)] text-sm flex items-start gap-2">
                                                    <span className="text-[#FF4F00]">•</span>
                                                    {pattern}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {result.recommendations.mustHaveTags.length > 0 && (
                                    <div>
                                        <p className="text-[var(--text-muted)] text-sm mb-3">Must-Have Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.recommendations.mustHaveTags.slice(0, 8).map((tag, i) => (
                                                <span key={i} className="px-3 py-1.5 text-sm rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border)]">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!result && !analyzing && !error && (
                <div className="text-center py-16">
                    <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#FF4F00]/20 to-purple-500/20 flex items-center justify-center text-6xl">
                        🔬
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Ready to Find Gold?</h3>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-6">
                        Enter any keyword to discover hidden opportunities, analyze competition, and get AI-powered recommendations.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {["youtube seo", "tiktok growth", "ai tools", "content creation"].map((kw) => (
                            <button
                                key={kw}
                                onClick={() => handleSearch(kw)}
                                className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[#FF4F00] hover:text-[#FF4F00] transition-all"
                            >
                                Try "{kw}"
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* CSS for fly animation */}
            <style jsx>{`
                @keyframes flyToCart {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: translate(calc(var(--target-x) / 2), calc(var(--target-y) / 2 - 50px)) scale(0.8);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--target-x), var(--target-y)) scale(0.3);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}
