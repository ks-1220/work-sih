"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  GOOGLE_CLIENT_ID,
  exchangeGoogleCredential,
  loadGoogleScript,
  resetGoogleLoader,
} from "../../services/googleIdentity";
import styles from "./AuthForm.module.css";

// Official Google button (GIS renderButton) with backend exchange.
// Props: next (return path), onSuccess(appToken), onError(message), theme.
// When no Client ID is configured it renders a professional setup notice
// instead of a dead button — never a fake login.
export default function GoogleSignInButton({ next = "/", onSuccess, onError, theme = "outline" }) {
  const { t } = useTranslation();
  const btnRef = useRef(null);
  const [status, setStatus] = useState(GOOGLE_CLIENT_ID ? "loading" : "unconfigured");
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const stateRef = useRef({ next, onSuccess, onError });
  stateRef.current = { next, onSuccess, onError };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;
    setStatus("loading");

    loadGoogleScript()
      .then((google) => {
        if (cancelled) return;
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            const { onSuccess: ok, onError: fail } = stateRef.current;
            setBusy(true);
            try {
              const appToken = await exchangeGoogleCredential(response?.credential);
              ok?.(appToken);
            } catch (err) {
              fail?.(err?.message || t('google.failed'));
            } finally {
              setBusy(false);
            }
          },
        });
        if (btnRef.current) {
          btnRef.current.innerHTML = "";
          google.accounts.id.renderButton(btnRef.current, {
            theme,
            size: "large",
            width: 320,
            text: "continue_with",
            shape: "pill",
          });
        }
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [theme, attempt]);

  const retry = () => {
    resetGoogleLoader();
    setAttempt((n) => n + 1);
  };

  if (status === "unconfigured") {
    return (
      <p className={styles.googleNotice}>
        {t('google.needClientId')} <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> {t('google.needClientId2')}{" "}
        <code>.env.local</code> ({t('google.needClientId3')} <code>.env.example</code>)
      </p>
    );
  }

  return (
    <div className={styles.googleWrap}>
      {status === "loading" && <p className={styles.googleNotice}>{t('google.loading')}</p>}
      {status === "error" && !busy && (
        <p className={styles.googleNotice}>
          {t('google.blocked')} <code>accounts.google.com</code> {t('google.blocked2')}{" "}
          <button type="button" onClick={retry} className={styles.retryBtn}>
            {t('google.retry')}
          </button>{" "}
          {t('google.orEmail')}
        </p>
      )}
      <div ref={btnRef} style={{ display: status === "ready" ? "block" : "none", opacity: busy ? 0.6 : 1 }} />
    </div>
  );
}
