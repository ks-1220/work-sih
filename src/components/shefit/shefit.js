"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import one from "../../assets/one.jpg";
import two from "../../assets/two.jpg";
import three from "../../assets/three.jpg";
import four from "../../assets/four.jpg";
import five from "../../assets/five.jpg";
import six from "../../assets/six.jpg";
import Navbar from "../Navbar/navbar";
import "./shefit.css";

const MenstrualCycleTracker = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [lastPeriodDate, setLastPeriodDate] = useState(null);

  /**
   * The month grid is derived from the selected month and the logged date, so
   * it is computed during render rather than pushed into state by an effect.
   * The previous version called setCalendarDays inside useEffect, which meant
   * every month change painted an empty grid first and filled it in on the
   * following render.
   */
  const calendarDays = useMemo(() => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = firstDayOfWeek; i > 0; i--) {
      days.push({ day: prevMonthLastDay - i + 1, otherMonth: true });
    }

    const today = new Date().toDateString();

    for (let i = 1; i <= daysInMonth; i++) {
      const thisDay = new Date(year, month, i);

      // Only the date the user actually entered is marked. The calendar used
      // to mark a single day at lastPeriod + 28 and call it a prediction; a
      // fixed constant is not a forecast, and one recorded date is not enough
      // information to estimate anything.
      const isLoggedPeriod =
        !!lastPeriodDate && thisDay.toDateString() === lastPeriodDate.toDateString();

      days.push({
        day: i,
        today: thisDay.toDateString() === today,
        period: isLoggedPeriod,
      });
    }

    // Pad the final row so the grid stays rectangular.
    const trailing = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= trailing; i++) {
      days.push({ day: i, otherMonth: true });
    }

    return days;
  }, [currentDate, lastPeriodDate]);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleLastPeriodChange = (event) => {
    setLastPeriodDate(new Date(event.target.value));
  };

  return (
    <div
      style={{
        backgroundColor: "rgb(73, 57, 113)",
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex" }}>
        <Navbar />
        <div className="shepage" style={{ display: "flex" }}>
          <div className="tracker-section">
            <div className="tracker-container">
              <h1>{t("menstrualTracker.title")}</h1>
              <div className="input-section">
                <label htmlFor="lastPeriod">{t("menstrualTracker.lastPeriodLabel")}</label>
                <input
                  type="date"
                  id="lastPeriod"
                  onChange={handleLastPeriodChange}
                />
              </div>

              <p className="tracker-note">
                {lastPeriodDate
                  ? `Logged: ${lastPeriodDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}. One date is not enough to estimate a future period, so no prediction is shown.`
                  : "Enter your last period date to mark it on the calendar."}
              </p>
              <p className="tracker-note tracker-note-muted">
                This tracker does not predict periods, fertile windows or safe days,
                and entries are not saved when you leave the page.
              </p>
              <div className="calendar-header">
                <button onClick={handlePrevMonth}>
                  &#8592;
                </button>
                <h2>
                  {currentDate.toLocaleString("default", { month: "long" })}{" "}
                  {currentDate.getFullYear()}
                </h2>
                <button onClick={handleNextMonth}>
                &#8594;
                </button>
              </div>
              <div className="calendarshe">
                {t("menstrualTracker.days", { returnObjects: true }).map((day, index) => (
                  <div key={index} className="day-header">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`day ${day.otherMonth ? "other-month" : ""} ${
                      day.today ? "today" : ""
                    } ${day.period ? "period" : ""}`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="myth-fact-section">
            <div className="myth-fact-container">
              <h2 className="section-title">{t("menstrualTracker.mythVsFact")}</h2>
              <div className="myth-fact-grid">
                {[one, two, three, four, five, six].map((image, index) => (
                  <div key={index} className="myth-card">
                    <img src={image.src} alt={`Myth ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenstrualCycleTracker;
