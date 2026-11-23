import { Link } from 'react-router-dom'
import AsciiHero from '../components/AsciiHero.jsx'
import TrackChart from '../components/TrackChart.jsx'
import { Decode, Reveal } from '../components/bits.jsx'
import { SITE, MILESTONES, PAPER, PROJECTS } from '../data.js'
import { T } from '../lib/fx.jsx'

const NAME_LINES = SITE.name.toUpperCase().split(' ')

export default function Home() {
  const featured = PROJECTS.slice(0, 2)
  return (
    <div className="page">
      <section className="hero wrap">
        <h1 className="sr-only">{SITE.name}</h1>
        <AsciiHero lines={NAME_LINES} photo={SITE.photo} />
        <div className="hero-meta">
          <div>
            <p className="pitch">{SITE.pitch}</p>
            <ul className="hero-lines">
              <li><span>accepted</span><span>{PAPER.short} at NeurIPS 2025 (CogInterp workshop) and ACL SiCon 2025</span></li>
              <li><span>currently</span><span>{SITE.currently}</span></li>
              <li><span>open to</span><span>{SITE.openTo}</span></li>
            </ul>
            <div className="btns">
              <Link to="/summon" className="btn solid" data-magnetic data-cursor="summon">Summon me</Link>
              <Link to="/resume" className="btn" data-magnetic data-cursor="view">Resume</Link>
              <Link to="/research" className="btn ghost" data-magnetic data-cursor="read paper">The paper</Link>
            </div>
          </div>
          <div className="stats">
            {SITE.stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="v">{s.value}{s.sub && <small>{s.sub}</small>}</div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="track wrap" aria-labelledby="track-h">
        <div className="track-head">
          <Decode text="Track record" />
          <span className="muted" id="track-h">Every point is a new high. Hover or tap one.</span>
        </div>
        <TrackChart milestones={MILESTONES} />
      </section>

      <section className="featured wrap">
        <div className="featured-head">
          <Decode text="Featured" />
          <Link to="/projects" className="arrow-link" data-cursor="all projects">All projects</Link>
        </div>
        <div className="cards">
          <Reveal as={Link} to="/research" className="card feature" data-cursor="read paper">
            <div className="meta"><b>research</b><span>NeurIPS 2025</span></div>
            <h3>{PAPER.short}</h3>
            <div className="big">85.3%</div>
            <p>Multimodal deception detection across video, audio and text. 12% better than single-input models, and it explains its calls.</p>
          </Reveal>
          {featured.map((p) => (
            <Reveal as={Link} key={p.slug} to={`/projects/${p.slug}`} className="card" data-cursor="view case study">
              <div className="meta"><b>project</b><span>{p.status}</span></div>
              <h3>{p.name}</h3>
              <p><T v={p.oneLiner} /></p>
              <ul className="tags">{p.stack.filter((s) => !s.startsWith('TODO')).slice(0, 4).map((s) => <li key={s}>{s}</li>)}</ul>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
