// src/components/AuthForm.jsx
import React, { useState } from "react";
import { authenticate } from "../api/auth";
import "../index.css";

const AuthForm = () => {
  const [secret, setSecret] = useState("");
  const [hash, setHash] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authenticate(secret, hash, userAddress);
      setMessage(response.message);
    } catch (error) {
      setMessage("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="auth-form">
      <h2>Authenticate</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Secret:</label>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Hash:</label>
          <input
            type="text"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Ethereum Address:</label>
          <input
            type="text"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit">Authenticate</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AuthForm;