import { AUTH_API_URL } from "./config";

// Real Google sign-in via Google Identity Services (GIS).
//
// Setup (one time, ~5 min, free):
//   1. https://console.cloud.google.com/apis/credentials → create an
//      "OAuth client ID" of type "Web application".
//   2. Under "Authorized JavaScript origins" add http://localhost:3000
//      (and your production origin later).
//   3. Copy the Client ID into .env.local as NEXT_PUBLIC_GOOGLE_CLIENT_ID
//      (see .env.example) and restart `npm run dev`.
//
// Flow: GIS returns an ID token (credential) in the browser → we POST it to
// the backend (`POST <AUTH_API_URL>/google` { credential }) → backend
// verifies it with Google and returns our app JWT { token }. No fake,
// client-minted sessions: if the backend cannot verify, login fails loudly.

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

const GIS_SRC = "https://accounts.google.com/gsi/client";

let gisPromise = null;

export function loadGoogleScript({ timeoutMs = 12000 } = {}) {
  if (typeof window === "undefined") return Promise.reject(new Error("no-window"));
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (gisPromise) return gisPromise;
  gisPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      gisPromise = null;
      reject(new Error("gis-load-timeout"));
    }, timeoutMs);
    const done = (fn) => (arg) => {
      clearTimeout(timer);
      fn(arg);
    };
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", done(() => resolve(window.google)), { once: true });
      existing.addEventListener(
        "error",
        done(() => {
          gisPromise = null;
          reject(new Error("gis-load-failed"));
        }),
        { once: true }
      );
      return;
    }
    const s = document.createElement("script");
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = done(() => resolve(window.google));
    s.onerror = done(() => {
      gisPromise = null;
      reject(new Error("gis-load-failed"));
    });
    document.head.appendChild(s);
  });
  return gisPromise;
}

// Clears the cached loader so the user can retry after fixing connectivity.
export function resetGoogleLoader() {
  gisPromise = null;
}

// Exchange a GIS ID-token credential for an app JWT via the backend.
// Throws with a human-readable message on any failure.
export async function exchangeGoogleCredential(credential) {
  let res;
  try {
    res = await fetch(`${AUTH_API_URL}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try email login.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON (e.g. a 404 HTML page from a backend without the route).
  }

  if (res.status === 404) {
    throw new Error(
      "Google sign-in is not enabled on the server yet (POST /api/auth/google → 404). " +
        "Use email login for now, or ask the backend team to add Google verification."
    );
  }
  if (!res.ok || !data?.token) {
    throw new Error(data?.message || "Google sign-in failed: the server rejected the credential.");
  }
  return data.token;
}
