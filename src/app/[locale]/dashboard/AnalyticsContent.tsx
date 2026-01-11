"use client";

// Placeholder component for the Analytics tab
export default function AnalyticsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h2>
            <p className="text-[var(--text-muted)] text-sm">
              Track your channel performance and growth
            </p>
          </div>
        </div>
        <select className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] opacity-50 cursor-not-allowed">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Views", value: "—", change: "", icon: "👁" },
          { label: "Subscribers", value: "—", change: "", icon: "👥" },
          { label: "Watch Time", value: "—", change: "", icon: "⏱" },
          { label: "Revenue", value: "—", change: "", icon: "💰" },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-sm text-[var(--text-muted)]">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="card p-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Views Over Time</h3>
          <div className="h-48 flex items-center justify-center bg-[var(--bg-surface)] rounded-xl">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-[var(--text-muted)] text-sm">Connect YouTube to see analytics</p>
            </div>
          </div>
        </div>

        {/* Top Videos */}
        <div className="card p-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Top Performing Videos</h3>
          <div className="h-48 flex items-center justify-center bg-[var(--bg-surface)] rounded-xl">
            <div className="text-center">
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-[var(--text-muted)] text-sm">No videos tracked yet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Keyword Performance */}
      <div className="card p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Keyword Performance</h3>
        <p className="text-[var(--text-muted)] text-sm mb-6">
          Track how your researched keywords are performing in your videos
        </p>
        
        <div className="text-center py-12 bg-[var(--bg-surface)] rounded-xl">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-[var(--text-secondary)] font-medium">No keyword data yet</p>
          <p className="text-[var(--text-muted)] text-sm mt-2">
            Research keywords and create content to start tracking performance
          </p>
        </div>
      </div>

      {/* Connect Account CTA */}
      <div className="card p-6 bg-gradient-to-br from-[#22C55E]/10 to-[#22D3EE]/10 border-[#22C55E]/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#22D3EE] flex items-center justify-center text-white text-2xl">
            📊
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)]">Unlock Full Analytics</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Connect your YouTube channel to access detailed performance metrics
            </p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-[#22C55E] text-white font-medium hover:bg-[#22C55E]/90 transition-colors opacity-50 cursor-not-allowed">
            Connect YouTube
          </button>
        </div>
      </div>
    </div>
  );
}
