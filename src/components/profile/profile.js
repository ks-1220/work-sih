"use client";

// TaskManager.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StreakCalendar from '../streakcalender/streakcalender';
import { useAuth } from '../../store/auth';
import SampleDataBadge from '../shared/SampleDataBadge';
import { demoProfileStats } from '../../data/demoStats';
import './profile.scss'; // Import your CSS file here

const Profile = () => {
  const [selectedMail, setSelectedMail] = useState([]);
  const [color, setColor] = useState('#493971');
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [streakData, setStreakData] = useState([]); // Stores the user's login streak dates
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Current year

  const { user } = useAuth(); // Fetch user data from the auth context or store
  const { isLoggedIN } = useAuth();

  // Update streak data when the user data changes
  useEffect(() => {
    if (user && user.lastLoginDates) {
      const formattedDates = user.lastLoginDates.map(date =>
        new Date(date).toISOString().split("T")[0] // Convert to YYYY-MM-DD
      );
      setStreakData(formattedDates); // Assuming `lastLoginDates` is an array of streak dates in `YYYY-MM-DD` format
    }
  }, [user]);

  const formattedLastLogin = user.lastLoginDate
            ? new Date(user.lastLoginDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : "Never";

  // Browser sniffing moved out of the render body: `window` and `navigator` do
  // not exist during the server render, and mutating document.body while
  // rendering is a side effect React does not allow either way.
  useEffect(() => {
    const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    const isEdge = /Edg/.test(navigator.userAgent);

    if (isChrome) {
      document.body.classList.add('chrome');
    } else if (isEdge) {
      document.body.classList.add('edge');
    }
  }, []);

  const handleMailChange = (id) => {
    setSelectedMail(prevSelected => 
      prevSelected.includes(id) ? prevSelected.filter(mailId => mailId !== id) : [...prevSelected, id]
    );
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
    document.documentElement.style.setProperty('--button-color', e.target.value);
  };

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      // Navigate to the previous month
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (direction === "next") {
      // Navigate to the next month
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  return (
    <div>
    {isLoggedIN ? (
      <div className="container">
      <div className="user-profile-area">
        <div className='home-heading'>
          <Link href="/">
              <i className="fa fa-house nav-icon1"></i>
            </Link>
        <div className="task-manager">Back to Home</div>
        </div>
        <div className="side-wrapper">
          <div className="user-profile">
            <img src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202212/afp_000_9cq7ux_shilpa_shetty_yoga-one_one.jpg?VersionId=DeAg8M98aY9OSz3Z3gVSU84uySM4f245" alt="" className="user-photo" />
            <div className="user-name">{user.firstName} {user.lastName}</div>
            <div className="user-mail">{user.email}</div>
          </div>
          <div className="user-notification">
            <div className="notify">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="currentColor">
            <path d="M13.533 5.6h-.961a.894.894 0 01-.834-.57.906.906 0 01.197-.985l.675-.675a.466.466 0 000-.66l-1.32-1.32a.466.466 0 00-.66 0l-.676.677a.9.9 0 01-.994.191.906.906 0 01-.56-.837V.467A.467.467 0 007.933 0H6.067A.467.467 0 005.6.467v.961c0 .35-.199.68-.57.834a.902.902 0 01-.983-.195L3.37 1.39a.466.466 0 00-.66 0L1.39 2.71a.466.466 0 000 .66l.675.675c.25.25.343.63.193.995a.902.902 0 01-.834.56H.467A.467.467 0 000 6.067v1.866c0 .258.21.467.467.467h.961c.35 0 .683.202.834.57a.904.904 0 01-.197.984l-.675.676a.466.466 0 000 .66l1.32 1.32a.466.466 0 00.66 0l.68-.68a.894.894 0 01.994-.187.897.897 0 01.556.829v.961c0 .258.21.467.467.467h1.866c.258 0 .467-.21.467-.467v-.961c0-.35.202-.683.57-.834a.904.904 0 01.984.197l.676.675a.466.466 0 00.66 0l1.32-1.32a.466.466 0 000-.66l-.68-.68a.894.894 0 01-.187-.994.897.897 0 01.829-.556h.961c.258 0 .467-.21.467-.467V6.067a.467.467 0 00-.467-.467zM7 9.333C5.713 9.333 4.667 8.287 4.667 7S5.713 4.667 7 4.667 9.333 5.713 9.333 7 8.287 9.333 7 9.333z" /></svg>
            </div>
            <div className="notify alert">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M10.688 95.156C80.958 154.667 204.26 259.365 240.5 292.01c4.865 4.406 10.083 6.646 15.5 6.646 5.406 0 10.615-2.219 15.469-6.604 36.271-32.677 159.573-137.385 229.844-196.896 4.375-3.698 5.042-10.198 1.5-14.719C494.625 69.99 482.417 64 469.333 64H42.667c-13.083 0-25.292 5.99-33.479 16.438-3.542 4.52-2.875 11.02 1.5 14.718z" />
      <path d="M505.813 127.406a10.618 10.618 0 00-11.375 1.542C416.51 195.01 317.052 279.688 285.76 307.885c-17.563 15.854-41.938 15.854-59.542-.021-33.354-30.052-145.042-125-208.656-178.917a10.674 10.674 0 00-11.375-1.542A10.674 10.674 0 000 137.083v268.25C0 428.865 19.135 448 42.667 448h426.667C492.865 448 512 428.865 512 405.333v-268.25a10.66 10.66 0 00-6.187-9.677z" /></svg>
            </div>
            <div className="notify alert">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
            <path d="M467.812 431.851l-36.629-61.056a181.363 181.363 0 01-25.856-93.312V224c0-67.52-45.056-124.629-106.667-143.04V42.667C298.66 19.136 279.524 0 255.993 0s-42.667 19.136-42.667 42.667V80.96C151.716 99.371 106.66 156.48 106.66 224v53.483c0 32.853-8.939 65.109-25.835 93.291L44.196 431.83a10.653 10.653 0 00-.128 10.752c1.899 3.349 5.419 5.419 9.259 5.419H458.66c3.84 0 7.381-2.069 9.28-5.397 1.899-3.329 1.835-7.468-.128-10.753zM188.815 469.333C200.847 494.464 226.319 512 255.993 512s55.147-17.536 67.179-42.667H188.815z" /></svg>
            </div>
          </div>
          <div className="progress-status">{demoProfileStats.taskProgress} <SampleDataBadge /></div>
          <div className="progress">
            <div className="progress-bar"></div>
          </div>
          <div className="task-status">
            <div className="task-stat">
              <div className="task-number">{user.streak}</div>
              <div className="task-condition">Streaks</div>
              <div className="task-tasks">{formattedLastLogin}</div>
            </div>
            {/* Streak above is a real backend field. These two are not, so
                each carries its own marker rather than one on the row. */}
            <div className="task-stat">
              <div className="task-number">{demoProfileStats.fitnessEventsAttended}</div>
              <div className="task-condition">Fitness Events</div>
              <div className="task-tasks"><SampleDataBadge /></div>
            </div>
            <div className="task-stat">
              <div className="task-number">{demoProfileStats.followerCount}</div>
              <div className="task-condition">Follower</div>
              <div className="task-tasks"><SampleDataBadge /></div>
            </div>
          </div>
        </div>
        <div className="side-wrapper">
  <div className="project-title">Medical Complications</div>
  <div className="project-name">
    {user?.medicalComplications && user.medicalComplications.length > 0 ? (
      user.medicalComplications.map((complication, index) => (
        <div key={index} className="project-department">
          {complication || "No data available"}
        </div>
      ))
    ) : (
      <div className="project-department">No medical complications found</div>
    )}
  </div>
</div>

        <div className="side-wrapper">
          <div style={{ padding: "20px", textAlign: "center" }}>
      <h3>
        Your Streak for {currentMonth < 10 ? `0${currentMonth}` : currentMonth}-{currentYear}
      </h3>
      <div className="streak-nav">
        <button type="button" onClick={() => handleMonthChange("prev")}>
          Previous Month
        </button>
        <button type="button" onClick={() => handleMonthChange("next")}>
          Next Month
        </button>
      </div>
      <StreakCalendar streakData={streakData} year={currentYear} month={currentMonth} />
    </div>
        </div>
      </div>
      <div className="main-area">
        <div className="header">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="inbox-calendar" onClick={toggleCalendar} checked={calendarVisible}
              readOnly>
            <input type="checkbox" className="inbox-calendar-checkbox" />
            <div className="toggle-page">
              <span>Appointment</span>
            </div>
            <div className="layer"></div>
          </div>
          <div className="color-menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 464.7 464.7"><path d="M446.6 18.1a62 62 0 00-87.6 0L342.3 35a23 23 0 10-32.5 32.5l5.4 5.4-180.6 180.6L71.9 316c-5 5-8 11.6-8.2 18.7l-.2 3.3-2.5 56.7a9.4 9.4 0 009.4 9.8h.4l30-1.3 18.4-.8 8.3-.4a37 37 0 0024.5-10.8l240.9-240.9 4.5 4.6a23 23 0 0032.5 0c9-9 9-23.6 0-32.6l16.7-16.7a62 62 0 000-87.6zm-174 209.2l-84.6 16 138-138 34.4 34.3-87.8 87.7zM64.5 423.9C28.9 423.9 0 433 0 444.3c0 11.3 28.9 20.4 64.5 20.4s64.5-9.1 64.5-20.4C129 433 100 424 64.5 424z"/>
            </svg>
            <input type="color" value={color} className="colorpicker" onChange={handleColorChange} />
          </div>
        </div>
        <div className="main-container">
          <div className={`inbox-container ${calendarVisible ? 'hide' : ''}`}>
            <div className="inbox">
              {['mail1', 'mail2', 'mail3', 'mail4', 'mail5', 'mail6', 'mail7', 'mail8'].map((mailId, index) => (
                <div key={mailId} className={`msg ${selectedMail.includes(mailId) ? 'selected-bg' : ''} anim-y`}>
                  <input
                    type="checkbox"
                    name="msg"
                    id={mailId}
                    className="mail-choice"
                    checked={selectedMail.includes(mailId)}
                    onChange={() => handleMailChange(mailId)}
                  />
                  <label htmlFor={mailId}></label>
                  <div className="msg-content">
                    <div className="msg-title">Appointment {index + 1}</div>
                    <div className="msg-date">10 Sept, 2024</div>
                  </div>
                  <img
                    src={`https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg`}
                    alt=""
                    className="members mail-members"
                  />
                </div>
              ))}
            </div>
            {/* <div className="add-task">
              <button className="add-button">Add task</button>
            </div> */}
            <div className="mail-detail">
    <div className="mail-detail-header">
     <div className="mail-detail-profile">
      <img src="https://assets.codepen.io/3364143/Screen+Shot+2020-08-01+at+12.24.16.png" alt="" className="members inbox-detail" />
      <div className="mail-detail-name">{user.firstName} {user.lastName}</div>
     </div>
     <div className="mail-icons">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash-2">
       <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user">
       <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
       <circle cx="12" cy="7" r="4" /></svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-tag">
       <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" /></svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-check-square">
       <path d="M9 11l3 3L22 4" />
       <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-paperclip">
       <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
     </div>
    </div>
    <div className="mail-contents">
     <div className="mail-contents-subject">
      <input type="checkbox" name="msg" id="mail20" className="mail-choice" checked/>
      <label for="mail20"></label>
      <div className="mail-contents-title">Schedule an appointment with a Nutritionist</div>
     </div>
     <div className="mail">
      <div className="mail-time">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-clock">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" /></svg>
       11 Sept, 2024
      </div>
      <div className="mail-inside">I am particularly interested in  [specifically e.g., weight management, enhancing athletic performance, improving digestive health, etc.]. Would it be possible to schedule a consultation at your earliest convenience? I am flexible with my availability. Your expertise in these areas would be invaluable to me.
Please let me know if there is any additional information you require from me beforehand. I look forward to your response and the opportunity to work together.</div>
      <div className="mail-assign">
       <div className="assignee">
        <strong>Necessary Reports</strong> Please Find the document atteched.
        <span className="assign-date">25 Nov, 2019</span>
       </div>
      </div>
      <div className="mail-checklist">
       <input type="checkbox" name="msg" id="mail30" className="mail-choice" checked/>
       <label for="mail30">Necessary Reports Document Uploaded</label>
       <div className="mail-checklist-date">11 September, 2024</div>
      </div>
      <div className="mail-doc">
       <div className="mail-doc-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" className="feather feather-file-text">
         <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
         <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
        <div className="mail-doc-detail">
         <div className="mail-doc-name">Details.pdf</div>
         <div className="mail-doc-date">added 11 Sept, 2024</div>
        </div>
       </div>
       <div className="mail-doc-icons">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash-2">
         <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-download-cloud">
         <path d="M8 17l4 4 4-4M12 12v9" />
         <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" /></svg>
       </div>
      </div>
     </div>
    </div>
    <div className="mail-textarea">
     <input type="text" placeholder="Write a comment..."/>
     <div className="textarea-icons">
      <div className="attach">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-paperclip">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
      </div>
      <div className="send">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-send">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
      </div>
     </div>
    </div>
    
   </div>
          </div>
          
   <div className={`calendar-container ${calendarVisible ? 'calendar-show' : ''}`}>
      <div className="calender-tab anim-y">
        <div className="week-month">
          <button className="button active">Week</button>
          <button className="button button-month">Month</button>
        </div>
        <div className="month-change" style={{display:'flex', flexDirection:'row'}}>
          <div>
          <div className="current-month">September</div>
          <div className="current-year">2024</div>
          </div>
          <img alt="" src='https://png.pngtree.com/png-vector/20231017/ourmid/pngtree-fresh-apple-fruit-red-png-image_10203073.png' style={{width:'50px', height:'50px'
          }}></img>
        </div>
        <div className="week-month">
          <button className="button button-weekends">Weekends</button>
          <button className="button button-task active">Cheat Days</button>
        </div>
      </div>
      <div className="calendar-wrapper anim-y">
        <div className="calendar">
          <div className="days">Monday</div>
          <div className="days">Tuesday</div>
          <div className="days">Wednesday</div>
          <div className="days">Thursday</div>
          <div className="days">Friday</div>
          <div className="days">Saturday</div>
          <div className="days">Sunday</div>
          <div className="day not-work">31</div>
          <div className="day project-market">
            1
            <div className="hover-title">Appointment 1</div>
            <div className="project-detail">Appointment with Dr. Neetu</div>
            <div className="project-detail">Appointment to ask about sports Nutritions</div>
            <div className="popup-check">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-check-square"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
          </div>
          <div className="day">2</div>
          <div className="day project-design">
            3
            <div className="project-detail design">Create 3 illustrations for blog post about last global fitness event</div>
          </div>
          <div className="day">4</div>
          <div className="day">5</div>
          <div className="day">6</div>
          <div className="day project-develop">
            7
            <div className="project-detail develop">Take a sustainable step towards environment.</div>
          </div>
          <div className="day">8</div>
          <div className="day">9</div>
          <div className="day">10</div>
          <div className="day">11</div>
          <div className="day">12</div>
          <div className="day">13</div>
          <div className="day">14</div>
          <div className="day project-market">
            15
            <div className="hover-title">Cycle Marathon</div>
            <div className="project-detail">Need to attend the cycle marathon.</div>
            <div className="popup-check">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-check-square"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
          </div>
          <div className="day">16</div>
          <div className="day project-market">
            17
            <div className="hover-title">Half Marathon Noida</div>
            <div className="project-detail">Create Banners for sustainability</div>
            <div className="project-detail">Increase the score to gain sustain points</div>
            <div className="popup-check">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-check-square"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
          </div>
          <div className="day">18</div>
          <div className="day">19</div>
          <div className="day">20</div>
          <div className="day">21</div>
          <div className="day">22</div>
          <div className="day project-finance">
            23
            <div className="hover-title">Period Reminder</div>
            <div className="project-detail finance">Prediction of current month period date.</div>
            <div className="popup-check">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-check-square"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
          </div>
          <div className="day">24</div>
          <div className="day">25</div>
          <div className="day">26</div>
          <div className="day">27</div>
          <div className="day">28</div>
          <div className="day">29</div>
          <div className="day">30</div>
          <div className="day not-work">1</div>
          <div className="day not-work">2</div>
          <div className="day not-work">3</div>
          <div className="day not-work">4</div>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>) : (<div style={{ 
  display: 'flex',
  flexDirection:'column', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '100vh',
  width: '100vh', 
}}>
      <h1>Login to your profile</h1>
      <Link href='/login'><button style={{fontSize:'1rem'}}>Login</button></Link>
    </div>)}
    </div>
  );
};

export default Profile;
