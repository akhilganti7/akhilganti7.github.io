import { useEffect, useRef, useState } from 'react'
import { useFx, fontsReady } from '../lib/fx.jsx'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmt = (d) => { const [y, m] = d.split('-').map(Number); return `${MONTHS[m - 1]} ${y}` }
const toM = (d) => { const [y, m] = d.split('-').map(Number); return y * 12 + m }

function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647) }

// Track record drawn as a character-cell "price chart". Each milestone is a new high.
export default function TrackChart({ milestones }) {
  const { effects, light } = useFx()
  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  const [active, setActive] = useState(milestones.length - 1)
  const activeRef = useRef(active)
  const [dots, setDots] = useState([])
  const [years, setYears] = useState([])
  const redrawRef = useRef(() => {})

  useEffect(() => { activeRef.current = active; redrawRef.current() }, [active])
  const DARK_C = { line: '#9b7bff', head: '#f6f1ff', area: '#2f2545', ms: '#f6f1ff', guide: '#6d5aa8', near: '#d8ccff' }
  const LIGHT_C = { line: '#6a3fd6', head: '#2a1260', area: '#d6cdea', ms: '#2a1260', guide: '#a690dc', near: '#3f1f8a' }
  const colorsRef = useRef(light ? LIGHT_C : DARK_C)
  useEffect(() => { colorsRef.current = light ? LIGHT_C : DARK_C; redrawRef.current() }, [light]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const box = boxRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, cols, rows, cw, chH, fs, colRow = [], msCol = [], progress = effects ? 0 : 1
    let raf = 0, disposed = false, started = false
    const pointer = { x: -9999, y: -9999 }

    async function build() {
      await fontsReady()
      if (disposed) return
      W = box.clientWidth
      const mobile = W < 640
      fs = mobile ? 10 : 13
      ctx.font = `500 ${fs}px "JetBrains Mono Variable", monospace`
      cw = ctx.measureText('M').width
      chH = Math.round(fs * 1.25)
      rows = mobile ? 12 : 16
      H = rows * chH
      cols = Math.floor(W / cw)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // milestone columns: half even spacing, half real time
      const n = milestones.length
      const t0 = toM(milestones[0].date), t1 = toM(milestones[n - 1].date)
      const pad = 3
      msCol = milestones.map((m, i) => {
        const even = n > 1 ? i / (n - 1) : 0.5
        const time = (toM(m.date) - t0) / Math.max(1, t1 - t0)
        return Math.round(pad + (0.55 * even + 0.45 * time) * (cols - pad * 2 - 4))
      })
      // value per column: random walk that hits a new high at each milestone
      const rand = rng(281)
      const val = new Array(cols).fill(0)
      let prevC = 0, prevV = 0.25
      msCol.forEach((c, i) => {
        const v = i + 1
        for (let x = prevC; x <= c; x++) {
          const f = (x - prevC) / Math.max(1, c - prevC)
          const wob = (rand() - 0.6) * 0.32 * Math.sin(Math.PI * f)
          val[x] = Math.min(prevV + (v - prevV) * f + wob, v)
        }
        val[c] = v
        prevC = c; prevV = v
      })
      for (let x = prevC + 1; x < cols; x++) val[x] = n - 0.15 + (rand() - 0.45) * 0.35
      const maxV = n + 0.4
      colRow = val.map((v) => Math.max(1, Math.min(rows - 1, Math.round(rows - 1 - (v / maxV) * (rows - 2)))))

      setDots(msCol.map((c, i) => ({ x: c * cw + cw / 2, y: colRow[c] * chH + chH / 2, i })))
      const seen = new Set()
      setYears(milestones.map((m, i) => {
        const y = m.date.slice(0, 4)
        if (seen.has(y)) return null
        seen.add(y)
        return { y, x: msCol[i] * cw + cw / 2 }
      }).filter(Boolean))
      draw()
    }

    function draw() {
      if (!cols) return
      const C = colorsRef.current
      ctx.clearRect(0, 0, W, H)
      ctx.font = `500 ${fs}px "JetBrains Mono Variable", monospace`
      ctx.textBaseline = 'top'
      const rect = canvas.getBoundingClientRect()
      const px = pointer.x - rect.left, py = pointer.y - rect.top
      const upto = Math.floor(progress * (cols - 1))
      const act = activeRef.current
      const actCol = msCol[act]
      // guide under active milestone
      if (progress >= 1 && actCol !== undefined) {
        ctx.fillStyle = C.guide
        for (let r = colRow[actCol] + 1; r < rows; r++) ctx.fillText('┊', actCol * cw, r * chH)
      }
      for (let c = 0; c <= upto; c++) {
        const r = colRow[c]
        const x = c * cw
        // area under the line
        ctx.fillStyle = C.area
        for (let rr = r + 1; rr < rows; rr += 1) {
          if (c === actCol && progress >= 1) continue
          if ((rr + c) % 2 === 0) ctx.fillText(rr - r < 3 ? ':' : '.', x, rr * chH)
        }
        // the line itself
        const pr = c > 0 ? colRow[c - 1] : r
        let ch = '─'
        if (r < pr) ch = '╱'
        else if (r > pr) ch = '╲'
        const near = Math.hypot(x + cw / 2 - px, r * chH + chH / 2 - py) < 70
        ctx.fillStyle = near ? C.near : C.line
        ctx.fillText(ch, x, r * chH)
        // vertical fill for steep jumps
        if (Math.abs(r - pr) > 1) {
          const a = Math.min(r, pr) + 1, b = Math.max(r, pr)
          for (let rr = a; rr < b; rr++) ctx.fillText('│', x, rr * chH)
        }
      }
      // milestone markers
      msCol.forEach((c, i) => {
        if (c > upto) return
        ctx.fillStyle = i === act ? C.ms : C.line
        ctx.fillText(i === act ? '◆' : '◇', c * cw, colRow[c] * chH)
      })
      // drawing head
      if (progress < 1) {
        ctx.fillStyle = C.head
        ctx.fillText('█', upto * cw, colRow[upto] * chH)
      }
    }
    redrawRef.current = draw

    let t0 = 0
    const animate = (t) => {
      if (disposed) return
      if (!t0) t0 = t
      progress = Math.min(1, (t - t0) / 1800)
      draw()
      if (progress < 1) raf = requestAnimationFrame(animate)
    }

    const onMove = (e) => {
      pointer.x = e.clientX; pointer.y = e.clientY
      if (progress >= 1) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }
    }

    let io
    if (effects) {
      io = new IntersectionObserver(([en]) => {
        if (en.isIntersecting && !started) { started = true; raf = requestAnimationFrame(animate) }
      }, { threshold: 0.35 })
      io.observe(canvas)
      window.addEventListener('pointermove', onMove, { passive: true })
    }
    let lastW = 0
    const ro = new ResizeObserver(() => {
      const w = box.clientWidth
      if (Math.abs(w - lastW) < 8) return
      lastW = w
      build()
    })
    ro.observe(box)
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io?.disconnect(); ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [effects, milestones])

  const m = milestones[active]
  return (
    <div>
      <div className="readout" aria-live="polite">
        <div className="d">{fmt(m.date)}</div>
        <div className="t">{m.label}</div>
      </div>
      <div className="chart-box" ref={boxRef}>
        <canvas ref={canvasRef} aria-hidden="true" />
        {dots.map((d) => (
          <button
            key={d.i}
            className="ms-dot"
            style={{ left: d.x, top: d.y }}
            aria-label={`${fmt(milestones[d.i].date)}: ${milestones[d.i].label}`}
            data-cursor={fmt(milestones[d.i].date)}
            onMouseEnter={() => setActive(d.i)}
            onFocus={() => setActive(d.i)}
            onClick={() => setActive(d.i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault()
                const next = Math.max(0, Math.min(milestones.length - 1, d.i + (e.key === 'ArrowRight' ? 1 : -1)))
                boxRef.current.querySelectorAll('.ms-dot')[next]?.focus()
              }
            }}
          />
        ))}
      </div>
      <div className="chart-axis" aria-hidden="true">
        {years.map((y) => <span key={y.y} style={{ left: y.x }}>{y.y}</span>)}
      </div>
    </div>
  )
}
