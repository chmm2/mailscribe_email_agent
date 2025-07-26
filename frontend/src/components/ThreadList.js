import React from "react";

export default function ThreadList({
  threads,
  loading,
  selected,
  setSelected,
  search,
  filter,
  setFilter,
  dateRange,
  setDateRange,
  sortOrder,
  setSortOrder
}) {
  // Helper to parse date string to Date object
  function parseMailDate(dateStr) {
    return new Date(dateStr);
  }

  // Calculate cutoff date
  const now = new Date();
  const cutoff = new Date(now.getTime() - Number(dateRange) * 24 * 60 * 60 * 1000);

  // Filter threads: show thread if any message matches search/filter/date
  let filteredThreads = threads.filter(thread => {
    // Thread is included if ANY message matches all filters
    return thread.messages.some(msg => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        (msg.subject && msg.subject.toLowerCase().includes(searchLower)) ||
        (msg.body?.plain && msg.body.plain.toLowerCase().includes(searchLower)) ||
        (msg.from?.name && msg.from.name.toLowerCase().includes(searchLower)) ||
        (msg.from?.email && msg.from.email.toLowerCase().includes(searchLower));
      const matchesFilter =
        filter === 'all' ? true :
        filter === 'unread' ? msg.unread :
        filter === 'read' ? !msg.unread : true;
      const mailDate = parseMailDate(msg.date);
      const matchesDate = mailDate >= cutoff;
      return matchesSearch && matchesFilter && matchesDate;
    });
  });

  // Sort threads by latest message date in thread
  filteredThreads.sort((a, b) => {
    const dateA = parseMailDate(a.messages[a.messages.length - 1].date);
    const dateB = parseMailDate(b.messages[b.messages.length - 1].date);
    if (sortOrder === 'newest') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  return (
    <div className="inbox-list">
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          className="mail-search"
          placeholder="Search conversations..."
          value={search}
          onChange={e => setSelected({ ...selected, search: e.target.value })}
        />
      </div>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1em" }}>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
        <select value={dateRange} onChange={e => setDateRange(e.target.value)}>
          <option value="60">Last 60 days</option>
          <option value="30">Last 30 days</option>
          <option value="7">Last 7 days</option>
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
      {loading && <div>Loading...</div>}
      {filteredThreads.map((thread) => (
        <div
          key={thread.thread_id || thread.thread_subject}
          className={`mail-item${selected.thread_id === (thread.thread_id || thread.thread_subject) ? " selected" : ""}`}
          onClick={() => setSelected({ ...selected, thread_id: thread.thread_id || thread.thread_subject })}
        >
          <div className="mail-from">{thread.messages[0].from?.name || thread.messages[0].from?.email}</div>
          <div className="mail-subject">{thread.thread_subject || "(No Subject)"}</div>
          <div className="mail-date">{thread.messages[0].date}</div>
          <div style={{ fontSize: "0.9em", color: "#888" }}>
            {thread.messages.length} message{thread.messages.length > 1 ? "s" : ""}
          </div>
        </div>
      ))}
      {filteredThreads.length === 0 && !loading && (
        <div style={{ color: "#888", marginTop: "2rem" }}>No conversations found.</div>
      )}
    </div>
  );
}