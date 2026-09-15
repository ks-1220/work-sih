"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { registerUser } from "../../services/api";
import { useAuth } from "../../store/auth";
import { resolvePostAuthDestination } from "../../services/onboarding";
import styles from "../auth/AuthForm.module.css";

const Register = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    age: "",
    medicalComplications: "",
    gender: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const { storetokenInLS } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, medicalComplications: formData.medicalComplications.split(",") };
      // registerUser stores the token and routes to /login; on success we
      // take the user through the fitness snapshot (onboarding) instead.
      const response = await registerUser(data, { push: () => {} }, storetokenInLS);

      // response.ok in the API layer already stored the JWT; anything without
      // an error flag is a success → continue to the fitness snapshot.
      if (response?.error) {
        setMessage(response.message || response.error);
      } else {
        router.push(resolvePostAuthDestination(next));
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage(t("register.errorMessage"));
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{t("register.heading")}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          className={styles.input}
          placeholder={t("register.firstNamePlaceholder")}
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="middleName"
          className={styles.input}
          placeholder={t("register.middleNamePlaceholder")}
          value={formData.middleName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          className={styles.input}
          placeholder={t("register.lastNamePlaceholder")}
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          className={styles.input}
          placeholder={t("register.emailPlaceholder")}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          className={styles.input}
          placeholder={t("register.agePlaceholder")}
          value={formData.age}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="medicalComplications"
          className={styles.input}
          placeholder={t("register.medicalComplicationsPlaceholder")}
          value={formData.medicalComplications}
          onChange={handleChange}
        />
        <select
          name="gender"
          className={styles.input}
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">{t("register.genderPlaceholder")}</option>
          <option value="Male">{t("register.genderOptions.male")}</option>
          <option value="Female">{t("register.genderOptions.female")}</option>
          <option value="Other">{t("register.genderOptions.other")}</option>
        </select>
        <input
          type="password"
          name="password"
          className={styles.input}
          placeholder={t("register.passwordPlaceholder")}
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className={styles.button} type="submit">
          {t("register.buttonText")}
        </button>
      </form>
      {message && <p className={styles.message}>{typeof message === "string" ? message : JSON.stringify(message)}</p>}
    </div>
  );
};

export default Register;
