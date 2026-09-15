"use client";

import React from "react";
import Link from "next/link";
import styles from "./YogaDashboard.module.css";

/* ─── Static data ──────────────────────────────────────────── */

const GURUS = [
  { name: "Raghav Ji", style: "Hatha Yoga", img: "/guru-1.jpg" },
  { name: "Anushka Verma", style: "Vinyasa", img: "/guru-2.jpg" },
  { name: "Meera Iyer", style: "Meditation", img: "/guru-3.jpg" },
  { name: "Kunal Sharma", style: "Ashtanga", img: "/guru-4.jpg" },
];

const VENUES = [
  {
    name: "Central Park Yoga Ground",
    distance: "1.8 km away",
    tags: [
      { label: "Outdoor", style: "tagGreen" },
      { label: "Group Sessions", style: "tagBlue" },
    ],
    cropPosition: "0% 0%",
  },
  {
    name: "Santoshi Yoga Centre",
    distance: "2.4 km away",
    tags: [
      { label: "Indoor", style: "tagPurple" },
      { label: "Certified Instructors", style: "tagOrange" },
    ],
    cropPosition: "33.33% 0%",
  },
  {
    name: "Riverside Wellness Park",
    distance: "3.1 km away",
    tags: [
      { label: "Outdoor", style: "tagGreen" },
      { label: "Morning Batches", style: "tagOrange" },
    ],
    cropPosition: "66.66% 0%",
  },
];

/* September 2025 calendar data — Mon-start. Empty slots = 0. */
const SEPT_2025 = [
  /* row 1 */ 1, 2, 3, 4, 5, 6, 7,
  /* row 2 */ 8, 9, 10, 11, 12, 13, 14,
  /* row 3 */ 15, 16, 17, 18, 19, 20, 21,
  /* row 4 */ 22, 23, 24, 25, 26, 27, 28,
  /* row 5 */ 29, 30, 0, 0, 0, 0, 0,
];
const EVENT_DAYS = new Set([4, 5, 14, 15, 17, 24, 27]);
const SPECIAL_DAYS = new Set([27]);
const TODAY = 14;

/* ─── Component ────────────────────────────────────────────── */

