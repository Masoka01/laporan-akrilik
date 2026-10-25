export default function OutputPanel({ text, onCopy }) {
  return (
    <section className="card grid gap-3" aria-labelledby="h-out">
      <h2 className="section-title" id="h-out">Teks laporan</h2>
      <pre
        id="out"
        className="m-0 p-3 bg-white dark:bg-[#0e161b] border border-[#c7d3d9] dark:border-[#26343c] rounded-lg font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words select-all"
      >{text}</pre>
      <button className="btn-primary hidden md:inline-flex" onClick={onCopy} type="button">
        Salin laporan
      </button>
    </section>
  )
}