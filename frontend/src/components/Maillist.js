import React, { useState } from "react";

export default function MailList({
  emails,
  loading,
  selected,
  setSelected
}) {
  const [visibleCount, setVisibleCount] = useState(10);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [dateRange, setDateRange] = useState('60'); // '60', '30', '7'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'

  // Helper to parse date string to Date object
  function parseMailDate(dateStr) {
    // Example: "Tue 6/24/2025 7:26 PM"
    return new Date(dateStr);
  }

  // Calculate cutoff date
  const now = new Date();
  const cutoff = new Date(now.getTime() - Number(dateRange) * 24 * 60 * 60 * 1000);

  // Filter emails by search, read/unread, and date range
  let filteredEmails = emails.filter((mail) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (mail.subject && mail.subject.toLowerCase().includes(searchLower)) ||
      (mail.from?.name && mail.from.name.toLowerCase().includes(searchLower)) ||
      (mail.from?.email && mail.from.email.toLowerCase().includes(searchLower)) ||
      (mail.body && mail.body.toLowerCase().includes(searchLower));
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'unread' ? mail.unread :
      filter === 'read' ? !mail.unread : true;
    const mailDate = parseMailDate(mail.date);
    const matchesDate = mailDate >= cutoff;
    return matchesSearch && matchesFilter && matchesDate;
  });

  // Sort emails by date
  filteredEmails.sort((a, b) => {
    const dateA = parseMailDate(a.date);
    const dateB = parseMailDate(b.date);
    if (sortOrder === 'newest') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="inbox-list">
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          className="mail-search"
          placeholder="Search mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
      {filteredEmails.slice(0, visibleCount).map((mail, idx) => {
        const realIdx = emails.indexOf(mail);
        return (
          <div
            key={realIdx}
            className={`mail-item${selected === realIdx ? " selected" : ""}`}
            onClick={() => setSelected(realIdx)}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ flex: 1 }}>
              <div className="mail-from">{mail.from?.name || mail.from?.email}</div>
              <div className="mail-subject" style={{ fontWeight: mail.unread ? "bold" : "normal" }}>
                {mail.subject || "(No Subject)"}
              </div>
              <div className="mail-date" style={{ color: "#888", fontSize: "0.95em", marginTop: 2 }}>
                {mail.date}
              </div>
            </div>
            {mail.unread && <span style={{color: 'blue', fontSize: '1.2em', marginLeft: 8}}>●</span>}
          </div>
        );
      })}
      {filteredEmails.length > visibleCount && (
        <button className="see-more-btn" onClick={handleSeeMore}>
          See more
        </button>
      )}
      {filteredEmails.length === 0 && !loading && (
        <div style={{ color: "#888", marginTop: "2rem" }}>No mails found.</div>
      )}
    </div>
  );
}