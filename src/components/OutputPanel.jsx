import { useState } from 'react'

export default function OutputPanel({ text, onCopy }) {
  const [open, setOpen] = useState(false)

  return (
    <section className="card grid gap-3" aria-labelledby="h-out">
      <h2 className="m-0">
        <button
          type="button"
          className="w-full flex items-center justify-between gap-2 bg-transparent border-0 p-0 min-h-[36px] text-left cursor-pointer md:cursor-default"
          aria-expanded={open}
          aria-controls="out"
          onClick={() => setOpen(o => !o)}
        >
          <span className="section-title" id="h-out">Teks laporan</span>
          <svg
            className={`md:hidden h-5 w-5 shrink-0 text-[#566873] dark:text-[#8fa3ad] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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
      </h2>
      <div className={`${open ? 'block' : 'hidden'} md:block`}>
        <pre
          id="out"
          className="m-0 p-3 bg-white dark:bg-[#0e161b] border border-[#c7d3d9] dark:border-[#26343c] rounded-lg font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words select-all"
        >{text}</pre>
        <button className="btn-primary hidden md:inline-flex mt-3 w-full" onClick={onCopy} type="button">
          Salin laporan
        </button>
      </div>
    </section>
  )
}
