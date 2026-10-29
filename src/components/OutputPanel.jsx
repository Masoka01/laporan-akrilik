import { useState } from "react";

export default function OutputPanel({ text, onCopy }) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="card"
      style={{ padding: 0, overflow: "hidden" }}
      aria-labelledby="h-out"
    >
      {/* header */}
      <button
        type="button"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "11px 14px",
          background: "var(--bg-inset)",
          border: "none",
          borderBottom: "1px solid var(--border)",
          cursor: "pointer",
          gap: 8,
        }}
        aria-expanded={open}
        aria-controls="out-body"
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className="section-title"
          id="h-out"
          style={{ pointerEvents: "none" }}
        >
          Teks laporan
        </span>
        <svg
          style={{
            display: "block",
            flexShrink: 0,
            color: "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.18s",
          }}
          className="panel-chevron"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* body */}
      <div
        id="out-body"
        className={open ? "" : "panel-collapsed"}
        style={{ padding: 12 }}
      >
        <pre
          id="out"
          style={{
            margin: 0,
            padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            fontFamily: "ui-monospace, Menlo, monospace",
            fontSize: 12,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            userSelect: "all",
            color: "var(--text-primary)",
          }}
        >
          {text}
        </pre>
        <button
          className="btn-primary desktop-copy-btn"
          style={{ marginTop: 10, width: "100%" }}
          onClick={onCopy}
          type="button"
        >
          Salin laporan
        </button>
      </div>
    </section>
  );
}
