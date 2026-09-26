"use client";

import { loadForUser, saveForUser, userKey } from "./userScopedStorage";

/**
 * Badge + streak gamification store (per-user via userScopedStorage).
 *
 * Badge definitions carry title/description keys (i18n resolved by the UI),
 * an FA icon, and a color. `awardBadges(user, events)` is idempotent: it
 * only returns newly-earned badges so callers can toast exactly once.
 */

export const BADGE_DEFS = {
  first_step: { icon: "fa-solid fa-shoe-prints", color: "#7e57c2", nameKey: "badges.firstStep", descKey: "badges.firstStepD" },
  perfect_day: { icon: "fa-solid fa-star", color: "#f9a825", nameKey: "badges.perfectDay", descKey: "badges.perfectDayD" },
  week_warrior: { icon: "fa-solid fa-fire", color: "#e65100", nameKey: "badges.weekWarrior", descKey: "badges.weekWarriorD" },
  month_master: { icon: "fa-solid fa-crown", color: "#6a1b9a", nameKey: "badges.monthMaster", descKey: "badges.monthMasterD" },
  streak_7: { icon: "fa-solid fa-bolt", color: "#0288d1", nameKey: "badges.streak7", descKey: "badges.streak7D" },
  streak_30: { icon: "fa-solid fa-medal", color: "#c62828", nameKey: "badges.streak30", descKey: "badges.streak30D" },
  quiz_whiz: { icon: "fa-solid fa-brain", color: "#00897b", nameKey: "badges.quizWhiz", descKey: "badges.quizWhizD" },
  hydrated: { icon: "fa-solid fa-droplet", color: "#039be5", nameKey: "badges.hydrated", descKey: "badges.hydratedD" },
  community_voice: { icon: "fa-solid fa-bullhorn", color: "#5c6bc0", nameKey: "badges.communityVoice", descKey: "badges.communityVoiceD" },
  early_bird: { icon: "fa-solid fa-sun", color: "#fb8c00", nameKey: "badges.earlyBird", descKey: "badges.earlyBirdD" },
  certified_finisher: { icon: "fa-solid fa-certificate", color: "#2e7d32", nameKey: "badges.certified", descKey: "badges.certifiedD" },
};

const BASE = "swasth.badges.v1";

export function getBadges(user) {
  const list = loadForUser(BASE, user, []);
  return Array.isArray(list) ? list : [];
}

/** Award badge ids; returns only the newly-earned ones. */
export function awardBadges(user, ids) {
  const owned = new Set(getBadges(user));
  const fresh = [...new Set(ids)].filter((id) => BADGE_DEFS[id] && !owned.has(id));
  if (!fresh.length) return [];
  saveForUser(BASE, user, [...owned, ...fresh]);
  return fresh;
}

export function badgeKey(user) {
  return userKey(BASE, user);
}

/** Longest run of consecutive YYYY-MM-DD dates ending at the latest date. */
export function currentStreak(dates) {
  if (!dates?.length) return 0;
  const set = new Set(dates);
  const sorted = [...set].sort();
  let streak = 1;
  for (let i = sorted.length - 1; i > 0; i--) {
    const a = new Date(`${sorted[i]}T12:00:00`);
    const b = new Date(`${sorted[i - 1]}T12:00:00`);
    if ((a - b) / 86400000 === 1) streak++;
    else break;
  }
  return streak;
}

/** Level thresholds for the profile showcase. */
export function levelFor(badgeCount) {
  if (badgeCount >= 9) return "legend";
  if (badgeCount >= 6) return "champion";
  if (badgeCount >= 3) return "achiever";
  if (badgeCount >= 1) return "starter";
  return "newcomer";
}
