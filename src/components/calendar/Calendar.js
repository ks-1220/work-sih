"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import './Calendar.css';

const PILLARS = [
  { code: 'Y', labelKey: 'pillars.yoga', icon: 'fa-solid fa-spa' },
  { code: 'M', labelKey: 'pillars.meditation', icon: 'fa-solid fa-brain' },
  { code: 'E', labelKey: 'pillars.diet', icon: 'fa-solid fa-apple-whole' },
  { code: 'C', labelKey: 'pillars.creative', icon: 'fa-solid fa-palette' },
];

const TOTAL_DAYS = 30;

export default function Calendar({ activityCounts = {}, onActivitySelect }) {
  const { t, i18n } = useTranslation();
  const now = new Date();
  // Locale-aware month names — Hindi renders महीना names, English default.
  const locale = i18n?.language?.startsWith('hi') ? 'hi-IN' : 'en-US';
  const monthName = now.toLocaleString(locale, { month: 'long' });
  const year = now.getFullYear();
  const isEnglish = !i18n?.language?.startsWith('hi');

  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);

  const ordinal = (day) => {
    if (!isEnglish) return `${monthName} ${day}`;
    const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
    return `${monthName} ${day}${suffix}`;
  };

  return (
    <div className="weboox-cal">
      <div className="weboox-cal-title">
        <h2>{monthName} {year}</h2>
        <span>{t('calendar.hint')}</span>
      </div>

      <div className="weboox-grid">
        {days.map((day) => {
          const checks = {
            Y: !!activityCounts[day]?.Y,
            M: !!activityCounts[day]?.M,
            E: !!activityCounts[day]?.E,
            C: !!activityCounts[day]?.C,
          };
          const done = Object.values(checks).filter(Boolean).length;
          const isToday = day === now.getDate();

          return (
            <div key={day} className={`weboox-card ${isToday ? 'weboox-card-today' : ''}`}>
              <div className="weboox-card-head">
                <span className="weboox-badge">{day}</span>
                <span className="weboox-card-date">{ordinal(day)}</span>
                {isToday && <span className="weboox-today">{t('calendar.today')}</span>}
              </div>

              <div className="weboox-checks">
                {PILLARS.map((p) => (
                  <label key={p.code} className={`weboox-check ${checks[p.code] ? 'weboox-check-on' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checks[p.code]}
                      onChange={(e) => onActivitySelect(day, p.code, e.target.checked)}
                    />
                    <span className="weboox-check-box" aria-hidden="true"><i className="fa-solid fa-check"></i></span>
                    <i className={`${p.icon} weboox-check-icon`}></i>
                    <span>{t(p.labelKey)}</span>
                  </label>
                ))}
              </div>

              <div className="weboox-score">
                <span>{t('calendar.overallScore')}</span>
                <strong className={done === 4 ? 'weboox-score-full' : done > 0 ? 'weboox-score-some' : ''}>{done}/4</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
