/**
 * MediaPipe Yoga Posture Detection & Correction Engine
 * Ported & adapted from abhishekjani08/Yoga-Posture-Detection-using-Mediapipe
 * Computes 8 canonical joint angles, compares with target pose vectors,
 * and provides real-time posture accuracy scoring and corrective feedback.
 *
 * Scoring rules: every check is a real angle measurement worth a fixed
 * share, each rule totals 100, and there are no unconditional bonuses or
 * caps, so a fully aligned pose scores 100. A rule only scores when every
 * joint it needs is confidently visible (score > MIN_KEYPOINT_SCORE);
 * otherwise it returns accuracy null so the UI shows "–" instead of a
 * number made up from defaulted (0,0) joints.
 */

import { POINTS } from "./data";

export const MIN_KEYPOINT_SCORE = 0.35;
export const TOTAL_KEYPOINTS = 17;
export const OFF_FRAME_TIP = "Step into the frame so your whole body is visible";

/**
 * Calculates 2D joint angle between three points (A -> B -> C)
 * in degrees [0, 180].
 */
export function calculateAngle(a, b, c) {
  if (!a || !b || !c) return 0;
  const ax = typeof a.x !== "undefined" ? a.x : a[0];
  const ay = typeof a.y !== "undefined" ? a.y : a[1];
  const bx = typeof b.x !== "undefined" ? b.x : b[0];
  const by = typeof b.y !== "undefined" ? b.y : b[1];
  const cx = typeof c.x !== "undefined" ? c.x : c[0];
  const cy = typeof c.y !== "undefined" ? c.y : c[1];

  const radians = Math.atan2(cy - by, cx - bx) - Math.atan2(ay - by, ax - bx);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return angle;
}

// A joint counts as visible only with a confident detection. Missing joints
// must never default to {x:0, y:0} for scoring.
function isVisible(keypoints, name) {
  const p = keypoints[POINTS[name]];
  return !!p && p.score > MIN_KEYPOINT_SCORE;
}

function needAll(keypoints, names) {
  return names.every((name) => isVisible(keypoints, name));
}

// Full arm chain (shoulder, elbow, wrist) plus the hip the shoulder angle
// is measured against.
function armSideVisible(keypoints, side) {
  return needAll(keypoints, [
    `${side}_SHOULDER`,
    `${side}_ELBOW`,
    `${side}_WRIST`,
    `${side}_HIP`,
  ]);
}

// Full leg chain plus the shoulder the hip angle is measured against.
function legSideVisible(keypoints, side) {
  return needAll(keypoints, [
    `${side}_SHOULDER`,
    `${side}_HIP`,
    `${side}_KNEE`,
    `${side}_ANKLE`,
  ]);
}

function angleAt(keypoints, a, b, c) {
  return calculateAngle(keypoints[POINTS[a]], keypoints[POINTS[b]], keypoints[POINTS[c]]);
}

// First fully-visible arm side, or null when neither arm is in frame.
function firstVisibleArm(keypoints) {
  if (armSideVisible(keypoints, "RIGHT")) return "RIGHT";
  if (armSideVisible(keypoints, "LEFT")) return "LEFT";
  return null;
}

function offFrame() {
  return { accuracy: null, isAligned: false, tip: OFF_FRAME_TIP };
}

/**
 * Extracts 8 key joint angles from detected landmarks.
 * Joints without a confident detection contribute 0 and must only be read
 * after the rule's visibility gate has passed.
 */
export function extractMediaPipeAngles(keypoints) {
  const kp = (idx) => keypoints[idx] || { x: 0, y: 0 };

  const rs = kp(POINTS.RIGHT_SHOULDER);
  const re = kp(POINTS.RIGHT_ELBOW);
  const rw = kp(POINTS.RIGHT_WRIST);

  const ls = kp(POINTS.LEFT_SHOULDER);
  const le = kp(POINTS.LEFT_ELBOW);
  const lw = kp(POINTS.LEFT_WRIST);

  const rh = kp(POINTS.RIGHT_HIP);
  const lh = kp(POINTS.LEFT_HIP);

  const rk = kp(POINTS.RIGHT_KNEE);
  const lk = kp(POINTS.LEFT_KNEE);

  const ra = kp(POINTS.RIGHT_ANKLE);
  const la = kp(POINTS.LEFT_ANKLE);

  return {
    rightElbow: calculateAngle(rs, re, rw),     // Angle 1: R Elbow
    leftElbow: calculateAngle(ls, le, lw),       // Angle 2: L Elbow
    rightShoulder: calculateAngle(re, rs, rh),   // Angle 3: R Shoulder
    leftShoulder: calculateAngle(le, ls, lh),    // Angle 4: L Shoulder
    rightHip: calculateAngle(rs, rh, rk),        // Angle 5: R Hip
    leftHip: calculateAngle(ls, lh, lk),         // Angle 6: L Hip
    rightKnee: calculateAngle(rh, rk, ra),       // Angle 7: R Knee
    leftKnee: calculateAngle(lh, lk, la),        // Angle 8: L Knee
  };
}

