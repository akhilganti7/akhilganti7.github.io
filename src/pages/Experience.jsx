import { Link, useParams } from 'react-router-dom'
import { Decode, Reveal } from '../components/bits.jsx'
import NotFound from './NotFound.jsx'
import { EXPERIENCE } from '../data.js'
import { T } from '../lib/fx.jsx'

export function Experience() {
  return (
    <div className="page wrap">
      <header className="page-head">
        <div className="path"><b>~/experience</b> $ history</div>
        <h1>Experience</h1>
        <p>Data, software, and capital markets. Open any role for what I did and the impact.</p>
      </header>
      <ul className="timeline">
        {EXPERIENCE.map((e) => (
          <Reveal as="li" className="tl-item" key={e.slug}>
            <Link to={`/experience/${e.slug}`} data-cursor="open">
              <span className="tl-node" aria-hidden="true" />
              <div>
                <h3>{e.company}</h3>
                <div className="ttl">{e.title}{e.team ? `, ${e.team}` : ''}</div>
                <div className="sum">{e.summary}</div>
              </div>
              <div className="dt"><T v={e.dates} /></div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}

export function ExperienceDetail() {
  const { slug } = useParams()
  const e = EXPERIENCE.find((x) => x.slug === slug)
  if (!e) return <NotFound />
  return (
    <div className="page wrap">
      <header className="page-head">
        <div className="path"><b>~/experience/{e.slug}</b> $ cat role.md</div>
        <h1>{e.company}</h1>
        <p style={{ color: 'var(--violet-hi)' }}>{e.title}{e.team ? `, ${e.team}` : ''}</p>
        <p><T v={e.dates} /></p>
      </header>
      <section className="section sec-grid">
        <div className="sec-label"><Decode text="The role" /></div>
        <div className="prose"><p className="lead">{e.summary}</p></div>
      </section>
      <section className="section sec-grid">
        <div className="sec-label"><Decode text="What I did" /></div>
        <ul className="did prose">{e.did.map((d, i) => <li key={i}><T v={d} /></li>)}</ul>
      </section>
      <section className="section sec-grid">
        <div className="sec-label"><Decode text="Impact" /></div>
        <div className="prose"><p><T v={e.impact} /></p><ul className="tags">{e.tags.map((t) => <li key={t}>{t}</li>)}</ul></div>
      </section>
      <section className="section">
        <div className="btns">
          <Link to="/experience" className="btn ghost" data-cursor="back">All experience</Link>
          <Link to="/summon" className="btn" data-magnetic data-cursor="summon">Summon me</Link>
        </div>
      </section>
    </div>
  )
}
