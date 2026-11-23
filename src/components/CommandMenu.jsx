import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFx } from '../lib/fx.jsx'
import { SITE, PROJECTS, EXPERIENCE, PAPER } from '../data.js'

// Slash-command menu. Press "/" anywhere (or ⌘K / Ctrl+K), type a command like /summon, hit enter.
export default function CommandMenu({ open, setOpen }) {
  const nav = useNavigate()
  const { plain, setPlain, theme, toggleTheme, motion, setMotion } = useFx()
  const [q, setQ] = useState('/')
  const [sel, setSel] = useState(0)
  const [miss, setMiss] = useState('')
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const lastFocus = useRef(null)

  const commands = useMemo(() => {
    const go = (to) => () => nav(to)
    const ext = (url) => () => window.open(url, '_blank', 'noopener')
    const lc = (s) => s.toLowerCase()
    const list = [
      { name: 'home', desc: 'go to the home page', group: 'page', run: go('/') },
      { name: 'about', desc: 'who i am and what i bring', group: 'page', run: go('/about') },
      { name: 'research', desc: 'decepbench results and berkeley research', group: 'page', run: go('/research') },
      { name: 'projects', desc: 'every project, as a case study', group: 'page', run: go('/projects') },
      { name: 'experience', desc: 'every role, with impact', group: 'page', run: go('/experience') },
      { name: 'resume', desc: 'view or download my resume', group: 'page', run: go('/resume') },
      { name: 'summon', desc: 'send me a message', group: 'page', run: go('/summon') },
    ]
    if (!plain) {
      list.push(
        { name: theme === 'dark' ? 'light' : 'dark', desc: `switch to ${theme === 'dark' ? 'light' : 'dark'} theme`, group: 'action', run: () => toggleTheme() },
        { name: 'animations', desc: `turn animations ${motion ? 'off' : 'on'}`, group: 'action', run: () => setMotion(!motion) },
      )
    }
    list.push({
      name: 'recruiter',
      desc: plain ? 'turn effects back on' : 'plain one-page summary',
      group: 'action',
      run: () => { setPlain(!plain); nav(plain ? '/' : '/recruiter') },
    })
    if (SITE.email) list.push({ name: 'email', desc: `copy my email (${SITE.email})`, group: 'action', run: () => navigator.clipboard?.writeText(SITE.email) })
    if (PAPER.links.paper) list.push({ name: 'paper', desc: 'read decepbench on the acl anthology', group: 'link', run: ext(PAPER.links.paper) })
    if (SITE.links.linkedin) list.push({ name: 'linkedin', desc: 'open my linkedin', group: 'link', run: ext(SITE.links.linkedin) })
    if (SITE.links.github) list.push({ name: 'github', desc: 'open my github', group: 'link', run: ext(SITE.links.github) })
    if (SITE.links.openreview) list.push({ name: 'openreview', desc: 'open my openreview profile', group: 'link', run: ext(SITE.links.openreview) })
    if (SITE.links.huggingface) list.push({ name: 'huggingface', desc: 'open my hugging face', group: 'link', run: ext(SITE.links.huggingface) })
    ;(SITE.resumes || []).forEach((r) => list.push({ name: `resume-${r.id}`, desc: `view my ${r.label.toLowerCase()} resume`, group: 'file', run: go(`/resume?v=${r.id}`) }))
    PROJECTS.forEach((p) => list.push({ name: p.slug, desc: `project: ${lc(p.name)}`, group: 'project', run: go(`/projects/${p.slug}`) }))
    EXPERIENCE.forEach((e) => list.push({ name: e.slug, desc: `role: ${lc(e.title)} at ${lc(e.company)}`, group: 'role', run: go(`/experience/${e.slug}`) }))
    return list
  }, [nav, plain, setPlain, theme, toggleTheme, motion, setMotion])

  const term = q.replace(/^\//, '').trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!term) return commands
    const starts = commands.filter((c) => c.name.startsWith(term))
    const rest = commands.filter((c) => !c.name.startsWith(term) && (c.name.includes(term) || c.desc.includes(term) || c.group.startsWith(term)))
    return [...starts, ...rest]
  }, [term, commands])

  // "/" anywhere opens the menu (unless you're typing in a field); ⌘K / Ctrl+K toggles it
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o) }
      else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); setOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  // Reset and focus in the same frame the menu opens, so fast typing right after "/" isn't lost
  useLayoutEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement
      setQ('/'); setSel(0); setMiss('')
      const el = inputRef.current
      if (el) { el.value = '/'; el.focus(); el.setSelectionRange(1, 1) }
    } else lastFocus.current?.focus?.()
  }, [open])

  useEffect(() => { setSel(0); setMiss('') }, [q])

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [sel])

  if (!open) return null
  const run = (c) => { setOpen(false); c?.run() }
  const submit = () => {
    const exact = commands.find((c) => c.name === term)
    if (exact) return run(exact)
    if (term && filtered[sel]) return run(filtered[sel])
    if (!term) return run(filtered[sel])
    setMiss(term)
  }

  return (
    <div className="cmd-back" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}>
      <div className="cmd" role="dialog" aria-modal="true" aria-label="Command menu">
        <input
          ref={inputRef}
          autoFocus
          value={q}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          placeholder="/ type a command"
          aria-label="Type a command"
          aria-controls="cmd-list"
          aria-activedescendant={filtered[sel] ? `cmd-${sel}` : undefined}
          onChange={(e) => setQ(e.target.value.toLowerCase())}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false)
            else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(filtered.length - 1, s + 1)) }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)) }
            else if (e.key === 'Enter') { e.preventDefault(); submit() }
            else if (e.key === 'Tab') {
              e.preventDefault()
              if (filtered[sel]) setQ(`/${filtered[sel].name}`)
            }
          }}
        />
        <ul id="cmd-list" role="listbox" ref={listRef}>
          {miss ? (
            <li className="none miss">command not found: /{miss}. delete it and type / to see every command.</li>
          ) : filtered.length === 0 ? (
            <li className="none">no matches. try /summon or /projects.</li>
          ) : (
            filtered.map((c, i) => (
              <li key={c.group + c.name} id={`cmd-${i}`} role="option" aria-selected={i === sel} onMouseEnter={() => setSel(i)} onClick={() => run(c)} data-cursor="run">
                <span className="nm">/{c.name}</span>
                <span className="ds">{c.desc}</span>
                <span className="g">{c.group}</span>
              </li>
            ))
          )}
        </ul>
        <div className="cmd-foot"><span>/ start a command</span><span>tab complete</span><span>↑↓ move</span><span>↵ run</span><span>esc close</span></div>
      </div>
    </div>
  )
}