export default function YogaDashboard() {
  return (
    <div className={styles.page}>
      {/* ═══ TOP BREADCRUMB ═══ */}
      <div className={styles.topBar}>
        <Link href="/start" className={styles.backBtn}>
          <span>←</span> Back to Fitness Modes
        </Link>
        <span className={styles.categoryBadge}>🧘 Yoga &amp; Mindfulness</span>
      </div>

      {/* ═══ HERO BANNER ═══ */}
      <section className={styles.hero}>
        <img
          className={styles.heroImage}
          src="/hero-banner.jpg"
          alt="Person meditating on a hilltop at sunrise with misty mountains"
        />
        <div className={styles.heroOverlay}>
          <span className={styles.heroEyebrow}>A Healthier, Happier You</span>
          <h1 className={styles.heroTitle}>Yoga, Your Way</h1>
          <p className={styles.heroSubtitle}>Move &nbsp;•&nbsp; Breathe &nbsp;•&nbsp; Be Present</p>
          <Link href="/start/yoga/practice" className={styles.heroCta}>
            Start Practice <span>→</span>
          </Link>
        </div>
        <p className={styles.heroQuote}>
          &ldquo;A calm mind creates a stronger you.&rdquo;
        </p>
      </section>

      {/* ═══ DASHBOARD GRID ═══ */}
      <div className={styles.dashGrid}>
        {/* ─── 1. Pose Coach ─── */}
        <div className={`${styles.card} ${styles.poseCoach}`}>
          <div className={styles.poseCoachLeft}>
            <div className={styles.cardHeader}>
              <div className={`${styles.cardIcon} ${styles.iconPurple}`}>🧘</div>
              <h2 className={styles.cardTitle}>Pose Coach</h2>
            </div>
            <p className={styles.cardSub}>Real-time posture feedback &amp; correction</p>
            <Link href="/start/yoga/practice" className={styles.cardBtn}>
              Try Now <span>→</span>
            </Link>
          </div>
          <div className={styles.poseCoachRight}>
            <img
              className={styles.poseImg}
              src="/pose-coach.jpg"
              alt="Illustration of a woman in Warrior II pose with AI skeletal overlay"
            />
            <div className={styles.accuracyRing}>
              <svg viewBox="0 0 80 80">
                <circle className={styles.ringBg} cx="40" cy="40" r="36" />
                <circle className={styles.ringFill} cx="40" cy="40" r="36" />
              </svg>
              <div className={styles.ringLabel}>
                <span className={styles.ringPercent}>92%</span>
                <span className={styles.ringText}>Posture<br />Accuracy</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2. Yoga Gurus ─── */}
        <div className={`${styles.card} ${styles.gurusCard}`}>
          <div className={styles.cardHeader}>
            <div className={`${styles.cardIcon} ${styles.iconAmber}`}>✨</div>
            <h2 className={styles.cardTitle}>Yoga Gurus</h2>
          </div>
          <p className={styles.cardSub}>Learn from inspiring teachers</p>
          <div className={styles.gurusRow}>
            {GURUS.map((g) => (
              <div key={g.name} className={styles.guruItem}>
                <img className={styles.guruAvatar} src={g.img} alt={g.name} />
                <span className={styles.guruName}>{g.name}</span>
                <span className={styles.guruStyle}>{g.style}</span>
              </div>
            ))}
            <button className={styles.gurusArrow} aria-label="See more gurus">›</button>
          </div>
          <div className={styles.guruCardBottom}>
            <Link href="/yoga" className={styles.cardBtn}>
              Explore Gurus <span>→</span>
            </Link>
          </div>
        </div>

        {/* ─── 3. Yoga Calendar ─── */}
        <div className={`${styles.card}`}>
          <div className={styles.cardHeader}>
            <div className={`${styles.cardIcon} ${styles.iconTeal}`}>📅</div>
            <h2 className={styles.cardTitle}>Yoga Calendar</h2>
          </div>
          <p className={styles.cardSub}>Sessions near you</p>
          <div className={styles.calendarCard}>
            <div className={styles.calendarWidget}>
              <div className={styles.calMonthHeader}>
                <div className={styles.calNav}>
                  <button className={styles.calNavBtn} aria-label="Previous month">‹</button>
                </div>
                <span className={styles.calMonthTitle}>September 2025</span>
                <div className={styles.calNav}>
                  <button className={styles.calNavBtn} aria-label="Next month">›</button>
                </div>
              </div>
              <div className={styles.calGrid}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <span key={d} className={styles.calDayHeader}>{d}</span>
                ))}
                {SEPT_2025.map((day, i) => {
                  if (day === 0) return <span key={`e${i}`} className={styles.calDayEmpty} />;
                  const isToday = day === TODAY;
                  const isEvent = EVENT_DAYS.has(day);
                  const isSpecial = SPECIAL_DAYS.has(day);
                  return (
                    <span
                      key={day}
                      className={`${styles.calDay} ${isToday ? styles.calDayToday : ""} ${isEvent && !isToday ? styles.calDayEvent : ""} ${isSpecial && !isToday ? styles.calDaySpecial : ""}`}
                    >
                      {isToday ? <span className={styles.calDayToday}>{day}</span> : day}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className={styles.calendarRight}>
              <div className={styles.calCategory}>
                <span className={styles.catIcon}>📍</span> Parks
              </div>
              <div className={styles.calCategory}>
                <span className={styles.catIcon}>🏛️</span> Community Centres
              </div>
              <div className={styles.calCategory}>
                <span className={styles.catIcon}>🎪</span> Special Events
              </div>
              <Link href="/yoga" className={styles.cardBtn} style={{ marginTop: "auto" }}>
                View Calendar <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── 4. My Yoga Pledge ─── */}
        <div className={`${styles.card}`}>
          <div className={styles.pledgeCard}>
            <div className={styles.pledgeLeft}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.iconPink}`}>🪷</div>
                <h2 className={styles.cardTitle}>My Yoga Pledge</h2>
              </div>
              <p className={styles.cardSub}>Commit. Practice. Grow.</p>
              <Link href="/yoga" className={styles.cardBtn}>
                Take the Pledge <span>→</span>
              </Link>
            </div>
            <div className={styles.pledgeCert}>
              <span className={styles.pledgeLotus}>🪷</span>
              <span className={styles.pledgeCertTitle}>My Yoga Pledge</span>
              <div className={styles.pledgeCheck}>✓</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ NEAR YOU SECTION ═══ */}
      <section className={styles.nearSection}>
        <div className={styles.nearHeader}>
          <div className={styles.nearHeaderLeft}>
            <span className={styles.nearIcon}>📍</span>
            <h2 className={styles.nearTitle}>Near You</h2>
            <span className={styles.nearSub}>Find yoga centres and parks around you</span>
          </div>
          <Link href="/yoga" className={styles.viewAll}>View All →</Link>
        </div>
        <div className={styles.nearGrid}>
          {VENUES.map((v) => (
            <div key={v.name} className={styles.venueCard}>
              <div className={styles.venueImgWrap}>
                <img
                  className={styles.venueImg}
                  src="/venues.jpg"
                  alt={v.name}
                  style={{ objectPosition: v.cropPosition }}
                />
              </div>
              <div className={styles.venueBody}>
                <h3 className={styles.venueName}>{v.name}</h3>
                <p className={styles.venueDistance}>📍 {v.distance}</p>
                <div className={styles.venueTags}>
                  {v.tags.map((t) => (
                    <span key={t.label} className={`${styles.venueTag} ${styles[t.style]}`}>
                      {t.label}
                    </span>
                  ))}
                </div>
                <button className={styles.venueBtn}>View</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
