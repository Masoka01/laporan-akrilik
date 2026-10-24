import { useState } from 'react'
import { dateShort } from '../utils'

export default function HistoryPanel({ reports, currentDate, onOpen, onDelete }) {
  const [armMap, setArmMap] = useState({})

  const keys = Object.keys(reports).sort().reverse()

  function handleDeleteClick(k) {
    if (!armMap[k]) {
      setArmMap(p => ({ ...p, [k]: true }))
      setTimeout(() => setArmMap(p => ({ ...p, [k]: false })), 2500)
    } else {
      onDelete(k)
    }
  }

  return (
    <section className="card grid gap-3" aria-labelledby="h-hist">
      <h2 className="section-title" id="h-hist">Riwayat</h2>
      {keys.length ? (
        <ul className="list-none m-0 p-0 grid gap-1.5">
          {keys.map(k => {
            const n = (reports[k].items || []).length
            const isCurrent = k === currentDate
            return (
              <li
                key={k}
                className={`flex items-center gap-2 rounded-lg ${isCurrent ? 'bg-[#e8eef0] dark:bg-[#0c1317]' : ''}`}
                aria-current={isCurrent || undefined}
              >
                <button
                  className="flex-1 min-w-0 flex justify-between gap-3 text-left bg-transparent border-0 p-3 min-h-[48px] cursor-pointer rounded-lg hover:bg-[#e8eef0] dark:hover:bg-[#0c1317] transition-colors"
                  type="button"
                  onClick={() => onOpen(k)}
                >
                  <span className="font-medium tabular-nums">{dateShort(k)}</span>
                  <span className="text-[#566873] dark:text-[#8fa3ad] text-sm whitespace-nowrap">{n} bahan</span>
                </button>
                <button
                  className={`btn-icon transition-all duration-150 ${
                    armMap[k]
                      ? 'btn-destructive armed'
                      : 'text-[#566873] dark:text-[#8fa3ad] hover:text-[#c53030] dark:hover:text-[#fc8181] hover:bg-[#fef3e8] dark:hover:bg-[#3d1a1a]'
                  }`}
                  type="button"
                  onClick={() => handleDeleteClick(k)}
                  aria-label={armMap[k] ? 'Konfirmasi hapus laporan' : `Hapus laporan ${dateShort(k)}`}
                >
                  {armMap[k] ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-[#566873] dark:text-[#8fa3ad] text-sm m-0 py-2">
          Belum ada laporan tersimpan. Laporan masuk ke sini otomatis setelah diisi.
        </p>
      )}
    </section>
  )
}