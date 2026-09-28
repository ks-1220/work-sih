/**
 * FitVisionAI Workout CV Engine
 * Ported & adapted from Niyatiiii06/FitVisionAI
 * Implements joint angle calculations, state-machine rep counting,
 * real-time form scoring, and posture safety feedback for Gym workouts.
 */

import { calculateAngle } from "./mediapipeYoga";
import { POINTS } from "./data";

// The stage a set starts from. Curls start hanging (DOWN) so a straight
// arm at the start never counts a rep; Plank holds instead of repping.
export const START_STAGE = {
  Squat: "UP",
  "Push-up": "UP",
  "Bicep Curl": "DOWN",
  Plank: "HOLD",
};

// Rep target shown next to the counter for rep-based exercises.
export const REP_TARGET = 15;

export const MIN_JOINT_SCORE = 0.35;

// Joints each exercise must see, per side. A side counts as visible only
// when every joint in its chain scores above MIN_JOINT_SCORE.
const EXERCISE_CHAINS = {
  Squat: ["SHOULDER", "HIP", "KNEE", "ANKLE"],
  "Push-up": ["SHOULDER", "ELBOW", "WRIST", "HIP", "ANKLE"],
  "Bicep Curl": ["SHOULDER", "ELBOW", "WRIST", "HIP"],
  Plank: ["SHOULDER", "HIP", "ANKLE"],
};

export const NOT_VISIBLE_TIP = "Step back so your whole body is in frame";

function jointVisible(keypoints, side, name) {
  const p = keypoints[POINTS[`${side}_${name}`]];
  return !!p && p.score > MIN_JOINT_SCORE;
}

function sideVisible(keypoints, exercise, side) {
  const chain = EXERCISE_CHAINS[exercise] || EXERCISE_CHAINS.Squat;
  return chain.every((name) => jointVisible(keypoints, side, name));
}

// Angle from one side's joints, or null when that side lacks any joint
// the angle needs. Missing keypoints never default to (0,0).
function angleIf(keypoints, side, joints, a, b, c) {
  if (!joints.every((name) => jointVisible(keypoints, side, name))) return null;
  const P = POINTS;
  return Math.round(
    calculateAngle(
      keypoints[P[`${side}_${a}`]],
      keypoints[P[`${side}_${b}`]],
      keypoints[P[`${side}_${c}`]]
    )
  );
}

/**
 * Extracts gym-specific angles from keypoints.
 * Each angle is averaged when both sides are visible, taken from the one
 * visible side otherwise, and null when neither side is visible.
 */
export function extractGymAngles(keypoints) {
  const knee = (s) => angleIf(keypoints, s, ["HIP", "KNEE", "ANKLE"], "HIP", "KNEE", "ANKLE");
  const hip = (s) => angleIf(keypoints, s, ["SHOULDER", "HIP", "KNEE"], "SHOULDER", "HIP", "KNEE");
  const elbow = (s) => angleIf(keypoints, s, ["SHOULDER", "ELBOW", "WRIST"], "SHOULDER", "ELBOW", "WRIST");
  const shoulder = (s) => angleIf(keypoints, s, ["ELBOW", "SHOULDER", "HIP"], "ELBOW", "SHOULDER", "HIP");
  const body = (s) => angleIf(keypoints, s, ["SHOULDER", "HIP", "ANKLE"], "SHOULDER", "HIP", "ANKLE");

  const leftKnee = knee("LEFT");
  const rightKnee = knee("RIGHT");
  const leftHip = hip("LEFT");
  const rightHip = hip("RIGHT");
  const leftElbow = elbow("LEFT");
  const rightElbow = elbow("RIGHT");
  const leftShoulder = shoulder("LEFT");
  const rightShoulder = shoulder("RIGHT");
  const leftBody = body("LEFT");
  const rightBody = body("RIGHT");

  const avg = (l, r) =>
    l != null && r != null ? Math.round((l + r) / 2) : (l ?? r ?? null);

  return {
    leftKnee,
    rightKnee,
    avgKnee: avg(leftKnee, rightKnee),
    leftHip,
    rightHip,
    avgHip: avg(leftHip, rightHip),
    leftElbow,
    rightElbow,
    avgElbow: avg(leftElbow, rightElbow),
    leftShoulder,
    rightShoulder,
    avgShoulder: avg(leftShoulder, rightShoulder),
    leftBody,
    rightBody,
    avgBody: avg(leftBody, rightBody),
  };
}

function emptyAngles() {
  return {
    leftKnee: null,
    rightKnee: null,
    avgKnee: null,
    leftHip: null,
    rightHip: null,
    avgHip: null,
    leftElbow: null,
    rightElbow: null,
    avgElbow: null,
    leftShoulder: null,
    rightShoulder: null,
    avgShoulder: null,
    leftBody: null,
    rightBody: null,
    avgBody: null,
  };
}

/**
 * Exercise State Machine & Posture Checker Class (from FitVisionAI)
 */
export class FitVisionWorkoutTracker {
  constructor(exercise = "Squat") {
    this.exercise = exercise;
    this.repCount = 0;
    this.stage = START_STAGE[exercise] || "UP";
    this.caloriesBurned = 0;
    this.holdSeconds = 0;
    this.lastFrameAt = null;
  }

