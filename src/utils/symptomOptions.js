// Shared, fixed symptom vocabulary for the menstrual cycle tracker. Used by
// both the server-side validator (src/server/domains/cycleLogs.js) and the
// client tracker UI, so the two never drift apart. A closed list rather than
// free text keeps this a wellness log, not a place to type a diagnosis.
export const SYMPTOM_OPTIONS = [
  "cramps",
  "headache",
  "fatigue",
  "mood_changes",
  "bloating",
  "acne",
  "back_pain",
  "nausea",
];

export const SYMPTOM_LABELS = {
  cramps: "Cramps",
  headache: "Headache",
  fatigue: "Fatigue",
  mood_changes: "Mood changes",
  bloating: "Bloating",
  acne: "Acne",
  back_pain: "Back pain",
  nausea: "Nausea",
};
