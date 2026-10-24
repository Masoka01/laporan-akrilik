import { num } from '../utils'

export default function Glyph({ it, className = '', style = {} }) {
  const a = num(it.a) || 1220
  const b = num(it.b) || 2440
  const W = 30
  const H = Math.min(72, Math.max(30, W * b / a))

  let cut = null
  if (it.mode === 'lembar') {
    cut = <rect className="fill-[#0b7e88] dark:fill-[#4ccbd3] opacity-30" x={0} y={0} width={W} height={H} />
  } else {
    const h = Math.min(H, Math.max(0, H * (num(it.pl) || 0) / b))
    if (h) cut = <rect className="fill-[#0b7e88] dark:fill-[#4ccbd3]" x={0} y={0} width={W} height={h} />
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-label="Perbandingan panjang potongan terhadap lembar"
      className={className}
      style={style}
    >
      {cut}
      <rect
        className="fill-none stroke-[#8da0aa] dark:stroke-[#4b5f6a]"
        strokeWidth={1}
        x={0.5} y={0.5}
        width={W - 1}
        height={H - 1}
      />
    </svg>
  )
}