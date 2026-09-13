"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select"; // Multi-select dropdown package
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import "./yoga.css";

function Yoga() {
  const { t } = useTranslation(); // Initialize the useTranslation hook

  const [healthProblems, setHealthProblems] = useState([]); // Health problems list from Flask
  const [selectedProblems, setSelectedProblems] = useState([]); // Selected health problems
  const [suggestions, setSuggestions] = useState([]); // Yoga suggestions from Flask

  useEffect(() => {
    fetch("https://yogaxyz.onrender.com/health-problems")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) =>
        setHealthProblems(
          Array.isArray(data)
            ? data.map((problem) => ({ label: problem, value: problem }))
            : []
        )
      )
      .catch((error) =>
        console.error("Fetching health problems failed:", error)
      );
  }, []);

  // Handle Fetch Suggestions
  const fetchSuggestions = () => {
    const selectedValues = selectedProblems.map((problem) => problem.value); // Get selected problem values
    fetch("https://yogaxyz.onrender.com/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ healthProblems: selectedValues }),
    })
      .then((response) => response.json())
      .then((data) => setSuggestions(data));
  };

  return (
    <div className="App">
      <h1 style={{ color: "white" }}>{t('yogaPoseSuggestions')}</h1>
      <div className="dropdown-container">
        <h2 style={{ color: "white" }}>{t('selectHealthProblems')}</h2>
        <Select
          isMulti
          options={healthProblems}
          value={selectedProblems}
          onChange={setSelectedProblems}
          placeholder={t('selectHealthProblems')}
        />
      </div>
      <button className="fetch-button" onClick={fetchSuggestions}>
        {t('getSuggestions')}
      </button>
      <div className="suggestions">
        <h2 style={{ color: "white" }}>{t('yogaSuggestions')}</h2>
        {suggestions.length > 0 ? (
          <div className="yoga-list">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="yoga-pose">
                <img
                  src={suggestion["Image URL"]}
                  alt={suggestion["Yoga Pose Name"]}
                />
                <p>{suggestion["Yoga Pose Name"]}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "white" }}>{t('noSuggestions')}</p>
        )}
      </div>
    </div>
  );
}

export default Yoga;
