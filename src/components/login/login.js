"use client";

// React Component
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../services/api";
import { useAuth } from "../../store/auth";
import { useTranslation } from "react-i18next";
import "./login.css";

const CustomLogin = () => {
  const { t } = useTranslation();
  const [customCredentials, setCustomCredentials] = useState({ email: "", password: "" });
  const [customMessage, setCustomMessage] = useState("");
  const router = useRouter();
  const { storetokenInLS } = useAuth();

  const handleCustomChange = (e) => {
    setCustomCredentials({ ...customCredentials, [e.target.name]: e.target.value });
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    const res_data = await loginUser(customCredentials, router, storetokenInLS);
    setCustomMessage(res_data.message || "An error occurred");
    if (res_data.error) {
      setCustomMessage(res_data.message || "An error occurred");
    } else {
      setCustomMessage("Login successful!");
    }
  };

  return (
    <div className="custom-container">
      <h2 className="custom-heading">{t("login.heading")}</h2>
      <form className="custom-form" onSubmit={handleCustomSubmit}>
        <input
          className="custom-input"
          type="email"
          name="email"
          placeholder={t("login.emailPlaceholder")}
          onChange={handleCustomChange}
          required
        />
        <input
          className="custom-input"
          type="password"
          name="password"
          placeholder={t("login.passwordPlaceholder")}
          onChange={handleCustomChange}
          required
        />
        <button className="custom-button" type="submit">
        {t("login.buttonText")}
        </button>
      </form>
      {customMessage && <p className="custom-message">{customMessage}</p>}
    </div>
  );
};

export default CustomLogin;
