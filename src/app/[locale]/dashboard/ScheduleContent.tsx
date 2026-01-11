"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Placeholder component for the Schedule tab
export default function ScheduleContent() {
  const t = useTranslations('dashboard');
  const [selectedDate] = useState(new Date());

  // Generate calendar days for current month
  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📅</span>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{t('scheduleTab.title')}</h2>
            <p className="text-[var(--text-muted)] text-sm">
              {t('scheduleTab.subtitle')}
            </p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl bg-[#FF4F00] text-white font-medium hover:bg-[#FF4F00]/90 transition-colors opacity-50 cursor-not-allowed">
          {t('scheduleTab.scheduleNew')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] opacity-50 cursor-not-allowed">
                ←
              </button>
              <button className="p-2 rounded-lg bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] opacity-50 cursor-not-allowed">
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-xs font-medium text-[var(--text-muted)] py-2">
                {day}
              </div>
            ))}
            {getDaysInMonth().map((day, i) => (
              <div
                key={i}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-sm
                  ${day ? "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] cursor-pointer" : ""}
                  ${day === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth()
                    ? "bg-[#FF4F00]/10 text-[#FF4F00] font-semibold" 
                    : ""}
                `}
              >
                {day !== null ? String(day) : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Posts */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{t('scheduleTab.upcomingPosts')}</h3>

          <div className="text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-[var(--text-secondary)] font-medium">{t('scheduleTab.noScheduledPosts')}</p>
            <p className="text-[var(--text-muted)] text-sm mt-2">
              {t('scheduleTab.connectToSchedule')}
            </p>
          </div>
        </div>
      </div>

      {/* Connect Account CTA */}
      <div className="card p-6 bg-gradient-to-br from-[#FF0000]/10 to-[#FF4F00]/10 border-[#FF0000]/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FF0000] flex items-center justify-center text-white text-2xl">
            ▶
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)]">{t('scheduleTab.connectChannel')}</h3>
            <p className="text-sm text-[var(--text-muted)]">
              {t('scheduleTab.connectChannelDesc')}
            </p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-[#FF0000] text-white font-medium hover:bg-[#FF0000]/90 transition-colors opacity-50 cursor-not-allowed">
            {t('scheduleTab.connectYouTube')}
          </button>
        </div>
      </div>
    </div>
  );
}
