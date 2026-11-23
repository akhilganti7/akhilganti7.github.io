import { Link, useParams } from 'react-router-dom'
import { Decode, Reveal } from '../components/bits.jsx'
import GithubActivity from '../components/GithubActivity.jsx'
import NotFound from './NotFound.jsx'
import { PROJECTS } from '../data.js'
import { T, isTodo, has } from '../lib/fx.jsx'

const statusClass = (s) => (s === 'Concept' ? 'concept' : s === 'In progress' ? 'progress' : '')

export function Projects() {
  return (
    <div className="page wrap">
      <header className="page-head">
        <div className="path"><b>~/projects</b> $ ls -la</div>
        <h1>Projects</h1>
        <p>Each one opens as a case study: the problem, how it works, what went wrong, and what it achieved.</p>
      </header>
      <div className="proj-grid">
        {PROJECTS.map((p) => (
          <Reveal as={Link} key={p.slug} to={`/projects/${p.slug}`} className="card" data-cursor="view case study">
            <div className="meta"><span className={`status-pill ${statusClass(p.status)}`}>● {p.status}</span><span>{p.year}</span></div>
            <h3>{p.name}</h3>
            <p><T v={p.oneLiner} /></p>
            <ul className="tags">{p.stack.filter((s) => !isTodo(s)).map((s) => <li key={s}>{s}</li>)}</ul>
          </Reveal>
        ))}
      </div>
      <GithubActivity />
    </div>
  )
}

export function ProjectDetail() {
  const { slug } = useParams()
  const p = PROJECTS.find((x) => x.slug === slug)
  if (!p) return <NotFound />
  const links = Object.entries(p.links).filter(([, v]) => v)
  const label = { github: 'GitHub', demo: 'Live demo', huggingface: 'Hugging Face' }
  const challenges = p.challenges.filter((c) => has(c.problem))
  const results = p.results.filter((r) => has(r.value))

  return (
    <div className="page wrap">
      <header className="page-head">
        <div className="path"><b>~/projects/{p.slug}</b> $ cat case-study.md</div>
        <h1>{p.name}</h1>
        <p><T v={p.oneLiner} /></p>
        <div className="case-meta">
          <div><b>status</b><span>{p.status}</span></div>
          <div><b>year</b><span>{p.year}</span></div>
          {has(p.role) && <div><b>role</b><span><T v={p.role} /></span></div>}
        </div>
        {links.length > 0 && (
          <div className="btns" style={{ marginTop: 26 }}>
            {links.map(([k, v], i) => (
              <a key={k} className={`btn ${i === 0 ? 'solid' : ''}`} href={v} target="_blank" rel="noopener noreferrer" data-magnetic data-cursor={label[k].toLowerCase()}>{label[k]}</a>
            ))}
          </div>
        )}
      </header>

      {has(p.purpose) && (
        <section className="section sec-grid">
          <div className="sec-label"><Decode text="Purpose" />the problem, and who it's for</div>
          <div className="prose"><p className="lead"><T v={p.purpose} /></p></div>
        </section>
      )}

      <section className="section sec-grid">
        <div className="sec-label"><Decode text="How it works" /></div>
        <div>
          <Reveal className="flow">
            {p.flow.map((f, i) => (
              <div key={f} style={{ display: 'contents' }}>
                {i > 0 && <span className="flow-arrow" aria-hidden="true">──▶</span>}
                <div className="flow-box"><small>step {i + 1}</small>{f}</div>
              </div>
            ))}
          </Reveal>
          <p className="muted" style={{ marginTop: 22, marginBottom: 8 }}>Tech stack</p>
          <ul className="tags">{p.stack.filter(has).map((s) => <li key={s} className={isTodo(s) ? 'todo' : ''}>{s.replace(/^TODO:?\s*/, '')}</li>)}</ul>
        </div>
      </section>

      {challenges.length > 0 && (
      <section className="section sec-grid">
        <div className="sec-label"><Decode text="Challenges" />what went wrong, and the fix</div>
        <div className="prose">
          {challenges.map((c, i) => (
            <div className="challenge" key={i}>
              <div className="q"><T v={c.problem} /></div>
              <div className="a"><T v={c.fix} /></div>
            </div>
          ))}
        </div>
      </section>
      )}

      {results.length > 0 && (
        <section className="section sec-grid">
          <div className="sec-label"><Decode text="Results" /></div>
          <div className="results">
            {results.map((r, i) => (
              <div className="result" key={i}>
                <div className="v">{isTodo(r.value) ? <span className="todo">number</span> : r.value}</div>
                <div className="l">{r.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {has(p.next) && (
        <section className="section sec-grid">
          <div className="sec-label"><Decode text="What's next" /></div>
          <div className="prose"><p><T v={p.next} /></p></div>
        </section>
      )}

      <section className="section">
        <div className="btns">
          <Link to="/projects" className="btn ghost" data-cursor="back">All projects</Link>
          <Link to="/summon" className="btn" data-magnetic data-cursor="summon">Want something like this? Summon me</Link>
        </div>
      </section>
    </div>
  )
}
