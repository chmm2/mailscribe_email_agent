import React, { useEffect, useState } from "react";
import DraftMailDetail from "../components/DraftMailDetail"; // <-- import

const API_BASE_URL = "http://localhost:8000";
const DRAFTS_PAGE_SIZE = 4;

export default function HistoryPage({ historyKey }) {
  const [drafts, setDrafts] = useState([]);
  const [sent, setSent] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleDrafts, setVisibleDrafts] = useState(DRAFTS_PAGE_SIZE);
  const [search, setSearch] = useState(""); // <-- Add search state

  // Fetch drafts and sent mails on mount or when historyKey changes
  const fetchHistory = async () => {
    setLoading(true);
    const [draftData, sentData] = await Promise.all([
      fetch(`${API_BASE_URL}/email-history/drafts`).then(res => res.json()),
      fetch(`${API_BASE_URL}/email-history/sent`).then(res => res.json())
    ]);
    setDrafts(draftData.drafts || []);
    setSent(sentData.sent || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, [historyKey]);

  // Open modal on edit
  const handleEdit = idx => {
    setEditIdx(idx);
    setShowEditModal(true);
  };

  // Save edited draft
  const handleSave = async (body) => {
    const updatedDrafts = drafts.map((d, i) =>
      i === editIdx ? { ...d, draft_reply: body } : d
    );
    setDrafts(updatedDrafts);
    setEditIdx(null);
    setShowEditModal(false);
    // Optionally: PATCH/POST to backend to persist
  };

  // Send draft (POST to backend, then refresh lists)
  const handleSend = async idx => {
    try {
      const res = await fetch(`${API_BASE_URL}/send-draft/${idx}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || "Failed to send draft.");
        return;
      }
      alert("Draft sent successfully!");
      await fetchHistory();
      setEditIdx(null);
      setVisibleDrafts(DRAFTS_PAGE_SIZE);
    } catch (err) {
      alert("Failed to send draft.");
    }
  };

  // Delete draft (remove from backend, then refresh lists)
  const handleDelete = async idx => {
    try {
      // Backend: remove draft from email_draft_log
      await fetch(`${API_BASE_URL}/email-history/drafts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: idx })
      });
      await fetchHistory();
      setEditIdx(null);
    } catch (err) {
      alert("Failed to delete draft.");
    }
  };

  // Filter drafts by search term
  const filteredDrafts = drafts.filter(draft => {
    const searchLower = search.toLowerCase();
    return (
      (draft.subject && draft.subject.toLowerCase().includes(searchLower)) ||
      (draft.from?.name && draft.from.name.toLowerCase().includes(searchLower)) ||
      (draft.from?.email && draft.from.email.toLowerCase().includes(searchLower)) ||
      (draft.draft_reply && draft.draft_reply.toLowerCase().includes(searchLower))
    );
  });

  if (loading) return <div style={{ padding: 32 }}>Loading history...</div>;

  return (
    <div className="history-bg">
      <h1 className="history-title">Email History</h1>
      <div className="history-subtitle">Manage your drafts and track your sent emails</div>
      <div style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          className="mail-search"
          placeholder="Search drafts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 350, maxWidth: "90%" }}
        />
      </div>
      <div className="history-columns-centered">
        {/* Drafts */}
        <div className="history-section scrollable-history-section">
          <div className="history-section-header">
            <span>Drafts</span>
            <span className="history-count">{filteredDrafts.length} items</span>
          </div>
          {filteredDrafts.length === 0 && <div className="history-empty">No drafts found.</div>}
          {filteredDrafts.slice(0, visibleDrafts).map((draft, idx) => (
            <div className="history-card" key={idx}>
              <div className="history-card-header">
                <span className="history-card-title">{draft.subject}</span>
                <span className="history-badge history-badge-draft">Draft</span>
              </div>
              <div className="history-card-meta">
                To: {draft.from?.name
                  ? `${draft.from.name} <${draft.from.email}>`
                  : draft.from?.email || (Array.isArray(draft.to) ? draft.to.join(", ") : draft.to)}
              </div>
              <div className="history-card-meta">
                Last updated: {draft.updated_at || "N/A"}
              </div>
              <div className="history-card-body">
                {draft.draft_reply.length > 120
                  ? draft.draft_reply.slice(0, 120) + "..."
                  : draft.draft_reply}
              </div>
              <div className="history-card-actions">
                <button className="history-btn" onClick={() => handleEdit(idx)}>
                  <span role="img" aria-label="edit">📝</span> Edit
                </button>
                <button className="history-btn history-btn-green" onClick={() => handleSend(idx)}>
                  <span role="img" aria-label="send">✈️</span> Send
                </button>
                <button className="history-btn history-btn-red" onClick={() => handleDelete(idx)}>
                  <span role="img" aria-label="delete">🗑️</span> Delete
                </button>
                <button
                  className="history-btn"
                  onClick={async () => {
                    const draft = drafts[idx];
                    try {
                      const res = await fetch(`${API_BASE_URL}/save-draft-to-imap`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          to: draft.from?.email || (Array.isArray(draft.to) ? draft.to[0] : draft.to),
                          subject: draft.subject,
                          body: draft.draft_reply || draft.body
                        })
                      });
                      const data = await res.json();
                      if (res.ok) {
                        alert("Draft saved to your email account's Drafts folder.");
                      } else {
                        alert(data.detail || "Failed to save draft to IMAP.");
                      }
                    } catch (err) {
                      alert("Failed to save draft to IMAP.");
                    }
                  }}
                >
                  <span role="img" aria-label="save">💾</span> Save to IMAP
                </button>
              </div>
            </div>
          ))}
          {visibleDrafts < filteredDrafts.length && (
            <button
              className="see-more-btn"
              onClick={() => setVisibleDrafts(v => v + DRAFTS_PAGE_SIZE)}
            >
              See more
            </button>
          )}
        </div>
        {/* Sent */}
        <div className="history-section scrollable-history-section">
          <div className="history-section-header">
            <span>Sent Mails</span>
            <span className="history-count">{sent.length} items</span>
          </div>
          {sent.length === 0 && <div className="history-empty">No sent mails.</div>}
          {sent.map((mail, idx) => (
            <div className="history-card history-card-sent" key={idx}>
              <div className="history-card-header">
                <span className="history-card-title">{mail.subject}</span>
                <span className="history-badge history-badge-sent">Sent</span>
              </div>
              <div className="history-card-meta">
                To: {Array.isArray(mail.to) ? mail.to.join(", ") : mail.to}
              </div>
              <div className="history-card-meta">
                Sent: {mail.sent_at || "N/A"}
              </div>
              <div className="history-card-body">
                {mail.body.length > 120
                  ? mail.body.slice(0, 120) + "..."
                  : mail.body}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal for editing */}
      {showEditModal && editIdx !== null && (
        <DraftMailDetail
          draft={drafts[editIdx]}
          onClose={() => { setShowEditModal(false); setEditIdx(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}