"use client";

import React from 'react';
import image from "../../assets/picture2.jpg";
import Navbar from '../Navbar/navbar';

function BlogPost2() {
  const blogPost = {
    title: "I just set a new record in cycling: 30 miles!💪",
    author: "Mike",
    date: "5th December 2024",
    content: `I’m over the moon to share a huge personal achievement: I just completed a 30-mile cycling ride, smashing my previous record! 💪 This ride wasn’t just another workout—it was a test of grit, endurance, and self-belief. The day started early, with the cool morning air carrying a mix of excitement and nervous energy as I set out. The first 10 miles felt like a breeze. My legs were strong, my cadence steady, and I soaked in the scenery, feeling completely in sync with the rhythm of the ride.

Around the 15-mile mark, the challenge began to reveal itself. My energy started to dip, and those subtle inclines I didn’t think twice about earlier began to feel like mountains. I focused on my breathing, my form, and reminding myself why I set this goal in the first place. At mile 20, a second wind kicked in, just as fatigue began to creep in again. I refueled with water and a quick snack, knowing the final 10 miles would push me past my limits.

The last stretch was a mental game. My legs were screaming, my shoulders stiff, and my mind started whispering doubts: Do you really have to finish this today? But I leaned into the challenge, letting the thought of crossing the 30-mile mark drive me forward. Every pedal stroke was a small victory, building toward the finish. When I finally hit the 30-mile milestone, I was overwhelmed with pride, a mix of exhaustion and euphoria washing over me.

This ride taught me more than just physical endurance—it reminded me of the power of persistence, preparation, and the joy of achieving something you once thought was out of reach. If you’re considering setting a big fitness goal, let this be your sign: go for it! The ride may test you, but the reward is unforgettable. 🚴‍♀️✨`,
  };

  return (
    <div style={{display:"flex"}}>
      <Navbar/>
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      backgroundColor: '#F0D0F9', // Soft lavender background
      minHeight: '100vh',
      color: '#4a4a4a'
    }}>
      <div style={{
        backgroundColor: '#944DA9', // Vibrant purple header
        padding: '20px',
        borderBottom: '2px solid #944DA9', // Deeper purple border
        marginBottom: '20px',
        borderRadius: '8px 8px 0 0'
      }}>
        <h1 style={{
          color: '#ffffff', // White title color
          fontSize: '2em',
          marginBottom: '10px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.2)' // Subtle text shadow
        }}>
          {blogPost.title}
        </h1>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#e6d6ff', // Soft purple text for author and date
          fontSize: '0.9em'
        }}>
          <span>Author: {blogPost.author}</span>
          <span>Date: {blogPost.date}</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '20px'
      }}>
          <img 
            src={image.src} 
            alt="Fitness challenge"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)' // Subtle shadow
            }}
          />
      </div>

      <div style={{
        textAlign: 'justify',
        backgroundColor: '#E7BCF5', // Very soft purple background for content
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)' // Subtle shadow
      }}>
        {blogPost.content.split('\n\n').map((paragraph, index) => (
          <p key={index} style={{ 
            marginBottom: '15px',
            color: '#4a4a4a' // Dark gray text for readability
          }}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
    </div>
  );
}

export default BlogPost2;