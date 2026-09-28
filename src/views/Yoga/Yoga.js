"use client";

import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar/navbar";
import { useTranslation } from "react-i18next";

// Set WebGL backend
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
const count = "/media/count.wav";

import "./Yoga.css";

import DropDown from "../../components/DropDown/DropDown";
import { poseImages } from "../../utils/pose_images";
import { POINTS, keypointConnections, poseInstructions } from "../../utils/data";
import { drawPoint, drawSegment } from "../../utils/helper";
import { evaluateMediaPipePose } from "../../utils/mediapipeYoga";

const poseList = [
  "Tree",
  "Chair",
  "Cobra",
  "Warrior",
  "Dog",
  "Shoulderstand",
  "Triangle",
];

const DETECTION_INTERVAL_MS = 100;
const TOTAL_JOINTS = 17;
const MIN_KEYPOINT_SCORE = 0.35;

function Yogacv() {
  const { t } = useTranslation();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState("Tree");
  const [accuracy, setAccuracy] = useState(null);
  const [visibility, setVisibility] = useState(null);
  const [liveFeedback, setLiveFeedback] = useState("");
  const [isModelReady, setIsModelReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  // All mutable detection-loop state lives in refs, so the 100 ms interval
  // always reads the latest pose and hold state without being re-created.
  const poseRef = useRef(currentPose);
  const intervalRef = useRef(null);
  const detectorRef = useRef(null);
  const audioRef = useRef(null);
  const skeletonColorRef = useRef("rgb(255,255,255)");
  const holdActiveRef = useRef(false);
  const holdStartRef = useRef(0);
  // Guards against overlapping async frames: while one detectPose() is still
  // awaiting estimatePoses, interval ticks are skipped instead of piling up.
  const frameInFlightRef = useRef(false);
  const warmupPromiseRef = useRef(null);
  const mountedRef = useRef(true);

  // Pose changes come through this handler (not an effect) so the hold
  // timer, best time, score and feedback reset in the same user gesture.
  const handleSelectPose = (pose) => {
    poseRef.current = pose;
    setCurrentPose(pose);
    holdActiveRef.current = false;
    holdStartRef.current = 0;
    skeletonColorRef.current = "rgb(255,255,255)";
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (e) {}
    }
    setPoseTime(0);
    setBestPerform(0);
    setAccuracy(null);
    setVisibility(null);
    setLiveFeedback("");
  };

  useEffect(() => {
    mountedRef.current = true;

    const detectPose = async () => {
      const detector = detectorRef.current;
      const countAudio = audioRef.current;
      if (
        !detector ||
        typeof webcamRef.current === "undefined" ||
        webcamRef.current === null ||
        !webcamRef.current.video ||
        webcamRef.current.video.readyState !== 4 ||
        canvasRef.current === null
      ) {
        return;
      }
      if (frameInFlightRef.current) return;
      frameInFlightRef.current = true;

      try {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const pose = await detector.estimatePoses(video);
        if (!mountedRef.current) return;
        if (!pose || pose.length === 0) return;
        const keypoints = pose[0].keypoints;

        let notDetected = 0;
        // Score travels with each joint so the scoring rules can require
        // confidently-seen joints instead of defaulting missing ones to (0,0).
        let keypointMap = {};
        keypoints.forEach((keypoint, idx) => {
          if (keypoint.score > MIN_KEYPOINT_SCORE) {
            keypointMap[idx] = { x: keypoint.x, y: keypoint.y, score: keypoint.score };
            if (
              !(keypoint.name === "left_eye" || keypoint.name === "right_eye")
            ) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, "rgb(255,255,255)");
              let connections = keypointConnections[keypoint.name];
              try {
                if (connections) {
                  connections.forEach((connection) => {
                    let conName = connection.toUpperCase();
                    if (POINTS[conName] !== undefined && keypoints[POINTS[conName]]) {
                      drawSegment(
                        ctx,
                        [keypoint.x, keypoint.y],
                        [
                          keypoints[POINTS[conName]].x,
                          keypoints[POINTS[conName]].y,
                        ],
                        skeletonColorRef.current
                      );
                    }
                  });
                }
              } catch (err) {}
            }
          } else {
            notDetected += 1;
          }
        });

        setVisibility(Math.round(((TOTAL_JOINTS - notDetected) / TOTAL_JOINTS) * 100));

        if (notDetected > 6) {
          skeletonColorRef.current = "rgb(255,255,255)";
          holdActiveRef.current = false;
          if (countAudio) {
            try {
              countAudio.pause();
              countAudio.currentTime = 0;
            } catch (e) {}
          }
          setAccuracy(null);
          setLiveFeedback("Step into the camera frame so your full body is visible");
          return;
        }

        // Reads poseRef.current, so selecting another pose takes effect on
        // the very next tick instead of staying stuck on the first pose.
        const evalResult = evaluateMediaPipePose(keypointMap, poseRef.current);
        setAccuracy(evalResult.accuracy);
        setLiveFeedback(evalResult.tip);

        if (evalResult.isAligned) {
          skeletonColorRef.current = "rgb(0,230,118)"; // Bright neon green for correct posture
          const now = Date.now();
          if (!holdActiveRef.current) {
            if (countAudio) countAudio.play().catch(() => {});
            holdStartRef.current = now;
            holdActiveRef.current = true;
          }
          const held = Math.round((now - holdStartRef.current) / 1000);
          setPoseTime(held);
          setBestPerform((prev) => Math.max(prev, held));
        } else {
          skeletonColorRef.current = "rgb(255,255,255)"; // White when adjusting
          holdActiveRef.current = false;
          if (countAudio) {
            try {
              countAudio.pause();
              countAudio.currentTime = 0;
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error("Detection loop error:", err);
      } finally {
        frameInFlightRef.current = false;
      }
    };

    const startLoop = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        detectPose();
      }, DETECTION_INTERVAL_MS);
    };

    const releaseAudio = () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = "";
        } catch (e) {}
        audioRef.current = null;
      }
    };

    const releaseDetector = () => {
      if (detectorRef.current) {
        detectorRef.current.dispose();
        detectorRef.current = null;
      }
    };

    async function setupVision() {
      const makeDetector = (modelType) =>
        poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
          modelType,
        });
      let detector = null;
      try {
        await tf.ready();
        detector = await makeDetector(
          poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
        );
      } catch (err) {
        console.warn("MoveNet Thunder fallback to Lightning:", err);
        try {
          detector = await makeDetector(
            poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
          );
        } catch (fallbackErr) {
          console.error("Pose detector load error:", fallbackErr);
        }
      }
      if (!detector) return;
      // Unmounted while the model was loading: release it, never cache it.
      if (!mountedRef.current) {
        detector.dispose();
        return;
      }
      detectorRef.current = detector;
      try {
        const countAudio = new Audio(count);
        countAudio.loop = true;
        audioRef.current = countAudio;
      } catch (e) {
        console.warn("Audio not supported or blocked", e);
      }
      if (!mountedRef.current) {
        releaseAudio();
        releaseDetector();
        return;
      }
      setIsModelReady(true);
      startLoop();
    }

    warmupPromiseRef.current = setupVision();

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      releaseAudio();
      frameInFlightRef.current = false;
      // The detector may still be loading; dispose whenever setup settles.
      if (warmupPromiseRef.current) {
        warmupPromiseRef.current.then(() => releaseDetector());
      } else {
        releaseDetector();
      }
    };
  }, []);

  const instructions = poseInstructions[currentPose] || [];
  const scoreTone = (accuracy ?? 0) >= 80 ? "#2e7d32" : "#e65100";

  return (
    <div className="practice-page">
      {/* Sidebar */}
      <div className="practice-sidebar">
        <Navbar />
      </div>

      {/* Main Studio */}
      <div className="practice-main">
        {/* Top Control Bar */}
        <div className="practice-topbar">
          <div className="practice-top-left">
            <Link href="/start/yoga" className="back-to-dash-btn">
              ← Back to Yoga Dashboard
            </Link>
            <div className="practice-title-wrap">
              <span className="practice-badge">🧘 AI Pose Coach Studio</span>
            </div>
          </div>

          <div className="practice-top-right">
            <DropDown
              poseList={poseList}
              currentPose={currentPose}
              setCurrentPose={handleSelectPose}
            />
          </div>
        </div>

        {/* HUD Stats Row */}
        <div className="hud-stats-row">
          <div className="hud-stat-card">
            <div className="hud-icon">⏱️</div>
            <div className="hud-content">
              <span className="hud-label">Pose Hold Time</span>
              <span className="hud-value">{poseTime}s</span>
            </div>
          </div>

          <div className="hud-stat-card">
            <div className="hud-icon">🏆</div>
            <div className="hud-content">
              <span className="hud-label">Best Record</span>
              <span className="hud-value">{bestPerform}s</span>
            </div>
          </div>

          <div className="hud-stat-card">
            <div className="hud-icon">🎯</div>
            <div className="hud-content">
              <span className="hud-label">Posture Accuracy</span>
              <span
                className="hud-value"
                style={{ color: scoreTone }}
              >
                {accuracy === null ? "–" : `${accuracy}%`}
              </span>
            </div>
          </div>

          <div className="hud-stat-card">
            <div className="hud-icon">👁️</div>
            <div className="hud-content">
              <span className="hud-label">{t("yoga.visibility")}</span>
              <span className="hud-value">
                {visibility === null ? "–" : `${visibility}%`}
              </span>
            </div>
          </div>

          <div className="hud-stat-card">
            <div className="hud-icon">✨</div>
            <div className="hud-content">
              <span className="hud-label">Target Pose</span>
              <span className="hud-value">{currentPose}</span>
            </div>
          </div>
        </div>

        {/* Studio Stage */}
        <div className="practice-stage">
          {/* Camera Viewport */}
          <div className="camera-card">
            <div className="camera-header">
              <span>Live Camera Feed</span>
              <span className="live-indicator">
                <span className="live-dot-pulse" />
                {isModelReady ? "MediaPipe Active" : "Initializing AI Model..."}
              </span>
            </div>
            <div className="camera-viewport">
              {cameraError ? (
                <div style={{ color: "#fff", textAlign: "center", padding: "2rem" }}>
                  <p>⚠️ Camera access required for AI pose detection.</p>
                  <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                    Please allow camera permissions in your browser.
                  </p>
                </div>
              ) : (
                <>
                  <Webcam
                    id="webcam"
                    ref={webcamRef}
                    onUserMediaError={() => setCameraError(true)}
                    videoConstraints={{
                      facingMode: "user",
                      width: 640,
                      height: 480,
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    id="my-canvas"
                    width={640}
                    height={480}
                  />
                </>
              )}
            </div>
          </div>

          {/* Reference Pose & Guidance Card */}
          <div className="reference-card">
            <div className="ref-header">
              <h2 className="ref-title">{currentPose} Pose Reference</h2>
            </div>
            <div className="ref-img-wrap">
              <img
                src={poseImages[currentPose]}
                alt={`Reference for ${currentPose}`}
                className="ref-pose-img"
              />
            </div>
            <div className="pose-tips-box">
              <h4 className="pose-tips-title">
                💡 Real-Time Feedback
              </h4>
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.82rem", fontWeight: "700", color: scoreTone }}>
                {liveFeedback || "Position yourself in front of the camera"}
              </p>
              <h4 className="pose-tips-title" style={{ marginTop: "0.6rem" }}>
                📋 Key Alignment Rules
              </h4>
              <ul className="pose-tips-list">
                {instructions.slice(0, 3).map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Yogacv;
