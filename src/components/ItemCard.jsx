import { useState, useRef } from 'react'
import { complete, swatchBg, LEBAR_OPTIONS, PANJANG_OPTIONS } from '../utils'
import Glyph from './Glyph'

export default function ItemCard({ item, colorOptions = [], onChange, onDuplicate, onDelete }) {
  const [armDel, setArmDel] = useState(false)
  const [wantCustom, setWantCustom] = useState(false)
  const armTimerRef = useRef(null)

  function handleField(field, value) {
    onChange({ ...item, [field]: value })
  }

  function handleMode(v) {
    onChange({ ...item, mode: v })
  }

  function handleColorChange(v) {
    if (v === '__custom__') {
      setWantCustom(true)
      return
    }
    setWantCustom(false)
    handleField('warna', v)
  }

  function handleDelete() {
    if (!armDel) {
      setArmDel(true)
      clearTimeout(armTimerRef.current)
      armTimerRef.current = setTimeout(() => setArmDel(false), 2500)
    } else {
      onDelete()
    }
  }

  const done = complete(item)
  const lembar = item.mode === 'lembar'
  const isCustom = wantCustom || (!!item.warna && !colorOptions.includes(item.warna))
  const lebarOpts = LEBAR_OPTIONS.includes(item.a) ? LEBAR_OPTIONS : [item.a, ...LEBAR_OPTIONS].filter(Boolean)
  const panjangOpts = PANJANG_OPTIONS.includes(item.b) ? PANJANG_OPTIONS : [item.b, ...PANJANG_OPTIONS].filter(Boolean)

  return (
    <article className="card grid gap-4">
      {/* top row: color + actions */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className="flex-none w-7 h-7 rounded-full border border-[#c7d3d9] dark:border-[#26343c] shrink-0"
          style={{ background: swatchBg(item.warna) }}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0 grid gap-2">
          <select
            className="field font-body font-medium"
            aria-label="Warna akrilik"
            value={isCustom ? '__custom__' : (item.warna || '')}
            onChange={e => handleColorChange(e.target.value)}
          >
            <option value="">Pilih warna…</option>
            {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="__custom__">Lainnya…</option>
          </select>
          {isCustom && (
            <input
              className="field"
              placeholder="Ketik warna khusus"
              aria-label="Warna akrilik khusus"
              value={item.warna}
              onChange={e => handleField('warna', e.target.value)}
              autoFocus
            />
          )}
        </div>
        <div className="flex-none flex items-center gap-1.5">
          <button
            className="btn-icon text-[#566873] dark:text-[#8fa3ad] hover:text-[#0b7e88] dark:hover:text-[#4ccbd3] hover:bg-[#e8eef0] dark:hover:bg-[#0c1317]"
            onClick={onDuplicate}
            type="button"
            aria-label="Gandakan bahan ini"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <button
            className={`btn-icon transition-all duration-150 ${
              armDel
                ? 'btn-destructive armed'
                : 'text-[#566873] dark:text-[#8fa3ad] hover:text-[#c53030] dark:hover:text-[#fc8181] hover:bg-[#fef3e8] dark:hover:bg-[#3d1a1a]'
            }`}
            onClick={handleDelete}
            type="button"
            aria-label={armDel ? 'Konfirmasi hapus' : 'Hapus bahan ini'}
          >
            {armDel ? (
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
        </div>
      </div>

      {!done && (
        <span className="badge-incomplete w-fit -mt-2">Belum lengkap</span>
      )}

      {/* fields grid */}
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5">
          <span className="field-label">Tebal <span className="font-body font-normal text-[#8da0aa] dark:text-[#4b5f6a]">(mm)</span></span>
          <input
            className="field"
            inputMode="decimal"
            value={item.tebal}
            onChange={e => handleField('tebal', e.target.value)}
            placeholder="3"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="field-label">Lebar lembar <span className="font-body font-normal text-[#8da0aa] dark:text-[#4b5f6a]">(mm)</span></span>
          <select
            className="field"
            aria-label="Lebar lembar"
            value={item.a}
            onChange={e => handleField('a', e.target.value)}
          >
            {lebarOpts.map(v => <option key={v} value={v}>{v} mm</option>)}
          </select>
        </label>
        <label className="col-span-2 grid gap-1.5">
          <span className="field-label">Panjang lembar <span className="font-body font-normal text-[#8da0aa] dark:text-[#4b5f6a]">(mm)</span></span>
          <select
            className="field"
            aria-label="Panjang lembar"
            value={item.b}
            onChange={e => handleField('b', e.target.value)}
          >
            {panjangOpts.map(v => <option key={v} value={v}>{v} mm</option>)}
          </select>
        </label>
      </div>

      {/* mode toggle + result row */}
      <div className="grid gap-3 pt-2 border-t border-dashed border-[#c7d3d9] dark:border-[#26343c]">
        {/* mode toggle */}
        <div className="inline-flex border border-[#c7d3d9] dark:border-[#26343c] rounded-lg overflow-hidden bg-white dark:bg-[#0e161b]" role="group" aria-label="Jenis hasil">
          {['lembar', 'potongan'].map(v => (
            <button
              key={v}
              type="button"
              aria-pressed={item.mode === v}
              onClick={() => handleMode(v)}
              className={`px-4 h-[44px] text-sm font-medium transition-all duration-150 border-0 cursor-pointer ${
                item.mode === v
                  ? 'bg-[#0b7e88] dark:bg-[#4ccbd3] text-white dark:text-[#05181a] shadow-sm'
                  : 'text-[#566873] dark:text-[#8fa3ad] hover:text-[#12202a] dark:hover:text-[#e4eef1] hover:bg-[#e8eef0] dark:hover:bg-[#0c1317]'
              } ${v === 'potongan' ? 'border-l border-[#c7d3d9] dark:border-[#26343c]' : ''}`}
            >
              {v === 'lembar' ? 'Lembar utuh' : 'Potongan'}
            </button>
          ))}
        </div>

        {/* result inputs + glyph */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {lembar ? (
              <>
                <input
                  className="field max-w-[100px]"
                  inputMode="decimal"
                  aria-label="Jumlah lembar"
                  placeholder="0"
                  value={item.lembar}
                  onChange={e => handleField('lembar', e.target.value)}
                />
                <span className="text-[#566873] dark:text-[#8fa3ad] flex-none font-medium text-sm">lembar</span>
              </>
            ) : (
              <>
                <input
                  className="field max-w-[100px]"
                  inputMode="decimal"
                  aria-label="Panjang potongan"
                  placeholder="panjang"
                  value={item.pl}
                  onChange={e => handleField('pl', e.target.value)}
                />
                <span className="text-[#566873] dark:text-[#8fa3ad] flex-none font-medium text-sm">mm</span>
              </>
            )}
          </div>
          <div className="flex items-center self-center">
            <Glyph it={item} />
          </div>
        </div>
      </div>
    </article>
  )
}