// =====================================================================
//  Resume previews
//
//  Turns each resume PDF listed in SITE.resumes (src/data.js) into page
//  images plus clickable link areas, so the Resume page can show a
//  scrollable preview that looks the same on every phone and browser.
//
//  You never need to run this by hand: it runs before `npm run dev` and
//  `npm run build`, and GitHub runs it on every push. To update a resume,
//  replace the PDF in /public (same file name) and push.
//
//  Output: src/assets/resumes/*.webp and src/resume-pages.json
// =====================================================================
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = path.join(root, 'src/assets/resumes')
const MANIFEST = path.join(root, 'src/resume-pages.json')
const WIDTH = 1600 // pixels wide; sharp on retina screens at the preview's max size
const QUALITY = 80

const round = (n) => Math.round(n * 100) / 100

async function main() {
  const { SITE } = await import(pathToFileURL(path.join(root, 'src/data.js')).href)
  const resumes = SITE.resumes || []
  const old = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : {}
  const manifest = {}

  let pdfjs, createCanvas
  try {
    pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
    ;({ createCanvas } = await import('@napi-rs/canvas'))
  } catch (err) {
    console.warn(`[resumes] couldn't load the PDF renderer, keeping the existing previews (${err.message})`)
    return
  }

  await mkdir(OUT_DIR, { recursive: true })
  const nodeModules = path.join(root, 'node_modules/pdfjs-dist')

  for (const r of resumes) {
    const pdfPath = path.join(root, 'public', r.file.replace(/^\//, ''))
    if (!existsSync(pdfPath)) {
      console.warn(`[resumes] ${r.id}: no PDF at public${r.file} yet, skipping`)
      continue
    }
    try {
      const data = new Uint8Array(await readFile(pdfPath))
      const task = pdfjs.getDocument({
        data,
        standardFontDataUrl: path.join(nodeModules, 'standard_fonts') + '/',
        wasmUrl: path.join(nodeModules, 'wasm') + '/',
        isEvalSupported: false,
        verbosity: 0,
      })
      const doc = await task.promise

      const pages = []
      const text = []
      for (let n = 1; n <= doc.numPages; n++) {
        const page = await doc.getPage(n)
        const base = page.getViewport({ scale: 1 })
        const vp = page.getViewport({ scale: WIDTH / base.width })
        const canvas = createCanvas(Math.round(vp.width), Math.round(vp.height))
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        await page.render({ canvas, canvasContext: ctx, viewport: vp }).promise

        const img = `${r.id}-p${n}.webp`
        await writeFile(path.join(OUT_DIR, img), await canvas.encode('webp', QUALITY))

        // Links inside the PDF (email, LinkedIn, GitHub...) become clickable boxes over the image.
        // PDF coordinates start at the bottom-left, so flip y to measure from the top.
        const [vx0, vy0, vx1, vy1] = page.view
        const pw = vx1 - vx0
        const ph = vy1 - vy0
        const links = (await page.getAnnotations())
          .filter((a) => a.subtype === 'Link' && (a.url || a.unsafeUrl))
          .map((a) => {
            const [x1, y1, x2, y2] = a.rect
            return {
              href: a.url || a.unsafeUrl,
              x: round(((Math.min(x1, x2) - vx0) / pw) * 100),
              y: round(((vy1 - Math.max(y1, y2)) / ph) * 100),
              w: round((Math.abs(x2 - x1) / pw) * 100),
              h: round((Math.abs(y2 - y1) / ph) * 100),
            }
          })

        // Plain text copy for screen readers and search engines.
        const tc = await page.getTextContent()
        text.push(tc.items.map((i) => i.str + (i.hasEOL ? '\n' : '')).join('').replace(/[ \t​]+/g, ' ').trim())

        pages.push({ img, width: canvas.width, height: canvas.height, links })
        page.cleanup()
      }
      await task.destroy()
      manifest[r.id] = { pages, text: text.join('\n\n') }
      console.log(`[resumes] ${r.id}: ${pages.length} page${pages.length === 1 ? '' : 's'}`)
    } catch (err) {
      console.warn(`[resumes] ${r.id}: couldn't render (${err.message})`)
      if (old[r.id]) manifest[r.id] = old[r.id] // keep the last good preview
    }
  }

  // Remove images that no longer belong to any resume.
  const keep = new Set(Object.values(manifest).flatMap((m) => m.pages.map((p) => p.img)))
  for (const f of await readdir(OUT_DIR)) if (!keep.has(f)) await rm(path.join(OUT_DIR, f))

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
}

main().catch((err) => {
  // Never block the site from building because of a preview.
  console.warn(`[resumes] skipped: ${err.message}`)
})
