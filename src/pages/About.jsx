import { Link } from 'react-router-dom'
import { Decode, Reveal } from '../components/bits.jsx'
import { ABOUT, SKILLS } from '../data.js'
import { T } from '../lib/fx.jsx'

export default function About() {
  return (
    <div className="page wrap">
      <header className="page-head">
        <div className="path"><b>~/about</b> $ cat about.md</div>
        <h1>Engineer by training.<br />Built for finance.</h1>
      </header>

      <section className="section sec-grid">
        <div className="sec-label"><Decode text="Short version" /></div>
        <div className="prose">
          {ABOUT.intro.map((p, i) => <p key={i} className={i === 0 ? 'lead' : ''}>{p}</p>)}
        </div>
      </section>

      <section className="section sec-grid">
        <div className="sec-label"><Decode text="Where it meets" />engineering × finance</div>
        <div className="prose">{ABOUT.intersection.map((p, i) => <p key={i}>{p}</p>)}</div>
      </section>

      <section className="section sec-grid">
        <div className="sec-label"><Decode text="What I bring" />each one with proof</div>
        <Reveal className="strengths">
          {ABOUT.strengths.map((s) => (
            <div className="strength" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.proof}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="section sec-grid">
        <div className="sec-label"><Decode text="Where I'm headed" /></div>
        <div className="prose">
          <p className="lead">{ABOUT.headed}</p>
          <div className="btns"><Link to="/summon" className="btn" data-magnetic data-cursor="summon">Work with me</Link></div>
        </div>
      </section>

      <section className="section sec-grid">
        <div className="sec-label"><Decode text="Skills" /></div>
        <div className="skills">
          {SKILLS.map((g) => (
            <div className="skill-row" key={g.group}>
              <span>{g.group}</span>
              <ul className="tags">{g.items.map((it) => <li key={it} className={it.startsWith('TODO') ? 'todo' : ''}>{it.replace(/^TODO:?\s*/, '')}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section sec-grid">
        <div className="sec-label"><Decode text="Education" /></div>
        <ul className="list-rows">
          {ABOUT.education.map((e) => (
            <li key={e.name}><span className="n">{e.name}</span><span className="y">{e.year}</span><span className="d"><T v={e.detail} /></span></li>
          ))}
        </ul>
      </section>

      <section className="section sec-grid">
        <div className="sec-label"><Decode text="Leadership" /></div>
        <ul className="list-rows">
          {ABOUT.leadership.map((e) => (
            <li key={e.name}><span className="n">{e.name}</span><span className="y">{e.year}</span><span className="d"><T v={e.detail} /></span></li>
          ))}
        </ul>
      </section>
    </div>
  )
}
