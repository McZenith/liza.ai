"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from "../ThemeProvider";
import { locales, localeNames } from '@/i18n/config';

// ============== PARALLAX BACKGROUND ==============

function ParallaxBackground() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 3000], [0, -400]);
  const y2 = useTransform(scrollY, [0, 3000], [0, -600]);
  const y3 = useTransform(scrollY, [0, 3000], [0, -200]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-100" />

      {/* Parallax Orbs */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-[#FF4F00] blur-[180px] opacity-15"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[30%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#8B5CF6] blur-[200px] opacity-10"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[60%] left-[5%] w-[400px] h-[400px] rounded-full bg-[#22D3EE] blur-[150px] opacity-10"
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[80%] right-[20%] w-[500px] h-[500px] rounded-full bg-[#FF4F00] blur-[180px] opacity-10"
      />
    </div>
  );
}

// ============== LANGUAGE SWITCHER ==============

function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Replace current locale in pathname with new locale
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-light)] transition-colors text-sm font-medium"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="hidden sm:inline">{localeNames[locale as keyof typeof localeNames]}</span>
        <span className="sm:hidden">{locale.toUpperCase()}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-full mt-2 py-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-lg min-w-[160px] z-50"
        >
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-hover)] transition-colors flex items-center justify-between ${locale === loc ? 'text-[#FF4F00] font-medium' : 'text-[var(--text-secondary)]'
                }`}
            >
              <span>{localeNames[loc as keyof typeof localeNames]}</span>
              {locale === loc && <span className="text-[#FF4F00]">✓</span>}
            </button>
          ))}
        </motion.div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// ============== NAVIGATION ==============

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('nav');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled
        ? "bg-[var(--nav-bg)] backdrop-blur-xl border-[var(--nav-border)] py-3 shadow-lg"
        : "bg-transparent border-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.a
          href="#"
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4F00] to-[#FF7A33] flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-[var(--text-primary)] font-bold text-xl">L</span>
          </div>
          <span className="text-2xl font-bold text-[var(--text-primary)]">Liza<span className="text-[#FF4F00]">.ai</span></span>
        </motion.a>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: t('features'), href: '#features' },
            { label: t('workflow'), href: '#workflow' },
            { label: t('pricing'), href: '#pricing' },
            { label: t('resources'), href: '#resources' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF4F00] transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="theme-toggle"
            title={resolvedTheme === "dark" ? t('switchToLight') : t('switchToDark')}
          >
            {resolvedTheme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </motion.button>

          <button className="hidden md:block text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition">
            {t('login')}
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-sm py-3 px-6"
          >
            {t('startFree')}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

// ============== HERO WITH PARALLAX ==============

function Hero() {
  const ref = useRef(null);
  const t = useTranslations('hero');
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="trust-badge mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[var(--text-secondary)] text-sm font-medium">{t('trustBadge')}</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] mb-6 leading-[1.1] tracking-tight"
        >
          {t('headline')}
          <br />
          <span className="gradient-text">{t('headlineHighlight')}</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          {t('description')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(255, 79, 0, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg px-10 py-5 animate-pulse-glow"
          >
            {t('ctaPrimary')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary text-lg px-10 py-5 flex items-center gap-3"
          >
            <span className="w-10 h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[#FF4F00]">▶</span>
            {t('ctaSecondary')}
          </motion.button>
        </motion.div>

        {/* Platform Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-4"
        >
          <span className="text-[var(--text-muted)] text-sm mr-2">{t('worksWithLabel')}</span>
          {[
            { name: "YouTube", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>, color: "#FF0000" },
            { name: "TikTok", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>, color: "#00F2EA" },
            { name: "Instagram", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>, color: "#E4405F" },
            { name: "X", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>, color: "var(--text-primary)" },
            { name: "LinkedIn", icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>, color: "#0A66C2" },
            { name: "Airbnb", icon: <Image src="/airbnb.png" alt="Airbnb" width={20} height={20} />, color: "#FF5A5F" },
          ].map((platform, i) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              whileHover={{ scale: 1.1, y: -2 }}
              className="w-11 h-11 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center cursor-pointer transition-colors hover:border-[var(--border-light)]"
              style={{ color: platform.color }}
              title={platform.name}
            >
              {platform.icon}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-[var(--border-light)] flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-[#FF4F00]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============== FEATURES WITH PARALLAX CARDS ==============

function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const t = useTranslations('features');

  const features = [
    { icon: "🔍", key: "research", color: "#8B5CF6" },
    { icon: "🔥", key: "trends", color: "#F97316" },
    { icon: "✨", key: "content", color: "#FF4F00" },
    { icon: "📅", key: "scheduling", color: "#22D3EE" },
    { icon: "📊", key: "analytics", color: "#22C55E" },
    { icon: "💬", key: "engagement", color: "#EC4899" },
  ];

  return (
    <section id="features" ref={ref} className="relative py-32 z-10">
      <motion.div style={{ y }} className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#FF4F00] font-semibold text-sm uppercase tracking-wider">{t('sectionLabel')}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-3 mb-4">
            {t('headline')} <span className="gradient-text">{t('headlineHighlight')}</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            {t('description') || 'From research to publishing to analytics — one platform for your entire content workflow.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="card p-8"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{ background: `${f.color}20`, boxShadow: `0 0 30px ${f.color}20` }}
              >
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{t(`${f.key}.title`)}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">{t(`${f.key}.description`)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ============== WORKFLOW JOURNEY (Before → During → After) ==============

function WorkflowSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const t = useTranslations('workflow');

  const workflowSteps = [
    { key: "before", color: "#8B5CF6", icon: "🔍" },
    { key: "during", color: "#22D3EE", icon: "✨" },
    { key: "after", color: "#22C55E", icon: "📊" },
  ];

  return (
    <section id="workflow" ref={ref} className="relative py-32 section-alt z-10">
      <motion.div style={{ y }} className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-[#FF4F00] font-semibold text-sm uppercase tracking-wider">{t('sectionLabel')}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-3 mb-4">
            {t('headline')} <span className="gradient-text">{t('headlineHighlight')}</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            {t('description')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Lines */}
          <div className="hidden md:flex absolute top-1/2 left-0 right-0 -translate-y-1/2 justify-between px-[15%] z-0">
            <div className="w-1/3 h-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]" />
            <div className="w-1/3 h-0.5 bg-gradient-to-r from-[#22D3EE] to-[#22C55E]" />
          </div>

          {workflowSteps.map((step, i) => {
            const items = t.raw(`${step.key}.items`) as string[];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="card p-8 relative z-10"
              >
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-4"
                  style={{ color: step.color }}
                >
                  {t(`${step.key}.phase`)}
                </div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
                  style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}
                >
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t(`${step.key}.title`)}</h3>
                <p className="text-[var(--text-muted)] text-sm mb-4">{t(`${step.key}.subtitle`)}</p>
                <p className="text-[var(--text-secondary)] mb-6">{t(`${step.key}.description`)}</p>
                <ul className="space-y-3">
                  {items.map((item: string, j: number) => (
                    <li key={j} className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        style={{ background: `${step.color}20`, color: step.color }}
                      >✓</span>
                      <span className="text-[var(--text-primary)]">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

// ============== TESTIMONIALS ==============

function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const t = useTranslations('testimonials');
  const items = t.raw('items') as Array<{ quote: string; author: string; role: string; stat: string }>;

  return (
    <section ref={ref} className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-[#FF4F00] font-semibold text-sm uppercase tracking-wider">{t('sectionLabel')}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-3">
            {t('headline')} <span className="gradient-text">{t('headlineHighlight')}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="card p-8"
            >
              <div className="stats-badge mb-6">{item.stat}</div>
              <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">"{item.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-xl">👤</div>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">{item.author}</div>
                  <div className="text-sm text-[var(--text-muted)]">{item.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============== PRICING ==============

function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const t = useTranslations('pricing');

  const planKeys = ['free', 'creator', 'agency'] as const;
  const planConfigs = [
    { key: 'free', popular: false },
    { key: 'creator', popular: true },
    { key: 'agency', popular: false },
  ];

  return (
    <section id="pricing" ref={ref} className="relative py-32 section-alt z-10">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-[#FF4F00] font-semibold text-sm uppercase tracking-wider">{t('sectionLabel')}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-3 mb-4">
            {t('headline')} <span className="gradient-text">{t('headlineHighlight')}</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg">{t('description')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {planConfigs.map((planConfig, i) => {
            const features = t.raw(`plans.${planConfig.key}.features`) as string[];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative rounded-2xl p-8 ${planConfig.popular
                  ? "bg-gradient-to-b from-[#FF4F00]/10 to-[var(--bg-elevated)] border-2 border-[#FF4F00] shadow-lg shadow-orange-500/20"
                  : "card"
                  }`}
              >
                {planConfig.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF4F00] text-white text-sm font-bold px-5 py-1.5 rounded-full">
                    {t('mostPopular')}
                  </div>
                )}
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{t(`plans.${planConfig.key}.name`)}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-[var(--text-primary)]">{t(`plans.${planConfig.key}.price`)}</span>
                  {t.has(`plans.${planConfig.key}.period`) && <span className="text-[var(--text-muted)]">{t(`plans.${planConfig.key}.period`)}</span>}
                </div>
                <p className="text-[var(--text-muted)] text-sm mb-6">{t(`plans.${planConfig.key}.description`)}</p>
                <ul className="space-y-3 mb-8">
                  {features.map((f: string, j: number) => (
                    <li key={j} className="flex items-center gap-3 text-[var(--text-secondary)] text-sm">
                      <span className="text-[#22C55E]">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-semibold transition-all ${planConfig.popular
                  ? "bg-[#FF4F00] text-white hover:bg-[#E54500]"
                  : "bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border)]"
                  }`}>
                  {t(`plans.${planConfig.key}.cta`)}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============== FINAL CTA ==============

function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const t = useTranslations('cta');

  return (
    <section ref={ref} className="relative py-32 z-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            {t('headline')} <span className="gradient-text">{t('headlineHighlight')}</span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
            {t('description')}
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(255, 79, 0, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg px-12 py-6"
          >
            {t('button')}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// ============== FOOTER ==============

function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="relative py-16 border-t border-[var(--border)] z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF4F00] to-[#FF7A33] flex items-center justify-center">
              <span className="text-[var(--text-primary)] font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">Liza.ai</span>
          </div>
          <div className="flex items-center gap-8 text-[var(--text-muted)]">
            {[
              { label: t('privacy'), href: '#' },
              { label: t('terms'), href: '#' },
              { label: t('blog'), href: '#' },
            ].map((link) => (
              <a key={link.label} href={link.href} className="hover:text-[var(--text-primary)] transition text-sm">{link.label}</a>
            ))}
          </div>
          <div className="text-[#52525B] text-sm">{t('copyright')}</div>
        </div>
      </div>
    </footer>
  );
}

// ============== SCROLL TO TOP ==============

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[#FF4F00] text-[var(--text-primary)] flex items-center justify-center shadow-lg shadow-orange-500/30 hover:bg-[#E54500] transition-colors"
      aria-label="Scroll to top"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </motion.button>
  );
}

// ============== MAIN PAGE ==============

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] relative">
      <ParallaxBackground />
      <Navigation />
      <Hero />
      <FeaturesSection />
      <WorkflowSection />
      <TestimonialsSection />
      <PricingSection />
      <FinalCTA />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
