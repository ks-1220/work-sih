"use client";

import { useCallback, useState } from 'react';
import Navbar from '../Navbar/navbar';
import TopBar from './TopBar';
import './WithNavbar.css';

export default function WithNavbar({ children }) {
  // Mobile drawer state. On desktop (min-width: 769px) the sidebar is always
  // visible and the top bar is hidden, so this state has no visual effect.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="withnav">
      <div className="withnav-sidebar">
        <Navbar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      </div>
      <div className="withnav-content">
        <div className="withnav-topbar">
          <TopBar onToggleSidebar={toggleSidebar} />
        </div>
        <div className="withnav-body">{children}</div>
      </div>
    </div>
  );
}