/**
 * Canonical target angle specifications and corrective instructions
 * derived from the abhishekjani08 MediaPipe dataset
 */
export const POSE_TARGET_RULES = {
  Tree: {
    evaluate: (keypoints) => {
      if (
        !legSideVisible(keypoints, "RIGHT") ||
        !legSideVisible(keypoints, "LEFT") ||
        !armSideVisible(keypoints, "RIGHT") ||
        !armSideVisible(keypoints, "LEFT")
      ) {
        return offFrame();
      }
      const angles = extractMediaPipeAngles(keypoints);
      // Tree: One leg straight (~170-180), other leg bent (~30-65)
      const rKneeStraight = angles.rightKnee > 155;
      const lKneeStraight = angles.leftKnee > 155;
      const isRightFolded = angles.rightKnee < 85;
      const isLeftFolded = angles.leftKnee < 85;

      let score = 0;
      let tips = [];

      if ((rKneeStraight && isLeftFolded) || (lKneeStraight && isRightFolded)) {
        score += 50;
      } else if (rKneeStraight || lKneeStraight) {
        score += 30;
        tips.push("Bend one knee and place foot against inner thigh");
      } else {
        tips.push("Straighten your standing leg firmly");
      }

      // Hips upright
      if (angles.rightHip > 150 && angles.leftHip > 150) {
        score += 30;
      } else {
        score += 15;
        tips.push("Keep hips and spine upright");
      }

      // Hands folded or overhead
      if (
        (angles.rightElbow < 100 && angles.leftElbow < 100) ||
        (angles.rightShoulder > 140 && angles.leftShoulder > 140)
      ) {
        score += 20;
      } else {
        score += 10;
        tips.push("Bring palms together at heart center");
      }

      return {
        accuracy: score,
        isAligned: score >= 80,
        tip: tips[0] || "Perfect Tree alignment! Hold steady",
      };
    },
  },

  Warrior: {
    evaluate: (keypoints) => {
      // Warrior III (matches warrior.jpg and the instructions): standing
      // knee straight, torso hinged to horizontal, lifted leg straight
      // back, arms reaching forward in a "T".
      if (
        !legSideVisible(keypoints, "RIGHT") ||
        !legSideVisible(keypoints, "LEFT") ||
        !armSideVisible(keypoints, "RIGHT") ||
        !armSideVisible(keypoints, "LEFT")
      ) {
        return offFrame();
      }
      const angles = extractMediaPipeAngles(keypoints);
      let score = 0;
      let tips = [];

      // Either leg can be the standing one; score the better side.
      const sides = ["RIGHT", "LEFT"];
      let stanceScore = 0;
      let stanceTip = "";
      for (const side of sides) {
        const other = side === "RIGHT" ? "LEFT" : "RIGHT";
        const kneeKey = side === "RIGHT" ? "rightKnee" : "leftKnee";
        const hipKey = side === "RIGHT" ? "rightHip" : "leftHip";
        const otherKneeKey = other === "RIGHT" ? "rightKnee" : "leftKnee";
        let s = 0;
        // Standing knee straight: one knee at or past 160 degrees
        if (angles[kneeKey] >= 160) {
          s += 30;
        }
        // Torso hinged to horizontal: the standing-side hip between 70 and 115
        if (angles[hipKey] >= 70 && angles[hipKey] <= 115) {
          s += 30;
        }
        // Lifted leg straight: the other knee at or past 155 degrees
        if (angles[otherKneeKey] >= 155) {
          s += 20;
        }
        if (s > stanceScore) {
          stanceScore = s;
          stanceTip =
            angles[kneeKey] < 160
              ? "Straighten your standing leg without locking it"
              : angles[hipKey] < 70 || angles[hipKey] > 115
                ? "Hinge forward until your torso is horizontal"
                : "Extend the lifted leg straight back";
        }
      }
      score += stanceScore;
      if (stanceScore < 80) tips.push(stanceTip);

      // Arms reaching forward: both elbows extended past 150 degrees
      if (angles.rightElbow >= 150 && angles.leftElbow >= 150) {
        score += 20;
      } else {
        tips.push("Reach both arms forward past your ears");
      }

      return {
        accuracy: score,
        isAligned: score >= 80,
        tip: tips[0] || "Strong Warrior III! Hold the T shape and breathe",
      };
    },
  },

  Chair: {
    evaluate: (keypoints) => {
      if (
        !legSideVisible(keypoints, "RIGHT") ||
        !legSideVisible(keypoints, "LEFT")
      ) {
        return offFrame();
      }
      const arm = firstVisibleArm(keypoints);
      if (!arm) return offFrame();
      const angles = extractMediaPipeAngles(keypoints);
      let score = 0;
      let tips = [];

      // Both knees bent (75-115)
      if (angles.rightKnee >= 75 && angles.rightKnee <= 120 && angles.leftKnee >= 75 && angles.leftKnee <= 120) {
        score += 40;
      } else {
        tips.push("Sink deeper into your chair position");
      }

      // Hips flexed (70-115)
      if (angles.rightHip >= 65 && angles.rightHip <= 120) {
        score += 30;
      } else {
        tips.push("Hinge back at the hips");
      }

      // Arms raised high (140-180)
      const shoulderUp =
        angleAt(keypoints, `${arm}_ELBOW`, `${arm}_SHOULDER`, `${arm}_HIP`) >= 135;
      if (shoulderUp) {
        score += 30;
      } else {
        score += 15;
        tips.push("Reach arms high next to ears");
      }

      return {
        accuracy: score,
        isAligned: score >= 80,
        tip: tips[0] || "Excellent Chair alignment! Keep chest high",
      };
    },
  },

  Cobra: {
    evaluate: (keypoints) => {
      if (
        !legSideVisible(keypoints, "RIGHT") ||
        !legSideVisible(keypoints, "LEFT")
      ) {
        return offFrame();
      }
      const arm = firstVisibleArm(keypoints);
      if (!arm) return offFrame();
      const angles = extractMediaPipeAngles(keypoints);
      let score = 0;
      let tips = [];

      // Hips extended: both hip angles open past 150°
      if (angles.rightHip >= 150 && angles.leftHip >= 150) {
        score += 25;
      } else {
        tips.push("Press hips down and lengthen the front body");
      }

      // Legs straight on the ground
      if (angles.rightKnee >= 155 && angles.leftKnee >= 155) {
        score += 20;
      } else {
        tips.push("Keep legs straight and pressed to mat");
      }

      // Chest lifted with a soft bend in the supporting elbows
      const elbow = angleAt(keypoints, `${arm}_SHOULDER`, `${arm}_ELBOW`, `${arm}_WRIST`);
      if (elbow >= 100 && elbow <= 160) {
        score += 35;
      } else {
        tips.push("Soft bend in elbows, roll shoulders back");
      }

      // Shoulders stacked over the hands, not shrugged or collapsed
      const shoulder = angleAt(keypoints, `${arm}_ELBOW`, `${arm}_SHOULDER`, `${arm}_HIP`);
      if (shoulder >= 25 && shoulder <= 80) {
        score += 20;
      } else {
        tips.push("Draw shoulder blades down and open the chest");
      }

      return {
        accuracy: score,
        isAligned: score >= 80,
        tip: tips[0] || "Great Cobra posture! Open through chest",
      };
    },
  },

  Dog: {
    evaluate: (keypoints) => {
      if (
        !needAll(keypoints, ["RIGHT_SHOULDER", "RIGHT_HIP", "RIGHT_KNEE"]) ||
        !legSideVisible(keypoints, "RIGHT") ||
        !legSideVisible(keypoints, "LEFT") ||
        !armSideVisible(keypoints, "RIGHT") ||
        !armSideVisible(keypoints, "LEFT")
      ) {
        return offFrame();
      }
      const angles = extractMediaPipeAngles(keypoints);
      let score = 0;
      let tips = [];

      // Hip angle: inverted V (60-95)
      if (angles.rightHip >= 55 && angles.rightHip <= 100) {
        score += 40;
      } else {
        tips.push("Push hips upward and back into an inverted V");
      }

      // Knees straight (155-180)
      if (angles.rightKnee >= 150 && angles.leftKnee >= 150) {
        score += 30;
      } else {
        tips.push("Straighten legs and sink heels down");
      }

      // Arms straight (150-180)
      if (angles.rightElbow >= 150 && angles.leftElbow >= 150) {
        score += 30;
      } else {
        tips.push("Press firmly through hands and straighten arms");
      }

      return {
        accuracy: score,
        isAligned: score >= 80,
        tip: tips[0] || "Solid Downward Dog! Lengthen spine",
      };
    },
  },

  Triangle: {
    evaluate: (keypoints) => {
      if (
        !legSideVisible(keypoints, "RIGHT") ||
        !legSideVisible(keypoints, "LEFT")
      ) {
        return offFrame();
      }
      const arm = firstVisibleArm(keypoints);
      if (!arm) return offFrame();
      const angles = extractMediaPipeAngles(keypoints);
      let score = 0;
      let tips = [];

      // Both knees straight (160-180)
      if (angles.rightKnee >= 155 && angles.leftKnee >= 155) {
        score += 40;
      } else {
        tips.push("Keep both legs straight without locking knees");
      }

      // One arm raised in line with the torso
      const raised = Math.max(
        angleAt(keypoints, "RIGHT_ELBOW", "RIGHT_SHOULDER", "RIGHT_HIP"),
        angleAt(keypoints, "LEFT_ELBOW", "LEFT_SHOULDER", "LEFT_HIP")
      );
      if (raised >= 70) {
        score += 35;
      } else {
        tips.push("Reach top arm toward the ceiling in a vertical line");
      }

      // That arm points straight up
      if (raised >= 150) {
        score += 25;
      } else {
        tips.push("Stack the top arm directly over the shoulder");
      }

      return {
        accuracy: score,
        isAligned: score >= 80,
        tip: tips[0] || "Beautiful Triangle pose! Expand chest",
      };
    },
  },

  Shoulderstand: {
    evaluate: (keypoints) => {
      if (
        !legSideVisible(keypoints, "RIGHT") ||
        !legSideVisible(keypoints, "LEFT")
      ) {
        return offFrame();
      }
      const arm = firstVisibleArm(keypoints);
      if (!arm) return offFrame();
      const angles = extractMediaPipeAngles(keypoints);
      let score = 0;
      let tips = [];

      // Legs extended straight up
      if (angles.rightKnee >= 155 && angles.leftKnee >= 155) {
        score += 25;
      } else {
        tips.push("Extend legs straight up toward sky");
      }

      // Hips stacked over the shoulders
      if (angles.rightHip >= 150 && angles.leftHip >= 150) {
        score += 20;
      } else {
        tips.push("Align hips directly over shoulders");
      }

      // Elbows bent to support the back
      const elbow = angleAt(keypoints, `${arm}_SHOULDER`, `${arm}_ELBOW`, `${arm}_WRIST`);
      if (elbow >= 60 && elbow <= 120) {
        score += 15;
      } else {
        tips.push("Bend elbows to shelf your hands under your back");
      }

      // Torso vertical with open shoulders
      const shoulder = angleAt(keypoints, `${arm}_ELBOW`, `${arm}_SHOULDER`, `${arm}_HIP`);
      if (shoulder >= 25 && shoulder <= 80) {
        score += 40;
      } else {
        tips.push("Walk hands higher and lift through the legs");
      }

      return {
        accuracy: score,
        isAligned: score >= 80,
        tip: tips[0] || "Steady Shoulderstand! Keep gaze upward",
      };
    },
  },
};

/**
 * Main evaluation function combining MediaPipe angle analysis.
 * Returns accuracy null (never a made-up number) when the joints the
 * chosen pose needs are not confidently visible.
 */
export function evaluateMediaPipePose(keypoints, currentPose) {
  const rule = POSE_TARGET_RULES[currentPose] || POSE_TARGET_RULES.Tree;
  const result = rule.evaluate(keypoints);
  return {
    ...result,
    angles: extractMediaPipeAngles(keypoints),
  };
}