  setExercise(exercise) {
    this.exercise = exercise;
    this.repCount = 0;
    this.stage = START_STAGE[exercise] || "UP";
    this.holdSeconds = 0;
    this.lastFrameAt = null;
  }

  reset() {
    this.repCount = 0;
    this.stage = START_STAGE[this.exercise] || "UP";
    this.caloriesBurned = 0;
    this.holdSeconds = 0;
    this.lastFrameAt = null;
  }

  processFrame(keypoints) {
    // Neither side shows the joints this exercise needs: freeze the state
    // machine (no stage or rep change) and say so.
    const leftOk = sideVisible(keypoints, this.exercise, "LEFT");
    const rightOk = sideVisible(keypoints, this.exercise, "RIGHT");
    if (!leftOk && !rightOk) {
      return {
        exercise: this.exercise,
        reps: this.repCount,
        stage: this.stage,
        holdSeconds: Math.round(this.holdSeconds * 10) / 10,
        formScore: null,
        status: "Not visible",
        tip: NOT_VISIBLE_TIP,
        angles: emptyAngles(),
        calories: Math.round(this.caloriesBurned * 10) / 10,
        stateChanged: false,
        visible: false,
      };
    }

    const angles = extractGymAngles(keypoints);
    let formScore = 100;
    let feedback = [];
    let stateChanged = false;

    if (this.exercise === "Squat") {
      // FitVisionAI Squat Logic
      // State transition
      if (angles.avgKnee < 110 && this.stage === "UP") {
        this.stage = "DOWN";
        stateChanged = true;
      } else if (angles.avgKnee > 155 && this.stage === "DOWN") {
        this.stage = "UP";
        this.repCount += 1;
        this.caloriesBurned += 0.32; // ~0.32 kcal per squat
        stateChanged = true;
      }

      // Form checking
      if (this.stage === "DOWN") {
        if (angles.avgKnee > 115) {
          formScore -= 25;
          feedback.push("Go lower — aim for parallel thighs");
        }
        if (angles.avgHip > 130) {
          formScore -= 20;
          feedback.push("Push hips back to protect knees");
        }
      } else {
        if (angles.avgBody < 155) {
          formScore -= 15;
          feedback.push("Keep back upright and chest high");
        }
      }

      if (feedback.length === 0) {
        feedback.push(
          this.stage === "DOWN" ? "Great depth! Power up through heels" : "Good stance. Begin your descent"
        );
      }
    } else if (this.exercise === "Push-up") {
      // FitVisionAI Push-up Logic
      if (angles.avgElbow < 100 && this.stage === "UP") {
        this.stage = "DOWN";
        stateChanged = true;
      } else if (angles.avgElbow > 150 && this.stage === "DOWN") {
        this.stage = "UP";
        this.repCount += 1;
        this.caloriesBurned += 0.28;
        stateChanged = true;
      }

      // Form checking
      if (angles.avgBody < 155) {
        formScore -= 30;
        feedback.push("Keep core tight — avoid sagging hips");
      }
      if (this.stage === "DOWN" && angles.avgElbow > 110) {
        formScore -= 20;
        feedback.push("Bend elbows to 90° for full chest range");
      }

      if (feedback.length === 0) {
        feedback.push(
          this.stage === "DOWN" ? "Chest near floor! Push up strongly" : "Plank straight. Lower with control"
        );
      }
    } else if (this.exercise === "Bicep Curl") {
      // Bicep Curl Logic
      if (angles.avgElbow < 55 && this.stage === "DOWN") {
        this.stage = "UP";
        stateChanged = true;
      } else if (angles.avgElbow > 150 && this.stage === "UP") {
        this.stage = "DOWN";
        this.repCount += 1;
        this.caloriesBurned += 0.22;
        stateChanged = true;
      }

      if (angles.avgShoulder > 35) {
        formScore -= 25;
        feedback.push("Keep elbows pinned to your sides");
      }

      if (feedback.length === 0) {
        feedback.push(
          this.stage === "UP" ? "Squeeze biceps at top! Lower slowly" : "Full extension. Curl upward"
        );
      }
    } else {
      // Plank / Static Core: reps are never counted. Hold time accrues
      // only while form stays good.
      if (angles.avgBody >= 160) {
        formScore = 95;
        feedback.push("Excellent plank alignment! Keep breathing");
      } else {
        formScore = 65;
        feedback.push("Flatten spine — align shoulders, hips and ankles");
      }
      const now = Date.now();
      if (this.lastFrameAt != null && formScore >= 80) {
        this.holdSeconds += (now - this.lastFrameAt) / 1000;
      }
      this.lastFrameAt = now;
    }

    formScore = Math.max(20, Math.min(100, formScore));

    return {
      exercise: this.exercise,
      reps: this.repCount,
      stage: this.stage,
      holdSeconds: Math.round(this.holdSeconds * 10) / 10,
      formScore,
      status: formScore >= 80 ? "Good" : formScore >= 60 ? "Fair" : "Needs Correction",
      tip: feedback[0] || "Maintain controlled tempo",
      angles,
      calories: Math.round(this.caloriesBurned * 10) / 10,
      stateChanged,
      visible: true,
    };
  }
}
