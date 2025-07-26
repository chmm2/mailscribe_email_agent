import React from "react";

export default function CenteredModal({ open, title, message, onOk, onCancel, okText = "Okay", cancelText = "Cancel" }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.35)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 10,
        padding: "2em 2.5em",
        minWidth: 320,
        maxWidth: "90vw",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        textAlign: "center"
      }}>
        {title && <h2 style={{ marginTop: 0 }}>{title}</h2>}
        <div style={{ margin: "1.5em 0" }}>{message}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button
            onClick={onCancel}
            style={{
              background: "#e5e7eb",
              color: "#222",
              border: "none",
              borderRadius: 6,
              padding: "0.6em 1.5em",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onOk}
            style={{
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "0.6em 1.5em",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {okText}
          </button>
        </div>
      </div>
    </div>
  );
}