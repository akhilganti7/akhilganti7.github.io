import { useEffect, useRef, useState } from 'react'
import { useFx } from '../lib/fx.jsx'

const GLYPHS = '!<>-_\\/[]{}=+*^?#$%01'

// Heading text that "decodes" from random glyphs when it scrolls into view.
export function Decode({ text, as: Tag = 'h2', className = '' }) {
  const { effects } = useFx()
  const ref = useRef(null)
  const [out, setOut] = useState(effects ? text.replace(/\S/g, ' ') : text)

  useEffect(() => {
    if (!effects) { setOut(text); return }
    const el = ref.current
    let raf, t0
    const run = (t) => {
      if (!t0) t0 = t
      const dur = Math.min(700, 220 + text.length * 22)
      const p = Math.min(1, (t - t0) / dur)
      const solved = Math.floor(p * text.length)
      let s = ''
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        if (i < solved || c === ' ') s += c
        else s += GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setOut(s)
      if (p < 1) raf = requestAnimationFrame(run)
    }
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { raf = requestAnimationFrame(run); io.disconnect() }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [text, effects])

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </Tag>
  )
}

// Block that wipes in (stepped scanline) when it scrolls into view.
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null)
  const { effects } = useFx()
  useEffect(() => {
    if (!effects) return
    const el = ref.current
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { el.classList.add('in'); io.disconnect() }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [effects])
  return <Tag ref={ref} className={`reveal ${className}`} {...rest}>{children}</Tag>
}

// Track if an element has scrolled into view (used to grow chart bars).
export function useInView(threshold = 0.3) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen]
}

export function ExtLink({ href, children, className = 'arrow-link', label = 'open' }) {
  if (!href) return null
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" data-cursor={label}>
      {children}
    </a>
  )
}
