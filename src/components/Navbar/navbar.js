"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/auth';
import WhatsAppFloat from '../shared/WhatsAppFloat';
import ChatbotFloat from '../shared/ChatbotFloat';
import { ORIGINAL_NAV_ITEMS } from '../../config/navItems';
const audio2 = "/media/audio2.mp3";
import './navbar.css';

// Base items (incl. Profile) render for everyone, including Guest Mode.
// Logout is appended for signed-in users only. See src/config/navItems.js.
//
// Mobile behaviour: on phones (max-width: 768px, see navbar.css) the sidebar
// is an off-canvas drawer. When used with `mobileOpen`/`onClose` (e.g. from
// WithNavbar + TopBar) it is controlled from outside; when rendered bare
// (home, diet, profile, sustain views) it manages its own floating opener.
export default function Navbar({ mobileOpen, onClose }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  // Auth-aware: show a Logout entry only for signed-in users (no flash —
  // nothing renders until the client has read the stored token).
  const { isLoggedIN, isAuthReady } = useAuth();
  const navItems =
    isAuthReady && isLoggedIN
      ? [...ORIGINAL_NAV_ITEMS, { href: '/logout', icon: 'fa-solid fa-right-from-bracket', labelKey: 'nav.logout' }]
      : ORIGINAL_NAV_ITEMS;

  const controlled = mobileOpen !== undefined;
  const open = controlled ? mobileOpen : internalOpen;
  const close = () => {
    if (controlled) {
      if (onClose) onClose();
    } else {
      setInternalOpen(false);
    }
  };
  // Effects call close through a ref so they never depend on its identity.
  const closeRef = useRef(close);
  closeRef.current = close;

  // Tapping any nav item navigates, so the drawer must shut on arrival.
  useEffect(() => {
    closeRef.current();
  }, [pathname]);

  // While the drawer is open: Escape shuts it and the page behind stays put.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

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
      {/* Floating opener for pages that render a bare <Navbar/> with no
          top bar (home, diet, profile, sustain). Hidden on desktop and on
          pages where a parent controls the drawer. */}
      {!controlled && (
        <button
          type="button"
          className="sidebar-fab"
          onClick={() => setInternalOpen(true)}
          aria-label={t('nav.menu')}
          aria-expanded={open}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      )}
      {/* Dimmed backdrop behind the open drawer (phones only, see CSS). */}
      {open && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={close}
          aria-label="Close menu"
          tabIndex={-1}
        />
      )}
      <nav className={`main-menu${open ? ' mobile-open' : ''}`} aria-label={t('nav.menu')}>
        {/* Top Hamburger Icon — on phones this closes the drawer. */}
        <div
          className="sidebar-hamburger"
          title={t('nav.menu')}
          onClick={close}
          role="button"
          tabIndex={0}
          aria-label={t('nav.menu')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              close();
            }
          }}
        >
          <i className="fa-solid fa-bars"></i>
        </div>

        {/* Sidebar nav items with curvy-ends styling */}
        <ul>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const label = t(item.labelKey);
            return (
              <li key={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
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

        {/* Bottom Legal Copyright */}
        <div className="sidebar-bottom-legal">
          <div>&copy; 2026 SaathiSync</div>
          <div>
            <Link href="/about">{t('nav.terms')}</Link> | <Link href="/about">{t('nav.privacy')}</Link>
          </div>
        </div>
      </nav>

        {/* Floating buttons (bottom-right, site-wide): chatbot above WhatsApp */}
        <ChatbotFloat />
        <WhatsAppFloat />
      </>
    );
  }
