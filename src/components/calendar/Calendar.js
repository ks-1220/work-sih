"use client";

import React from 'react';
import './Calendar.css';

const Calendar = ({ onActivitySelect }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const handleActivitySelect = (day, activity, isChecked) => {
    onActivitySelect(day, activity, isChecked);
  };

  return (
    <div>
      <div className="calendar2-container">{monthName} {currentYear}</div>
      <div className="calendar2-scrollable">
      <table className="calendar2-table">
        <tbody>
          {[...Array(Math.ceil(daysInMonth / 10))].map((_, i) => {
            const startIndex = i * 10 + 1;
            const endIndex = Math.min(startIndex + 9, daysInMonth);
            return (
              <tr key={i}>
                {[...Array(endIndex - startIndex + 1)].map((_, index) => {
                  const day = startIndex + index;
                  return (
                    <td key={day} className="calendar2-cell">
                      <div className="calendar2-date">
                        <div className="calendar2-marker"></div>
                        <div className="calendar2-text">{day}</div>
                      </div>
                      <div>
                        <label className="calendar2-checkbox ">
                          Yoga
                          <input
                            type="checkbox"
                            value="Y"
                            onChange={(e) => handleActivitySelect(day, 'Y', e.target.checked)}
                            className='checkbox-yoga'
                          />
                          <span style={{ color: '#3AA8AA' }}></span>
                        </label>

                        <label className="calendar2-checkbox ">
                          Meditation
                          <input
                            type="checkbox"
                            value="M"
                            onChange={(e) => handleActivitySelect(day, 'M', e.target.checked)}
                            className='checkbox-meditation'
                          />
                        </label>
                        <label className="calendar2-checkbox ">
                          Healthy Diet
                          <input
                            type="checkbox"
                            value="E"
                            onChange={(e) => handleActivitySelect(day, 'E', e.target.checked)}
                            className='checkbox-diet'
                          />
                        </label>
                        <label className="calendar2-checkbox ">
                          Creative Hub
                          <input
                            type="checkbox"
                            value="C"
                            onChange={(e) => handleActivitySelect(day, 'C', e.target.checked)}
                            className='checkbox-hub'
                          />
                        </label>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Calendar;
