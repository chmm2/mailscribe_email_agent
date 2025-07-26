import React from "react";

export default function ThreadDetail({ thread, selectedMsgIdx, setSelectedMsgIdx }) {
  if (!thread) {
    return <div className="mail-detail mail-detail-placeholder">Select a conversation to view</div>;
  }

  // If a message is selected, show only that message
  if (selectedMsgIdx !== null && thread.messages[selectedMsgIdx]) {
    const msg = thread.messages[selectedMsgIdx];
    return (
      <div className="mail-detail">
        <button
          className="main-toolbar-btn"
          onClick={() => setSelectedMsgIdx(null)}
          style={{ marginBottom: 10 }}
        >
          ← Back to thread
        </button>
        <div className="mail-thread-message-vertical">
          <div className="mail-thread-meta-vertical">
            <div>
              <div className="mail-thread-from"><b>From:</b> {msg.from?.name || msg.from?.email} &lt;{msg.from?.email}&gt;</div>
              <div className="mail-thread-to"><b>To:</b> {msg.to && msg.to.length > 0 ? msg.to.join(", ") : "(none)"}</div>
            </div>
            <div className="mail-thread-date-vertical">{msg.date}</div>
          </div>
          <div className="mail-body" style={{ marginTop: 12 }}>
            {msg.body?.plain || msg.body?.html || ""}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show the whole thread
  return (
    <div className="mail-detail">
      <div className="mail-header">
        <div className="mail-subject-detail">{thread.thread_subject || "(No Subject)"}</div>
      </div>
      <hr />
      <div>
        {thread.messages.map((msg, idx) => (
          <div
            key={idx}
            className="mail-thread-message-vertical"
            style={{
              marginBottom: 28,
              cursor: "pointer",
              background: idx % 2 === 0 ? "#f8fafc" : "#fff",
              borderRadius: 8,
              padding: "1rem 1.2rem",
              borderLeft: "4px solid #6366f1",
              transition: "background 0.18s"
            }}
            onClick={() => setSelectedMsgIdx(idx)}
          >
            <div className="mail-thread-meta-vertical">
              <div>
                <div className="mail-thread-from"><b>From:</b> {msg.from?.name || msg.from?.email} &lt;{msg.from?.email}&gt;</div>
                <div className="mail-thread-to"><b>To:</b> {msg.to && msg.to.length > 0 ? msg.to.join(", ") : "(none)"}</div>
              </div>
              <div className="mail-thread-date-vertical">{msg.date}</div>
            </div>
            <div className="mail-body" style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
              {(msg.body?.plain || msg.body?.html || "").slice(0, 400)}
              {msg.body?.plain && msg.body.plain.length > 400 ? "..." : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}