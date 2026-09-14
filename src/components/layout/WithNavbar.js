"use client";

import Navbar from '../Navbar/navbar';

// Wraps a page in the sticky sidebar navigation, using the same composition
// sustain.js already used.
//
// This is applied at the route level rather than inside the page components
// themselves, because several of those components are also embedded in other
// pages that supply their own navbar: RecipeSection appears inside /cards, and
// the yoga suggestion panel appears inside /start. Putting the navbar in the
// component would render two of them on those routes.
export default function WithNavbar({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ height: '100vh', top: 0, position: 'sticky' }}>
        <Navbar />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}
