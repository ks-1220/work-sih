"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SampleDataBadge from '../shared/SampleDataBadge';
import './WellnessHub.css';

// Sample directory entries. These are illustrative placeholders so the layout
// can be reviewed — not real clinics. Replace with a verified directory.
// Names, areas and hours are proper nouns and stay untranslated; focus lines
// resolve via focusKey at render time.
const CLINICS = [
  { name: 'Keraleeya Ayurveda Nilayam', kind: 'ayurveda', focusKey: 'wellness.clinicFocus1', area: 'Kochi', hours: 'Mon–Sat · 9am–7pm' },
  { name: 'Charaka Wellness Clinic', kind: 'ayurveda', focusKey: 'wellness.clinicFocus2', area: 'Bengaluru', hours: 'Mon–Sat · 10am–8pm' },
  { name: 'Vata-Pitta Balance Centre', kind: 'ayurveda', focusKey: 'wellness.clinicFocus3', area: 'Pune', hours: 'Tue–Sun · 9am–6pm' },
  { name: 'Swasth Community Clinic', kind: 'clinic', focusKey: 'wellness.clinicFocus4', area: 'Delhi', hours: 'Mon–Fri · 8am–4pm' },
  { name: 'MindEase Counselling Centre', kind: 'mental', focusKey: 'wellness.clinicFocus5', area: 'Mumbai · online', hours: 'Mon–Sat · 11am–9pm' },
  { name: 'MannSehat Therapy Studio', kind: 'mental', focusKey: 'wellness.clinicFocus6', area: 'Hyderabad · online', hours: 'Mon–Fri · 10am–7pm' },
];

const DOSHAS = [
  { id: 'vata', icon: 'fa-solid fa-wind' },
  { id: 'pitta', icon: 'fa-solid fa-fire' },
  { id: 'kapha', icon: 'fa-solid fa-mountain' },
];

const DINACHARYA = [
  { id: 'rise', icon: 'fa-solid fa-sun' },
  { id: 'water', icon: 'fa-solid fa-mug-saucer' },
  { id: 'abhyanga', icon: 'fa-solid fa-hands' },
  { id: 'meals', icon: 'fa-solid fa-bowl-food' },
  { id: 'sleep', icon: 'fa-solid fa-moon' },
];

const BREATH_PHASES = [
  { id: 'inhale', labelKey: 'wellness.breathIn', secs: 4 },
  { id: 'hold', labelKey: 'wellness.breathHold', secs: 7 },
  { id: 'exhale', labelKey: 'wellness.breathOut', secs: 8 },
];

