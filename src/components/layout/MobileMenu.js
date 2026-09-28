"use client";

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Navbar from '../Navbar/navbar';
import ChatbotFloat from '../shared/ChatbotFloat';
import WhatsAppFloat from '../shared/WhatsAppFloat';
import './MobileMenu.css';

// Site-wide mobile chrome, rendered once in the root layout so it exists on
// every route — including login/register, which have no sidebar. On phones
// this is a sticky hamburger strip; tapping it slides the drawer in. The
// strip stays visible while scrolling (sticky top). Hidden on desktop via
// CSS, where each page's own sidebar rail is the navigation.
// The chatbot/WhatsApp floats also live here so exactly one copy renders.
export default function MobileMenu() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);
  const isHindi = i18n?.language?.startsWith('hi');

  return (
    <>
      <div className="mobile-strip">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={openMenu}
          aria-label={t('nav.menu')}
          aria-expanded={open}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <Link href="/" className="mobile-brand">
          SaathiSync
        </Link>
        <div className="mobile-lang" role="group" aria-label="Language / भाषा">
          <button
            type="button"
            className={isHindi ? '' : 'on'}
            onClick={() => i18n?.changeLanguage?.('en')}
            aria-pressed={!isHindi}
          >
            EN
          </button>
          <button
            type="button"
            className={isHindi ? 'on' : ''}
            onClick={() => i18n?.changeLanguage?.('hi')}
            aria-pressed={!!isHindi}
          >
            हिं
          </button>
        </div>
      </div>
      {/* Off-canvas drawer on phones (see navbar.css); inert + hidden on
          desktop. The page-level sidebars stay untouched for desktop. */}
      <div className="mobile-nav-holder" inert={!open}>
        <Navbar mobileOpen={open} onClose={closeMenu} />
      </div>
      <ChatbotFloat />
      <WhatsAppFloat />
    </>
  );
}
