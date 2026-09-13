"use client";

import React, { useState } from 'react';
import { useAuth } from '../../store/auth';
import speaker from "../../assets/speaker.png";
// Audio and video live in public/media: Next has no webpack loader for these
// file types, so they cannot be imported the way Create React App allowed.
const audio2 = "/media/audio2.mp3";
import './navbar.css'; 

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);  // To toggle chatbot visibility
  const { isLoggedIN , user} = useAuth();

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const toggleChatbot = () => setShowChatbot(!showChatbot);  // Toggle function for chatbot visibility

  return (
    <main>
      <nav className="main-menu">
        <h1>Swasth∞</h1>
        <img className="logo" src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/4cfdcb5a-0137-4457-8be1-6e7bd1f29ebb" alt="" />
        <ul>
          <li className={`nav-item ${activeIndex === 0 ? 'active' : ''}`}>
            <b></b>
            <b></b>
            <a href="/" onClick={() => setActiveIndex(0)}>
              <i className="fa fa-house nav-icon"></i>
              <span className="nav-text">Home</span>
            </a>
          </li>
          <li className={`nav-item ${activeIndex === 1 ? 'active' : ''}`}>
            <b></b>
            <b></b>
            <a href="/start" onClick={() => setActiveIndex(1)}>
              <i className="fas fa-weight"></i>
              <span className="nav-text">Fitness</span>
            </a>
          </li>
          <li className={`nav-item ${activeIndex === 2 ? 'active' : ''}`}>
            <b></b>
            <b></b>
            <a href="/cards" onClick={() => setActiveIndex(2)}>
              <i className="fas fa-apple-alt"></i>
              <span className="nav-text">Dietary</span>
            </a>
          </li>
          <li className={`nav-item ${activeIndex === 3 ? 'active' : ''}`}>
            <b></b>
            <b></b>
            <a href="/sus" onClick={() => setActiveIndex(3)}>
              <i className="fas fa-leaf"></i>
              <span className="nav-text">Sustain</span>
            </a>
          </li>
          <li className={`nav-item ${activeIndex === 4 ? 'active' : ''}`}>
            <b></b>
            <b></b>
            <a href="/arthub" onClick={() => setActiveIndex(4)}>
              <i className="fas fa-hand-holding-heart"></i>
              <span className="nav-text">Serenity</span>
            </a>
          </li>
          {user && user.gender === 'Female' && (
          <li className={`nav-item ${activeIndex === 5 ? 'active' : ''}`}>
            <b></b>
            <b></b>
            <a href="she" onClick={() => setActiveIndex(5)}>
              <i className="fas fa-venus"></i>
              <span className="nav-text">SheFit</span>
            </a>
          </li>
          )}
          <li className={`nav-item ${activeIndex === 6 ? 'active' : ''}`}>
            <b></b>
            <b></b>
            <a href="/profile" onClick={() => setActiveIndex(6)}>
              <i className="fa fa-user nav-icon"></i>
              <span className="nav-text">Profile</span>
            </a>
          </li>
          <li className={`nav-item ${activeIndex === 7 ? 'active' : ''}`}>
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
              {isLoggedIN ? (<a href="/logout">Logout</a>) : (<>
                <a href="/register">Register</a>
                <a href="/login">Login</a>
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
