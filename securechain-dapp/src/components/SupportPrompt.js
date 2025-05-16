import { useState } from "react";

export default function SupportPrompt() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Help Button - Top Right */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          padding: "0.75rem 1.25rem",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "50px",
          fontSize: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
      >
        {open ? "❌" : "💬 Support"}
      </button>

      {/* Floating Support Panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: "70px",
            right: "20px",
            width: "300px",
            backgroundColor: "#ffffff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "1rem",
            fontSize: "0.9rem",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            zIndex: 9998,
          }}
        >
          <strong>Need help?</strong>
          <ul style={{ paddingLeft: "1.25rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
            <li>✅ Use the correct MetaMask account</li>
            <li>🧑‍✈️ Drivers: register/update cargo</li>
            <li>🔐 Inspectors: lock cargo</li>
            <li>👑 Owner: assign roles</li>
          </ul>
          <p style={{ margin: 0 }}>
            📩 <a href="mailto:support@securechain.app">paramdeepsinghsaini@gmail.com</a>
          </p>
        </div>
      )}
    </>
  );
}
