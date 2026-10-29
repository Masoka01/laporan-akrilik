import { useState, useRef } from "react";
import { complete, swatchBg, LEBAR_OPTIONS, PANJANG_OPTIONS } from "../utils";
import Glyph from "./Glyph";

export default function ItemCard({
  item,
  index,
  colorOptions = [],
  onChange,
  onDuplicate,
  onDelete,
}) {
  const [armDel, setArmDel] = useState(false);
  const armTimerRef = useRef(null);

  function handleField(field, value) {
    onChange({ ...item, [field]: value });
  }

  function handleDelete() {
    if (!armDel) {
      setArmDel(true);
      clearTimeout(armTimerRef.current);
      armTimerRef.current = setTimeout(() => setArmDel(false), 2500);
    } else {
      onDelete();
    }
  }

  const done = complete(item);
  const lembar = item.mode === "lembar";
  const lebarOpts = LEBAR_OPTIONS.includes(item.a)
    ? LEBAR_OPTIONS
    : [item.a, ...LEBAR_OPTIONS].filter(Boolean);
  const panjangOpts = PANJANG_OPTIONS.includes(item.b)
    ? PANJANG_OPTIONS
    : [item.b, ...PANJANG_OPTIONS].filter(Boolean);
  const listId = `dl-warna-${item.id}`;

  return (
    <article className="card" style={{ padding: 0, overflow: "hidden" }}>
      {/* ── Row 1: index + warna + actions ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 12px 12px 0",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* index number strip */}
        <div
          style={{
            width: 36,
            flexShrink: 0,
            alignSelf: "stretch",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid var(--border)",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text-muted)",
            letterSpacing: "0.02em",
          }}
        >
          {String(index).padStart(2, "0")}
        </div>

        {/* color swatch */}
        <span
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: swatchBg(item.warna),
          }}
          aria-hidden="true"
        />

        {/* warna input */}
        <input
          className="field"
          style={{
            flex: 1,
            minWidth: 0,
            fontWeight: 600,
            fontSize: 14,
            height: 38,
          }}
          list={listId}
          placeholder="Nama warna"
          aria-label="Warna akrilik"
          value={item.warna}
          onChange={(e) => handleField("warna", e.target.value)}
          autoFocus={!item.warna}
        />

        {!done && (
          <span className="badge-incomplete" style={{ flexShrink: 0 }}>
            Belum lengkap
          </span>
        )}

        {/* actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexShrink: 0,
          }}
        >
          <button
            className="btn-icon"
            onClick={onDuplicate}
            type="button"
            aria-label="Gandakan bahan ini"
            title="Gandakan bahan"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <button
            className={`btn-icon btn-destructive${armDel ? " armed" : ""}`}
            onClick={handleDelete}
            type="button"
            aria-label={armDel ? "Konfirmasi hapus" : "Hapus bahan ini"}
            title={armDel ? "Ketuk lagi untuk hapus" : "Hapus bahan"}
          >
            {armDel ? (
              <svg
                width="16"
                height="16"
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
                width="16"
                height="16"
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
        </div>
      </div>

      {/* ── Row 2: dimensi ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0,
          borderBottom: "1px solid var(--border)",
        }}
      >
        {[
          {
            label: "Tebal (mm)",
            content: (
              <input
                className="field"
                style={{
                  borderRadius: 0,
                  border: "none",
                  borderRight: "1px solid var(--border)",
                  height: 52,
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: "center",
                }}
                inputMode="decimal"
                aria-label="Tebal"
                value={item.tebal}
                onChange={(e) => handleField("tebal", e.target.value)}
                placeholder="—"
              />
            ),
          },
          {
            label: "Lebar (mm)",
            content: (
              <select
                className="field"
                style={{
                  borderRadius: 0,
                  border: "none",
                  borderRight: "1px solid var(--border)",
                  height: 52,
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: "center",
                  cursor: "pointer",
                }}
                aria-label="Lebar lembar"
                value={item.a}
                onChange={(e) => handleField("a", e.target.value)}
              >
                {lebarOpts.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            ),
          },
          {
            label: "Panjang (mm)",
            content: (
              <select
                className="field"
                style={{
                  borderRadius: 0,
                  border: "none",
                  height: 52,
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: "center",
                  cursor: "pointer",
                }}
                aria-label="Panjang lembar"
                value={item.b}
                onChange={(e) => handleField("b", e.target.value)}
              >
                {panjangOpts.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            ),
          },
        ].map(({ label, content }) => (
          <div
            key={label}
            style={{ display: "grid", gridTemplateRows: "auto 1fr" }}
          >
            <span
              className="field-label"
              style={{
                margin: 0,
                padding: "6px 10px 4px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg-inset)",
              }}
            >
              {label}
            </span>
            {content}
          </div>
        ))}
      </div>

      {/* ── Row 3: mode toggle + jumlah + glyph ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 12px",
        }}
      >
        {/* mode toggle */}
        <div className="mode-toggle" role="group" aria-label="Jenis hasil">
          {[
            { value: "lembar", label: "Utuh" },
            { value: "potongan", label: "Potongan" },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={item.mode === value}
              onClick={() => handleField("mode", value)}
              className={`mode-toggle-btn${item.mode === value ? " active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* quantity */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flex: 1,
            minWidth: 0,
          }}
        >
          <input
            className="field"
            style={{
              width: 90,
              height: 40,
              fontSize: 18,
              fontWeight: 700,
              textAlign: "center",
            }}
            inputMode="decimal"
            aria-label={lembar ? "Jumlah lembar" : "Panjang potongan"}
            placeholder="0"
            value={lembar ? item.lembar : item.pl}
            onChange={(e) =>
              handleField(lembar ? "lembar" : "pl", e.target.value)
            }
          />
        </div>

        {/* glyph */}
        <Glyph it={item} style={{ flexShrink: 0 }} />
      </div>

      <datalist id={listId}>
        {colorOptions.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </article>
  );
}
