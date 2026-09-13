"use client";

import React, { useState, useEffect } from "react";
import "./streak.css";

const StreakCalendar = ({ streakData, year, month }) => {
  const [calendarDays, setCalendarDays] = useState([]);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    // Generate the calendar grid
    const daysInMonth = new Date(year, month, 0).getDate(); // Number of days in the selected month
    const startDay = new Date(year, month - 1, 1).getDay(); // First weekday of the month (0 = Sunday)

    const calendar = [];

    // Add placeholders for days from the previous month
    for (let i = 0; i < startDay; i++) {
      calendar.push(null);
    }

    // Add actual days for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
        i < 10 ? "0" + i : i
      }`; // Format as YYYY-MM-DD
      calendar.push({ day: i, date: formattedDate });
    }

    setCalendarDays(calendar);
  }, [year, month]);

  return (
    <div>
      {/* <div className="weekday-header">
        {weekdays.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div> */}
      <div className="calendar-streak">
        {calendarDays.map((item, index) => (
          <div
            key={index}
            className={`day-box ${
              item && streakData.includes(item.date) ? "streak-day" : ""
            }`}
          >
            {item ? item.day : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreakCalendar;
