import React, { useRef, useState } from "react";

export default function KnowledgeUpload() {
  const fileInput = useRef();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileInput.current.files[0]) return;
    setUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", fileInput.current.files[0]);
    const res = await fetch("http://localhost:8000/upload-knowledge", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    setMessage(data.message || data.error || "Upload complete");
  };

  return (
    <div style={{ margin: "2em 0" }}>
      <form onSubmit={handleUpload}>
        <input type="file" ref={fileInput} accept=".xlsx,.pdf" />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Knowledge File"}
        </button>
      </form>
      {message && <div style={{ marginTop: 8, color: "#2563eb" }}>{message}</div>}
    </div>
  );
}