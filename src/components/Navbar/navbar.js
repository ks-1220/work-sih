"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/auth';
import WhatsAppFloat from '../shared/WhatsAppFloat';
const audio2 = "/media/audio2.mp3";
import './navbar.css';

// Sidebar order: Home, Fitness, Wellness (CTA), Dietary, Tracker, SheFit,
// Serenity. Sustain (/sus) and About (/about) stay reachable by URL and via
// the Terms/Privacy footer links. Logout is appended for signed-in users.
// Labels are i18n keys resolved at render time.
const ORIGINAL_NAV_ITEMS = [
  { href: '/', icon: 'fa-solid fa-house', labelKey: 'nav.home' },
  { href: '/start', icon: 'fa-solid fa-dumbbell', labelKey: 'nav.fitness' },
  { href: '/wellness', icon: 'fa-solid fa-spa', labelKey: 'nav.wellness', cta: true },
  { href: '/cards', icon: 'fa-solid fa-apple-whole', labelKey: 'nav.dietary' },
  { href: '/tracker', icon: 'fa-solid fa-chart-line', labelKey: 'nav.tracker' },
  { href: '/she', icon: 'fa-solid fa-venus', labelKey: 'nav.shefit' },
  { href: '/arthub', icon: 'fa-solid fa-hand-holding-heart', labelKey: 'nav.serenity' },
];

export default function Navbar() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  // Auth-aware: show a Logout entry only for signed-in users (no flash —
  // nothing renders until the client has read the stored token).
  const { isLoggedIN, isAuthReady } = useAuth();
  const navItems =
    isAuthReady && isLoggedIN
      ? [...ORIGINAL_NAV_ITEMS, { href: '/logout', icon: 'fa-solid fa-right-from-bracket', labelKey: 'nav.logout' }]
      : ORIGINAL_NAV_ITEMS;

  const toggleAudio = () => {
    const audioElement = document.getElementById('audioPlayer');
    if (!audioElement) return;

    if (isPlayingAudio) {
      audioElement.pause();
      setIsPlayingAudio(false);
    } else {
      audioElement.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.log('Audio playback error:', err);
      });
    }
  };

  return (
    <>
      <nav className="main-menu" aria-label={t('nav.menu')}>
        {/* Top Hamburger Icon */}
        <div className="sidebar-hamburger" title={t('nav.menu')}>
          <i className="fa-solid fa-bars"></i>
        </div>

        {/* Complete Original Nav Items with Curvy Ends Styling */}
        <ul>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const label = t(item.labelKey);
            return (
              <li key={item.href} className={`nav-item ${isActive ? 'active' : ''} ${item.cta ? 'nav-cta' : ''}`}>
                <Link href={item.href} title={label}>
                  <i className={item.icon}></i>
                  <span className="nav-text">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Ambient Serene Sound Toggle */}
        <button
          className="sidebar-zen-btn"
          onClick={toggleAudio}
          title={isPlayingAudio ? t('nav.zenPause') : t('nav.zenPlay')}
          aria-label="Toggle zen audio"
        >
          <i className={`fa-solid ${isPlayingAudio ? 'fa-pause' : 'fa-music'}`}></i>
          <span>{isPlayingAudio ? t('nav.pause') : t('nav.zen')}</span>
        </button>
        <audio id="audioPlayer" loop>
          <source src={audio2} type="audio/mp3" />
        </audio>

        {/* Bottom Curvy-Ended Action Button (Red 'Build' / 'AI Pose' button) */}
        <div className="sidebar-action-container">
          <Link href="/yoga" className="sidebar-curvy-btn" title={t('nav.buildTitle')}>
            <i className="fa-solid fa-clipboard-check"></i>
            <span>{t('nav.build')}</span>
          </Link>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="sidebar-bottom-legal">
          <div>&copy; 2026 Swasth</div>
          <div>
            <Link href="/about">{t('nav.terms')}</Link> | <Link href="/about">{t('nav.privacy')}</Link>
          </div>
        </div>
      </nav>

        {/* Floating WhatsApp button (bottom-right, site-wide) */}
        <WhatsAppFloat />
      </>
    );
  }
