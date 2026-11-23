import { useState } from 'react'
import { Decode, Reveal } from '../components/bits.jsx'
import Bars from '../components/Bars.jsx'
import { PAPER, OTHER_RESEARCH } from '../data.js'
import { T, isTodo, has } from '../lib/fx.jsx'

const METRICS = [
  { key: 'accuracy', label: 'Accuracy', max: 100, fmt: (v) => `${v.toFixed(1)}%` },
  { key: 'f1', label: 'F1', max: 1, fmt: (v) => v.toFixed(2) },
  { key: 'auc', label: 'AUC-ROC', max: 1, fmt: (v) => v.toFixed(2) },
]

function Chart({ title, source, takeaway, children, controls }) {
  return (
    <Reveal className="chart">
      <div className="chart-top">
        <div>
          <h3>{title}</h3>
          <div className="src">Source: DecepBench, {source}</div>
        </div>
        {controls}
      </div>
      {children}
      <p className="takeaway">{takeaway}</p>
    </Reveal>
  )
}

export default function Research() {
  const [metric, setMetric] = useState(METRICS[0])
  const P = PAPER

  const modelRows = P.modelComparison.rows.map((r) => ({
    name: r.name, value: r[metric.key], display: metric.fmt(r[metric.key]), ours: r.ours,
    detail: <><b>{r.name}</b>: accuracy {r.accuracy}%, F1 {r.f1.toFixed(2)}, AUC-ROC {r.auc.toFixed(2)}</>,
  }))
  const genRows = P.generalization.rows.map((r) => ({
    name: r.name, value: r.accuracy, display: `${r.accuracy}%`, ours: true,
    detail: <><b>{r.name}</b> ({r.modality}): precision {r.precision}%, recall {r.recall}%, F1 {r.f1.toFixed(2)}. Top cues: {r.features}.</>,
  }))
  const ablRows = P.ablation.rows.map((r) => ({
    name: r.name, value: Math.abs(r.change), display: `${r.change}%`, neg: true,
    detail: <><b>{r.name}</b>: accuracy falls from {P.ablation.full}% to {r.accuracy}%. {r.impact}.</>,
  }))
  const shapRows = P.shap.rows.map((r, i) => ({
    name: `${i + 1}. ${r.name}`, value: r.share ?? null, display: r.share ? `${r.share}%` : 'ranked', ours: !!r.share,
    detail: r.share
      ? <><b>{r.name}</b> accounts for {r.share}% of the model's decision weight.</>
      : <><b>{r.name}</b> is ranked #{i + 1} by SHAP importance. The paper reports the order, not a percentage.</>,
  }))
  const sizeRows = P.sameSize.rows.map((r) => ({
    name: r.name, value: r.accuracy, display: `${r.accuracy}%`, ours: r.ours,
    detail: <><b>{r.name}</b>: {r.accuracy}% accuracy with the same 300M parameter budget.</>,
  }))

  return (
    <div className="page wrap">
      <header className="page-head">
        <div className="path"><b>~/research</b> $ open decepbench.pdf</div>
        <h1>{P.short}</h1>
        <p>{P.title.split(': ')[1]}</p>
        <div className="venues">
          {P.venues.map((v) => (
            v.link
              ? <a className="badge" key={v.name} href={v.link} target="_blank" rel="noopener noreferrer" data-cursor="view" style={{ textDecoration: 'none' }}><b>{v.name}</b><T v={v.status} />{v.note && <T v={v.note} />}<span aria-hidden="true">↗</span></a>
              : <span className="badge" key={v.name}><b>{v.name}</b><T v={v.status} />{v.note && <T v={v.note} />}</span>
          ))}
        </div>
        <div className="paper-links btns">
          {P.links.paper && <a className="btn solid" href={P.links.paper} target="_blank" rel="noopener noreferrer" data-magnetic data-cursor="read paper">Read the paper</a>}
          {P.links.openreview && <a className="btn" href={P.links.openreview} target="_blank" rel="noopener noreferrer" data-magnetic data-cursor="openreview">OpenReview</a>}
          {P.links.code && <a className="btn ghost" href={P.links.code} target="_blank" rel="noopener noreferrer" data-magnetic data-cursor="code">Code</a>}
          {P.links.huggingface && <a className="btn ghost" href={P.links.huggingface} target="_blank" rel="noopener noreferrer" data-magnetic data-cursor="hugging face">Hugging Face</a>}
        </div>
      </header>

      <section className="section">
        <div className="callouts">
          {P.headline.map((h) => (
            <div className="callout" key={h.label}><div className="v">{h.value}</div><div className="l">{h.label}</div></div>
          ))}
        </div>
      </section>

      <section className="section sec-grid">
        <div className="sec-label"><Decode text="The problem" /></div>
        <div className="prose"><p className="lead">{P.problem}</p></div>
      </section>

      <section className="section sec-grid">
        <div className="sec-label"><Decode text="What we built" /></div>
        <div>
          <ul className="built prose">{P.built.map((b) => <li key={b}>{b}</li>)}</ul>
          <div className="prose" style={{ marginTop: 18 }}>
            <p className="muted" style={{ marginBottom: 6 }}>Authors</p>
            <p>
              {P.authors.map((a, i) => (
                <span key={a}>{a === 'Akhil Ganti' ? <b style={{ color: 'var(--violet-hi)' }}>{a}</b> : a}{i < P.authors.length - 1 ? ', ' : ''}</span>
              ))}
            </p>
            <p className="muted" style={{ marginBottom: 6 }}>My contribution</p>
            <p><T v={P.contribution} /></p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sec-grid" style={{ marginBottom: 28 }}>
          <div className="sec-label"><Decode text="Results" />hover any row for exact values</div>
          <p className="prose muted" style={{ margin: 0 }}>Every number below comes straight from the paper's tables. Bars start at zero.</p>
        </div>

        <Chart
          title="Multimodal beats every single input"
          source={P.modelComparison.source}
          takeaway={P.modelComparison.takeaway}
          controls={
            <div className="seg" role="group" aria-label="Metric">
              {METRICS.map((m) => (
                <button key={m.key} aria-pressed={metric.key === m.key} onClick={() => setMetric(m)} data-cursor={m.label}>{m.label}</button>
              ))}
            </div>
          }
        >
          <Bars rows={modelRows} max={metric.max} defaultDetail="Hover a model to compare all three metrics." />
        </Chart>

        <Chart title="Same size, still better" source={P.sameSize.source} takeaway={P.sameSize.takeaway}>
          <Bars rows={sizeRows} max={100} defaultDetail={<><span className="up">+11.2 points</span> from fusing modalities, with model size held equal.</>} />
        </Chart>

        <Chart title="Holds up on five other datasets" source={P.generalization.source} takeaway={P.generalization.takeaway}>
          <Bars rows={genRows} max={100} defaultDetail="Hover a dataset for precision, recall, F1 and the cues that mattered." />
        </Chart>

        <Chart title="What breaks when you remove a cue" source={P.ablation.source} takeaway={P.ablation.takeaway}>
          <Bars rows={ablRows} max={10} defaultDetail={`Accuracy points lost versus the full model (${P.ablation.full}%).`} />
        </Chart>

        <Chart title="What the model actually looks at" source={P.shap.source} takeaway={P.shap.takeaway}>
          <Bars rows={shapRows} max={50} defaultDetail="Share of decision weight. The paper gives percentages for the top two and the order for the rest." />
        </Chart>
      </section>

      <section className="section sec-grid">
        <div className="sec-label"><Decode text="Limitations" />reported in the paper</div>
        <ul className="limits prose">{P.limitations.map((l) => <li key={l}>{l}</li>)}</ul>
      </section>

      <section className="section sec-grid">
        <div className="sec-label"><Decode text="What's next" /></div>
        <div className="prose"><p>{P.future}</p></div>
      </section>

      {OTHER_RESEARCH.map((r) => (
        <section className="section sec-grid" key={r.name}>
          <div className="sec-label"><Decode text="Also" />earlier research, {r.year}</div>
          <div className="prose">
            <h3 style={{ fontSize: 28, marginBottom: 4 }}>{r.name}</h3>
            <p style={{ color: 'var(--violet-hi)', marginBottom: 4 }}>{r.role}</p>
            {r.mentor && <p style={{ marginBottom: 18 }}><span className="badge"><b>{r.mentor}</b></span></p>}
            <p className="lead">{r.summary}</p>
            {r.highlights && (
              <div className="callouts facts" style={{ margin: '6px 0 26px' }}>
                {r.highlights.map((h) => <div className="callout" key={h.label}><div className="v">{h.value}</div><div className="l">{h.label}</div></div>)}
              </div>
            )}
            <p className="muted" style={{ marginBottom: 8 }}>What I did</p>
            <ul className="did">{r.did.map((d, i) => <li key={i}><T v={d} /></li>)}</ul>
            <p className="muted" style={{ margin: '10px 0 8px' }}>Tools</p>
            <ul className="tags">{r.tools.filter(has).map((t) => <li key={t} className={isTodo(t) ? 'todo' : ''}>{t.replace(/^TODO:?\s*/, '')}</li>)}</ul>
            {r.result && (
              <>
                <p className="muted" style={{ margin: '18px 0 8px' }}>Result</p>
                <p><T v={r.result} /></p>
              </>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
