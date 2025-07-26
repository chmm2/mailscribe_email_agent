import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8000";

export default function ForwardingSettings() {
  const [keywordMap, setKeywordMap] = useState({});
  const [keyword, setKeyword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/get-forwarding`)
      .then(res => res.json())
      .then(data => setKeywordMap(data.keyword_map || {}));
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!keyword.trim() || !email.trim()) return;
    keyword.split(",").map(k => k.trim()).forEach(k => {
      if (!k) return;
      setKeywordMap(prev => {
        const emails = prev[k] || [];
        if (emails.includes(email.trim())) return prev;
        return {
          ...prev,
          [k]: [...emails, email.trim()]
        };
      });
    });
    setKeyword("");
    setEmail("");
  };

  const handleRemove = (kw, em) => {
    setKeywordMap(prev => {
      const emails = (prev[kw] || []).filter(e => e !== em);
      const newMap = { ...prev };
      if (emails.length) {
        newMap[kw] = emails;
      } else {
        delete newMap[kw];
      }
      // Immediately update backend after local change
      fetch(`${API_BASE_URL}/set-forwarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword_map: newMap })
      });
      return newMap;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`${API_BASE_URL}/set-forwarding`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword_map: keywordMap })
    });
    const data = await res.json();
    setMessage(data.message || "Saved.");
  };

  return (
    <div style={{
      background: "#e0e7ff",
      padding: "1.2em 1.5em",
      borderRadius: 10,
      marginBottom: "2em",
      maxWidth: 420,
      boxShadow: "0 2px 8px rgba(30,41,59,0.06)"
    }}>
      <h3 style={{ marginTop: 0, color: "#3730a3", marginBottom: 12 }}>Relevant Email Forwarding</h3>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Keyword (e.g. payment)"
          style={{ flex: 1, padding: 7, borderRadius: 6, border: "1px solid #c7d2fe", fontSize: "1em" }}
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="recipient@example.com"
          style={{ flex: 2, padding: 7, borderRadius: 6, border: "1px solid #c7d2fe", fontSize: "1em" }}
        />
        <button
          type="submit"
          style={{
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "0.6em 1.1em",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Add
        </button>
      </form>
      <form onSubmit={handleSave}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyword → Forward To Emails:</div>
        {Object.keys(keywordMap).length === 0 ? (
          <div style={{ color: "#64748b", marginTop: 6, fontSize: "0.97em" }}>No forwarding rules set yet.</div>
        ) : (
          <ul style={{ margin: "0.5em 0 0 0.5em", padding: 0 }}>
            {Object.entries(keywordMap).map(([kw, emails]) => (
              <li key={kw} style={{ color: "#3730a3", fontWeight: 500, marginBottom: 6, fontSize: "1em" }}>
                <span style={{ fontWeight: 700 }}>{kw}:</span>
                {emails.map((em, idx) => (
                  <span key={em} style={{ marginLeft: 8, background: "#fff", borderRadius: 4, padding: "2px 8px", display: "inline-block" }}>
                    {em}
                    <button
                      type="button"
                      title="Remove"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        fontSize: "1.1em",
                        cursor: "pointer",
                        marginLeft: 4
                      }}
                      onClick={() => handleRemove(kw, em)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </li>
            ))}
          </ul>
        )}
        <button
          type="submit"
          style={{
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "0.7em 2em",
            fontSize: "1.08em",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: 14
          }}
        >
          Save Forwarding Settings
        </button>
        {message && <div style={{ marginTop: 10, color: "#2563eb" }}>{message}</div>}
      </form>
    </div>
  );
}