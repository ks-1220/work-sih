"use client";

import Navbar from '../Navbar/navbar';
import './WithNavbar.css';

// Sidebar + content shell. The mobile hamburger strip + drawer come from the
// site-wide MobileMenu in the root layout, so every route shares one menu.
export default function WithNavbar({ children }) {
  return (
    <div className="withnav">
      <div className="withnav-sidebar">
        <Navbar />
      </div>
      <div className="withnav-content">
        <div className="withnav-body">{children}</div>
      </div>
    </div>
  );
}
