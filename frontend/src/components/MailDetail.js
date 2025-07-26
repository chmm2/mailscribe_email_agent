import React from "react";

export default function MailDetail({ email, onForward, forwarding, forwardMsg }) {
  if (!email) {
    return (
      <div className="mail-detail mail-detail-placeholder">Select an email to view</div>
    );
  }

  return (
    <div className="mail-detail">
      <div className="mail-header">
        <div className="mail-subject-detail">{email.subject || "(No Subject)"}</div>
        <div className="mail-meta">
          <span>
            <b>From:</b> {email.from?.name || email.from?.email} &lt;{email.from?.email}&gt;
          </span>
          <span>
            <b>To:</b> {email.to && email.to.length > 0 ? email.to.join(", ") : "(none)"}
          </span>
          <span>
            <b>CC:</b> {email.cc && email.cc.length > 0 ? email.cc.join(", ") : "(none)"}
          </span>
          <span>
            <b>BCC:</b> {email.bcc && email.bcc.length > 0 ? email.bcc.join(", ") : "(none)"}
          </span>
          <span>
            <b>Date:</b> {email.date}
          </span>
          <span>
            <b>Status:</b> {email.unread ? <span style={{ color: "blue" }}>Unread</span> : "Read"}
          </span>
          <span>
            <b>Folder:</b> {email.folder}
          </span>
        </div>
      </div>
      <hr />
      <div className="mail-body">{email.body}</div>
    </div>
  );
}