"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../store/auth';
import speaker from "../../assets/speaker.png";
// Audio and video live in public/media: Next has no webpack loader for these
// file types, so they cannot be imported the way Create React App allowed.
const audio2 = "/media/audio2.mp3";
import './navbar.css';

// Every entry carries its own href, so the list can grow without renumbering
// anything.
//
// SheFit used to be filtered on `user.gender === 'Female'`. A gender string is
// not an eligibility rule, and menstrual health education does not depend on
// the value on an account, so the section is available to everyone. Private
// records, when they exist, are gated by consent and ownership instead.
const NAV_ITEMS = [
  { href: '/', icon: 'fa fa-house nav-icon', label: 'Home' },
  { href: '/start', icon: 'fas fa-weight', label: 'Fitness' },
  { href: '/cards', icon: 'fas fa-apple-alt', label: 'Dietary' },
  { href: '/sus', icon: 'fas fa-leaf', label: 'Sustain' },
  { href: '/arthub', icon: 'fas fa-hand-holding-heart', label: 'Serenity' },
  { href: '/she', icon: 'fas fa-venus', label: 'SheFit' },
  { href: '/tracker', icon: 'fas fa-chart-line', label: 'Tracker' },
  { href: '/profile', icon: 'fa fa-user nav-icon', label: 'Profile' },
  { href: '/about', icon: 'fas fa-circle-info', label: 'About' },
];

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);  // To toggle chatbot visibility
  const { isLoggedIN } = useAuth();

  // Derived from the URL rather than held in state. The old version set an
  // index on click, but every link was a plain anchor that reloaded the
  // document, so the component remounted and the index reset to 0 every time.
  // The highlight was permanently stuck on Home.
  const pathname = usePathname();

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const toggleChatbot = () => setShowChatbot(!showChatbot);  // Toggle function for chatbot visibility

  return (
    <main>
      <nav className="main-menu">
        <h1>Swasth∞</h1>
        <img className="logo" src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/4cfdcb5a-0137-4457-8be1-6e7bd1f29ebb" alt="" />
        <ul>
          {NAV_ITEMS.map((item) => (
            <li
              key={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <b></b>
              <b></b>
              <Link href={item.href}>
                <i className={item.icon}></i>
                <span className="nav-text">{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="nav-item">
            <b></b>
            <b></b>
            <div onClick={() => {
              const audioElement = document.getElementById('audioPlayer');
              if (audioElement) {
                audioElement.play().catch(error => {
                  console.log('Audio playback failed:', error);
                });
              }
            }}>
              <img 
                src={speaker.src}
                alt="Play Audio" 
                style={{ width: '50px', height: '40px', cursor: 'pointer', backgroundColor:'white', borderRadius:'50px'}} 
              />
            </div>
            <audio id="audioPlayer">
              <source src={audio2} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </li>
        </ul>

        <div className="user-menu">
          <div className="user-icon-circle" onClick={toggleDropdown}>
            <i className="fas fa-user-cog"></i>
          </div>
          {showDropdown && (
            <div className="dropdown-menu-nav">
              {isLoggedIN ? (<Link href="/logout">Logout</Link>) : (<>
                <Link href="/register">Register</Link>
                <Link href="/login">Login</Link>
              </>)}
            </div>
          )}
        </div>
      </nav>

      {/* Chatbot Icon */}
      <div 
        className="chatbot-icon" 
        onClick={toggleChatbot} 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          backgroundColor: '#e1bee7', 
          borderRadius: '50%', 
          padding: '10px', 
          cursor: 'pointer' 
        }}
      >
        <i className="fas fa-comment-alt" style={{ color: 'rgb(57,73,117)', fontSize: '24px' }}></i>
      </div>

      {/* Chatbot iframe */}
      {showChatbot && (
        <div 
          className="chatbot-container" 
          style={{ 
            position: 'fixed', 
            bottom: '70px', 
            right: '20px', 
            width: '350px', 
            height: '500px', 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)', 
            zIndex: 9999
          }}
        >
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/ADV93zEpeXv-8WlwW2wJB"
            width="100%"
            style={{ height: '100%' }}
            frameBorder="0"
          ></iframe>
        </div>
      )}
    </main>
  );
}

export default Navbar;
