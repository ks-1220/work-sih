"use client";

// Self-contained 30-second chair stand test. Reuses the same MoveNet
// detector, keypoint format and drawing helpers as the existing yoga
// pipeline (src/views/Yoga/Yoga.js) but keeps its own webcam ref, canvas
// ref and detection loop so the yoga component is left untouched.
//
// This is a functional screening exercise, not a diagnostic tool: the
// on-screen result is a plain rep count plus a non-clinical descriptive
// note, never a fall-risk or health assessment.

import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { POINTS, keypointConnections } from "../../utils/data";
import { drawPoint, drawSegment } from "../../utils/helper";
import { angleBetweenPoints, getKeypoint } from "../../utils/pose/angles";
import { CHAIR_STAND_CONFIG as CFG } from "./chairStandConfig";
import styles from "./seniorFitness.module.css";

// Average the left/right knee angle when both sides are confidently
// detected, otherwise fall back to whichever side is visible. Returns
// null if neither side has hip+knee+ankle above the confidence threshold.
function computeKneeAngle(keypoints) {
  const minScore = CFG.MIN_KEYPOINT_SCORE;
  const leftHip = getKeypoint(keypoints, POINTS, "LEFT_HIP", minScore);
  const leftKnee = getKeypoint(keypoints, POINTS, "LEFT_KNEE", minScore);
  const leftAnkle = getKeypoint(keypoints, POINTS, "LEFT_ANKLE", minScore);
  const rightHip = getKeypoint(keypoints, POINTS, "RIGHT_HIP", minScore);
  const rightKnee = getKeypoint(keypoints, POINTS, "RIGHT_KNEE", minScore);
  const rightAnkle = getKeypoint(keypoints, POINTS, "RIGHT_ANKLE", minScore);

  const leftAngle =
    leftHip && leftKnee && leftAnkle
      ? angleBetweenPoints(leftHip, leftKnee, leftAnkle)
      : null;
  const rightAngle =
    rightHip && rightKnee && rightAnkle
      ? angleBetweenPoints(rightHip, rightKnee, rightAnkle)
      : null;

  if (leftAngle != null && rightAngle != null) {
    return (leftAngle + rightAngle) / 2;
  }
  return leftAngle ?? rightAngle ?? null;
}

