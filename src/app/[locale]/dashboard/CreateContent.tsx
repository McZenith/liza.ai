"use client";

import { useState } from "react";

interface CreateContentProps {
  selectedKeywords?: string[];
}

// Placeholder component for the Create tab
// Will generate AI-powered titles, descriptions, and tags from selected keywords
export default function CreateContent({ selectedKeywords = [] }: CreateContentProps) {
  const [keywords] = useState<string[]>(selectedKeywords);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">✨</span>
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Create Content</h2>
          <p className="text-[var(--text-muted)] text-sm">
            Turn your selected keywords into optimized video content
          </p>
        </div>
      </div>

      {/* Selected Keywords (Shopping Cart) */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛒</span>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Selected Keywords</h3>
          </div>
          <span className="text-sm text-[var(--text-muted)]">{keywords.length} keywords</span>
        </div>

        {keywords.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-[var(--text-secondary)] font-medium">No keywords selected yet</p>
            <p className="text-[var(--text-muted)] text-sm mt-2">
              Go to the <span className="text-[#FF4F00]">Explore</span> or <span className="text-[#8B5CF6]">Research</span> tab 
              to find and select keywords
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-[#FF4F00]/10 text-[#FF4F00] text-sm font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI Generation Tools (Coming Soon) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Title Generator */}
        <div className="card p-6 opacity-60">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🎬</span>
            <h3 className="font-semibold text-[var(--text-primary)]">Title Generator</h3>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            AI-powered titles based on top performing videos
          </p>
          <div className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-center text-sm text-[var(--text-muted)]">
            Coming Soon
          </div>
        </div>

        {/* Description Generator */}
        <div className="card p-6 opacity-60">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📝</span>
            <h3 className="font-semibold text-[var(--text-primary)]">Description Writer</h3>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            SEO-optimized descriptions with keywords
          </p>
          <div className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-center text-sm text-[var(--text-muted)]">
            Coming Soon
          </div>
        </div>

        {/* Tag Extractor */}
        <div className="card p-6 opacity-60">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🏷️</span>
            <h3 className="font-semibold text-[var(--text-primary)]">Tag Extractor</h3>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Extract winning tags from top 50 videos
          </p>
          <div className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-center text-sm text-[var(--text-muted)]">
            Coming Soon
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card p-6 bg-gradient-to-br from-[#FF4F00]/5 to-[#8B5CF6]/5">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "1", icon: "🔍", text: "Research keywords in Explore/Research tabs" },
            { step: "2", icon: "🛒", text: "Add promising keywords to your cart" },
            { step: "3", icon: "🤖", text: "AI analyzes top 50 videos for each keyword" },
            { step: "4", icon: "✨", text: "Get optimized titles, descriptions & tags" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm text-[var(--text-secondary)]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
