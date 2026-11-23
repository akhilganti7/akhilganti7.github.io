import { useEffect, useRef } from 'react'
import { useFx } from '../lib/fx.jsx'
import { TICKERS } from '../data.js'

// Glowing terminal caret that follows the mouse.
// - grows into a [ label ] over anything with data-cursor="..."
// - pulls elements with data-magnetic toward it
// - leaves a faint ticker trail when moving fast
// Desktop only. Off in recruiter mode and for reduced motion.
export default function Cursor() {
  const { effects, finePointer } = useFx()
  const on = effects && finePointer
  const curRef = useRef(null)

  useEffect(() => {
    if (!on) return
    const root = document.documentElement
    root.classList.add('has-cursor')
    const cur = curRef.current
    const mouse = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    let last = { x: 0, y: 0, t: 0 }
    let lastMove = performance.now()
    let lastTrail = 0
    let label = ''
    let hidden = true
    let raf
    const trails = new Set()
    let magnets = []
    const refreshMagnets = () => { magnets = [...document.querySelectorAll('[data-magnetic]')] }
    refreshMagnets()
    const mo = new MutationObserver(refreshMagnets)
    mo.observe(document.body, { childList: true, subtree: true })

    const setLabel = (txt) => {
      if (txt === label) return
      label = txt
      cur.textContent = txt
      cur.classList.toggle('label', !!txt)
    }

    const onMove = (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY
      lastMove = performance.now()
      if (hidden) { hidden = false; cur.classList.remove('hidden'); pos.x = mouse.x; pos.y = mouse.y }
      const t = e.target
      const field = t.closest?.('input, textarea, select')
      cur.classList.toggle('hidden', !!field)
      const lab = t.closest?.('[data-cursor]')
      setLabel(lab ? lab.getAttribute('data-cursor') : '')

      // magnetic pull
      for (const el of magnets) {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2
        const dx = mouse.x - cx, dy = mouse.y - cy
        const reach = Math.max(r.width, r.height) / 2 + 40
        if (Math.abs(dx) < reach && Math.abs(dy) < reach) {
          el.style.translate = `${dx * 0.22}px ${dy * 0.3}px`
          el.style.transition = 'translate .15s ease-out'
        } else if (el.style.translate) {
          el.style.translate = ''
          el.style.transition = 'translate .4s cubic-bezier(.3,1.6,.5,1)'
        }
      }

      // ticker trail when moving fast
      const now = performance.now()
      const dt = now - last.t || 16
      const speed = Math.hypot(e.clientX - last.x, e.clientY - last.y) / dt
      last = { x: e.clientX, y: e.clientY, t: now }
      if (speed > 1.6 && now - lastTrail > 70 && trails.size < 12) {
        lastTrail = now
        spawnTrail(e.clientX, e.clientY)
      }
    }

    const spawnTrail = (x, y) => {
      const s = document.createElement('span')
      s.className = 'trail'
      s.textContent = TICKERS[Math.floor(Math.random() * TICKERS.length)]
      s.style.left = `${x + 14}px`
      s.style.top = `${y + 10}px`
      document.body.appendChild(s)
      trails.add(s)
      const drift = (Math.random() - 0.5) * 30
      const a = s.animate(
        [{ opacity: 0.9, transform: 'translate(0,0)' }, { opacity: 0, transform: `translate(${drift}px, ${18 + Math.random() * 16}px)` }],
        { duration: 900, easing: 'ease-out' }
      )
      a.onfinish = () => { s.remove(); trails.delete(s) }
    }

    const onDown = (e) => {
      const ring = document.createElement('span')
      ring.className = 'ring'
      ring.style.left = `${e.clientX}px`
      ring.style.top = `${e.clientY}px`
      document.body.appendChild(ring)
      ring.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(7)', opacity: 0 }], { duration: 520, easing: 'ease-out' }).onfinish = () => ring.remove()
    }

    const onLeave = (e) => { if (!e.relatedTarget) { hidden = true; cur.classList.add('hidden') } }

    const loop = () => {
      pos.x += (mouse.x - pos.x) * 0.38
      pos.y += (mouse.y - pos.y) * 0.38
      const w = cur.offsetWidth, h = cur.offsetHeight
      const ox = label ? -w / 2 : 1
      // labels sit above the cursor, or below it when there's no room at the top of the screen
      const oy = label ? (pos.y - h - 12 < 6 ? 22 : -h - 12) : -h / 2
      cur.style.transform = `translate3d(${pos.x + ox}px, ${pos.y + oy}px, 0)`
      cur.classList.toggle('idle', !label && performance.now() - lastMove > 700)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    document.addEventListener('mouseout', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('mouseout', onLeave)
      root.classList.remove('has-cursor')
      magnets.forEach((el) => { el.style.translate = '' })
      trails.forEach((s) => s.remove())
    }
  }, [on])

  if (!on) return null
  return <div ref={curRef} className="cur hidden" aria-hidden="true" />
}
