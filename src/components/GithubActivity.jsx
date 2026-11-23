import { useEffect, useState } from 'react'
import { SITE } from '../data.js'

const ago = (iso) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  return `${Math.round(s / 86400)}d ago`
}

// Live feed of recent public commits. Hidden until SITE.links.githubUser is set.
export default function GithubActivity() {
  const user = SITE.links.githubUser
  const [items, setItems] = useState(null)

  useEffect(() => {
    if (!user) return
    const key = `gh:${user}`
    try {
      const cached = JSON.parse(sessionStorage.getItem(key) || 'null')
      if (cached && Date.now() - cached.t < 10 * 60 * 1000) { setItems(cached.items); return }
    } catch { /* ignore */ }
    fetch(`https://api.github.com/users/${user}/events/public?per_page=40`)
      .then((r) => (r.ok ? r.json() : []))
      .then((events) => {
        const out = []
        for (const ev of events) {
          if (ev.type !== 'PushEvent') continue
          for (const c of ev.payload?.commits || []) {
            out.push({ sha: c.sha.slice(0, 7), msg: c.message.split('\n')[0], repo: ev.repo.name, at: ev.created_at })
          }
          if (out.length >= 6) break
        }
        const items = out.slice(0, 6)
        setItems(items)
        try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), items })) } catch { /* ignore */ }
      })
      .catch(() => setItems([]))
  }, [user])

  if (!user || !items || items.length === 0) return null
  return (
    <section className="section">
      <div className="sec-grid">
        <div className="sec-label"><h2>git log</h2>Latest public commits, live from GitHub.</div>
        <ul className="gitlog">
          {items.map((c) => (
            <li key={c.sha + c.repo}>
              <a className="sha" href={`https://github.com/${c.repo}/commit/${c.sha}`} target="_blank" rel="noopener noreferrer" data-cursor="commit">{c.sha}</a>
              <span className="repo">{c.repo.split('/')[1]}</span>
              <span className="msg">{c.msg} <span className="muted">· {ago(c.at)}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
