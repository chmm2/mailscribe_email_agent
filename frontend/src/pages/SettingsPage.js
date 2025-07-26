import React, { useEffect, useState } from "react";
import KnowledgeUpload from "../components/KnowledgeUpload";

const API_BASE_URL = "http://localhost:8000";

export default function SettingsPage({ onBack }) {
  const [profile, setProfile] = useState(null);
  const [knowledgeFiles, setKnowledgeFiles] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/gmail-profile`)
      .then(res => res.json())
      .then(setProfile);
  }, []);

  // Fetch knowledge files on mount and after removal
  const fetchKnowledgeFiles = () => {
    fetch(`${API_BASE_URL}/knowledge-list`)
      .then(res => res.json())
      .then(data => setKnowledgeFiles(data.files || []));
  };

  useEffect(() => {
    fetchKnowledgeFiles();
  }, []);

  // Remove file handler
  const handleRemove = async (filename) => {
    if (!window.confirm(`Remove "${filename}" from knowledge base?`)) return;
    await fetch(`${API_BASE_URL}/remove-knowledge`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filename),
    });
    fetchKnowledgeFiles();
  };

  return (
    <div className="settings-container">
      <h2>Account Profile</h2>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "2rem",
        marginBottom: "2rem",
        background: "#f8fafc",
        borderRadius: "12px",
        padding: "2rem"
      }}>
        <img
          src={profile?.photo || "https://www.gravatar.com/avatar?d=mp&s=120"}
          alt="Profile"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "3px solid #6366f1",
            objectFit: "cover"
          }}
        />
        <div>
          <div style={{ fontSize: "1.4em", fontWeight: 600, color: "#3730a3" }}>
            {profile?.name || "Loading..."}
          </div>
          <div style={{ color: "#64748b", fontSize: "1.1em", marginTop: 8 }}>
            <b>Email:</b> {profile?.email || "Loading..."}
          </div>
        </div>
      </div>
      <div style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "1.5rem",
        marginBottom: "2rem",
        boxShadow: "0 2px 8px rgba(30,41,59,0.04)"
      }}>
        <h3 style={{ color: "#6366f1", marginBottom: 8 }}>About</h3>
        <div style={{ color: "#334155", fontSize: "1.08em" }}>
          {profile?.about || "This is your Mailer Agent profile. Here you can manage your account and see your Gmail details."}
        </div>
      </div>
      <h2>Upload Knowledge Base (Excel/PDF)</h2>
      <KnowledgeUpload />
      <div style={{
        background: "#e0e7ff",
        padding: "1em 1.5em",
        borderRadius: 8,
        margin: "1.5em 0",
        maxWidth: 600
      }}>
        <b>Knowledge Files (Excel/PDF) uploaded:</b>
        {knowledgeFiles.length === 0 ? (
          <div style={{ color: "#64748b", marginTop: 6 }}>No files uploaded.</div>
        ) : (
          <ul style={{ margin: "0.5em 0 0 1em", padding: 0 }}>
            {knowledgeFiles.map((filename, idx) => (
              <li key={idx} style={{ color: "#3730a3", fontWeight: 500, display: "flex", alignItems: "center" }}>
                <span style={{ flex: 1 }}>{filename}</span>
                <button
                  title="Remove"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    fontSize: "1.2em",
                    cursor: "pointer",
                    marginLeft: 8
                  }}
                  onClick={() => handleRemove(filename)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}