export default function ChairStandTest() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // State-machine refs (mutable, read/written inside the detection loop -
  // kept as refs rather than React state so the 10x/sec loop doesn't fight
  // with React's render batching).
  const confirmedStateRef = useRef("seated");
  const candidateRef = useRef({ state: "seated", count: 0 });
  const stoodThisCycleRef = useRef(false);
  const repCountRef = useRef(0);
  const secondsLeftRef = useRef(CFG.TEST_DURATION_SECONDS);
  const runningRef = useRef(false);

  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CFG.TEST_DURATION_SECONDS);
  const [repCount, setRepCount] = useState(0);
  const [poseState, setPoseState] = useState("seated");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    tf.setBackend("webgl").catch((error) => {
      console.error("Failed to initialize WebGL backend:", error);
    });
  }, []);

  // Clears both intervals and releases the detector. Used on finish, on a
  // re-start (in case a previous run's intervals are somehow still alive)
  // and on unmount, so there is exactly one place that owns teardown.
  const stopDetectionAndTimers = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (detectorRef.current) {
      detectorRef.current.dispose();
      detectorRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      runningRef.current = false;
      stopDetectionAndTimers();
    };
  }, []);

  const detectFrame = async () => {
    const detector = detectorRef.current;
    if (
      !detector ||
      !webcamRef.current ||
      webcamRef.current.video?.readyState !== 4
    ) {
      return;
    }

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    try {
      const poses = await detector.estimatePoses(video);
      const keypoints = poses[0]?.keypoints;
      if (!keypoints) return;

      keypoints.forEach((keypoint) => {
        if (keypoint.score <= CFG.MIN_KEYPOINT_SCORE) return;
        if (keypoint.name === "left_eye" || keypoint.name === "right_eye") return;
        drawPoint(ctx, keypoint.x, keypoint.y, 8, "rgb(255,255,255)");
        const connections = keypointConnections[keypoint.name] || [];
        connections.forEach((connection) => {
          const target = keypoints[POINTS[connection.toUpperCase()]];
          if (target) {
            drawSegment(ctx, [keypoint.x, keypoint.y], [target.x, target.y], "rgb(0,200,255)");
          }
        });
      });

      const kneeAngle = computeKneeAngle(keypoints);
      if (kneeAngle == null) return;

      let candidateState = null;
      if (kneeAngle <= CFG.SEATED_ANGLE_MAX) candidateState = "seated";
      else if (kneeAngle >= CFG.STANDING_ANGLE_MIN) candidateState = "standing";

      // Ambiguous zone between the two thresholds: don't touch the
      // debounce counter, just wait for a clear reading.
      if (candidateState == null) return;

      if (candidateState === confirmedStateRef.current) {
        candidateRef.current = { state: candidateState, count: 0 };
        return;
      }

      if (candidateRef.current.state === candidateState) {
        candidateRef.current.count += 1;
      } else {
        candidateRef.current = { state: candidateState, count: 1 };
      }

      if (candidateRef.current.count >= CFG.CONFIRM_FRAMES) {
        confirmedStateRef.current = candidateState;
        setPoseState(candidateState);

        if (candidateState === "standing") {
          stoodThisCycleRef.current = true;
        } else if (candidateState === "seated" && stoodThisCycleRef.current) {
          stoodThisCycleRef.current = false;
          repCountRef.current += 1;
          setRepCount(repCountRef.current);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startTest = async () => {
    // Guards against duplicate/leaked intervals if Start is triggered more
    // than once (e.g. a fast double click) before state has re-rendered:
    // this ref is checked and set synchronously, before the first await.
    if (runningRef.current) return;
    runningRef.current = true;
    stopDetectionAndTimers();

    setIsFinished(false);
    setRepCount(0);
    setSecondsLeft(CFG.TEST_DURATION_SECONDS);
    repCountRef.current = 0;
    confirmedStateRef.current = "seated";
    candidateRef.current = { state: "seated", count: 0 };
    stoodThisCycleRef.current = false;
    secondsLeftRef.current = CFG.TEST_DURATION_SECONDS;
    setPoseState("seated");
    setStatusMessage("");

    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER }
    );

    // The component may have unmounted, or the test may have been stopped
    // manually, while the detector was loading - don't start timers for a
    // run that's no longer wanted.
    if (!runningRef.current) {
      detector.dispose();
      return;
    }
    detectorRef.current = detector;

    setIsRunning(true);
    detectionIntervalRef.current = setInterval(detectFrame, CFG.DETECTION_INTERVAL_MS);

    // Plain setInterval callback (not a React state updater), so calling
    // finishTest() here directly - rather than from inside setSecondsLeft's
    // updater - is a normal, safe side effect.
    timerIntervalRef.current = setInterval(() => {
      secondsLeftRef.current -= 1;
      setSecondsLeft(Math.max(secondsLeftRef.current, 0));
      if (secondsLeftRef.current <= 0) {
        finishTest();
      }
    }, 1000);
  };

  const finishTest = () => {
    if (!runningRef.current) return;
    runningRef.current = false;
    stopDetectionAndTimers();

    setIsRunning(false);
    setIsFinished(true);

    const band = CFG.FEEDBACK_BANDS.find((b) => repCountRef.current <= b.max);
    setStatusMessage(band ? band.label : "");
  };

  const stopTest = () => {
    finishTest();
  };

  return (
    <div className={styles.container}>
      <h2>30-Second Chair Stand Test</h2>
      <p className={styles.disclaimer}>
        This is a simple functional screening exercise, not a medical
        diagnosis. Stop immediately if you feel unsteady or unwell.
      </p>

      {!isRunning && !isFinished && (
        <div className={styles.instructions}>
          <ol>
            <li>Place a sturdy chair in view of the camera, without arms if possible.</li>
            <li>Sit in the middle of the chair with feet flat on the floor.</li>
            <li>Make sure your hips, knees and ankles are all visible on camera.</li>
            <li>When ready, click Start and stand up and sit down as many times as you safely can for 30 seconds.</li>
          </ol>
          <button className={styles.primaryBtn} onClick={startTest}>
            Start Test
          </button>
        </div>
      )}

      {(isRunning || isFinished) && (
        <div className={styles.cameraArea}>
          <div className={styles.videoWrap}>
            <Webcam ref={webcamRef} width={480} height={360} className={styles.webcam} />
            <canvas ref={canvasRef} width={480} height={360} className={styles.canvasOverlay} />
          </div>

          {isRunning && (
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Time left</span>
                <span className={styles.statValue}>{secondsLeft}s</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Reps</span>
                <span className={styles.statValue}>{repCount}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>State</span>
                <span className={styles.statValue}>{poseState === "standing" ? "Standing" : "Seated"}</span>
              </div>
            </div>
          )}

          {isRunning && (
            <button className={styles.secondaryBtn} onClick={stopTest}>
              Stop Test
            </button>
          )}

          {isFinished && (
            <div className={styles.resultCard}>
              <h3>Test complete</h3>
              <p className={styles.resultCount}>{repCount} reps in 30 seconds</p>
              <p>{statusMessage}</p>
              <button className={styles.primaryBtn} onClick={startTest}>
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
