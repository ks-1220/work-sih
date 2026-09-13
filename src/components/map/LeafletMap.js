"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { stateData, INDIA_CENTER, INDIA_ZOOM, markerIconOptions } from './fitnessEvents';

// Leaflet reads `window` as soon as it is imported, so nothing in this file may
// be pulled into a server render. It is only ever reached through the
// ssr: false dynamic import in FitnessEventsMap.
const customIcon = new L.Icon(markerIconOptions);

const LeafletMap = ({ onSelectState, style }) => (
  <MapContainer center={INDIA_CENTER} zoom={INDIA_ZOOM} style={style}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
    />

    {stateData.map((state) => (
      <Marker
        key={state.id}
        position={state.coordinates}
        icon={customIcon}
        eventHandlers={{
          click: () => onSelectState(state),
        }}
      >
        <Popup>{state.name}</Popup>
      </Marker>
    ))}
  </MapContainer>
);

export default LeafletMap;
