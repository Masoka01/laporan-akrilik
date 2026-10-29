import { num } from "../utils";

export default function Glyph({ it, style = {} }) {
  const a = num(it.a) || 1220;
  const b = num(it.b) || 2440;
  const W = 28;
  const H = Math.min(68, Math.max(28, (W * b) / a));

  let fill = null;
  if (it.mode === "lembar") {
    fill = (
      <rect
        x={0}
        y={0}
        width={W}
        height={H}
        style={{ fill: "var(--accent)", opacity: 0.22 }}
      />
    );
  } else {
    const h = Math.min(H, Math.max(0, (H * (num(it.pl) || 0)) / b));
    if (h)
      fill = (
        <rect
          x={0}
          y={0}
          width={W}
          height={h}
          style={{ fill: "var(--accent)", opacity: 0.7 }}
        />
      );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-label="Perbandingan panjang potongan terhadap lembar"
      style={style}
    >
      {fill}
      <rect
        x={0.5}
        y={0.5}
        width={W - 1}
        height={H - 1}
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth={1}
      />
    </svg>
  );
}
