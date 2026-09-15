"use client";

// React Component
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "../../services/api";
import { useAuth } from "../../store/auth";
import { resolvePostAuthDestination } from "../../services/onboarding";
import GoogleSignInButton from "../auth/GoogleSignInButton";
import { useTranslation } from "react-i18next";
import styles from "../auth/AuthForm.module.css";

const CustomLogin = () => {
  const { t } = useTranslation();
  const [customCredentials, setCustomCredentials] = useState({ email: "", password: "" });
  const [customMessage, setCustomMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const { storetokenInLS } = useAuth();

  const handleCustomChange = (e) => {
    setCustomCredentials({ ...customCredentials, [e.target.name]: e.target.value });
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setIsError(false);
    const res_data = await loginUser(customCredentials, { push: () => {} }, storetokenInLS);
    setBusy(false);
    if (res_data?.error) {
      setIsError(true);
      setCustomMessage(res_data.message || "An error occurred");
    } else {
      setIsError(false);
      setCustomMessage("Login successful! Taking you to your fitness snapshot…");
      router.push(resolvePostAuthDestination(next));
    }
  };

  const handleGoogleSuccess = (appToken) => {
    storetokenInLS(appToken);
    setIsError(false);
    setCustomMessage("Signed in with Google! Taking you to your fitness snapshot…");
    router.push(resolvePostAuthDestination(next));
  };

  const handleGoogleError = (message) => {
    setIsError(true);
    setCustomMessage(message);
  };

  return (
    <div className={styles.container}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>
          <i className="fa-solid fa-spa"></i>
        </span>
        Swasth Infinity
      </div>
      <h2 className={styles.heading}>{t("login.heading")}</h2>
      <p className={styles.subheading}>{t("login.subheading")}</p>
      <form className={styles.form} onSubmit={handleCustomSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>{t("login.emailPlaceholder")}</span>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder={t("login.emailPlaceholder")}
            autoComplete="email"
            value={customCredentials.email}
            onChange={handleCustomChange}
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{t("login.passwordPlaceholder")}</span>
          <span className={styles.passwordWrap}>
            <input
              className={styles.input}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("login.passwordPlaceholder")}
              autoComplete="current-password"
              value={customCredentials.password}
              onChange={handleCustomChange}
              required
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
            </button>
          </span>
        </label>
        <button className={styles.button} type="submit" disabled={busy}>
          {busy ? t("login.signingIn") : t("login.buttonText")}
        </button>
        <div className={styles.divider}>or</div>
        <GoogleSignInButton next={next} onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
      </form>
      {customMessage && (
        <p className={isError ? styles.error : styles.message} role={isError ? "alert" : "status"}>
          {customMessage}
        </p>
      )}
      <div className={styles.links}>
        <Link href="/">{t("login.backHome")}</Link>
        <Link href={`/register?next=${encodeURIComponent(next)}`}>{t("login.createAccount")}</Link>
      </div>
    </div>
  );
};

export default CustomLogin;
