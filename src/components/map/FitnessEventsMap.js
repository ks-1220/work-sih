"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// ssr: false keeps Leaflet out of the server render entirely. Marking the file
// "use client" is not enough on its own: client components are still
// prerendered on the server, and Leaflet touches `window` at import time.
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <div style={{ width: '70%', height: '100%' }} />,
});

const FitnessEventsMap = ({ placeholder, mapStyle = { width: '70%', height: '100%' } }) => {
  const [selectedState, setSelectedState] = useState(null);

  return (
    <>
      <LeafletMap onSelectState={setSelectedState} style={mapStyle} />

      <div
        style={{
          width: '30%',
          padding: '20px',
          overflowY: 'auto',
          borderLeft: '1px solid #ccc',
        }}
      >
        {selectedState ? (
          <div>
            <h3>{selectedState.name}</h3>
            <ul>
              {selectedState.events.map((event, index) => (
                <li key={index}>
                  <strong>{event.name}</strong> - {event.date}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>{placeholder}</p>
        )}
      </div>
    </>
  );
};

export default FitnessEventsMap;
