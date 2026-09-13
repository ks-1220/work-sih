"use client";

import React from 'react';
import track from "../../assets/images/track.jpeg";
import './ProgressBar.css'; // Import the CSS file

const ProgressBar = ({ activityCounts }) => {
  const totalDays = 30; // Assuming a month has 30 days

  const calculateProgress = (activity) => {
    const count = Object.values(activityCounts).reduce((acc, dayActivities) => {
      return acc + (dayActivities[activity] ? 1 : 0);
    }, 0);

    return ((count / totalDays) * 100).toFixed(2);
  };

  return (
    <div className="progressBarContainer">
      <div className='inner-progress'>
        <div className='progressInfo'>
          YOGA:<span>{calculateProgress('Y')}%</span>
          <progress value={calculateProgress('Y')} max="100" className='progressValue1'></progress>
        </div>
        <div className='progressInfo'>
          MEDITATION: <span>{calculateProgress('M')}%</span>
          <progress value={calculateProgress('M')} max="100" className='progressValue2'></progress>
        </div>
        <div className='progressInfo'>
          HEALTHY DIET: <span>{calculateProgress('E')}%</span>
          <progress value={calculateProgress('E')} max="100" className='progressValue3'></progress>
        </div>
        <div className='progressInfo'>
          CREATIVE HUB: <span>{calculateProgress('C')}%</span>
          <progress value={calculateProgress('C')} max="100" className='progressValue4'></progress>
        </div>
      </div>
      <img src={track.src} alt='track' className='progressImage'></img>
    </div>
  );
};

export default ProgressBar;
