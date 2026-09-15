"use client";

import React from "react";
import Link from "next/link";
import styles from "./FitnessLanding.module.css";

export default function FitnessLanding() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>✨ SWASTH∞ FITNESS</span>
          <h1 className={styles.title}>Choose Your Discipline</h1>
          <p className={styles.subtitle}>
            Select your path to start your personalized wellness and strength journey.
          </p>
        </div>

        {/* Mode Picker Grid — Yoga & Gym */}
        <div className={styles.modePicker}>
          {/* Yoga Card */}
          <Link href="/start/yoga" className={`${styles.modeCard} ${styles.modeYoga}`}>
            <div className={styles.modeImgWrap}>
              <img src="/yoga-card.jpg" alt="Woman meditating in lotus pose" />
            </div>
            <div className={styles.modeBody}>
              <span className={styles.modeCategory}>Mind &amp; Body</span>
              <h2 className={styles.modeTitle}>🧘 Yoga</h2>
              <p className={styles.modeTagline}>
                Breathe deep, flow gracefully &amp; find your inner balance — one
                pose at a time.
              </p>
              <div className={`${styles.modeBtn} ${styles.modeBtnYoga}`}>
                Begin Your Flow <span className={styles.modeBtnArrow}>→</span>
              </div>
            </div>
          </Link>

          {/* Gym Card */}
          <Link href="/start/gym" className={`${styles.modeCard} ${styles.modeGym}`}>
            <div className={styles.modeImgWrap}>
              <img src="/gym-card.jpg" alt="Athlete doing a dumbbell curl" />
            </div>
            <div className={styles.modeBody}>
              <span className={styles.modeCategory}>Strength &amp; Conditioning</span>
              <h2 className={styles.modeTitle}>🏋️ Gym</h2>
              <p className={styles.modeTagline}>
                Push harder, lift heavier &amp; crush every rep — no excuses, just
                gains.
              </p>
              <div className={`${styles.modeBtn} ${styles.modeBtnGym}`}>
                Hit the Iron <span className={styles.modeBtnArrow}>→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
