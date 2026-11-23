# akhil-site

Personal site in a "market terminal" style. React + Vite, hosted free on GitHub Pages.

Features: dark and light themes, a Resume page with three scrollable resume previews, an animations on/off switch, live character-art name that reacts to your cursor and clicks, custom glowing cursor with labels / magnetic buttons / ticker trail, character-style track-record chart, DecepBench results as interactive charts, project case studies, Summon contact form, slash-command menu (press /), Recruiter mode (plain printable one-pager), live GitHub commit feed, link preview image for LinkedIn.

---

## 1. Fill in your info

Almost everything lives in **`src/data.js`**.

- Anything starting with `TODO:` shows as a **yellow dashed "fill in" box** when you run the site on your computer (`npm run dev`), so you can see what's missing. On the live site, TODOs (and any section left empty) are hidden.
- Links left as `''` are hidden automatically.
- Lines marked `// CHECK` are guesses (mostly dates). Confirm them.

Also:

| What | Where |
|---|---|
| Resumes (3 versions) | `public/resume-engineering.pdf`, `public/resume-business.pdf`, `public/resume-combined.pdf`. To update one, replace the file (keep the same name) and push. |
| Photo (optional, draws your face in characters next to your name) | Save as `public/me.jpg`, then set `photo: '/me.jpg'` in `src/data.js` |
| Your site address (for the LinkedIn preview image) | Edit `.env`: `VITE_SITE_URL=https://YOUR-USERNAME.github.io` |
| Live commit feed | Set `githubUser` in `src/data.js` |

## 2. Preview it on your computer

1. Install **Node.js** (the LTS version) from nodejs.org.
2. Open a terminal in this folder and run:
   ```
   npm install
   npm run dev
   ```
3. Open the link it prints (usually http://localhost:5173). Edits to `src/data.js` show up instantly.

## 3. Connect the Summon form (2 minutes, free)

Pick one:

- **Formspree:** sign up at formspree.io, create a form, copy the ID from the URL `https://formspree.io/f/XXXXXXX`, paste it into `CONTACT.formspreeId` in `src/data.js`.
- **Web3Forms:** go to web3forms.com, enter your email, copy the access key they send you into `CONTACT.web3formsKey`.

Until one is set, the form opens the visitor's email app (if you set `SITE.email`), or shows a "not connected yet" message.

## 4. Put it online with GitHub Pages

1. On GitHub, create a **public** repository named exactly **`YOUR-USERNAME.github.io`**.
2. In a terminal in this folder:
   ```
   git init
   git add .
   git commit -m "first version"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
   git push -u origin main
   ```
3. On GitHub, open the repo, then **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.
4. Open the **Actions** tab. When the "Deploy to GitHub Pages" run turns green (about a minute), your site is live at **https://YOUR-USERNAME.github.io**.

From now on, every `git push` redeploys the site automatically.

> Using a different repo name (like `portfolio`)? The site would live at `/portfolio/`. Change `base` in `vite.config.js` to `'/portfolio/'`.

## 5. Updating later

Edit `src/data.js`, then:
```
git add .
git commit -m "update projects"
git push
```

## Notes

- **Light / dark theme** (the half-circle button): same animations in both. Switching wipes the new theme in as a circle from the button.
- **Animations switch**: turning it on makes the whole screen glow once; turning it off stops everything instantly. The choice is remembered. Visitors whose device is set to "reduce motion" start with it off.
- **Recruiter mode** (switch, or `/recruiter`) turns off all effects and shows a plain one-page summary that prints cleanly.
- On laptops and phones the theme / animations / recruiter switches sit in the bottom bar so all the tabs fit up top.
- **Resume page** shows each PDF as a scrollable preview with zoom, and the links inside the PDF (email, LinkedIn, GitHub, paper) stay clickable. The preview images are made from the PDFs automatically every time you run `npm run dev` or push (the script is `scripts/resume-previews.mjs`). You can link straight to one version: `/resume?v=engineering`, `/resume?v=business`, or just `/resume` for the combined one.
- **/** opens the command menu (⌘K / Ctrl+K works too). Type a command like `/summon` or `/research` and press Enter.
- Effects turn off automatically for people who set "reduce motion" on their device. The custom cursor only appears on computers with a mouse.
- Research numbers come from the DecepBench paper's tables (Tables 1–3, Figure 3).
