import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { useFx } from '../lib/fx.jsx'
import { IconBrandLinkedin, IconBrandGithub } from '@tabler/icons-react'
import { SITE, TICKERS, PAPER } from '../data.js'

export const TABS = [
  { to: '/', label: 'home' },
  { to: '/about', label: 'about' },
  { to: '/research', label: 'research' },
  { to: '/projects', label: 'projects' },
  { to: '/experience', label: 'experience' },
  { to: '/resume', label: 'resume' },
  { to: '/summon', label: 'summon' },
]

// Theme, animations and recruiter-mode controls (top bar on desktop, status bar on phones)
function Controls({ onCommand, compact = false }) {
  const { plain, setPlain, theme, toggleTheme, motion, setMotion } = useFx()
  const nav = useNavigate()
  const toggleRecruiter = () => {
    if (plain) { setPlain(false); nav('/') }
    else { setPlain(true); nav('/recruiter') }
  }
  return (
    <>
      {!plain && (
        <button className="theme-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} data-cursor={theme === 'dark' ? 'light mode' : 'dark mode'}>
          <span className="dot" aria-hidden="true" />
        </button>
      )}
      {!plain && (
        <button className="switch" role="switch" aria-checked={motion} aria-label="Animations" onClick={() => setMotion(!motion)} data-cursor={motion ? 'turn off' : 'turn on'}>
          <span className="sw-track"><span className="knob" /></span>
          <span className="lbl">{compact ? 'animations' : 'Animations'}</span>
        </button>
      )}
      <button className="switch" role="switch" aria-checked={plain} aria-label="Recruiter mode" onClick={toggleRecruiter} data-cursor={plain ? 'effects on' : 'plain view'}>
        <span className="sw-track"><span className="knob" /></span>
        <span className="lbl">{compact ? 'recruiter' : 'Recruiter mode'}</span>
      </button>
      {!compact && <button className="kbd" onClick={onCommand} aria-label="Open command menu (press /)" data-cursor="commands">/</button>}
    </>
  )
}

export function TopBar({ onCommand }) {
  const loc = useLocation()
  const tabsRef = useRef(null)
  const [ind, setInd] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const el = tabsRef.current?.querySelector('.tab.active')
    if (el) {
      setInd({ left: el.offsetLeft, width: el.offsetWidth })
      el.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    } else setInd({ left: 0, width: 0 })
    tabsRef.current?.dispatchEvent(new Event('scroll'))
  }, [loc.pathname])

  // The tab strip only shows home, about, research and the start of projects; the rest fades out.
  // Hold the mouse near the right or left edge to scroll: the longer you hold, the faster it goes.
  // The scroll wheel scrolls it sideways too.
  useEffect(() => {
    const el = tabsRef.current
    if (!el) return
    let raf = 0
    let dir = 0
    let closeness = 0
    let held = 0
    let last = 0
    const max = () => el.scrollWidth - el.clientWidth
    const update = () => {
      el.classList.toggle('can-left', el.scrollLeft > 2)
      el.classList.toggle('can-right', el.scrollLeft < max() - 2)
    }
    const fit = () => {
      const tabs = el.querySelectorAll('.tab')
      if (tabs.length < 4) return
      const t = tabs[3]
      el.style.maxWidth = `${Math.round(t.offsetLeft + t.offsetWidth * 0.55)}px`
      update()
    }
    const tick = (now) => {
      if (!dir) { raf = 0; last = 0; return }
      const dt = last ? Math.min(now - last, 50) : 16
      last = now
      held += dt
      const accel = 1 + Math.min(held / 300, 7) // speeds up the longer you hold, up to 8x
      const v = dir * (0.8 + closeness * 2.4) * accel * (dt / 16)
      const next = Math.max(0, Math.min(max(), el.scrollLeft + v))
      el.scrollLeft = next
      update()
      if ((dir > 0 && next >= max()) || (dir < 0 && next <= 0)) { raf = 0; last = 0; return }
      raf = requestAnimationFrame(tick)
    }
    const onMove = (e) => {
      if (max() <= 0) { dir = 0; return }
      const r = el.getBoundingClientRect()
      const zone = r.width * 0.3
      const x = e.clientX - r.left
      let d = 0
      if (x < zone && el.scrollLeft > 0) { d = -1; closeness = (zone - x) / zone }
      else if (x > r.width - zone && el.scrollLeft < max()) { d = 1; closeness = (x - (r.width - zone)) / zone }
      if (d !== dir) held = 0
      dir = d
      if (dir && !raf) raf = requestAnimationFrame(tick)
    }
    const onLeave = () => { dir = 0; held = 0 }
    const onWheel = (e) => {
      if (max() <= 0 || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', fit)
    fit()
    document.fonts?.ready.then(fit)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', fit)
    }
  }, [])

  return (
    <header className="top">
      <div className="wrap top-inner">
        <Link to="/" className="prompt" data-cursor="home"><b>{SITE.handle}@western</b>:~$</Link>
        <nav className="tabs" ref={tabsRef} aria-label="Main">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.to === '/'} className={({ isActive }) => `tab ${isActive ? 'active' : ''}`} data-cursor={t.label}>
              <span className="tilde">~/</span>{t.label}
            </NavLink>
          ))}
          <span className="tab-ind" style={{ left: ind.left, width: ind.width }} aria-hidden="true" />
        </nav>
        <nav className="profiles" aria-label="Profiles">
          {SITE.links.linkedin && (
            <a className="icon-btn" href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-cursor="linkedin" data-magnetic>
              <IconBrandLinkedin size={19} stroke={1.6} aria-hidden="true" />
            </a>
          )}
          {SITE.links.github && (
            <a className="icon-btn" href={SITE.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" data-cursor="github" data-magnetic>
              <IconBrandGithub size={19} stroke={1.6} aria-hidden="true" />
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}

export function StatusBar({ onCommand }) {
  const items = [...TICKERS, `${PAPER.short.toUpperCase()} NEURIPS 2025 ▲`, 'OPEN TO 2027 INTERNSHIPS']
  const row = (k) => (
    <div className="ticker-track-half" key={k} style={{ display: 'flex', gap: 34, paddingRight: 34 }}>
      {items.map((t, i) => (
        <span key={i}>{t.includes('+') || t.includes('▲') ? <span className="up">{t}</span> : t}</span>
      ))}
    </div>
  )
  return (
    <div className="status no-print">
      <span className="live"><i />live</span>
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">{row('a')}{row('b')}</div>
      </div>
      <div className="status-controls"><Controls onCommand={onCommand} compact /></div>
      <button className="kbd" onClick={onCommand} data-cursor="commands"><span className="long">/ commands</span><span className="short">menu</span></button>
    </div>
  )
}

// Scroll to top on route change, and set the tab title.
export function RouteEffects({ titles }) {
  const loc = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    const key = Object.keys(titles).find((k) => (k === '/' ? loc.pathname === '/' : loc.pathname.startsWith(k)))
    document.title = key && titles[key] ? `${titles[key]} | ${SITE.name}` : `${SITE.name} | Engineering x Finance`
  }, [loc.pathname, titles])
  return null
}
