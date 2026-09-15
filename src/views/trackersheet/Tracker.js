"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/auth';
import Link from 'next/link';
import Calendar from "../../components/calendar/Calendar";
import ProgressBar from "../../components/progress/ProgressBar";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import WhatsAppFloat from "../../components/shared/WhatsAppFloat";
import { resolvePostAuthDestination } from "../../services/onboarding";
import './Tracker.css';

export default function Tracker() {
  const { t, i18n } = useTranslation();
  const [activityCounts, setActivityCounts] = useState({});
  const { isLoggedIN, storetokenInLS } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleActivitySelect = (day, activity, isChecked) => {
    if (!isLoggedIN) {
      router.push(`/login?next=${encodeURIComponent(pathname || '/tracker')}`);
      return;
    }
    setActivityCounts((prev) => {
      const next = { ...prev };
      if (!next[day]) next[day] = {};
      else next[day] = { ...next[day] };
      if (isChecked) next[day][activity] = true;
      else {
        delete next[day][activity];
        if (Object.keys(next[day]).length === 0) delete next[day];
      }
      return next;
    });
  };

  const handleGoogleSuccess = (appToken) => {
    storetokenInLS(appToken);
    router.push(resolvePostAuthDestination(pathname || '/tracker'));
  };

  const pct = (code) => {
    const n = Object.values(activityCounts).filter((d) => d[code]).length;
    return ((n / 30) * 100).toFixed(2);
  };

  const pillars = [
    { labelKey: 'pillars.yoga', label: t('pillars.yoga'), icon: 'fa-solid fa-person-praying', pct: pct('Y') },
    { labelKey: 'pillars.meditation', label: t('pillars.meditation'), icon: 'fa-solid fa-brain', pct: pct('M') },
    { labelKey: 'pillars.diet', label: t('pillars.diet'), icon: 'fa-solid fa-apple-whole', pct: pct('E') },
    { labelKey: 'pillars.creative', label: t('pillars.creative'), icon: 'fa-solid fa-pen-nib', pct: pct('C') },
  ];
  const locale = i18n?.language?.startsWith('hi') ? 'hi-IN' : 'en-US';
  const pillarMonth = new Date().toLocaleString(locale, { month: 'long', year: 'numeric' });

  return (
    <div className="tracker-weboox">
      <h1 className="weboox-title">{t('tracker.title')}</h1>
      {!isLoggedIN && (
        <div className="tracker-login-banner">
          <span><i className="fa-solid fa-lock"></i> {t('tracker.loginBanner')}</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <GoogleSignInButton
              next={pathname || '/tracker'}
              onSuccess={handleGoogleSuccess}
              onError={() => router.push(`/login?next=${encodeURIComponent(pathname || '/tracker')}`)}
            />
            <Link href={`/login?next=${encodeURIComponent(pathname || '/tracker')}`} className="tracker-login-link">{t('tracker.emailLogin')}</Link>
          </div>
        </div>
      )}

      <div className="weboox-top">
        <div className="weboox-gauges">
          <ProgressBar activityCounts={activityCounts} />
        </div>

        <aside className="pillar-panel">
          <h2>{t('tracker.mastery')}</h2>
          <div className="pillar-scene">
            {pillars.map((p) => {
              const val = parseFloat(p.pct) || 0;
              const fillH = val <= 0 ? '0%' : `${Math.max(val, 8)}%`;
              return (
                <div key={p.label} className="pillar-col">
                  <div className="pillar-pedestal">
                    <span className="pillar-top"><i className={p.icon}></i></span>
                    <span className="pillar-shaft">
                      <span className="pillar-fill" style={{ height: fillH }} />
                    </span>
                    <span key={p.pct} className="pillar-pct-badge pillar-pop">{p.pct}%</span>
                    <span className="pillar-label">{p.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pillar-date">{pillarMonth}</div>
        </aside>
      </div>

      <Calendar activityCounts={activityCounts} onActivitySelect={handleActivitySelect} />

      <div className="weboox-footer">
        <span className="weboox-footer-text">{t('tracker.footer')}</span>
        <WhatsAppFloat inline />
      </div>
    </div>
  );
}
