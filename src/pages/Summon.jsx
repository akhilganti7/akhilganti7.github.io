import { useEffect, useRef, useState } from 'react'
import { SITE, CONTACT } from '../data.js'
import { useFx } from '../lib/fx.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// The clickable preview page can't reach outside websites, so sending is switched off there.
const PREVIEW = !!import.meta.env.VITE_MEMORY_ROUTER
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function send(payload) {
  if (PREVIEW) throw new Error('preview')
  if (CONTACT.formspreeId) {
    const r = await fetch(`https://formspree.io/f/${CONTACT.formspreeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...payload, _subject: `Summon: ${payload.reason} from ${payload.name}` }),
    })
    if (!r.ok) throw new Error('send failed')
    return 'sent'
  }
  if (CONTACT.web3formsKey) {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: CONTACT.web3formsKey, subject: `Summon: ${payload.reason} from ${payload.name}`, ...payload }),
    })
    const j = await r.json().catch(() => ({}))
    if (!r.ok || j.success === false) throw new Error('send failed')
    return 'sent'
  }
  if (SITE.email) {
    const body = `${payload.message}\n\n${payload.name}\n${payload.email}`
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Summon: ${payload.reason}`)}&body=${encodeURIComponent(body)}`
    return 'mailto'
  }
  throw new Error('not configured')
}

export default function Summon() {
  const { effects } = useFx()
  const [f, setF] = useState({ name: '', email: '', reason: CONTACT.reasons[0], message: '', site: '' })
  const [errs, setErrs] = useState({})
  const [state, setState] = useState('idle') // idle | sending | done | mailto | error
  const [log, setLog] = useState([])
  const [copied, setCopied] = useState(false)
  const [copiedMsg, setCopiedMsg] = useState(false)
  const [lastMsg, setLastMsg] = useState('')
  const liveRef = useRef(null)

  useEffect(() => { if (['done', 'error', 'mailto', 'unconfigured', 'preview'].includes(state)) liveRef.current?.focus() }, [state])

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const validate = () => {
    const e = {}
    if (!f.name.trim()) e.name = 'Add your name so I know who to reply to.'
    if (!EMAIL_RE.test(f.email.trim())) e.email = 'That email looks off. Check for typos.'
    if (f.message.trim().length < 10) e.message = 'Tell me a little more (at least 10 characters).'
    setErrs(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (state === 'sending') return
    if (!validate()) return
    setState('sending')
    setLog([])
    const steps = ['> packaging message', '> opening channel to akhil', '> transmitting']
    const anim = (async () => {
      for (const s of steps) { setLog((l) => [...l, s]); await wait(effects ? 380 : 0) }
      if (effects) {
        for (let i = 1; i <= 12; i++) {
          setLog((l) => [...l.slice(0, steps.length), `  [${'█'.repeat(i)}${'░'.repeat(12 - i)}] ${Math.round((i / 12) * 100)}%`])
          await wait(45)
        }
      }
    })()
    try {
      if (f.site) { await anim; setState('done'); return } // honeypot: bots get a fake success
      const payload = { name: f.name.trim(), email: f.email.trim(), reason: f.reason, message: f.message.trim() }
      setLastMsg(`${payload.message}\n\n${payload.name}\n${payload.email}`)
      const [res] = await Promise.all([send(payload), anim])
      setLog((l) => [...l, res === 'mailto' ? '> handed off to your email app' : '> summoned.'])
      setState(res === 'mailto' ? 'mailto' : 'done')
      if (res === 'sent') setF({ name: '', email: '', reason: CONTACT.reasons[0], message: '', site: '' })
    } catch (err) {
      await anim
      const why = { 'not configured': '> no channel configured', preview: '> preview page: sending is off' }[err.message] || '> connection failed'
      setLog((l) => [...l, why])
      setState(err.message === 'not configured' ? 'unconfigured' : err.message === 'preview' ? 'preview' : 'error')
    }
  }

  const copyMsg = async () => {
    try { await navigator.clipboard.writeText(lastMsg); setCopiedMsg(true); setTimeout(() => setCopiedMsg(false), 1800) } catch { /* ignore */ }
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(SITE.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* ignore */ }
  }

  const contacts = [
    SITE.links.linkedin && { label: 'LinkedIn', href: SITE.links.linkedin },
    SITE.links.github && { label: 'GitHub', href: SITE.links.github },
    SITE.links.openreview && { label: 'OpenReview', href: SITE.links.openreview },
    SITE.links.huggingface && { label: 'Hugging Face', href: SITE.links.huggingface },
  ].filter(Boolean)

  return (
    <div className="page wrap">
      <header className="page-head">
        <div className="path"><b>~/summon</b> $ ./summon --to akhil</div>
        <h1>Summon me</h1>
        <p>Working on something interesting, hiring for an internship, or want to collaborate on research? Send a message and it lands straight in my inbox.</p>
        {PREVIEW && <p className="preview-note">Preview only: the form sends once the site is live on GitHub Pages.</p>}
      </header>

      <div className="summon">
        <form className="term" onSubmit={submit} noValidate>
          <div className="term-bar"><span>summon.sh</span><span>{state === 'sending' ? 'transmitting…' : 'ready'}</span></div>
          <div className="term-body">
            <div className="field">
              <label htmlFor="s-name">your name</label>
              <input id="s-name" autoComplete="name" value={f.name} onChange={set('name')} aria-invalid={!!errs.name} aria-describedby={errs.name ? 's-name-err' : undefined} />
              {errs.name && <div className="err" id="s-name-err">{errs.name}</div>}
            </div>
            <div className="field">
              <label htmlFor="s-email">your email</label>
              <input id="s-email" type="email" autoComplete="email" value={f.email} onChange={set('email')} aria-invalid={!!errs.email} aria-describedby={errs.email ? 's-email-err' : undefined} />
              {errs.email && <div className="err" id="s-email-err">{errs.email}</div>}
            </div>
            <div className="field">
              <label id="s-reason">what's it about</label>
              <div className="chips" role="group" aria-labelledby="s-reason">
                {CONTACT.reasons.map((r) => (
                  <button type="button" key={r} className="chip" aria-pressed={f.reason === r} onClick={() => setF({ ...f, reason: r })} data-cursor="pick">{r}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label htmlFor="s-msg">message</label>
              <textarea id="s-msg" rows={5} value={f.message} onChange={set('message')} aria-invalid={!!errs.message} aria-describedby={errs.message ? 's-msg-err' : undefined} />
              {errs.message && <div className="err" id="s-msg-err">{errs.message}</div>}
            </div>
            <div className="hp" aria-hidden="true">
              <label htmlFor="s-site">Leave this empty</label>
              <input id="s-site" tabIndex={-1} autoComplete="off" value={f.site} onChange={set('site')} />
            </div>
            <button type="submit" className="btn solid" data-magnetic data-cursor="summon" disabled={state === 'sending'}>
              {state === 'sending' ? 'Summoning…' : 'Summon'}
            </button>
            <div className="tx-log" aria-hidden="true">{log.map((l, i) => <div key={i} className={l.includes('█') ? 'tx-bar' : ''}>{l}</div>)}</div>
            <div ref={liveRef} tabIndex={-1} aria-live="polite" style={{ outline: 'none' }}>
              {state === 'done' && <div className="result-msg">Summoned. I'll get back to you within 48 hours.</div>}
              {state === 'mailto' && <div className="result-msg">Your email app should open with the message ready. Hit send there.</div>}
              {state === 'error' && (
                <div className="result-msg bad">
                  That didn't send. Check your connection and try again{SITE.email ? `, or email me at ${SITE.email}` : ''}.
                  <div className="btns" style={{ marginTop: 12 }}>
                    <button type="button" className="btn ghost" onClick={copyMsg} data-cursor="copy">{copiedMsg ? 'Copied' : 'Copy your message'}</button>
                  </div>
                </div>
              )}
              {state === 'preview' && (
                <div className="result-msg bad">This preview page can't send messages. On the live site, this goes straight to my inbox.{SITE.email ? ` For now, email me at ${SITE.email}.` : ''}</div>
              )}
              {state === 'unconfigured' && (
                <div className="result-msg bad">The contact form isn't connected yet. Reach me on LinkedIn for now.</div>
              )}
            </div>
          </div>
        </form>

        <div>
          <ul className="contact-list">
            {SITE.email && (
              <li><button onClick={copy} data-cursor={copied ? 'copied' : 'copy'}><span>{copied ? 'Copied to clipboard' : SITE.email}</span><span>{copied ? '✓' : 'copy'}</span></button></li>
            )}
            {contacts.map((c) => (
              <li key={c.label}><a href={c.href} target="_blank" rel="noopener noreferrer" data-cursor="open"><span>{c.label}</span><span>↗</span></a></li>
            ))}
            {SITE.resume && <li><a href={SITE.resume} download data-cursor="download"><span>Resume (PDF, engineering + business)</span><span>↓</span></a></li>}
          </ul>
          <p className="muted" style={{ marginTop: 20, fontSize: 13 }}>Open to: {SITE.openTo}.</p>
        </div>
      </div>
    </div>
  )
}
