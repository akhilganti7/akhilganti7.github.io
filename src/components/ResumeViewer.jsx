import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
// Made by scripts/resume-previews.mjs from the PDFs in /public. Don't edit by hand.
import PAGES from '../resume-pages.json'

const IMGS = import.meta.glob('../assets/resumes/*.webp', { eager: true, query: '?url', import: 'default' })
const imgUrl = (name) => IMGS[`../assets/resumes/${name}`]

export const hasPreview = (id) => !!PAGES[id]?.pages?.some((p) => imgUrl(p.img))

// Start downloading a resume's pages early (on tab hover), so switching feels instant.
export function preloadResume(id) {
  PAGES[id]?.pages?.forEach((p) => {
    const url = imgUrl(p.img)
    if (url) new Image().src = url
  })
}

const ZOOMS = [1, 1.25, 1.5, 2]

// "/resume-x.pdf" -> a path that also works if the site is hosted under a sub-folder.
const fileUrl = (f) => import.meta.env.BASE_URL + f.replace(/^\//, '')

const linkLabel = (href) =>
  href.startsWith('mailto:') ? 'email'
    : /linkedin\.com/.test(href) ? 'linkedin'
      : /github\.com\/[^/]+\/[^/]+/.test(href) ? 'repo'
        : /github\.com/.test(href) ? 'github'
          : /aclanthology|arxiv|openreview/.test(href) ? 'paper'
            : 'open'

export default function ResumeViewer({ resume, name }) {
  const data = PAGES[resume.id]
  const boxRef = useRef(null)
  const [z, setZ] = useState(0)
  const prevZ = useRef(ZOOMS[0])
  const [loaded, setLoaded] = useState({})
  const [more, setMore] = useState(false)
  const fileName = resume.file.split('/').pop()
  const count = data.pages.length

  // Show the bottom fade only while there's more page below.
  const check = useCallback(() => {
    const b = boxRef.current
    if (b) setMore(b.scrollTop + b.clientHeight < b.scrollHeight - 4)
  }, [])

  useEffect(() => {
    const b = boxRef.current
    if (!b) return
    const ro = new ResizeObserver(check)
    ro.observe(b)
    if (b.firstElementChild) ro.observe(b.firstElementChild)
    return () => ro.disconnect()
  }, [check])

  // A cached image can finish loading before React is listening for it.
  useEffect(() => {
    boxRef.current?.querySelectorAll('img[data-img]').forEach((img) => {
      if (img.complete && img.naturalWidth) setLoaded((s) => ({ ...s, [img.dataset.img]: true }))
    })
    check()
  }, [check])

  // Zoom around the middle of what you're looking at, not the top-left corner.
  useLayoutEffect(() => {
    const b = boxRef.current
    const next = ZOOMS[z]
    const r = next / prevZ.current
    prevZ.current = next
    if (!b || r === 1) return
    const cx = b.scrollLeft + b.clientWidth / 2
    const cy = b.scrollTop + b.clientHeight / 2
    b.scrollLeft = cx * r - b.clientWidth / 2
    b.scrollTop = cy * r - b.clientHeight / 2
    check()
  }, [z, check])

  return (
    <section className="rv" aria-label={`${resume.label} resume`}>
      <div className="rv-bar">
        <div className="rv-file">
          <span className="rv-name">{fileName}</span>
          <span className="rv-count">{count} page{count === 1 ? '' : 's'}</span>
        </div>
        <div className="rv-tools">
          <div className="rv-zoom" role="group" aria-label="Zoom">
            <button type="button" onClick={() => setZ((v) => Math.max(0, v - 1))} disabled={z === 0} aria-label="Zoom out" data-cursor="zoom out">−</button>
            <button type="button" className="rv-zlabel" onClick={() => setZ(0)} aria-label="Fit to width" data-cursor="fit">{z === 0 ? 'fit' : `${Math.round(ZOOMS[z] * 100)}%`}</button>
            <button type="button" onClick={() => setZ((v) => Math.min(ZOOMS.length - 1, v + 1))} disabled={z === ZOOMS.length - 1} aria-label="Zoom in" data-cursor="zoom in">+</button>
          </div>
          <a className="btn ghost" href={fileUrl(resume.file)} target="_blank" rel="noopener noreferrer" data-magnetic data-cursor="new tab">Open PDF</a>
          <a className="btn solid" href={fileUrl(resume.file)} download data-magnetic data-cursor="download">Download</a>
        </div>
      </div>

      <div className={`rv-frame ${more ? 'more' : ''}`}>
        <div className="rv-box" ref={boxRef} onScroll={check} tabIndex={0} data-cursor="scroll" aria-label={`${resume.label} resume preview. Scroll to read.`}>
          <div className="rv-pages" style={{ '--z': ZOOMS[z] }}>
            {data.pages.map((p, i) => (
              <div key={p.img} className={`rv-page ${loaded[p.img] ? 'ready' : ''}`} style={{ aspectRatio: `${p.width} / ${p.height}` }}>
                <img
                  src={imgUrl(p.img)}
                  width={p.width}
                  height={p.height}
                  alt={`${name}'s ${resume.label.toLowerCase()} resume, page ${i + 1} of ${count}`}
                  data-img={p.img}
                  decoding="async"
                  draggable={false}
                  onLoad={(e) => {
                    // Wait until the image is decoded, so the print-in starts with pixels ready to show.
                    const done = () => { setLoaded((s) => ({ ...s, [p.img]: true })); check() }
                    const d = e.currentTarget.decode?.()
                    d ? d.then(done, done) : done()
                  }}
                />
                {p.links.map((l, j) => (
                  <a
                    key={j}
                    className="rv-link"
                    href={l.href}
                    {...(l.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                    style={{ left: `${l.x}%`, top: `${l.y}%`, width: `${l.w}%`, height: `${l.h}%` }}
                    data-cursor={linkLabel(l.href)}
                    aria-label={l.href.replace(/^mailto:/, 'Email ')}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.text && <div className="sr-only">{data.text}</div>}
    </section>
  )
}
