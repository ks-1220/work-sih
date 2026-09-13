"use client";

import React from 'react';
import image from "../../assets/picture1.jpg";
import Navbar from '../Navbar/navbar';

function BlogPost() {
  const blogPost = {
    title: "We completed the 30-Day Running Streak Challenge!🏃‍♀️🎉",
    author: "Jane",
    date: "9th December 2024",
    content: `I'm feeling absolutely exhilarated today! If you would've told me a month ago that I would be setting a new cycling record and completing a 30-day running streak, I probably would've laughed in disbelief. But here I am, on December 24th, sharing this milestone with all of you—and I'm bursting with pride!

It all started when I decided to push myself a little further this year. I've always been passionate about fitness, but I wanted to challenge myself in new ways. A friend of mine told me about the 30-Day Running Streak Challenge, where you commit to running every day for 30 days straight. At first, I was hesitant—could I really do it? Would my body hold up? But with a little determination and the right mindset, I jumped in.

Every morning, I set out for a run, and with each passing day, I noticed my endurance growing. It wasn't always easy, especially on those cold, rainy mornings, but the satisfaction of crossing off another day on my streak kept me motivated. Some days I ran short distances, others I pushed myself a bit further, but I stuck to it.

Along the way, I also set my sights on a cycling goal. I've always loved cycling, but I never quite pushed myself to ride long distances. This time, I decided to set a new personal record—and I'm beyond excited to share that I crushed it! I cycled 30 miles in one go, a distance I'd only dreamed of achieving before. The feeling of accomplishment after finishing that ride was indescribable. It was the perfect complement to completing my running streak.

So, what have I learned from this experience? First, fitness is all about consistency and pushing your limits, even when it feels tough. Every mile, every step, and every day adds up to something bigger than just physical achievement—it's about building mental toughness and resilience. Second, setting goals, no matter how big or small, is a powerful motivator. Whether it's a cycling record or a streak of daily runs, having a goal to work towards gives you purpose.

To anyone reading this, I encourage you to try setting your own challenge. Maybe it's cycling, running, or even something completely different—but whatever it is, commit to it fully. You'll be amazed at how much you're capable of once you put your mind to it!

Thanks for following my fitness journey. Here's to more records, more streaks, and even bigger goals in the future! 💪🎉`,
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

export default BlogPost;