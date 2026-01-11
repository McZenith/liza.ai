"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];

export default function LanguageThemeSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("liza-theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("liza-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Change language
  const changeLanguage = (newLocale: string) => {
    // Replace the locale segment in the pathname
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setShowDropdown(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-light)] transition-all text-lg"
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>

      {/* Language Selector */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="h-9 px-3 rounded-lg flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-light)] transition-all text-sm"
        >
          <span>{currentLang.flag}</span>
          <span className="text-[var(--text-primary)] hidden sm:inline">{currentLang.code.toUpperCase()}</span>
          <svg className="w-3 h-3 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute top-full right-0 mt-2 w-40 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[var(--bg-hover)] transition-colors ${
                    locale === lang.code ? "bg-[#FF4F00]/10 text-[#FF4F00]" : "text-[var(--text-primary)]"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="text-sm">{lang.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
