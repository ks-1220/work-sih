"use client";

import React, { useState } from "react";
import { MYTH_FACT_QUESTIONS } from "./mythFactData";
import styles from "./shefit.module.css";

// A lightweight, stateless-across-visits quiz: no score is kept, nothing is
// persisted or sent anywhere. The interaction (answer, reveal, explanation,
// next) is the whole point - no points/badges/leaderboards as required.
export default function MythOrFact() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const total = MYTH_FACT_QUESTIONS.length;
  const question = MYTH_FACT_QUESTIONS[index];
  const revealed = selected !== null;
  const isCorrect = revealed && selected === question.answer;

  const handleAnswer = (choice) => {
    if (revealed) return;
    setSelected(choice);
  };

  const handleNext = () => {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((prev) => prev + 1);
    setSelected(null);
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setDone(false);
  };

  if (done) {
    return (
      <div className={styles.quizCard}>
        <p className={styles.quizEmoji} aria-hidden="true">💡</p>
        <h3 className={styles.quizDoneTitle}>You&apos;ve been through all {total} questions</h3>
        <p className={styles.quizDoneText}>
          Curious for another round, or want to look at a statement again?
        </p>
        <button className={styles.primaryBtn} onClick={handleRestart}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.quizCard}>
      <p className={styles.quizEmoji} aria-hidden="true">💡</p>
      <p className={styles.quizKicker}>MYTH OR FACT?</p>
      <h3 className={styles.quizStatement}>&ldquo;{question.statement}&rdquo;</h3>

      <div className={styles.quizChoices}>
        <button
          className={`${styles.quizChoiceBtn} ${
            revealed && question.answer === "myth" ? styles.quizChoiceCorrect : ""
          } ${revealed && selected === "myth" && !isCorrect ? styles.quizChoiceWrong : ""}`}
          onClick={() => handleAnswer("myth")}
          disabled={revealed}
        >
          MYTH
        </button>
        <button
          className={`${styles.quizChoiceBtn} ${
            revealed && question.answer === "fact" ? styles.quizChoiceCorrect : ""
          } ${revealed && selected === "fact" && !isCorrect ? styles.quizChoiceWrong : ""}`}
          onClick={() => handleAnswer("fact")}
          disabled={revealed}
        >
          FACT
        </button>
      </div>

      {revealed && (
        <div className={styles.quizResult}>
          <p className={isCorrect ? styles.quizCorrectLabel : styles.quizWrongLabel}>
            {isCorrect ? "That's right." : "Not quite."}
          </p>
          <p className={styles.quizExplanation}>{question.explanation}</p>
          <button className={styles.primaryBtn} onClick={handleNext}>
            {index + 1 >= total ? "Finish" : "Next"}
          </button>
        </div>
      )}

      <p className={styles.quizProgress}>
        Question {index + 1} of {total}
      </p>
    </div>
  );
}
