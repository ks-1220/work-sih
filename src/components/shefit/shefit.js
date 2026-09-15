"use client";

import React, { useMemo, useState } from "react";
import CycleTracker from "./CycleTracker";
import MythOrFact from "./MythOrFact";
import { getWellnessInsights } from "../../utils/wellnessInsights";
import styles from "./shefit.module.css";

// Educational content only - phrased to inform rather than diagnose, per
// the "PCOS can involve..." / "some people experience..." guidance. Kept as
// a plain data array rather than a CMS or extra file, since this is static
// copy with no reuse elsewhere.
const EDUCATION_TOPICS = [
  {
    title: "PCOS & Hormonal Health",
    icon: "fas fa-dna",
    description: "What PCOS and hormonal changes can look like, in plain language.",
    points: [
      "PCOS (Polycystic Ovary Syndrome) can involve irregular periods, hormonal changes, and symptoms like acne or excess hair growth - but it looks different from person to person.",
      "Hormonal fluctuations are a normal part of the menstrual cycle. Larger or more disruptive changes are worth discussing with a healthcare professional rather than self-diagnosing.",
      "A diagnosis of PCOS or any hormonal condition can only be made by a healthcare professional, usually through a combination of history, examination and tests.",
    ],
  },
  {
    title: "Menstrual Health",
    icon: "fas fa-calendar-days",
    description: "How to make sense of your own cycle, without comparing it to anyone else's.",
    points: [
      "Cycle length and flow can vary widely between people, and even cycle to cycle for the same person - there isn't one universal 'normal'.",
      "Some cramping, mood changes or fatigue around your period are common, but severe pain that disrupts daily life is worth raising with a doctor.",
      "Tracking your own cycle over time - not comparing it to someone else's - is the most useful way to notice what's typical for you.",
    ],
  },
  {
    title: "General Women's Health",
    icon: "fas fa-heart-pulse",
    description: "Small habits that make it easier to notice changes in your body over time.",
    points: [
      "Regular check-ups, even when nothing feels wrong, help build a health history that makes it easier to notice changes over time.",
      "Symptoms can have many possible explanations - persistent or unusual symptoms are best discussed with a healthcare professional rather than searched and self-assessed.",
      "You know your own body best. If something feels different for you, that's worth mentioning at your next appointment even if it seems minor.",
    ],
  },
  {
    title: "Nutrition, Exercise & Sleep",
    icon: "fas fa-spa",
    description: "How everyday habits like food, movement and rest connect to how you feel.",
    points: [
      "Balanced meals, regular movement and consistent sleep can all support hormonal balance and general wellbeing, though they aren't a treatment for any specific condition.",
      "Gentle activity is generally fine during your period if you feel up to it - comfort should guide the decision, not a strict rule either way.",
      "Poor sleep and high stress are both commonly linked to cycle changes for many people - if either has shifted a lot recently, it may be worth reflecting on.",
    ],
  },
];

function Shefit() {
  const [entries, setEntries] = useState([]);
  const insights = useMemo(() => getWellnessInsights(entries), [entries]);
  const [openTopic, setOpenTopic] = useState(null);

  const toggleTopic = (title) => {
    setOpenTopic((prev) => (prev === title ? null : title));
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.heroKicker}>SHEFIT</p>
        <h1 className={styles.heroTitle}>Women&apos;s Health &amp; Wellness</h1>
        <p className={styles.heroLead}>
          Understand your health, track your wellbeing, and learn more about
          women&apos;s health.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="menstrual-health">
        <h2 id="menstrual-health" className={styles.sectionTitle}>
          Menstrual Health
        </h2>
        <div className={styles.trackerCard}>
          <CycleTracker onEntriesChange={setEntries} />
          <p className={styles.privacyNote}>
            🔒 Your entries are stored only in this browser and are not sent anywhere.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="wellness-insights">
        <h2 id="wellness-insights" className={styles.sectionTitle}>
          Wellness Insights
        </h2>
        <div className={styles.insightsCard}>
          {insights.map((insight, index) => (
            <p key={index} className={styles.insightText}>
              {insight}
            </p>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="myth-or-fact">
        <h2 id="myth-or-fact" className={styles.sectionTitle}>
          Myth or Fact
        </h2>
        <MythOrFact />
      </section>

      <section className={styles.section} aria-labelledby="womens-health-education">
        <h2 id="womens-health-education" className={styles.sectionTitle}>
          Know Your Body
        </h2>
        <p className={styles.sectionSubtitle}>
          A few short, friendly reads - tap a card to explore it.
        </p>
        <div className={styles.educationGrid}>
          {EDUCATION_TOPICS.map((topic) => {
            const isOpen = openTopic === topic.title;
            const panelId = `education-panel-${topic.title.replace(/\s+/g, "-")}`;

            return (
              <div
                key={topic.title}
                className={`${styles.educationCard} ${isOpen ? styles.educationCardOpen : ""}`}
              >
                <button
                  type="button"
                  className={styles.educationCardHeader}
                  onClick={() => toggleTopic(topic.title)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className={styles.educationIcon} aria-hidden="true">
                    <i className={topic.icon}></i>
                  </span>
                  <span className={styles.educationHeaderText}>
                    <span className={styles.educationTitle}>{topic.title}</span>
                    <span className={styles.educationDescription}>{topic.description}</span>
                  </span>
                  <span className={styles.educationCta}>
                    {isOpen ? "Close" : "Explore"}
                    <i className={`fas fa-chevron-down ${styles.educationChevron}`} aria-hidden="true"></i>
                  </span>
                </button>

                <div
                  id={panelId}
                  className={styles.educationPanelWrap}
                  role="region"
                  aria-label={topic.title}
                >
                  <div className={styles.educationPanelInner}>
                    <ul className={styles.educationList}>
                      {topic.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className={styles.educationDisclaimer}>
          This information is educational, not a diagnosis. If symptoms are
          persistent or concerning, consider speaking with a healthcare
          professional.
        </p>
      </section>
    </div>
  );
}

export default Shefit;
