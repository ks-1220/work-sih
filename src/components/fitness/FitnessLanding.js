"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styles from "./FitnessLanding.module.css";

export default function FitnessLanding() {
  const { t } = useTranslation();
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>✨ {t('fitness.badge')}</span>
          <h1 className={styles.title}>{t('fitness.title')}</h1>
          <p className={styles.subtitle}>{t('fitness.subtitle')}</p>
        </div>

        {/* Mode Picker Grid — Yoga & Gym */}
        <div className={styles.modePicker}>
          {/* Yoga Card */}
          <Link href="/start/yoga" className={`${styles.modeCard} ${styles.modeYoga}`}>
            <div className={styles.modeImgWrap}>
              <img src="/yoga-card.jpg" alt={t('fitness.yogaAlt')} />
            </div>
            <div className={styles.modeBody}>
              <span className={styles.modeCategory}>{t('fitness.yogaCat')}</span>
              <h2 className={styles.modeTitle}>🧘 {t('fitness.yoga')}</h2>
              <p className={styles.modeTagline}>{t('fitness.yogaTag')}</p>
              <div className={`${styles.modeBtn} ${styles.modeBtnYoga}`}>
                {t('fitness.yogaBtn')} <span className={styles.modeBtnArrow}>→</span>
              </div>
            </div>
          </Link>

          {/* Gym Card */}
          <Link href="/start/gym" className={`${styles.modeCard} ${styles.modeGym}`}>
            <div className={styles.modeImgWrap}>
              <img src="/gym-card.jpg" alt={t('fitness.gymAlt')} />
            </div>
            <div className={styles.modeBody}>
              <span className={styles.modeCategory}>{t('fitness.gymCat')}</span>
              <h2 className={styles.modeTitle}>🏋️ {t('fitness.gym')}</h2>
              <p className={styles.modeTagline}>{t('fitness.gymTag')}</p>
              <div className={`${styles.modeBtn} ${styles.modeBtnGym}`}>
                {t('fitness.gymBtn')} <span className={styles.modeBtnArrow}>→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
