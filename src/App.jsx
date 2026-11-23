import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { TopBar, StatusBar, RouteEffects } from './components/Chrome.jsx'
import Cursor from './components/Cursor.jsx'
import CommandMenu from './components/CommandMenu.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Research from './pages/Research.jsx'
import { Projects, ProjectDetail } from './pages/Projects.jsx'
import { Experience, ExperienceDetail } from './pages/Experience.jsx'
import Summon from './pages/Summon.jsx'
import { Resume, Recruiter, NotFoundPage } from './pages/Misc.jsx'
import { useLocation } from 'react-router-dom'

const TITLES = {
  '/': '', '/about': 'About', '/research': 'Research: DecepBench', '/projects': 'Projects',
  '/experience': 'Experience', '/summon': 'Summon', '/resume': 'Resume', '/recruiter': 'Summary',
}

export default function App() {
  const [cmd, setCmd] = useState(false)
  const loc = useLocation()
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <RouteEffects titles={TITLES} />
      <TopBar onCommand={() => setCmd(true)} />
      <main id="main" key={loc.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/research" element={<Research />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/experience/:slug" element={<ExperienceDetail />} />
          <Route path="/summon" element={<Summon />} />
          <Route path="/contact" element={<Summon />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/recruiter" element={<Recruiter />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <StatusBar onCommand={() => setCmd(true)} />
      <div className="vignette" aria-hidden="true" />
      <Cursor />
      <CommandMenu open={cmd} setOpen={setCmd} />
    </>
  )
}
