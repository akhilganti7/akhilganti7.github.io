import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SITE, ABOUT, PAPER, OTHER_RESEARCH, EXPERIENCE, PROJECTS, SKILLS } from '../data.js'
import { T, isTodo, useFx } from '../lib/fx.jsx'
import ResumeViewer, { hasPreview, preloadResume } from '../components/ResumeViewer.jsx'

export function Resume() {
  const resumes = SITE.resumes || []
  const [params, setParams] = useSearchParams()
  const fallback = resumes.find((r) => r.id === 'combined')?.id || resumes[0]?.id
  const sel = resumes.some((r) => r.id === params.get('v')) ? params.get('v') : fallback
  const cur = resumes.find((r) => r.id === sel)
  const pick = (id) => setParams(id === fallback ? {} : { v: id }, { replace: true })

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('reading')
    return () => root.classList.remove('reading')
  }, [])

  // Arrow keys move between the three versions.
  const onKeyDown = (e) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const i = (resumes.findIndex((r) => r.id === sel) + step + resumes.length) % resumes.length
    pick(resumes[i].id)
    e.currentTarget.querySelectorAll('[role="tab"]')[i]?.focus()
  }

  return (
    <div className="page wrap">
      <header className="page-head">
        <div className="path"><b>~/resume</b> $ ls resumes/</div>
        <h1>Resume</h1>
        <p>Three versions, depending on what you're hiring for.</p>
        <div className="resume-pick" role="tablist" aria-label="Resume version" onKeyDown={onKeyDown}>
          {resumes.map((r) => (
            <button
              key={r.id}
              role="tab"
              id={`rtab-${r.id}`}
              aria-selected={sel === r.id}
              aria-controls="resume-panel"
              tabIndex={sel === r.id ? 0 : -1}
              className={`resume-tab ${sel === r.id ? 'on' : ''}`}
              onClick={() => pick(r.id)}
              onMouseEnter={() => preloadResume(r.id)}
              onFocus={() => preloadResume(r.id)}
              data-cursor="view"
            >
              <span className="rt-name"><span className="rt-long">{r.label}</span><span className="rt-short">{r.short || r.label}</span></span>
              <span className="rt-blurb">{r.blurb}</span>
            </button>
          ))}
        </div>
      </header>
      <div id="resume-panel" role="tabpanel" aria-labelledby={cur ? `rtab-${cur.id}` : undefined}>
        {cur && hasPreview(cur.id) && <ResumeViewer key={cur.id} resume={cur} name={SITE.name} />}
        {cur && !hasPreview(cur.id) && (
          <div className="empty">
            <span className="todo">add this resume as public{cur.file}</span>
            <p>Once the PDF is in /public, the preview builds itself the next time you run the site.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const clean = (arr) => arr.filter((x) => !isTodo(x))

// Recruiter mode: plain, fast, printable one-pager.
export function Recruiter() {
  const { plain, setPlain } = useFx()
  useEffect(() => { if (!plain) setPlain(true) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const contacts = [
    SITE.email && { label: SITE.email, href: `mailto:${SITE.email}` },
    SITE.links.linkedin && { label: 'LinkedIn', href: SITE.links.linkedin },
    SITE.links.github && { label: 'GitHub', href: SITE.links.github },
    SITE.links.openreview && { label: 'OpenReview', href: SITE.links.openreview },
    SITE.links.huggingface && { label: 'Hugging Face', href: SITE.links.huggingface },
  ].filter(Boolean)
  return (
    <div className="page wrap">
      <article className="rec">
        <h1>{SITE.name}</h1>
        <p>{SITE.role}</p>
        <p><strong>Open to:</strong> {SITE.openTo}</p>
        <div className="links">
          {contacts.map((c) => <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer">{c.label}</a>)}
          {SITE.resume && <a href={SITE.resume} download>Resume (PDF)</a>}
        </div>
        <div className="btns no-print" style={{ marginTop: 16 }}>
          <button className="btn ghost" onClick={() => window.print()}>Print or save as PDF</button>
          <Link className="btn ghost" to="/summon">Contact form</Link>
        </div>

        <h2>Summary</h2>
        <p>{ABOUT.intro[0]}</p>
        <p>{ABOUT.intro[1]}</p>

        <h2>Research</h2>
        <div className="row"><strong>{PAPER.title}</strong></div>
        <p>Co-author ({PAPER.authors.indexOf('Akhil Ganti') + 1} of {PAPER.authors.length}). {PAPER.links.paper && <a href={PAPER.links.paper} target="_blank" rel="noopener noreferrer">ACL Anthology</a>}</p>
        <p>{PAPER.venues.map((v) => `${v.name}${v.note && !isTodo(v.note) ? `, ${v.note}` : ''} (${isTodo(v.status) ? 'status pending' : v.status})`).join('; ')}</p>
        <ul>
          <li>85.3% accuracy, 0.83 F1, 0.91 AUC-ROC on DOLOS (1,675 clips, 213 people).</li>
          <li>About 12% better than single-input models; +11.2 points over BERT at the same 300M parameters.</li>
          <li>Explainable: SHAP shows micro-expressions (35%) and pitch variation (28%) drive decisions.</li>
          {!isTodo(PAPER.contribution) && <li>My role: {PAPER.contribution}</li>}
        </ul>
        {OTHER_RESEARCH.map((r) => (
          <div key={r.name} style={{ marginTop: 12 }}>
            <div className="row"><span><strong>{r.name}</strong>, {r.role}</span><span className="y">{r.year}</span></div>
            <ul>
              {r.mentor && <li>{r.mentor}.</li>}
              <li>{r.summary}</li>
              {clean(r.did).map((d) => <li key={d}>{d}</li>)}
              {r.result && !isTodo(r.result) && <li>{r.result}</li>}
            </ul>
          </div>
        ))}

        <h2>Experience</h2>
        {EXPERIENCE.map((e) => (
          <div key={e.slug} style={{ marginBottom: 12 }}>
            <div className="row"><span><strong>{e.company}</strong>, {e.title}</span><span className="y">{isTodo(e.dates) ? '' : e.dates}</span></div>
            <ul>
              <li>{e.summary}</li>
              {clean(e.did).map((d) => <li key={d}>{d}</li>)}
              {!isTodo(e.impact) && <li>{e.impact}</li>}
            </ul>
          </div>
        ))}

        <h2>Projects</h2>
        <ul>
          {PROJECTS.map((p) => <li key={p.slug}><strong>{p.name}</strong> ({p.status}): {p.oneLiner} <span className="y">{clean(p.stack).join(', ')}</span></li>)}
        </ul>

        <h2>Education</h2>
        {ABOUT.education.map((e) => <div key={e.name} className="row"><span><strong>{e.name}</strong>, {e.detail}</span><span className="y">{e.year}</span></div>)}

        <h2>Skills</h2>
        {SKILLS.map((g) => <p key={g.group} style={{ margin: '4px 0' }}><strong>{g.group}:</strong> {clean(g.items).join(', ')}</p>)}

        <h2>Leadership</h2>
        {ABOUT.leadership.map((e) => <div key={e.name} className="row"><span><strong>{e.name}</strong>. <T v={e.detail} /></span><span className="y">{e.year}</span></div>)}
      </article>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="page wrap nf">
      <pre>{`$ cd ${typeof window !== 'undefined' ? window.location.pathname : ''}\nbash: no such file or directory`}</pre>
      <h1 style={{ fontSize: 56, margin: '18px 0' }}>Page not found</h1>
      <p className="muted">That page doesn't exist. Head home, or press / to jump anywhere.</p>
      <div className="btns" style={{ marginTop: 20 }}><Link className="btn" to="/">Go home</Link></div>
    </div>
  )
}
