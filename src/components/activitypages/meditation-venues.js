"use client";

import React, { useState } from 'react';
import Navbar from '../Navbar/navbar';

const MeditationWorld = () => {
  const [activeTab, setActiveTab] = useState('arenas');

  const tennisArenas = [
    {
      name: 'Vipassana Sadhana Sansthan',
      address: 'C6P3+HW2, Logistics farms Village Bhatti, Chattarpur Mandir Rd, opposite Radha Soami Satsang, Phase IV, New Delhi, Delhi 110074',
      phone: '011 2645 2772',
      facilities: ['Meditation Halls', 'Individual Meditation Rooms', 'Counseling and Support'],
      rating: 4.7,
    },
    {
      name: 'Pyramid Meditation Centre',
      address: 'Rooftop, 17, B-7/Extension, Block B 7, Safdarjung Enclave, New Delhi,110029',
      phone: '070428 31591',
      facilities: ['Yoga and Wellness Classes', 'Community Activities', 'Yoga and Wellness Classes'],
      rating: 4.3,
    },
    {
      name: 'The Art Of Living',
      address: '200 DDA Site 1, New Rajinder Nagar, New Delhi, 110060',
      phone: ' 083768 21223',
      facilities: ['Yoga Programs', 'Happiness Program', 'Cultural and Community Events'],
      rating: 4.7
      
    },
    {
      name: 'BramhakumariS Meditation Centre',
      address: 'Manav Kalyan Bhavan, R 4, West, opp. Pratap Nagar, Pratap Nagar, Market, Hari Nagar, New Delhi, Delhi, 110064',
      phone: ' 097384 21345',
      facilities: ['Yoga and Wellness Classes', 'Community Activities', 'Yoga and Wellness Classes'],
      rating: 4.3,
    },
    {
      name: 'Yogoda Satsanga Dhyana Kendra',
      address: '11-12, Bhai Vir Singh Marg, Sector 2, Gole Market, New Delhi, Delhi 110001',
      phone: ' 011 2334 6271',
      facilities: ['Yoga and Wellness Classes', 'Meditation Halls', 'Individual Meditation Rooms'],
      rating: 4.8,
    },
    {
      name: 'Dhammarama',
      address: 'Metro Station Gate, Plot 8 Metro view Residency, 1, opposite Sector 11, Sector 11 Dwarka, Dwarka, Delhi, 110075',
      phone: '078386 09598',
      facilities: ['Meditation Halls', 'Individual Meditation Rooms', 'Counseling and Support'],
      rating: 4.3,
    },
    {
      name: 'Tushita Mahayana Meditation Centre',
      address: 'No. 9, Padmini enclave, Block F Rd, Kausalya Park, Block J, Padmini Enclave, Hauz Khas, New Delhi, Delhi 110016',
      phone: ' 093199 83001',
      facilities: ['Yoga and Wellness Classes', 'Meditation Halls', 'Individual Meditation Rooms'],
      rating: 4.4,
    },
    {
      name: 'Sri Aurobindo Ashram',
      address: 'Begumpur Road, Sarvodaya Enclave, New Delhi',
      phone: ' 08130253768',
      facilities: ['Meditation Halls', 'Individual Meditation Rooms', 'Counseling and Support'],
      rating: 4.6,
    },
    {
      name: 'Zorba The Buddha',
      address: 'No.7, Tropical Drive, Mehrauli-Gurgaon Road, Ghitorni, New Delhi',
      phone: ' 07123498991',
      facilities: ['Yoga and Wellness Classes', 'Meditation Halls', 'Individual Meditation Rooms'],
      rating: 4.1,
    },
    {
      name: 'Transcendental Meditation',
      address: 'Block BP, West Shalimar Bagh, New Delhi',
      phone: ' 09124667821',
      facilities: ['Meditation Halls', 'Individual Meditation Rooms', 'Counseling and Support'],
      rating: 4.8,
    },
  ];

  const learningResources = [
    {
      title: "Peace and Relaxation",
      type: "Online Video",
      level: "Beginner",
      duration: "15 Minutes",
      youtubeLink: "https://www.youtube.com/watch?v=MSdqEhO1egc", // Replace with actual link
    },
    {
      title: "Meditation for Stress Relief and Anxiety",
      type: "Online Video",
      level: "Beginner",
      duration: "20 Minutes",
      youtubeLink: "https://www.youtube.com/watch?v=uNiJW0KMwf4", // Replace with actual link
    },
    {
      title: "Pranayama for Inner Balance",
      type: "Online Video",
      level: "Beginner",
      duration: "10 Minutes",
      youtubeLink: "https://www.youtube.com/watch?v=blbv5UTBCGg", // Replace with actual link
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
          <h1 style={styles.headerText}>MEDITATION</h1>
        </div>
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'arenas' ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab('arenas')}
          >
            Meditation Arenas
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

export default MeditationWorld;
