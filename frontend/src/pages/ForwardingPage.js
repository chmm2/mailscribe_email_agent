import React, { useEffect, useState } from "react";
import ForwardingSettings from "../components/ForwardingSettings";

const API_BASE_URL = "http://localhost:8000";

export default function ForwardingPage() {
  const [forwarded, setForwarded] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/forwarded-emails`)
      .then(res => res.json())
      .then(data => setForwarded(data.emails || []));
  }, []);

  return (
    <div className="history-bg">
      <h1 className="history-title">Forwarding & Log</h1>
      <div className="history-subtitle">
        Manage relevant email forwarding and see all forwarded emails
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2.5rem",
          alignItems: "flex-start",
          overflowX: "auto",
          width: "100%",
        }}
      >
        {/* Left: Forwarding Settings */}
        <div
          style={{
            flex: "1 1 600px",
            minWidth: 420,
            maxWidth: 700,
          }}
        >
          <ForwardingSettings />
        </div>
        {/* Right: Forwarded Emails Log */}
        <div
          style={{
            flex: "0 0 480px",
            minWidth: 420,
            maxWidth: 520,
            background: "#f8fafc",
            borderRadius: "14px",
            padding: "1.5rem 1.2rem 1.2rem 1.2rem",
            boxShadow: "0 2px 12px rgba(30,41,59,0.04)",
            maxHeight: "70vh",
            overflowY: "auto",
            flexShrink: 0, // Prevent shrinking so it always stays at the right
          }}
        >
          <h2 style={{ color: "#6366f1" }}>Forwarded Emails Log</h2>
          {forwarded.length === 0 ? (
            <div style={{ color: "#64748b" }}>No emails have been forwarded yet.</div>
          ) : (
            <ul style={{ margin: 0, padding: 0 }}>
              {forwarded.map((mail, idx) => (
                <li
                  key={idx}
                  style={{
                    background: "#fff",
                    borderRadius: 6,
                    margin: "1em 0",
                    padding: "1em",
                    borderLeft: "5px solid #6366f1",
                  }}
                >
                  <div>
                    <b>Subject:</b> {mail.subject}
                  </div>
                  <div>
                    <b>To:</b> {mail.to}
                  </div>
                  <div>
                    <b>Date:</b> {mail.date}
                  </div>
                  <div style={{ color: "#64748b", marginTop: 6 }}>
                    {mail.body && mail.body.length > 120
                      ? mail.body.slice(0, 120) + "..."
                      : mail.body}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}