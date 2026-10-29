import { useState } from "react";
import { dateShort } from "../utils";

export default function HistoryPanel({
  reports,
  currentDate,
  onOpen,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const [armMap, setArmMap] = useState({});

  const keys = Object.keys(reports).sort().reverse();

  function handleDeleteClick(k) {
    if (!armMap[k]) {
      setArmMap((p) => ({ ...p, [k]: true }));
      setTimeout(() => setArmMap((p) => ({ ...p, [k]: false })), 2500);
    } else {
      onDelete(k);
    }
  }

  return (
    <section
      className="card"
      style={{ padding: 0, overflow: "hidden" }}
      aria-labelledby="h-hist"
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
          borderBottom:
            open || keys.length ? "1px solid var(--border)" : "none",
          cursor: "pointer",
          gap: 8,
        }}
        aria-expanded={open}
        aria-controls="hist-body"
        onClick={() => setOpen((o) => !o)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className="section-title"
            id="h-hist"
            style={{ pointerEvents: "none" }}
          >
            Riwayat
          </span>
          {keys.length > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--accent)",
                background:
                  "color-mix(in srgb, var(--accent) 12%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                borderRadius: 4,
                padding: "1px 6px",
                pointerEvents: "none",
              }}
            >
              {keys.length}
            </span>
          )}
        </div>
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
      <div id="hist-body" className={open ? "" : "panel-collapsed"}>
        {keys.length ? (
          <ul style={{ listStyle: "none", margin: 0, padding: "4px 0" }}>
            {keys.map((k) => {
              const n = (reports[k].items || []).length;
              const isCurrent = k === currentDate;
              return (
                <li
                  key={k}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderLeft: isCurrent
                      ? "3px solid var(--accent)"
                      : "3px solid transparent",
                    background: isCurrent
                      ? "color-mix(in srgb, var(--accent) 6%, transparent)"
                      : "transparent",
                  }}
                  aria-current={isCurrent || undefined}
                >
                  <button
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      color: "var(--text-primary)",
                      fontWeight: isCurrent ? 600 : 400,
                    }}
                    type="button"
                    onClick={() => onOpen(k)}
                  >
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>
                      {dateShort(k)}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {n} bahan
                    </span>
                  </button>
                  <button
                    className={`btn-icon btn-destructive${armMap[k] ? " armed" : ""}`}
                    style={{ marginRight: 6 }}
                    type="button"
                    onClick={() => handleDeleteClick(k)}
                    aria-label={
                      armMap[k]
                        ? "Konfirmasi hapus laporan"
                        : `Hapus laporan ${dateShort(k)}`
                    }
                  >
                    {armMap[k] ? (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              margin: 0,
              padding: "12px 14px",
            }}
          >
            Belum ada riwayat. Laporan tersimpan otomatis setelah diisi.
          </p>
        )}
      </div>
    </section>
  );
}