function BreathWidget() {
  const { t } = useTranslation();
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [left, setLeft] = useState(BREATH_PHASES[0].secs);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (left > 1) {
      const t = setTimeout(() => setLeft((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPhaseIdx((i) => {
        const next = (i + 1) % BREATH_PHASES.length;
        if (next === 0) setCycles((c) => c + 1);
        setLeft(BREATH_PHASES[next].secs);
        return next;
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [running, left]);

  const phase = BREATH_PHASES[phaseIdx];
  const reset = () => {
    setRunning(false);
    setPhaseIdx(0);
    setLeft(BREATH_PHASES[0].secs);
    setCycles(0);
  };

  return (
    <div className="breath-widget">
      <div
        className={`breath-circle breath-${phase.id} ${running ? 'breath-live' : ''}`}
        style={{ '--phase-secs': `${phase.secs}s` }}
        aria-hidden="true"
      >
        <span>{running ? left : '4·7·8'}</span>
      </div>
      <div className="breath-info">
        <strong>{running ? t(phase.labelKey) : t('wellness.breathTitle')}</strong>
        <p>{running ? t('wellness.breathCycles', { count: cycles }) : t('wellness.breathPattern')}</p>
        <div className="breath-actions">
          <button type="button" onClick={() => setRunning((r) => !r)} className="breath-btn">
            {running ? t('wellness.pause') : t('wellness.begin')}
          </button>
          <button type="button" onClick={reset} className="breath-btn breath-ghost">
            {t('wellness.reset')}
          </button>
        </div>
      </div>
    </div>
  );
}

// showHero=false when composed under work-sih's Wellness hero on /wellness,
// so the page has a single hero (theirs) followed by these hub sections.
export default function WellnessHub({ showHero = true }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const shown = CLINICS.filter((c) => filter === 'all' || c.kind === filter);
  const FILTERS = [
    ['all', t('wellness.filterAll')],
    ['ayurveda', t('wellness.filterAyurveda')],
    ['clinic', t('wellness.filterClinics')],
    ['mental', t('wellness.filterMental')],
  ];
  const TIPS = [
    { icon: 'fa-solid fa-notes-medical', titleKey: 'wellness.tip1t', textKey: 'wellness.tip1x' },
    { icon: 'fa-solid fa-person-walking', titleKey: 'wellness.tip2t', textKey: 'wellness.tip2x' },
    { icon: 'fa-solid fa-users', titleKey: 'wellness.tip3t', textKey: 'wellness.tip3x' },
  ];

  return (
    <div className="wellness-page">
      {showHero && (
        <header className="wellness-hero">
          <div>
            <h1>{t('wellness.title')}</h1>
            <p>{t('wellness.subtitle')}</p>
          </div>
          <span className="wellness-info-chip">
            <i className="fa-solid fa-circle-info"></i> {t('wellness.guidanceChip')}
          </span>
        </header>
      )}

      {/* AYURVEDA — the heart of this hub */}
      <section className="well-section" aria-label={t('wellness.ayurveda')}>
        <h2><i className="fa-solid fa-spa"></i> {t('wellness.ayurveda')} <span className="well-tag">{t('wellness.focusTag')}</span></h2>
        <p className="well-lead">{t('wellness.ayurvedaLead')}</p>
        <div className="dosha-grid">
          {DOSHAS.map((d) => (
            <article key={d.id} className="glass-card dosha-card">
              <div className="dosha-head">
                <span className="dosha-icon"><i className={d.icon}></i></span>
                <div>
                  <h3>{t(`wellness.dosha_${d.id}_name`)}</h3>
                  <small>{t(`wellness.dosha_${d.id}_el`)}</small>
                </div>
              </div>
              <p>{t(`wellness.dosha_${d.id}_traits`)}</p>
              <p className="dosha-balance"><strong>{t('wellness.toBalance')}</strong> {t(`wellness.dosha_${d.id}_bal`)}</p>
            </article>
          ))}
        </div>

        <h3 className="well-sub">{t('wellness.dinaTitle')}</h3>
        <div className="dina-strip">
          {DINACHARYA.map((d) => (
            <div key={d.id} className="glass-card dina-card">
              <i className={d.icon}></i>
              <strong>{t(`wellness.dina_${d.id}_t`)}</strong>
              <span>{t(`wellness.dina_${d.id}_x`)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CLINICS */}
      <section className="well-section" aria-label={t('wellness.clinics')}>
        <h2><i className="fa-solid fa-hospital"></i> {t('wellness.clinics')} <SampleDataBadge /></h2>
        <p className="well-lead">{t('wellness.clinicsLead')}</p>
        <div className="clinic-filters" role="group" aria-label={t('wellness.filterLabel')}>
          {FILTERS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`filter-chip ${filter === id ? 'filter-on' : ''}`}
              aria-pressed={filter === id}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="clinic-grid">
          {shown.map((c) => (
            <article key={c.name} className="glass-card clinic-card">
              <div className="clinic-top">
                <h3>{c.name}</h3>
                <SampleDataBadge />
              </div>
              <p className="clinic-focus">{t(c.focusKey)}</p>
              <p className="clinic-meta"><i className="fa-solid fa-location-dot"></i> {c.area}</p>
              <p className="clinic-meta"><i className="fa-solid fa-clock"></i> {c.hours}</p>
            </article>
          ))}
        </div>
      </section>

      {/* MENTAL HEALTH */}
      <section className="well-section" aria-label={t('wellness.mental')}>
        <h2><i className="fa-solid fa-brain"></i> {t('wellness.mental')}</h2>
        <div className="mental-grid">
          <article className="glass-card">
            <h3>{t('wellness.calmTitle')}</h3>
            <BreathWidget />
          </article>
          <article className="glass-card helpline-card">
            <h3><i className="fa-solid fa-phone"></i> {t('wellness.helplineTitle')}</h3>
            <p className="helpline-num">Tele MANAS · 14416</p>
            <p>{t('wellness.helplineText')}</p>
          </article>
        </div>
        <div className="tips-row">
          {TIPS.map((tip) => (
            <div key={tip.titleKey} className="glass-card tip-card">
              <i className={tip.icon}></i>
              <strong>{t(tip.titleKey)}</strong>
              <span>{t(tip.textKey)}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="well-disclaimer">{t('wellness.disclaimer')}</footer>
    </div>
  );
}
