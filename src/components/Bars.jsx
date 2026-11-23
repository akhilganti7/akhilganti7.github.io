import { useState } from 'react'
import { useInView } from './bits.jsx'

// Terminal-style horizontal bar chart. Hover / focus a row to see its detail line.
// rows: [{ name, value, display, ours, neg, detail }]
export default function Bars({ rows, max, baseline, baselineLabel, defaultDetail }) {
  const [ref, seen] = useInView(0.25)
  const [on, setOn] = useState(null)
  const current = on === null ? null : rows[on]

  return (
    <div ref={ref}>
      <div className="bars" role="list">
        {rows.map((r, i) => {
          const pct = r.value == null ? 0 : (Math.abs(r.value) / max) * 100
          return (
            <div
              key={r.name}
              role="listitem"
              tabIndex={0}
              className={`bar-row ${r.ours ? 'ours' : ''} ${r.neg ? 'neg' : ''} ${on === i ? 'on' : ''}`}
              onMouseEnter={() => setOn(i)}
              onMouseLeave={() => setOn(null)}
              onFocus={() => setOn(i)}
              onBlur={() => setOn(null)}
              aria-label={`${r.name}: ${r.display}${r.detailText ? '. ' + r.detailText : ''}`}
            >
              <span className="nm">{r.name}</span>
              <span className="bar-track">
                {r.value != null && <span className="bar-fill" style={{ width: seen ? `${pct}%` : 0 }} />}
                {baseline != null && (
                  <span className="baseline" style={{ left: `${(baseline / max) * 100}%` }}>
                    {i === 0 && <span>{baselineLabel}</span>}
                  </span>
                )}
              </span>
              <span className={`val ${r.value == null ? 'na' : ''} ${r.neg ? 'down' : ''}`}>{r.display}</span>
            </div>
          )
        })}
      </div>
      <div className="chart-detail" aria-live="polite">
        {current ? current.detail : defaultDetail}
      </div>
    </div>
  )
}
