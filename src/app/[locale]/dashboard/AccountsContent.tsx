"use client";

// Placeholder component for the Accounts tab
export default function AccountsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔗</span>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Manage Accounts</h2>
            <p className="text-[var(--text-muted)] text-sm">
              Connect and manage your social media accounts
            </p>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="card p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Connected Accounts</h3>
        
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔌</div>
          <p className="text-[var(--text-secondary)] font-medium">No accounts connected</p>
          <p className="text-[var(--text-muted)] text-sm mt-2">
            Connect your accounts to unlock scheduling and analytics
          </p>
        </div>
      </div>

      {/* Available Platforms */}
      <div className="card p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Available Platforms</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* YouTube */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[#FF0000]/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#FF0000] flex items-center justify-center text-white text-xl">
                ▶
              </div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">YouTube</h4>
                <p className="text-xs text-[var(--text-muted)]">Video platform</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 rounded-xl bg-[#FF0000] text-white font-medium hover:bg-[#FF0000]/90 transition-colors opacity-50 cursor-not-allowed">
              Connect
            </button>
          </div>

          {/* TikTok */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[#000000]/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#25F4EE] via-[#FE2C55] to-[#000000] flex items-center justify-center text-white text-xl">
                ♪
              </div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">TikTok</h4>
                <p className="text-xs text-[var(--text-muted)]">Short-form video</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 rounded-xl bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          {/* Instagram */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[#E1306C]/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] flex items-center justify-center text-white text-xl">
                📷
              </div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Instagram</h4>
                <p className="text-xs text-[var(--text-muted)]">Reels & Stories</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 rounded-xl bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          {/* Twitter/X */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[#000000]/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#000000] flex items-center justify-center text-white text-xl">
                𝕏
              </div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">X (Twitter)</h4>
                <p className="text-xs text-[var(--text-muted)]">Microblogging</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 rounded-xl bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          {/* LinkedIn */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[#0A66C2]/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white text-xl">
                in
              </div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">LinkedIn</h4>
                <p className="text-xs text-[var(--text-muted)]">Professional network</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 rounded-xl bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          {/* Facebook */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[#1877F2]/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#1877F2] flex items-center justify-center text-white text-xl">
                f
              </div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Facebook</h4>
                <p className="text-xs text-[var(--text-muted)]">Social network</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 rounded-xl bg-[var(--bg-hover)] text-[var(--text-secondary)] font-medium cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="card p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Account Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)]">
            <div>
              <h4 className="font-medium text-[var(--text-primary)]">Auto-post enabled</h4>
              <p className="text-sm text-[var(--text-muted)]">Automatically publish scheduled posts</p>
            </div>
            <button className="w-12 h-6 rounded-full bg-[var(--bg-hover)] relative opacity-50 cursor-not-allowed">
              <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-[var(--text-muted)]" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)]">
            <div>
              <h4 className="font-medium text-[var(--text-primary)]">Post notifications</h4>
              <p className="text-sm text-[var(--text-muted)]">Get notified when posts are published</p>
            </div>
            <button className="w-12 h-6 rounded-full bg-[var(--bg-hover)] relative opacity-50 cursor-not-allowed">
              <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-[var(--text-muted)]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
