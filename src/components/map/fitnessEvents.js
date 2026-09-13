// Shared by the home page map and the standalone map component, which each
// carried their own identical copy of this array before the migration.
export const stateData = [
  {
    id: 1,
    name: 'Maharashtra',
    coordinates: [19.7515, 75.7139],
    events: [
      { name: 'Yoga Camp', date: '2024-12-01' },
      { name: 'Marathon', date: '2024-12-05' },
    ],
  },
  {
    id: 2,
    name: 'Karnataka',
    coordinates: [15.3173, 75.7139],
    events: [{ name: 'Cycling Event', date: '2024-12-10' }],
  },
  {
    id: 3,
    name: 'Delhi',
    coordinates: [28.7041, 77.1025],
    events: [{ name: 'Zumba Workshop', date: '2024-12-15' }],
  },
];

export const INDIA_CENTER = [20.5937, 78.9629];
export const INDIA_ZOOM = 5;

export const markerIconOptions = {
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
};
