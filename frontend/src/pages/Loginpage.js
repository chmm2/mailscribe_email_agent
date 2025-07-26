import React, { useState } from "react";

const API_BASE_URL = "http://localhost:8000";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/configure-imap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: "imap.gmail.com",
          port: 993,
          username: email,
          password,
          folders: ["INBOX"],
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Login failed");
      }
      // Only set loggedIn after config is successful
      onLogin();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-outer">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login to Mailer Agent</h2>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="your.email@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Your email password or app password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            <span style={{ marginRight: 8 }}>⚙️</span>
            {loading ? "Connecting..." : "Connect & Configure"}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
        <div className="gmail-info-box">
          <span className="gmail-info-icon">ⓘ</span>
          <span>
            <b>Gmail Users:</b>
            <br />
            Use your email address and an App Password (not your regular password).
            Enable 2FA and generate an App Password in your Google Account settings.
          </span>
        </div>
      </div>
    </div>
  );
}