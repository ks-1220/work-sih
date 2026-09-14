"use client";

import './SampleDataBadge.css';

// Marks a panel whose figures come from src/data/demoStats.js rather than from
// anything the user did. Keeps the app from presenting placeholder health and
// activity numbers as real measurements.
export default function SampleDataBadge({ label = 'Sample data' }) {
  return (
    <span className="sample-data-badge" title="Placeholder figures, not your recorded data">
      {label}
    </span>
  );
}
