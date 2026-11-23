import { useEffect, useRef } from 'react'
import { useFx, fontsReady } from '../lib/fx.jsx'

// Draws the name (and optional photo) as live character art on a canvas.
// Characters near the cursor scatter, brighten and flip; clicks/taps send a ripple through it.
const RAMP = ' .:-=+*#%@'
const GLYPHS = '01$%#*+=<>/\\|{}[]~^'
const COLORS = ['#2c2240', '#3f2f63', '#5a43a0', '#7a5ee0', '#9b7bff', '#b9a3ff', '#d8ccff', '#f6f1ff']
const LIGHT_COLORS = ['#ddd5ef', '#c4b6e6', '#a690dc', '#8a6ad6', '#6a3fd6', '#5530b0', '#3f1f8a', '#2a1260']

export default function AsciiHero({ lines, photo }) {
  const { effects, light } = useFx()
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const paletteRef = useRef(light ? LIGHT_COLORS : COLORS)
  const redrawRef = useRef(() => {})

  // swap colours live (no rebuild) when the theme changes
  useEffect(() => {
    paletteRef.current = light ? LIGHT_COLORS : COLORS
    redrawRef.current()
  }, [light])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let cells = []
    let cols, rows, cw, chH, W, H, fs
    let raf = 0
    let visible = true
    let disposed = false
    let start = 0
    const pointer = { x: -9999, y: -9999 }
    const ripples = []
    const buckets = COLORS.map(() => [])

    const loadImage = (src) =>
      new Promise((res) => {
        if (!src) return res(null)
        const img = new Image()
        img.onload = () => res(img)
        img.onerror = () => res(null)
        img.src = src
      })

    async function build() {
      await fontsReady()
      const img = await loadImage(photo)
      if (disposed) return
      W = wrap.clientWidth
      const mobile = W < 640
      fs = mobile ? 6 : 8.5
      ctx.font = `500 ${fs}px "JetBrains Mono Variable", monospace`
      cw = ctx.measureText('M').width
      chH = Math.round(fs * 1.15)
      const textLines = mobile ? lines : [lines.join(' ')]
      const showPhoto = img && !mobile
      const textW = showPhoto ? W * 0.62 : W

      // size the name to fill the width, then size the canvas around it
      const m = document.createElement('canvas').getContext('2d')
      let size = 200
      m.font = `800 ${size}px "Newsreader Variable", Georgia, serif`
      const widest = Math.max(...textLines.map((l) => m.measureText(l).width))
      size = (size * textW * 0.97) / widest
      const lh = size * 0.86
      const blockH = lh * textLines.length
      H = Math.round(blockH + chH * (mobile ? 4 : 6))
      if (showPhoto) H = Math.max(H, Math.round(W * 0.3))
      cols = Math.floor(W / cw)
      rows = Math.floor(H / chH)

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // --- paint the source image offscreen ---
      const off = document.createElement('canvas')
      off.width = W; off.height = H
      const o = off.getContext('2d', { willReadFrequently: true })
      o.font = `800 ${size}px "Newsreader Variable", Georgia, serif`
      o.textBaseline = 'alphabetic'
      o.fillStyle = '#fff'
      textLines.forEach((l, i) => {
        o.fillText(l, showPhoto ? 0 : (W - o.measureText(l).width) / 2, (H - blockH) / 2 + lh * (i + 0.86))
      })
      // shade top-to-bottom for depth
      o.globalCompositeOperation = 'source-atop'
      const g = o.createLinearGradient(0, 0, W, H)
      g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#8a8a8a')
      o.fillStyle = g; o.fillRect(0, 0, W, H)
      o.globalCompositeOperation = 'source-over'
      if (showPhoto) {
        const bw = W * 0.36, bh = H
        const s = Math.max(bw / img.width, bh / img.height)
        const iw = img.width * s, ih = img.height * s
        o.save()
        o.beginPath(); o.rect(W - bw, 0, bw, bh); o.clip()
        o.filter = 'grayscale(1) contrast(1.35) brightness(1.05)'
        o.drawImage(img, W - bw + (bw - iw) / 2, (bh - ih) / 2, iw, ih)
        o.restore()
      }
      const data = o.getImageData(0, 0, W, H).data
      const lum = (x, y) => {
        const i = (Math.min(H - 1, Math.max(0, Math.round(y))) * W + Math.min(W - 1, Math.max(0, Math.round(x)))) * 4
        return ((data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255) * (data[i + 3] / 255)
      }

      // --- build the character grid ---
      cells = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cw, y = r * chH
          const b = (lum(x + cw * 0.5, y + chH * 0.5) * 2 + lum(x + cw * 0.2, y + chH * 0.25) + lum(x + cw * 0.8, y + chH * 0.75)) / 4
          if (b > 0.06) {
            cells.push(cell(c, r, x, y, b, RAMP[Math.min(RAMP.length - 1, Math.round(b * (RAMP.length - 1)))]))
          } else if (Math.random() < 0.03) {
            cells.push(cell(c, r, x, y, 0.1, Math.random() < 0.5 ? '.' : '·', true))
          }
        }
      }
      start = performance.now()
      redrawRef.current = effects ? () => {} : drawStatic
      if (effects) loop(start)
      else drawStatic()
    }

    const cell = (c, r, x, y, b, ch, dust = false) => ({
      c, r, x, y, cx: x + cw / 2, cy: y + chH / 2, b, ch, dust,
      dx: 0, dy: 0, flip: 0, alt: ch,
      born: (c / cols) * 900 + Math.random() * 260,
    })

    const drawStatic = () => {
      if (!cells.length) return
      const palette = paletteRef.current
      ctx.clearRect(0, 0, W, H)
      ctx.font = `500 ${fs}px "JetBrains Mono Variable", monospace`
      ctx.textBaseline = 'top'
      for (const k of cells) {
        ctx.fillStyle = palette[Math.min(palette.length - 1, Math.floor(k.b * palette.length))]
        ctx.fillText(k.ch, k.x, k.y)
      }
    }

    const R = 110, R2 = R * R
    const loop = (t) => {
      if (disposed) return
      raf = requestAnimationFrame(loop)
      if (!visible) return
      const rect = canvas.getBoundingClientRect()
      const px = pointer.x - rect.left, py = pointer.y - rect.top
      const age = t - start
      const palette = paletteRef.current
      for (const b of buckets) b.length = 0
      // expire ripples
      for (let i = ripples.length - 1; i >= 0; i--) if (t - ripples[i].t0 > 1500) ripples.splice(i, 1)

      for (const k of cells) {
        if (age < k.born) continue
        let tx = 0, ty = 0, boost = 0
        const fresh = age - k.born < 160
        const dx = k.cx - px, dy = k.cy - py
        const d2 = dx * dx + dy * dy
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1
          const f = 1 - d / R
          const push = f * f * 26
          tx += (dx / d) * push; ty += (dy / d) * push
          boost += f * 0.9
          if (Math.random() < f * 0.18) { k.flip = 5 + (Math.random() * 10) | 0; k.alt = GLYPHS[(Math.random() * GLYPHS.length) | 0] }
        }
        for (const rp of ripples) {
          const rdx = k.cx - rp.x, rdy = k.cy - rp.y
          const rd = Math.sqrt(rdx * rdx + rdy * rdy) || 1
          const radius = (t - rp.t0) * 0.6
          const diff = Math.abs(rd - radius)
          if (diff < 30) {
            const kk = (1 - diff / 30) * Math.max(0, 1 - radius / 900)
            tx += (rdx / rd) * kk * 16; ty += (rdy / rd) * kk * 16
            boost += kk
            if (Math.random() < kk * 0.4) { k.flip = 6; k.alt = GLYPHS[(Math.random() * GLYPHS.length) | 0] }
          }
        }
        if (!k.dust && Math.random() < 0.0007) { k.flip = 8; k.alt = GLYPHS[(Math.random() * GLYPHS.length) | 0] }
        k.dx += (tx - k.dx) * 0.2
        k.dy += (ty - k.dy) * 0.2
        let br = Math.min(1, k.b + boost)
        let ch = k.ch
        if (fresh) { ch = GLYPHS[(Math.random() * GLYPHS.length) | 0]; br = 1 }
        else if (k.flip > 0) { k.flip--; ch = k.alt; br = Math.min(1, br + 0.25) }
        const bi = Math.min(palette.length - 1, Math.floor(br * palette.length))
        buckets[bi].push(k, ch)
      }

      ctx.clearRect(0, 0, W, H)
      ctx.font = `500 ${fs}px "JetBrains Mono Variable", monospace`
      ctx.textBaseline = 'top'
      for (let b = 0; b < buckets.length; b++) {
        const arr = buckets[b]
        if (!arr.length) continue
        ctx.fillStyle = palette[b]
        for (let i = 0; i < arr.length; i += 2) {
          const k = arr[i]
          ctx.fillText(arr[i + 1], k.x + k.dx, k.y + k.dy)
        }
      }
    }

    const onMove = (e) => { pointer.x = e.clientX; pointer.y = e.clientY }
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999 }
    const onDown = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left, y = e.clientY - rect.top
      if (x < -200 || y < -200 || x > rect.width + 200 || y > rect.height + 200) return
      ripples.push({ x, y, t0: performance.now() })
      if (ripples.length > 4) ripples.shift()
    }

    let io, ro
    if (effects) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerdown', onDown, { passive: true })
      document.addEventListener('mouseleave', onLeave)
      io = new IntersectionObserver(([en]) => { visible = en.isIntersecting })
      io.observe(canvas)
    }
    const onVis = () => { visible = !document.hidden }
    document.addEventListener('visibilitychange', onVis)
    let lastW = 0
    ro = new ResizeObserver(() => {
      const w = wrap.clientWidth
      if (Math.abs(w - lastW) < 8) return
      lastW = w
      cancelAnimationFrame(raf)
      build()
    })
    ro.observe(wrap)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io?.disconnect(); ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [effects, photo, lines])

  return (
    <div className="ascii-wrap" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
