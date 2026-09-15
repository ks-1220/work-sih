"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SYMPTOM_LABELS, SYMPTOM_OPTIONS } from "../../utils/symptomOptions";
import { addLocalCycleEntry, getLocalCycleSummary } from "../../utils/localCycleLog";
import styles from "./shefit.module.css";

const todayIso = () => new Date().toISOString().slice(0, 10);

/**
 * Builds a rectangular month grid, marking days that fall inside any logged
 * cycle's [startDate, endDate] range (a cycle with no logged end date marks
 * only its start day). Derived during render rather than pushed into state
 * by an effect, the same reasoning the old tracker's calendar already used.
 */
function buildCalendarDays(viewDate, entries) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const days = [];
  for (let i = firstDayOfWeek; i > 0; i--) {
    days.push({ key: `prev-${i}`, day: prevMonthLastDay - i + 1, otherMonth: true });
  }

  const todayStr = todayIso();

  for (let i = 1; i <= daysInMonth; i++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const isLogged = entries.some((entry) => {
      const end = entry.endDate || entry.startDate;
      return iso >= entry.startDate && iso <= end;
    });

    days.push({ key: iso, day: i, today: iso === todayStr, logged: isLogged });
  }

  const trailing = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    days.push({ key: `next-${i}`, day: i, otherMonth: true });
  }

  return days;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CycleTracker({ onEntriesChange }) {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [entries, setEntries] = useState([]);
  const [cycleCount, setCycleCount] = useState(0);
  const [averageCycleLengthDays, setAverageCycleLengthDays] = useState(null);
  const [loadError, setLoadError] = useState("");

  const [startDate, setStartDate] = useState(todayIso());
  const [endDate, setEndDate] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const loadSummary = useCallback(() => {
    setLoadError("");
    try {
      const data = getLocalCycleSummary();
      setEntries(data.entries ?? []);
      setCycleCount(data.cycleCount ?? 0);
      setAverageCycleLengthDays(data.averageCycleLengthDays ?? null);
    } catch (err) {
      setLoadError(err.message || "Could not load your cycle history.");
    }
  }, []);

  useEffect(() => {
    // Reads from localStorage on mount. Runs client-side only (this file is
    // a client component), so there's nothing to fetch and no auth token to
    // wait for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    onEntriesChange?.(entries);
  }, [entries, onEntriesChange]);

  const toggleSymptom = (symptom) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!startDate) {
      setSubmitError("Please choose a period start date.");
      return;
    }
    if (endDate && endDate < startDate) {
      setSubmitError("End date must not be before the start date.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      addLocalCycleEntry({ startDate, endDate, symptoms, note });
      setEndDate("");
      setSymptoms([]);
      setNote("");
      loadSummary();
    } catch (err) {
      setSubmitError(err.message || "Could not save this entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const calendarDays = useMemo(() => buildCalendarDays(viewDate, entries), [viewDate, entries]);

  const recentEntries = useMemo(
    () => [...entries].sort((a, b) => (a.startDate < b.startDate ? 1 : -1)).slice(0, 5),
    [entries]
  );

  return (
    <div className={styles.trackerGrid}>
      <div className={styles.trackerColumn}>
        <h3 className={styles.trackerColumnTitle}>Log Period</h3>
        <form onSubmit={handleSubmit} className={styles.trackerForm}>
          <label className={styles.formLabel}>
            Period start date
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={todayIso()}
              required
              className={styles.formInput}
            />
          </label>

          <label className={styles.formLabel}>
            Period end date (optional)
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={todayIso()}
              className={styles.formInput}
            />
          </label>

          <fieldset className={styles.symptomFieldset}>
            <legend className={styles.formLabel}>Symptoms (optional)</legend>
            <div className={styles.symptomGrid}>
              {SYMPTOM_OPTIONS.map((symptom) => (
                <label key={symptom} className={styles.symptomOption}>
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                  />
                  {SYMPTOM_LABELS[symptom]}
                </label>
              ))}
            </div>
          </fieldset>

          <label className={styles.formLabel}>
            Private note (optional)
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={3}
              className={styles.formTextarea}
              placeholder="Anything you'd like to remember about this cycle."
            />
          </label>

          {submitError && <p className={styles.formError}>{submitError}</p>}

          <button type="submit" className={styles.primaryBtn} disabled={submitting}>
            {submitting ? "Saving..." : "Save Entry"}
          </button>
        </form>
      </div>

      <div className={styles.trackerColumn}>
        <h3 className={styles.trackerColumnTitle}>Cycle History</h3>

        <div className={styles.statsRow}>
          <div className={styles.statPill}>
            <span className={styles.statValue}>{cycleCount}</span>
            <span className={styles.statLabel}>logged cycles</span>
          </div>
          <div className={styles.statPill}>
            <span className={styles.statValue}>
              {averageCycleLengthDays ?? "—"}
            </span>
            <span className={styles.statLabel}>
              {averageCycleLengthDays ? "avg. days between cycles" : "log 2+ cycles for an average"}
            </span>
          </div>
        </div>

        <div className={styles.calendarHeader}>
          <button
            type="button"
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))}
            aria-label="Previous month"
          >
            &#8592;
          </button>
          <span>
            {viewDate.toLocaleString("default", { month: "long" })} {viewDate.getFullYear()}
          </span>
          <button
            type="button"
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))}
            aria-label="Next month"
          >
            &#8594;
          </button>
        </div>

        <div className={styles.calendarGrid}>
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className={styles.calendarWeekday}>
              {label}
            </div>
          ))}
          {calendarDays.map((day) => (
            <div
              key={day.key}
              className={`${styles.calendarDay} ${day.otherMonth ? styles.calendarDayMuted : ""} ${
                day.today ? styles.calendarDayToday : ""
              } ${day.logged ? styles.calendarDayLogged : ""}`}
            >
              {day.day}
            </div>
          ))}
        </div>

        {loadError && <p className={styles.formError}>{loadError}</p>}

        {recentEntries.length > 0 && (
          <ul className={styles.entryList}>
            {recentEntries.map((entry) => (
              <li key={entry.id} className={styles.entryItem}>
                <span className={styles.entryDates}>
                  {entry.startDate}
                  {entry.endDate ? ` – ${entry.endDate}` : ""}
                </span>
                {entry.symptoms?.length > 0 && (
                  <span className={styles.entrySymptoms}>
                    {entry.symptoms.map((s) => SYMPTOM_LABELS[s] ?? s).join(", ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {entries.length === 0 && !loadError && (
          <p className={styles.trackerNote}>
            No cycles logged yet. Use &ldquo;Log Period&rdquo; to add your first entry.
          </p>
        )}

        <p className={styles.trackerDisclaimer}>
          This tracker does not predict future periods, ovulation or fertile
          windows, and makes no medical claims. It only reflects what
          you&apos;ve logged.
        </p>
      </div>
    </div>
  );
}
