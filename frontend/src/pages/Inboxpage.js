import React, { useEffect, useState } from "react";
import MailList from "../components/Maillist";
import MailDetail from "../components/MailDetail";
import ThreadList from "../components/ThreadList";
import ThreadDetail from "../components/ThreadDetail";
import CenteredModal from "../components/CenteredModal";

export default function InboxPage({ inboxData, setInboxData, viewMode, setViewMode, ...otherProps }) {
  const { threads, emails, loading } = inboxData;

  // For threads
  const [selectedThread, setSelectedThread] = useState({ thread_id: null, search: "" });
  const [selectedMsgIdx, setSelectedMsgIdx] = useState(null);

  // For mails
  const [selectedMailIdx, setSelectedMailIdx] = useState(null);

  // Thread filters
  const [threadFilter, setThreadFilter] = useState('all');
  const [threadDateRange, setThreadDateRange] = useState('60');
  const [threadSortOrder, setThreadSortOrder] = useState('newest');

  const [generatingAllDrafts, setGeneratingAllDrafts] = useState(false);

  // Modal state
  const [modal, setModal] = useState({ open: false, message: "", onOk: null });

  // Forwarding state
  const [forwarding, setForwarding] = useState(false);
  const [forwardMsg, setForwardMsg] = useState(""); // ✅ Fixed missing state

  // Reset selected message when thread changes
  useEffect(() => {
    setSelectedMsgIdx(null);
  }, [selectedThread.idx]);

  const handleGenerateDrafts = async () => {
    setGeneratingAllDrafts(true);
    try {
      const res = await fetch("http://localhost:8000/fetch-and-generate-drafts");
      const data = await res.json();
      if (res.ok && data.count > 0) {
        setModal({
          open: true,
          message: `All drafts are generated (${data.count}). You can view them in History.`,
          onOk: () => setModal({ ...modal, open: false })
        });
      } else {
        setModal({
          open: true,
          message: "No drafts generated.",
          onOk: () => setModal({ ...modal, open: false })
        });
      }
    } catch (err) {
      setModal({
        open: true,
        message: "Failed to generate drafts.",
        onOk: () => setModal({ ...modal, open: false })
      });
    }
    setGeneratingAllDrafts(false);
  };

  const handleForward = async () => {
    setForwarding(true);
    setForwardMsg(""); // ✅ This was undefined earlier
    try {
      const res = await fetch("http://localhost:8000/forward-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emails[selectedMailIdx]),
      });
      const data = await res.json();
      if (res.ok) {
        setForwardMsg("Email forwarded successfully!");
      } else {
        setForwardMsg(data.detail || "Failed to forward email.");
      }
    } catch (err) {
      setForwardMsg("Failed to forward email.");
    }
    setForwarding(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Toolbar at the top */}
      <div style={{ padding: "1rem", background: "#f8fafc", borderBottom: "1px solid #e5e7eb", display: "flex", gap: 12 }}>
        <button
          className={`main-toolbar-btn${viewMode === "threads" ? " selected" : ""}`}
          onClick={() => setViewMode("threads")}
          style={{ minWidth: 160 }}
        >
          Threads
        </button>
        <button
          className={`main-toolbar-btn${viewMode === "mails" ? " selected" : ""}`}
          onClick={() => setViewMode("mails")}
          style={{ minWidth: 160 }}
        >
          All Mails
        </button>
        <button
          className="main-toolbar-btn"
          style={{
            minWidth: 160,
            background: generatingAllDrafts ? "#6366f1" : "#2563eb",
            color: "#fff",
            fontWeight: 700,
            marginLeft: 0
          }}
          disabled={generatingAllDrafts}
          onClick={handleGenerateDrafts}
        >
          {generatingAllDrafts ? "Generating..." : "Generate Drafts for All Mails"}
        </button>
        <button
          className="main-toolbar-btn"
          onClick={handleForward}
          disabled={forwarding || selectedMailIdx === null}
          style={{
            minWidth: 160,
            background: forwarding ? "#6366f1" : "#2563eb",
            color: "#fff",
            fontWeight: 700,
            marginLeft: 0
          }}
        >
          {forwarding ? "Forwarding..." : "Forward Email"}
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left: List */}
        <div style={{ width: 420, minWidth: 320, maxWidth: 700, borderRight: "1px solid #e5e7eb", background: "#f9fafb", height: "110%", overflowY: "auto" }}>
          {viewMode === "threads" ? (
            <ThreadList
              threads={threads}
              loading={loading}
              selected={selectedThread}
              setSelected={setSelectedThread}
              search={selectedThread.search}
              filter={threadFilter}
              setFilter={setThreadFilter}
              dateRange={threadDateRange}
              setDateRange={setThreadDateRange}
              sortOrder={threadSortOrder}
              setSortOrder={setThreadSortOrder}
            />
          ) : (
            <MailList
              emails={emails}
              loading={loading}
              selected={selectedMailIdx}
              setSelected={setSelectedMailIdx}
            />
          )}
        </div>

        {/* Right: Detail */}
        <div className="inbox-detail" style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
          {viewMode === "threads" ? (
            <ThreadDetail
              thread={threads.find(t => (t.thread_id || t.thread_subject) === selectedThread.thread_id)}
              selectedMsgIdx={selectedMsgIdx}
              setSelectedMsgIdx={setSelectedMsgIdx}
            />
          ) : (
            <MailDetail
              email={emails[selectedMailIdx]}
              forwarding={forwarding}
              forwardMsg={forwardMsg}
            />
          )}
        </div>
      </div>

      <CenteredModal
        open={modal.open}
        message={modal.message}
        onOk={modal.onOk}
        onCancel={() => setModal({ ...modal, open: false })}
      />
    </div>
  );
}

// Add this CSS to your App.css:
/*
.cool-draft-btn:hover:not(:disabled) {
  background: #4338ca;
  color: #fff;
  transform: translateY(-2px) scale(1.04);
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
*/
