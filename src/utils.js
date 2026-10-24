export const MONTHS = ['JANUARI','FEBRUARI','MARET','APRIL','MEI','JUNI','JULI','AGUSTUS','SEPTEMBER','OKTOBER','NOVEMBER','DESEMBER']
export const SHORT  = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
export const COLORS = ['Bening','Hitam','Putih Susu','Putih Solid','Merah','Biru','Hijau','Kuning','Orange','Ungu','Pink','Coklat','Abu-abu','Smoke','Emas','Silver','Tosca']
export const LEBAR_OPTIONS = ['1000', '1220']
export const PANJANG_OPTIONS = ['2440', '2000']

export function uid() { return Math.random().toString(36).slice(2, 9) }
export function clone(o) { return JSON.parse(JSON.stringify(o)) }
function pad(n) { return (n < 10 ? '0' : '') + n }

export function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}

export function t(v) { return String(v == null ? '' : v).trim() }
export function num(v) { const n = parseFloat(String(v).replace(',','.')); return isFinite(n) && n > 0 ? n : null }

export function parts(d) { const p = d.split('-'); return { y: +p[0], m: +p[1], d: +p[2] } }
export function dateLabel(d) { const p = parts(d); return `${p.d} ${MONTHS[p.m-1]} ${p.y}` }
export function dateShort(d) { const p = parts(d); return `${p.d} ${SHORT[p.m-1]} ${p.y}` }

export function blankItem(from = {}) {
  return {
    id: uid(), warna: '',
    tebal: from.tebal || '2',
    a: from.a || '1220',
    b: from.b || '2440',
    mode: from.mode || 'lembar',
    lembar: '', pl: ''
  }
}

export function blankFrom(rep, d) {
  const items = (rep?.items || []).map(i => {
    const c = clone(i)
    c.id = uid()
    c.lembar = ''
    c.pl = ''
    c.a = c.a || '1220'
    delete c.pw
    delete c.kondisi
    return c
  })
  return { date: d, items }
}

export function complete(it) {
  const base = t(it.warna) && t(it.tebal) && t(it.a) && t(it.b)
  return !!(base && (it.mode === 'lembar' ? t(it.lembar) : t(it.pl)))
}

export function buildText(date, items) {
  const head = `LAPORAN PENGGUNAAN AKRILIK ${dateLabel(date)}`
  if (!items.length) return head
  const ph = '…'

  const groups = []
  const index = {}

  for (const it of items) {
    const warna = t(it.warna)
    const tebal = t(it.tebal)
    const hasResult = it.mode === 'lembar' ? !!t(it.lembar) : !!t(it.pl)
    if (!warna && !tebal && !hasResult) continue

    const gk = `${warna.toLowerCase()}|${tebal}`
    let g = index[gk]
    if (!g) {
      g = { warna, tebal, lembar: new Map(), potongan: new Map() }
      index[gk] = g
      groups.push(g)
    }

    if (it.mode === 'lembar') {
      const key = `${t(it.a)}|${t(it.b)}`
      const entry = g.lembar.get(key) || { a: t(it.a), b: t(it.b), total: 0, valid: false }
      const n = num(it.lembar)
      if (n) { entry.total += n; entry.valid = true }
      g.lembar.set(key, entry)
    } else {
      const key = `${t(it.a)}|${t(it.pl)}`
      const entry = g.potongan.get(key) || { a: t(it.a), pl: t(it.pl), count: 0 }
      entry.count += 1
      g.potongan.set(key, entry)
    }
  }

  const lines = groups.map(g => {
    const segs = []
    for (const e of g.lembar.values()) {
      segs.push(`${e.a || ph} * ${e.b || ph} = ${e.valid ? e.total : ph} lembar`)
    }
    for (const e of g.potongan.values()) {
      let seg = `${e.a || ph} * ${e.pl || ph}`
      if (e.count > 1) seg += ` = ${e.count} potongan`
      segs.push(seg)
    }
    return `- AKRILIK ${g.warna.toUpperCase() || ph} ${g.tebal || ph} mm ${segs.join(' & ')}`
  })

  if (!lines.length) return head
  return head + '\n\n' + lines.join('\n')
}

export function swatchBg(w) {
  const k = t(w).toLowerCase()
  if (k.includes('bening')) return 'conic-gradient(#cfdde2 25%,#fff 0 50%,#cfdde2 0 75%,#fff 0) 0 0/8px 8px'
  const map = {
    'putih susu':'#f7f4ea', putih:'#f5f5f2', 'abu-abu':'#9aa4a8', abu:'#9aa4a8',
    emas:'#c9a227', silver:'#c0c6c9', tosca:'#2aa39a',
    hitam:'#14181b', hijau:'#2f9e5b', merah:'#d23b3b',
    biru:'#2f6fd1', kuning:'#e8c21f', orange:'#e8812a', oranye:'#e8812a',
    smoke:'#6b7378', asap:'#6b7378', coklat:'#7a5230', pink:'#e86fa0', ungu:'#7a4fc4'
  }
  for (const name in map) { if (k.includes(name)) return map[name] }
  return 'repeating-linear-gradient(45deg,#9fb0b8 0 3px,#c7d3d9 3px 6px)'
}

const LS_KEY = 'akrilik.v2'
const LEGACY_LS_KEY = 'akrilik.v1'

function cmToMm(v) {
  const n = parseFloat(String(v).replace(',', '.'))
  if (!isFinite(n) || n <= 0 || n > 500) return v
  return String(n * 10)
}

function migrateReport(rep) {
  const source = rep && typeof rep === 'object' ? rep : {}
  const rawItems = Array.isArray(source.items) ? source.items : []
  const items = rawItems.map(it => {
    const c = { ...it }
    c.a = '1220'
    c.b = cmToMm(c.b)
    if (c.pl !== undefined) c.pl = cmToMm(c.pl)
    if (c.pw !== undefined) c.pw = cmToMm(c.pw)
    delete c.kondisi
    delete c.pw
    return c
  })
  return { ...source, items }
}

export function loadLocal() {
  let raw = null
  try { raw = localStorage.getItem(LS_KEY) } catch { return {} }
  if (raw != null) {
    try { return JSON.parse(raw) || {} } catch { return {} }
  }

  let legacy = null
  try { legacy = localStorage.getItem(LEGACY_LS_KEY) } catch { return {} }
  if (!legacy) return {}

  let data = null
  try { data = JSON.parse(legacy) } catch { return {} }
  if (!data || typeof data !== 'object') return {}

  const migrated = {}
  for (const key in data) {
    const rep = data[key]
    if (rep && typeof rep === 'object') migrated[key] = migrateReport(rep)
  }
  persistLocal(migrated)
  return migrated
}

export function persistLocal(reports) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(reports)) } catch { /* ignore storage errors */ }
}
