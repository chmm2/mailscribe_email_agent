import React, { useState, useEffect } from "react";
import LoginPage from "./pages/Loginpage";
import InboxPage from "./pages/Inboxpage";
import SettingsPage from "./pages/SettingsPage";
import HistoryPage from "./pages/HistoryPage";
import ForwardingPage from "./pages/ForwardingPage";
import "./App.css";

export default function App() {
  // Load from localStorage if available
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("loggedIn") === "true");
  const [page, setPage] = useState(() => localStorage.getItem("page") || "inbox");
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("viewMode") || "mails"); // default to "mails"
  const [historyKey, setHistoryKey] = useState(0);
  const [draftMode, setDraftMode] = useState(false);
  const [inboxData, setInboxData] = useState({
    threads: [],
    emails: [],
    loading: false,
    fetched: false, // <-- add a flag
  });
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Persist login, page, and viewMode state
  useEffect(() => {
    localStorage.setItem("loggedIn", loggedIn ? "true" : "false");
  }, [loggedIn]);
  useEffect(() => {
    localStorage.setItem("page", page);
  }, [page]);
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  // Fetch only if not already fetched
  useEffect(() => {
    if (!loggedIn || inboxData.fetched) return;
    setInboxData((prev) => ({ ...prev, loading: true }));
    Promise.all([
      fetch("http://localhost:8000/fetch-threads").then((res) => res.json()),
      fetch("http://localhost:8000/fetch-mails").then((res) => res.json()),
    ]).then(([threadData, mailData]) => {
      setInboxData({
        threads: threadData.threads || [],
        emails: mailData.emails || [],
        loading: false,
        fetched: true,
      });
    });
  }, [loggedIn, inboxData.fetched]);

  // On logout, clear everything and go to login
  function handleLogout() {
    setLoggedIn(false);
    setPage("inbox");
    setViewMode("mails");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("page");
    localStorage.removeItem("viewMode");
    // ...reset other state as needed
  }

  if (!loggedIn) {
    return (
      <div className="mailer-app">
        <LoginPage onLogin={() => setLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className={`mailer-app${sidebarVisible ? "" : " sidebar-hidden"}`}>
      {/* Sidebar */}
      {sidebarVisible && (
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">📧 Mailer</div>
            <button
              className="sidebar-toggle-btn"
              aria-label={
                sidebarVisible ? "Hide sidebar" : "Show sidebar"
              }
              onClick={() => setSidebarVisible((v) => !v)}
            >
              {sidebarVisible ? "⏴" : "⏵"}
            </button>
          </div>
          <div className="sidebar-nav">
            <button
              className={`sidebar-nav-btn${
                page === "inbox" ? " active" : ""
              }`}
              onClick={() => setPage("inbox")}
            >
              Inbox
            </button>
            <button
              className={`sidebar-nav-btn${
                page === "history" ? " active" : ""
              }`}
              onClick={() => {
                setPage("history");
                setHistoryKey((k) => k + 1);
              }}
            >
              History
            </button>
            <button
              className={`sidebar-nav-btn${
                page === "settings" ? " active" : ""
              }`}
              onClick={() => setPage("settings")}
            >
              User Profile
            </button>
            <button
              className={`sidebar-nav-btn${
                page === "forwarding" ? " active" : ""
              }`}
              onClick={() => setPage("forwarding")}
            >
              Forwarding & Log
            </button>
          </div>
          <div className="sidebar-footer">
            <button
              className="main-toolbar-btn logout"
              onClick={handleLogout}
            >
              <span role="img" aria-label="logout" style={{ marginRight: 8 }}></span>
              Logout
            </button>
            <div
              style={{
                marginTop: "1.2rem",
                color: "#64748b",
                fontSize: "0.95em",
              }}
            >
              Powered by Mailer Agent
            </div>
          </div>
        </div>
      )}
      {/* When sidebar is hidden, show the toggle button fixed at top left */}
      {!sidebarVisible && (
        <button
          className="sidebar-toggle-btn sidebar-toggle-btn-floating"
          aria-label="Show sidebar"
          onClick={() => setSidebarVisible(true)}
        >
          ⏵
        </button>
      )}

      <div className="main-content">
        <div className="content-area">
          <div className="inbox-main">
            {page === "inbox" && (
              <InboxPage
                draftMode={draftMode}
                setDraftMode={setDraftMode}
                inboxData={inboxData}
                setInboxData={setInboxData}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            )}
            {page === "history" && <HistoryPage historyKey={historyKey} />}
            {page === "settings" && <SettingsPage />}
            {page === "forwarding" && <ForwardingPage />}
          </div>
        </div>
      </div>
    </div>
  );
}