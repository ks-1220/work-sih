"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../../services/api";
import { useAuth } from "../../store/auth";

const Adminlogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { storetokenInLS } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res_data = await loginAdmin(credentials, router, storetokenInLS);
    setMessage(res_data.message || "An error occurred");
    if (res_data.error) {
      setMessage(res_data.message || "An error occurred");
    } else {
      setMessage("Login successful!");
    }
  };

  return (
    <div className="custom-container">
      <h2 className="custom-heading">Login</h2>
      <form className="custom-form" onSubmit={handleSubmit}>
        <input
          className="custom-input"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          className="custom-input"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button className="custom-button" type="submit">Login</button>
      </form>
      {message && <p className="custom-message">{message}</p>}
    </div>
  );
};

export default Adminlogin;
