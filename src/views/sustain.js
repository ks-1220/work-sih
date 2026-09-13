"use client";

import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Import i18next
import Navbar from '../components/Navbar/navbar';
import YourComponent from '../components/sustain/card';
const video = '/media/treeVideo.mp4'; // served from public/media
import '../App.css';

const Card = () => {
  const { t } = useTranslation(); // Hook for translations
  const videoRef = useRef(null);

  // Function to handle button click and redirect
  const handleButtonClick = () => {
    window.location.href = '/aframe-environment-component-master/index.html';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ height: "100vh", top: 0, position: "sticky" }}>
        <Navbar />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className='videodiv' style={{ display: 'flex', flexDirection: 'row' }}>
          <video
            className='video'
            ref={videoRef}
            width="100%"
            loop
            autoPlay
          >
            <source src={video} type="video/mp4" />
            {t('cards.videoFallback')}
          </video>
          <div>
            <h1 className='hstyle' style={{ marginTop: '140px', marginLeft: '80px', color: 'blueviolet' }}>
              {t('cards.videoHeader')}
            </h1>
            <button
              onClick={handleButtonClick}
              className='playbtn'
              style={{ width: '100px', height: '40px', marginLeft: '100px', borderRadius: '15px', background: 'blueviolet', color: 'white' }}
            >
              {t('cards.buttonText')}
            </button>
          </div>
        </div>
        {/* YourComponent below the video */}
        <div style={{ flex: 1 }}>
          <YourComponent />
        </div>
      </div>
    </div>
  );
};

export default Card;
