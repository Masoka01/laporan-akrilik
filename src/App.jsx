import { useState, useMemo } from "react";
import { uid, clone, blankItem, buildText, COLORS, t } from "./utils";
import { useReports } from "./hooks/useReports";
import ItemCard from "./components/ItemCard";
import OutputPanel from "./components/OutputPanel";
import HistoryPanel from "./components/HistoryPanel";
import Toast from "./components/Toast";

const STATUS_TEXT = {
  new: "Belum tersimpan",
  draft: "Belum tersimpan",
  saving: "Menyimpan…",
  saved: "Tersimpan",
  error: "Gagal — ketuk untuk coba lagi",
};

const statusDotStyle = {
  saved: { background: "#22c55e" },
  saving: { background: "#f59e0b" },
  error: { background: "#ef4444" },
  draft: { background: "var(--text-muted)" },
  new: { background: "var(--border-strong)" },
};

export default function App() {
  const {
    reports,
    state,
    saveStatus,
    updateItems,
    changeDate,
    loadReport,
    deleteReport,
    newReport,
    flush,
    retrySave,
  } = useReports();

  const [toastMsg, setToastMsg] = useState(null);
  const [toastKey, setToastKey] = useState(0);

  function toast(msg) {
    setToastMsg(msg);
    setToastKey((k) => k + 1);
  }

  const reportText = useMemo(
    () => buildText(state.date, state.items),
    [state.date, state.items],
  );

  const colorOptions = useMemo(() => {
    const seen = {};
    const list = [];
    COLORS.concat(
      Object.values(reports).flatMap((r) =>
        (r.items || []).map((i) => t(i.warna)),
      ),
    ).forEach((c) => {
      const k = c.toLowerCase();
      if (c && !seen[k]) {
        seen[k] = 1;
        list.push(c);
      }
    });
    return list;
  }, [reports]);

  function handleItemChange(id, updated) {
    updateItems((items) => items.map((it) => (it.id === id ? updated : it)));
  }

  function handleAddItem() {
    const last = state.items[state.items.length - 1];
    updateItems((items) => [...items, blankItem(last)]);
  }

  function handleDuplicate(id) {
    updateItems((items) => {
      const idx = items.findIndex((it) => it.id === id);
      if (idx < 0) return items;
      const c = clone(items[idx]);
      c.id = uid();
      return [...items.slice(0, idx + 1), c, ...items.slice(idx + 1)];
    });
  }

  function handleDelete(id) {
    updateItems((items) => items.filter((it) => it.id !== id));
  }

  function handleDateChange(v) {
    if (!v) return;
    flush(state, reports).then(() => changeDate(v, reports));
  }

  function handleNewReport() {
    flush(state, reports).then(() => {
      const msg = newReport(state, reports);
      if (msg) toast(msg);
    });
  }

  function handleOpenReport(d) {
    flush(state, reports).then(() => {
      loadReport(d, reports);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function handleDeleteReport(d) {
    deleteReport(d);
  }

  function handleCopy() {
    const text = reportText;
    let p;
    try {
      p = navigator.clipboard.writeText(text);
    } catch (e) {
      p = Promise.reject(e);
    }
    p.then(
      () => toast("Laporan disalin"),
      () => {
        const el = document.getElementById("out");
        if (el) {
          const r = document.createRange();
          r.selectNodeContents(el);
          const s = window.getSelection();
          s.removeAllRanges();
          s.addRange(r);
        }
        toast("Teks terpilih, salin manual");
      },
    );
  }

  const utuh = state.items.filter((i) => i.mode === "lembar").length;
  const pot = state.items.length - utuh;

  return (
    <div
      style={{
        maxWidth: 1060,
        margin: "0 auto",
        display: "grid",
        gap: 0,
        paddingBottom: 96,
      }}
    >
      {/* ── Header bar ── */}
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px 24px",
          padding: "20px 0 18px",
          borderBottom: "1px solid var(--border)",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(22px, 5vw, 30px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: "var(--text-primary)",
            }}
          >
            Laporan Akrilik
          </h1>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              paddingBottom: 2,
            }}
          >
            Pemakaian harian
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="field-label" style={{ marginBottom: 0 }}>
              Tanggal
            </span>
            <input
              type="date"
              aria-label="Tanggal"
              className="field"
              style={{ width: 160 }}
              value={state.date}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </label>

          <button
            type="button"
            role="status"
            className="status-pill"
            style={{
              cursor: saveStatus === "error" ? "pointer" : "default",
              ...(saveStatus === "error"
                ? {
                    borderColor: "var(--danger)",
                    color: "var(--danger)",
                    background: "var(--danger-bg)",
                  }
                : {}),
            }}
            onClick={() => saveStatus === "error" && retrySave(state, reports)}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                flexShrink: 0,
                ...statusDotStyle[saveStatus],
              }}
            />
            {STATUS_TEXT[saveStatus]}
          </button>
        </div>
      </header>

      {/* ── Main two-column grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
          gap: 20,
          alignItems: "start",
        }}
        className="responsive-grid"
      >
        {/* Left: items */}
        <section aria-labelledby="h-items">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 12,
            }}
          >
            <h2 id="h-items" className="section-title" style={{ margin: 0 }}>
              Bahan terpakai
            </h2>
            {state.items.length > 0 && (
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                {state.items.length} item · {utuh} utuh · {pot} potongan
              </span>
            )}
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {state.items.length === 0 ? (
              <div className="empty-state">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 48 48"
                  fill="none"
                  style={{
                    display: "block",
                    margin: "0 auto 14px",
                    color: "var(--accent)",
                    opacity: 0.7,
                  }}
                  aria-hidden="true"
                >
                  <rect
                    x="10"
                    y="5"
                    width="28"
                    height="38"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M22 11v26M26 11v26"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.4"
                  />
                  <path
                    d="M15 20h4M15 28h4M29 20h4M29 28h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
                <strong
                  style={{
                    display: "block",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                  }}
                >
                  Belum ada bahan
                </strong>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  Tambah bahan untuk memulai laporan hari ini.
                </p>
              </div>
            ) : (
              state.items.map((item, idx) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={idx + 1}
                  colorOptions={colorOptions}
                  onChange={(updated) => handleItemChange(item.id, updated)}
                  onDuplicate={() => handleDuplicate(item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))
            )}
          </div>

          <div
            style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}
          >
            <button
              className="btn-primary"
              type="button"
              onClick={handleAddItem}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Tambah bahan
            </button>
            <button
              className="btn-secondary"
              type="button"
              onClick={handleNewReport}
            >
              Laporan baru
            </button>
          </div>
        </section>

        {/* Right: output + history */}
        <aside
          style={{ display: "grid", gap: 12, position: "sticky", top: 16 }}
        >
          <OutputPanel text={reportText} onCopy={handleCopy} />
          <HistoryPanel
            reports={reports}
            currentDate={state.date}
            onOpen={handleOpenReport}
            onDelete={handleDeleteReport}
          />
        </aside>
      </div>

      {/* Bottom bar — mobile only */}
      <div
        className="mobile-bottom-bar"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          borderTop: "1px solid var(--border)",
          background: "var(--bg-page)",
          paddingTop: 12,
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
          paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
          paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
          display: "none",
        }}
      >
        <button
          className="btn-primary"
          style={{ width: "100%", height: 52, fontSize: 16 }}
          type="button"
          onClick={handleCopy}
        >
          Salin laporan
        </button>
      </div>

      <Toast key={toastKey} message={toastMsg} />
    </div>
  );
}
