import React, { useState } from "react";

export default function DraftMailDetail({ draft, onClose, onSave }) {
  const [body, setBody] = useState(draft.draft_reply);

  const handleSave = () => {
    onSave(body);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Draft</h2>
        <div style={{ marginBottom: 12 }}>
          <b>Subject:</b> {draft.subject}
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>To:</b> {draft.from?.name
            ? `${draft.from.name} <${draft.from.email}>`
            : draft.from?.email || (Array.isArray(draft.to) ? draft.to.join(", ") : draft.to)}
        </div>
        <textarea
          className="history-edit-textarea"
          value={body}
          onChange={e => setBody(e.target.value)}
          style={{ width: "100%", minHeight: 250, marginBottom: 16 }}
        />
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button className="history-btn" onClick={onClose}>Cancel</button>
          <button className="history-btn history-btn-green" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}