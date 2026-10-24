import { useState, useMemo } from 'react'
import { uid, clone, blankItem, buildText, COLORS, t } from './utils'
import { useReports } from './hooks/useReports'
import ItemCard from './components/ItemCard'
import OutputPanel from './components/OutputPanel'
import HistoryPanel from './components/HistoryPanel'
import Toast from './components/Toast'

const STATUS_TEXT = {
  new: 'Belum tersimpan',
  draft: 'Belum tersimpan',
  saving: 'Menyimpan…',
  saved: 'Tersimpan',
  error: 'Gagal, ketuk untuk coba lagi',
}

export default function App() {
  const {
    reports, state, saveStatus,
    updateItems, changeDate, loadReport, deleteReport, newReport, flush, retrySave,
  } = useReports()

  const [toastMsg, setToastMsg] = useState(null)
  const [toastKey, setToastKey] = useState(0)

  function toast(msg) {
    setToastMsg(msg)
    setToastKey(k => k + 1)
  }

  const reportText = useMemo(
    () => buildText(state.date, state.items),
    [state.date, state.items]
  )

  // derive unique colors for datalist
  const colorOptions = useMemo(() => {
    const seen = {}
    const list = []
    COLORS.concat(
      Object.values(reports).flatMap(r => (r.items || []).map(i => t(i.warna)))
    ).forEach(c => {
      const k = c.toLowerCase()
      if (c && !seen[k]) { seen[k] = 1; list.push(c) }
    })
    return list
  }, [reports])

  // Item operations
  function handleItemChange(id, updated) {
    updateItems(items => items.map(it => it.id === id ? updated : it))
  }

  function handleAddItem() {
    const last = state.items[state.items.length - 1]
    updateItems(items => [...items, blankItem(last)])
  }

  function handleDuplicate(id) {
    updateItems(items => {
      const idx = items.findIndex(it => it.id === id)
      if (idx < 0) return items
      const c = clone(items[idx]); c.id = uid()
      return [...items.slice(0, idx + 1), c, ...items.slice(idx + 1)]
    })
  }

  function handleDelete(id) {
    updateItems(items => items.filter(it => it.id !== id))
  }

  function handleDateChange(v) {
    if (!v) return
    flush(state, reports).then(() => changeDate(v, reports))
  }

  function handleNewReport() {
    flush(state, reports).then(() => {
      const msg = newReport(state, reports)
      if (msg) toast(msg)
    })
  }

  function handleOpenReport(d) {
    flush(state, reports).then(() => {
      loadReport(d, reports)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  function handleDeleteReport(d) {
    deleteReport(d)
  }

  function handleCopy() {
    const text = reportText
    let p
    try { p = navigator.clipboard.writeText(text) } catch (e) { p = Promise.reject(e) }
    p.then(
      () => toast('Laporan disalin'),
      () => {
        const el = document.getElementById('out')
        if (el) { const r = document.createRange(); r.selectNodeContents(el); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r) }
        toast('Teks terpilih, salin manual')
      }
    )
  }

  const utuh = state.items.filter(i => i.mode === 'lembar').length
  const pot  = state.items.length - utuh

  // Save status color mapping
  const statusColors = {
    saved: 'bg-[#1e7a4f] dark:bg-[#5cc796]',
    saving: 'bg-[#0b7e88] dark:bg-[#4ccbd3]',
    error: 'bg-[#a8500b] dark:bg-[#e8a04f]',
    draft: 'bg-[#8da0aa] dark:bg-[#4b5f6a]',
    new: 'bg-[#8da0aa] dark:bg-[#4b5f6a]',
  }

  return (
    <div className="max-w-[1040px] mx-auto grid gap-5 md:gap-6 pb-28 md:pb-12 pt-5 md:pt-6 px-3 md:px-0">
      {/* header */}
      <header className="flex flex-wrap gap-x-6 gap-y-4 items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-[32px] md:text-[36px] leading-tight tracking-normal m-0">
            Laporan Akrilik
          </h1>
          <p className="text-sm text-[#566873] dark:text-[#8fa3ad] mt-1 mb-0 font-body">Pemakaian lembar harian</p>
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="flex flex-col gap-1.5">
            <span className="field-label">Tanggal</span>
            <input
              type="date"
              className="field w-[11.5rem] max-w-full"
              value={state.date}
              onChange={e => handleDateChange(e.target.value)}
            />
          </label>
          <button
            type="button"
            role="status"
            className={`status-pill cursor-default ${
              saveStatus === 'error'
                ? 'text-[#a8500b] dark:text-[#e8a04f] border-[#a8500b] dark:border-[#e8a04f] bg-[#fef3e8] dark:bg-[#3d2508] cursor-pointer'
                : 'text-[#566873] dark:text-[#8fa3ad] border-[#c7d3d9] dark:border-[#26343c] bg-white dark:bg-[#0e161b]'
            }`}
            onClick={() => saveStatus === 'error' && retrySave(state, reports)}
          >
            <span className={`w-2 h-2 rounded-full flex-none ${statusColors[saveStatus]}`} />
            {STATUS_TEXT[saveStatus]}
          </button>
        </div>
      </header>

      {/* main grid */}
      <div className="grid gap-5 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] items-start">
        {/* left: edit column */}
        <section className="grid gap-4" aria-labelledby="h-items">
          <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-2">
            <h2 className="section-title" id="h-items">Bahan terpakai</h2>
            {state.items.length > 0 && (
              <span className="text-sm text-[#566873] dark:text-[#8fa3ad] font-body whitespace-nowrap">
                {state.items.length} bahan · {utuh} utuh · {pot} potongan
              </span>
            )}
          </div>

          <div className="grid gap-3">
            {state.items.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-3 text-[#0b7e88] dark:text-[#4ccbd3]" aria-hidden="true">
                  <rect x="10" y="5" width="28" height="38" rx="3" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M22 11v26M26 11v26" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
                  <path d="M15 20h4M15 28h4M29 20h4M29 28h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                </svg>
                <strong className="block text-[#12202a] dark:text-[#e4eef1] font-body text-base mb-1.5">
                  Belum ada bahan
                </strong>
                <p className="text-[#566873] dark:text-[#8fa3ad] text-sm m-0">
                  Ketuk &ldquo;Tambah bahan&rdquo; untuk mulai laporan tanggal ini.
                </p>
              </div>
            ) : (
              state.items.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  colorOptions={colorOptions}
                  onChange={updated => handleItemChange(item.id, updated)}
                  onDuplicate={() => handleDuplicate(item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button className="btn-primary" type="button" onClick={handleAddItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Tambah bahan
            </button>
            <button className="btn-secondary" type="button" onClick={handleNewReport}>
              Laporan baru
            </button>
          </div>
        </section>

        {/* right: output column (sticky on desktop) */}
        <aside className="grid gap-4 md:sticky md:top-4">
          <OutputPanel text={reportText} onCopy={handleCopy} />
          <HistoryPanel
            reports={reports}
            currentDate={state.date}
            onOpen={handleOpenReport}
            onDelete={handleDeleteReport}
          />
        </aside>
      </div>

      {/* bottom bar (phone only) */}
      <div
        className="fixed left-0 right-0 bottom-0 md:hidden border-t border-[#c7d3d9] dark:border-[#26343c] bg-[#e8eef0] dark:bg-[#0c1317]"
        style={{
          paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(16px, env(safe-area-inset-right, 0px))',
          paddingTop: '12px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <button className="btn-primary w-full h-[52px] text-base" type="button" onClick={handleCopy}>
          Salin laporan
        </button>
      </div>

      <Toast key={toastKey} message={toastMsg} />
    </div>
  )
}