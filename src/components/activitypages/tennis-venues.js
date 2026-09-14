"use client";

import React, { useState } from 'react';
import Navbar from '../Navbar/navbar';

const TennisWorld = () => {
  const [activeTab, setActiveTab] = useState('arenas');

  const tennisArenas = [
    {
      name: 'East Delhi Tennis Academy',
      address: 'Clay Courts, Vikash Marg Rd, Block B, Swasthya Vihar, Delhi, 110092',
      phone: '09124667821',
      facilities: ['Indoor Courts', 'Outdoor Courts', 'Pro Shop'],
      rating: 4.4,
    },
    {
      name: 'Yamuna Sports Complex ',
      address: 'M876+873, Surajmal Vihar, Delhi, 110092',
      phone: '09876346324',
      facilities: ['Clay Courts', 'Hard Courts', 'Coaching Available'],
      rating: 4.6,
    },
    {
      name: 'BASE Sports',
      address: '78, Yamuna Sports Complex, Surajmal Vihar, New Delhi, Delhi 110092',
      phone: '09845323553',
      facilities: ['Indoor & Outdoor', 'Night Lighting', 'Equipment Rental'],
      rating: 4.2,
    },
    {
        name: 'Adian Deportes',
        address: 'Faridabad Sector 81, Faridabad',
        phone: '8050237589',
        facilities: ['Clay Courts', 'Hard Courts', 'Coaching Available'],
        rating: 4.3,
    },
    {
        name: 'BASE Sports',
        address: '78, Yamuna Sports Complex, Surajmal Vihar, New Delhi, Delhi 110092',
        phone: '09845323553',
        facilities: ['Indoor & Outdoor', 'Night Lighting', 'Equipment Rental'],
        rating: 4.4,
    },
    {
        name: 'Gallant Play Arena G K 1',
        address: 'Greater Kailash 1, Delhi',
        phone: '08967346523',
        facilities: ['Indoor Courts', 'Outdoor Courts', 'Pro Shop'],
        rating: 4.1,
    },
    {
        name: 'Uprising Tennis Academy',
        address: 'Sadarpur, Ghaziabad',
        phone: '09843452553',
        facilities: ['Clay Courts', 'Hard Courts', 'Coaching Available'],
        rating: 4.5,
    },
    {
        name: 'Green park Sports Complex',
        address: 'MXWP+62X, Sawda, Delhi, 110081',
        phone: '98739 31800',
        facilities: ['Indoor & Outdoor', 'Night Lighting', 'Equipment Rental'],
        rating: 4.2,
    },
    {
        name: 'Gallant Play Arena South City 1',
        address: 'Sec - 41, South City 1',
        phone: '09842365453',
        facilities: ['Indoor Courts', 'Outdoor Courts', 'Pro Shop'],
        rating: 4.7,
    },
    {
        name: 'United Shuttlers Badminton Academy',
        address: ' Yamuna Sports Complex,Gate No-4, Surajmal Vihar, Delhi, 110092',
        phone: '09823321875',
        facilities: ['Indoor & Outdoor', 'Night Lighting', 'Equipment Rental'],
        rating: 4.0,
    },
  ];

  const learningResources = [
    {
      title: "The Basic Swing Pattern",
      type: "Online Video",
      level: "Beginner",
      duration: "5 Minutes",
      youtubeLink: "https://www.youtube.com/watch?v=VsiShyD6O2U", // Replace with actual link
    },
    {
      title: "Better Court Coverage",
      type: "Online Video",
      level: "Beginner",
      duration: "6 Minutes",
      youtubeLink: "https://www.youtube.com/watch?v=AYkgzXkE0uc", // Replace with actual link
    },
    {
      title: "Baseline Accuracy Drill",
      type: "Online Video",
      level: "Beginner",
      duration: "5 minutes",
      youtubeLink: "https://www.youtube.com/watch?v=example3", // Replace with actual link
    },
  ];

  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f3e5f5',
      margin: 0,
      padding: 0,
      display: "flex",
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    headerText: {
      fontSize: '2.5rem',
      color: '#6a1b9a',
      fontWeight: 'bold',
      margin: 0,
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#ce93d8',
      borderRadius: '25px',
      padding: '5px',
      marginBottom: '20px',
    },
    tab: {
      padding: '10px 20px',
      borderRadius: '20px',
      fontWeight: 'bold',
      cursor: 'pointer',
      color: '#6a1b9a',
      textAlign: 'center',
      transition: 'background-color 0.2s',
    },
    tabActive: {
      backgroundColor: '#6a1b9a',
      color: 'white',
    },
    arenas: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
    arenaCard: {
      backgroundColor: 'white',
      border: '1px solid #d1c4e9',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    arenaTitle: {
      fontSize: '1.5rem',
      color: '#6a1b9a',
      marginBottom: '10px',
    },
    arenaDetails: {
      fontSize: '0.9rem',
      color: '#555',
      lineHeight: '1.5',
    },
    facilities: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '10px',
    },
    facility: {
      backgroundColor: '#e1bee7',
      color: '#6a1b9a',
      fontSize: '0.8rem',
      padding: '5px 10px',
      borderRadius: '15px',
      textAlign: 'center',
    },
    resources: {
      listStyleType: 'none',
      padding: 0,
      marginTop: '20px',
    },
    resourceItem: {
      backgroundColor: '#ffffff',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '10px',
      border: '1px solid #d1c4e9',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    resourceTitle: {
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#6a1b9a',
    },
    resourceDetails: {
      fontSize: '0.9rem',
      color: '#555',
    },
    cta: {
      backgroundColor: '#ce93d8',
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
      marginTop: '30px',
    },
    ctaTitle: {
      fontSize: '1.8rem',
      color: '#6a1b9a',
      marginBottom: '10px',
    },
    ctaText: {
      fontSize: '1rem',
      color: '#555',
      marginBottom: '20px',
    },
    ctaButton: {
      backgroundColor: '#6a1b9a',
      color: 'white',
      fontSize: '1rem',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.2s',
    },
  };

  return (
    <div style={styles.body}>
      <Navbar/>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerText}>TENNIS</h1>
        </div>
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'arenas' ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab('arenas')}
          >
            Tennis Arenas
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'resources' ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab('resources')}
          >
            Learning Resources
          </button>
        </div>
        {activeTab === 'arenas' && (
          <div style={styles.arenas}>
            {tennisArenas.map((arena, index) => (
              <div key={index} style={styles.arenaCard}>
                <h3 style={styles.arenaTitle}>{arena.name}</h3>
                <div style={styles.arenaDetails}>
                  <p>Address: {arena.address}</p>
                  <p>Phone: {arena.phone}</p>
                  <p>Rating: ★ {arena.rating}</p>
                  <div style={styles.facilities}>
                    {arena.facilities.map((facility, idx) => (
                      <span key={idx} style={styles.facility}>
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'resources' && (
          <ul style={styles.resources}>
            {learningResources.map((resource, index) => (
              <li key={index} style={styles.resourceItem}>
                <div style={styles.resourceTitle}>{resource.title}</div>
                <div style={styles.resourceDetails}>
                  <p>Type: {resource.type}</p>
                  <p>Level: {resource.level}</p>
                  <p>Duration: {resource.duration}</p>
                  <p>
                    <a
                      href={resource.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#6a1b9a', textDecoration: 'underline' }}
                    >
                      Watch on YouTube
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div style={styles.cta}>
          <h2 style={styles.ctaTitle}>Ready to Improve Your Tennis?</h2>
          <p style={styles.ctaText}>
            Whether you&rsquo;re a beginner or an advanced player, we&rsquo;ve got resources to help you.
          </p>
          <button style={styles.ctaButton}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default TennisWorld;
