import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'

// Safe localStorage (some browsers block it)
export const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v) } catch { return d } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } },
}

function useMedia(query) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setMatch(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}

const FxContext = createContext(null)

export function FxProvider({ children }) {
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const finePointer = useMedia('(hover: hover) and (pointer: fine)')
  const [plain, setPlainState] = useState(() => store.get('recruiterMode', false))

  const [theme, setThemeState] = useState(() => store.get('theme', 'dark'))
  // Animations switch: null = visitor hasn't chosen, so follow their device's reduce-motion setting
  const [motionChoice, setMotionChoice] = useState(() => store.get('motion', null))
  const motion = motionChoice === null ? !reduced : motionChoice

  const setPlain = (v) => { setPlainState(v); store.set('recruiterMode', v) }
  const effects = !plain && motion

  // Turning animations ON makes the whole screen glow once. Turning them OFF is instant, no animation.
  const setMotion = useCallback((on) => {
    setMotionChoice(on)
    store.set('motion', on)
    if (!on) return
    const el = document.createElement('div')
    el.className = 'power-glow'
    el.setAttribute('aria-hidden', 'true')
    document.body.appendChild(el)
    const a = el.animate(
      [{ opacity: 0 }, { opacity: 1, offset: 0.22 }, { opacity: 0.85, offset: 0.45 }, { opacity: 0 }],
      { duration: 1200, easing: 'ease-out' }
    )
    a.onfinish = () => el.remove()
  }, [])
  // palette the canvases should use: recruiter mode and light theme are both light
  const light = plain || theme === 'light'

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('plain', plain)
    root.classList.toggle('fx', effects)
    root.classList.toggle('light', theme === 'light')
  }, [plain, effects, theme])

  // Switch dark/light. With effects on, the new theme wipes in as a circle from the click point.
  const toggleTheme = useCallback((e) => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const apply = () => {
      flushSync(() => setThemeState(next))
      document.documentElement.classList.toggle('light', next === 'light')
      store.set('theme', next)
    }
    if (!effects || !document.startViewTransition) { apply(); return }
    const x = e?.clientX ?? window.innerWidth - 80
    const y = e?.clientY ?? 30
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const vt = document.startViewTransition(apply)
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.6,.1,.2,1)', pseudoElement: '::view-transition-new(root)' }
      )
    }).catch(() => {})
  }, [theme, effects])

  const value = useMemo(
    () => ({ plain, setPlain, reduced, effects, finePointer, theme, light, toggleTheme, motion, setMotion }),
    [plain, reduced, effects, finePointer, theme, light, toggleTheme, motion, setMotion]
  )
  return <FxContext.Provider value={value}>{children}</FxContext.Provider>
}

export const useFx = () => useContext(FxContext)

// "TODO: ..." strings render as visible placeholders so it's obvious what to fill in.
export const isTodo = (s) => typeof s === 'string' && s.trim().startsWith('TODO')

export function T({ v, as: Tag = 'span', className = '' }) {
  if (v === undefined || v === null || v === '') return null
  if (isTodo(v)) return <Tag className={`todo ${className}`}>{v.replace(/^TODO:?\s*/, '')}</Tag>
  return <Tag className={className}>{v}</Tag>
}

export const fontsReady = () =>
  Promise.all([
    document.fonts.load('800 100px "Newsreader Variable"'),
    document.fonts.load('500 14px "JetBrains Mono Variable"'),
  ]).catch(() => {})
