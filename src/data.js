// =====================================================================
//  ALL SITE CONTENT LIVES IN THIS FILE.
//
//  - Any text that starts with "TODO:" shows up on the site as a dashed
//    placeholder box, so you can see exactly what still needs filling in.
//  - Any link left as "" is hidden automatically.
//  - Lines marked  // CHECK  are my best guess. Confirm them.
//  - To add a project: copy one block in PROJECTS, change the slug + text.
// =====================================================================

export const SITE = {
  name: 'Akhil Ganti',
  handle: 'akhil',
  pitch: 'I work where engineering meets finance: models, markets, and the data in between.',
  role: 'Engineering @ Western University',
  currently: 'Engineering at Western University',
  openTo: 'Summer 2027 internships in finance, private equity, and software / ML', // CHECK
  email: 'akhilganti7@gmail.com',
  links: {
    github: 'https://github.com/akhilganti7',
    githubUser: 'akhilganti7', // turns on the live commit feed
    linkedin: 'https://www.linkedin.com/in/akhilganti7',
    openreview: 'https://openreview.net/profile?id=~Akhil_Ganti1',
    huggingface: '', // e.g. 'https://huggingface.co/your-handle'
  },
  // Your three resumes. Save each PDF in /public with these exact names and they appear on the Resume page.
  // To update one, replace the PDF (same name) and push. The scrollable preview rebuilds itself.
  // "short" is the name shown on phones, where space is tight.
  resumes: [
    { id: 'engineering', label: 'Engineering', short: 'Engineering', file: '/resume-engineering.pdf', blurb: 'For software, ML research and data roles.' },
    { id: 'business', label: 'Business', short: 'Business', file: '/resume-business.pdf', blurb: 'For finance, private equity and investment roles.' },
    { id: 'combined', label: 'Engineering + Business', short: 'Both', file: '/resume-combined.pdf', blurb: 'The full picture: both sides together.' },
  ],
  // Which resume the "Resume (PDF)" links around the site point to
  resume: '/resume-combined.pdf',
  // Optional: put a photo in /public (e.g. /public/me.jpg) and set it here.
  // The hero then draws your face in characters next to your name.
  photo: '',
  stats: [
    { value: 'NeurIPS', sub: '2025', label: 'Workshop paper accepted' },
    { value: '85.3%', sub: '', label: 'DecepBench accuracy' },
    { value: '4', sub: '', label: 'Industry roles' },
  ],
}

// Contact form ("Summon"). Pick ONE free service and paste its key/ID here.
//   Formspree:  make a form at formspree.io, copy the ID from https://formspree.io/f/XXXXXXX
//   Web3Forms:  get an access key at web3forms.com (sent to your email)
// If both are empty, the form opens the visitor's email app instead.
export const CONTACT = {
  formspreeId: '',
  web3formsKey: 'a6c148cd-63de-4937-9657-af81b8f2db5b', // public by design: it only lets people send messages TO you
  reasons: ['Project', 'Internship', 'Research', 'Other'],
}

// Little tickers that trail behind the cursor and scroll in the status bar.
export const TICKERS = [
  'DECP 85.3%', 'F1 0.83', 'AUC 0.91', 'NRPS 2025', 'ACL SICON', '+12.0% vs unimodal',
  'DOLOS 1,675 clips', 'BERT 68.2 → 79.4', 'MOSAIC $1.5M+', 'MOSAIC 4 TB/HR', 'WSIB $1.8M VALIDATED', 'CI/CD -45% DEPLOY TIME', '50+ STUDIOS MAPPED',
]

// ---------------------------------------------------------------------
// TRACK RECORD (the chart on the home page). Month + year, in order.
// ---------------------------------------------------------------------
export const MILESTONES = [
  { date: '2024-06', label: 'Research on the world\'s first MOSAIC microscope, in Nobel laureate Eric Betzig\'s lab' },
  { date: '2024-11', label: 'Applied ML Researcher at Algoverse' }, // CHECK: your resume says "Nov. 2025 - Jul. 2025"
  { date: '2025-07', label: 'DecepBench published at ACL SiCon 2025 in Vienna' },
  { date: '2025-09', label: 'Started Engineering at Western University' },
  { date: '2025-12', label: 'DecepBench at NeurIPS 2025 (CogInterp workshop)' },
  { date: '2026-02', label: 'Software Engineer at MomentumMind Research' },
  { date: '2026-04', label: 'Analyst at Arc Reactor Capital and Baird Augustine' },
  { date: '2026-05', label: 'Payments Analyst Intern at WSIB' },
  { date: '2026-07', label: 'Shipped Stock Compass, a DCF valuation app' },
]

// ---------------------------------------------------------------------
// ABOUT (professional, first person). Edit freely.
// ---------------------------------------------------------------------
export const ABOUT = {
  intro: [
    "I'm an engineering student at Western University. I build systems that turn messy data into decisions people can act on, and I'm keen to explore where software systems collide with financial models, markets and the concepts behind them.",
    'My work so far sits where engineering meets finance. I co-authored DecepBench, a multimodal deception-detection benchmark published at ACL SiCon 2025, and had the opportunity to travel to Vienna to present it at the Association for Computational Linguistics conference (ACL 2025). I validated over $1.8M in benefit payments as a Payments Analyst Intern at WSIB, I built software at MomentumMind Research, and I have experience in private equity and investment analysis from Arc Reactor Capital and Baird Augustine.',
  ],
  intersection: [
    'The same habits carry across both worlds. Define the problem tightly, measure what actually matters, and be honest about where a model or a deal can break.',
    'Research taught me to put the limitations right next to the results. Finance taught me that every number needs a decision attached to it. I like work where both are true at once: models that move money, data that changes a call.',
  ],
  headed: "I'm building toward a career in finance and private equity, with an engineer's toolkit: I can build the model, the pipeline, or the product myself instead of only reading the output.", // CHECK
  strengths: [
    {
      title: 'Research rigour',
      proof: 'Co-authored DecepBench (85.3% accuracy, ACL SiCon 2025 and NeurIPS 2025 workshop), and trained cell-segmentation models on the world\'s first MOSAIC microscope in Nobel laureate Eric Betzig\'s lab at UC Berkeley.',
    },
    {
      title: 'Data to decisions',
      proof: 'Validated over $1.8M in approved benefit payments across 9,000+ claims as a Payments Analyst Intern at WSIB.',
    },
    {
      title: 'Capital markets lens',
      proof: 'AI-sector modelling for a $50M AUM portfolio at Baird Augustine, and a landscape report on 50+ venture studios at Arc Reactor Capital.',
    },
    {
      title: 'Ships real software',
      proof: 'Cut deployment time 45% with CI/CD at MomentumMind Research, and built Stock Compass, a full-stack app with a live DCF valuation model.',
    },
  ],
  education: [
    { name: 'Western University', detail: 'Bachelor of Engineering (Co-op), with Advanced Entry Opportunity (AEO) to the Ivey Business School. Western Scholarship of Distinction.', year: 'Sept 2025 – present' },
  ],
  leadership: [
    { name: 'Vice President of Finance, Telugu Student Union', detail: 'Executive board of a 300+ member cultural club.', year: 'Nov 2025 – present' }, // CHECK: Aug resume says Jun 2026
    { name: 'Western Formula One Team', detail: 'Member.', year: '2025 – present' },
    { name: 'Western Investment Club', detail: 'Member.', year: '2025 – present' },
    { name: 'Pre-Business Student Network, Western AI, case competitions', detail: 'Member and competitor.', year: '2025 – present' },
  ],
}

export const SKILLS = [
  { group: 'Programming', items: ['Python', 'Java', 'JavaScript', 'MATLAB', 'Bash'] },
  { group: 'ML / AI', items: ['PyTorch', 'scikit-learn', 'Hugging Face', 'RunPod', 'CUDA', 'Cellpose', 'ImageBind', 'SHAP / LIME', 'Jupyter'] },
  { group: 'Data', items: ['pandas', 'NumPy', 'Matplotlib', 'Excel', 'Fiji / ImageJ'] },
  { group: 'Web', items: ['React', 'Node.js', 'Tailwind CSS', 'Flask', 'GitHub Actions', 'Stripe'] },
  { group: 'Finance', items: ['Financial modelling', 'DCF valuation', 'Investment theses', 'Market research'] },
  { group: 'Engineering', items: ['SolidWorks', 'Onshape', 'LaTeX / Overleaf'] },
]

// ---------------------------------------------------------------------
// RESEARCH. Numbers below come straight from the DecepBench paper tables.
// ---------------------------------------------------------------------
export const PAPER = {
  slug: 'decepbench',
  title: 'DecepBench: Benchmarking Multimodal Deception Detection',
  short: 'DecepBench',
  // Author order as published on the ACL Anthology (your name is bolded automatically)
  authors: ['Ethan Braverman', 'Vittesh Maganti', 'Nysa Lalye', 'Ethan Chen', 'Akhil Ganti', 'Aryan Sudhir', 'Michael Lu', 'Kevin Zhu', 'Vasu Sharma', "Sean O'Brien"],
  venues: [
    { name: 'NeurIPS 2025', status: 'Accepted', note: 'CogInterp workshop', link: '' }, // paste the OpenReview submission link here to make the badge clickable
    { name: 'ACL SiCon 2025', status: 'Published', note: 'Vienna, Austria' },
    { name: 'MASC-SLL', status: '', note: '' },
    { name: 'ACL GEM', status: '', note: '' },
  ],
  links: {
    paper: 'https://aclanthology.org/2025.sicon-1.3/',
    openreview: 'https://openreview.net/profile?id=~Akhil_Ganti1',
    code: 'https://github.com/akhilganti7/DecepBench',
    huggingface: '',
  },
  contribution: "Trained the model, and sped up the experiments by running them on Hugging Face's cloud GPUs.",
  problem: 'Deception detection matters in security, forensics, legal settings, and for checking whether AI systems are reliable. But there was no large, generalizable, explainable benchmark. Models trained on one setting kept failing on others.',
  built: [
    'A benchmark built on DOLOS, the largest game-show deception dataset: 1,675 video clips from 213 people, each 2 to 19 seconds of real, high-stakes lying.',
    'Transcripts added to every clip, creating a third input type (text) next to video and audio.',
    '9 interpretable features grounded in psychology research, like micro-expressions (OpenFace), response latency (Praat), lexical diversity (MATTR), sensory detail and word count (LIWC), and body-vs-speech mismatch (OpenPose).',
    'Explainability with SHAP and LIME, so the model shows why it flags a clip as deceptive.',
    "ImageBind (Meta AI's multimodal model), with its text encoder re-trained on interview transcripts for a 9% accuracy gain.",
  ],
  headline: [
    { value: '85.3%', label: 'Accuracy on DOLOS' },
    { value: '0.91', label: 'AUC-ROC' },
    { value: '+12%', label: 'Over single-modality baselines' },
    { value: '11.2 pts', label: 'Gain at equal model size' },
  ],
  modelComparison: {
    source: 'Table 1',
    takeaway: 'Combining video, audio and text beats every single-input model on all three metrics.',
    rows: [
      { name: 'Text only (BERT)', accuracy: 66.8, f1: 0.64, auc: 0.72 },
      { name: 'Audio only (HuBERT)', accuracy: 71.2, f1: 0.69, auc: 0.77 },
      { name: 'Visual only (SlowFast)', accuracy: 73.4, f1: 0.71, auc: 0.81 },
      { name: 'DecepBench model', accuracy: 85.3, f1: 0.83, auc: 0.91, ours: true },
    ],
  },
  generalization: {
    source: 'Table 3',
    takeaway: 'The model holds up on five other datasets, from courtrooms to healthcare to fake reviews.',
    rows: [
      { name: 'Deceptive Opinion Spam', modality: 'Text', accuracy: 89.2, precision: 88.7, recall: 87.5, f1: 0.88, features: 'Lexical diversity' },
      { name: 'Box of Lies (Staged)', modality: 'Video + Text', accuracy: 82.6, precision: 83.1, recall: 80.9, f1: 0.82, features: 'Micro-expressions, verbal redundancy' },
      { name: 'MDPE (Healthcare)', modality: 'Video + Audio', accuracy: 80.4, precision: 81.0, recall: 77.3, f1: 0.79, features: 'Head movements, speech rate' },
      { name: 'Real-life Legal Deception', modality: 'Video + Text', accuracy: 78.1, precision: 76.2, recall: 74.8, f1: 0.75, features: 'Gaze shifts, hesitation pauses' },
      { name: 'Human Speech Detection', modality: 'Audio', accuracy: 75.9, precision: 73.5, recall: 72.1, f1: 0.73, features: 'Pitch variation' },
    ],
  },
  ablation: {
    source: 'Table 2',
    full: 85.3,
    takeaway: 'Taking out micro-expressions hurts the most, which matches what psychology research predicts.',
    rows: [
      { name: 'Micro-expressions removed', accuracy: 76.2, change: -9.1, impact: 'Missed deception in high-stakes settings (high-stakes recall fell 22%)' },
      { name: 'Pitch variation removed', accuracy: 77.5, change: -7.8, impact: 'Weaker on voice-driven lies (F1 0.71 → 0.59)' },
      { name: 'Lexical redundancy removed', accuracy: 80.0, change: -5.3, impact: 'Weaker in low-stakes settings' },
    ],
  },
  shap: {
    source: 'Figure 3, SHAP analysis',
    takeaway: 'Two cues carry most of the signal: fleeting facial expressions and unstable pitch.',
    rows: [
      { name: 'Micro-expressions', share: 35 },
      { name: 'Pitch variation', share: 28 },
      { name: 'Hesitation pauses' },
      { name: 'Gaze shifts' },
      { name: 'Lexical diversity' },
      { name: 'Head movements' },
    ],
  },
  sameSize: {
    source: 'Section 5, parameter-matched test',
    takeaway: 'At the same 300M parameters, multimodal still wins by 11.2 points. Fusion drives the gain, not model size.',
    rows: [
      { name: 'BERT, text only (300M)', accuracy: 68.2 },
      { name: 'ImageBind, multimodal (300M)', accuracy: 79.4, ours: true },
    ],
  },
  limitations: [
    '14.2% false-positive rate in high-stakes clips, where stress gets mistaken for lying.',
    'About 12% of DOLOS clips show people with tightly controlled voice and face, which leads to missed lies.',
    'Precision dropped to 71.3% on staged interviews (Bag of Lies), which lack real stress signals.',
    'Lower performance on non-Western data because gaze and nodding patterns differ across cultures.',
  ],
  future: 'More datasets and domains, real-time detection, physiological signals like heart rate and EEG, and models that adapt across cultures and languages.',
}

export const OTHER_RESEARCH = [
  {
    name: 'UC Berkeley, Advanced Bioimaging Center',
    role: 'Cancer cell and bio-engineering research intern',
    mentor: 'Worked under Nobel laureate Eric Betzig (Nobel Prize in Chemistry, 2014)',
    year: 'Jun – Sep 2024',
    summary: 'Used the world\'s first MOSAIC, a $1.5M+ research microscope that combines more than ten imaging techniques in one instrument, and trained cell-segmentation models that find and outline individual cells so researchers can measure them automatically instead of tracing each one by hand.',
    highlights: [
      { value: '$1.5M+', label: 'Cost of the MOSAIC microscope (USD)' },
      { value: '1st', label: 'MOSAIC ever built, worldwide' },
      { value: 'Nobel', label: 'Lab led by Eric Betzig, Chemistry 2014' },
      { value: '4 TB/hr', label: 'Data MOSAIC can generate' },
    ],
    did: [
      'Prepared MOSAIC (Multimodal Optical Scope with Adaptive Imaging Correction) for intensive data collection on cancer cells from fish and LLC-PK1 cells, a pig kidney cell line.',
      'Analyzed petabytes of microscope data with Python scripts.',
      'Labelled nuclei in LLC-PK1 cells using PyTorch, NumPy, pandas, Matplotlib, ImageJ and Fiji, and checked the data for discrepancies.',
      'Trained and fine-tuned cell-segmentation models (Cellpose) to detect abnormalities in the data.',
    ],
    tools: ['MOSAIC microscope', 'Python', 'PyTorch', 'NumPy', 'pandas', 'Matplotlib', 'Fiji / ImageJ', 'Cellpose'],
    result: '', // add a real number here later if you find one (accuracy, images processed, time saved)
  },
]

// ---------------------------------------------------------------------
// EXPERIENCE
// ---------------------------------------------------------------------
export const EXPERIENCE = [
  {
    slug: 'wsib',
    company: 'WSIB',
    title: 'Payments Analyst Intern',
    team: 'Healthcare Payments',
    dates: 'May 2026 – Sep 2026',
    summary: 'Analyst on the Healthcare Payments team at the Workplace Safety and Insurance Board, in Toronto.',
    did: [
      'Reviewed and processed 9,000+ active claims in the WSIB system, speeding up work for several teams.',
      'Validated over $1.8M in approved benefit payments to injured workers, supporting their rehabilitation and financial relief.',
      'Ran Excel analysis on large, high-volume data sets and documents.',
    ],
    impact: '$1.8M+ in benefit payments validated across 9,000+ claims.',
    tags: ['Data analysis', 'Excel', 'Payments', 'Healthcare'],
  },
  {
    slug: 'momentummind',
    company: 'MomentumMind Research',
    title: 'Software Engineer',
    team: '',
    dates: 'TODO: Feb 2026 – end month',
    summary: 'Building and shipping production software for a research firm in Mississauga (remote).',
    did: [
      'Built and deployed a scalable app with React, Tailwind CSS and Node.js.',
      'Set up CI/CD workflows in GitHub Actions that cut deployment time by 45% and reduced production errors.',
      'Designed and shipped a real-time payment system using Stripe webhooks.',
    ],
    impact: 'Deployment time cut by 45%.',
    tags: ['React', 'Node.js', 'GitHub Actions', 'Stripe'],
  },
  {
    slug: 'arc-reactor',
    company: 'Arc Reactor Capital',
    title: 'Private Equity Analyst',
    team: '',
    dates: 'Apr 2026 – Sep 2026',
    summary: 'Private equity analysis for an AI-native venture studio in Austin, Texas (remote).',
    did: [
      'Wrote a global landscape report on 50+ autonomous venture studios, documenting their technology stacks and operating models.',
      'Turned research into strategic frameworks and investment theses for the portfolio.',
    ],
    impact: 'Landscape report covering 50+ venture studios, used to shape investment strategy.',
    tags: ['Private equity', 'Venture', 'Research'],
  },
  {
    slug: 'baird-augustine',
    company: 'Baird Augustine',
    title: 'Investment Analyst',
    team: '',
    dates: 'Apr 2026 – Sep 2026',
    summary: 'Investment analysis for a firm in Los Gatos, California (remote).',
    did: [
      'Market analysis and financial modelling on AI-sector companies, supporting investment theses for a $50M AUM portfolio.',
      'Turned market trends and complex data into investor-ready briefings and valuation reports.',
      'Lender network research for capital advisory work, including expanding the firm\'s lender database.',
    ],
    impact: 'Supported investment theses for a $50M AUM portfolio.',
    tags: ['Financial modelling', 'Valuation', 'AI sector'],
  },
]

// ---------------------------------------------------------------------
// PROJECTS (each one gets its own case-study page)
// ---------------------------------------------------------------------
export const PROJECTS = [
  {
    slug: 'portfolio',
    name: 'Market Terminal Portfolio',
    status: 'Live',
    year: '2026',
    oneLiner: 'This site: a market-terminal portfolio with live character art, a cursor that reacts, and interactive research charts.',
    purpose: 'A resume tells people what you did. I wanted something that shows how I think: research results you can explore, projects written up as case studies, and a recruiter mode that gets someone the facts in under a minute.',
    role: 'Design, build and deployment', // CHECK
    flow: ['One content file (data.js)', 'React + Vite build', 'GitHub Actions', 'GitHub Pages'],
    stack: ['React', 'Vite', 'React Router', 'Canvas 2D', 'View Transitions API', 'GitHub Actions', 'GitHub Pages', 'Web3Forms'],
    challenges: [
      {
        problem: 'The name in the hero is thousands of characters redrawn every frame, and switching the canvas colour for each one made it stutter.',
        fix: 'Grouped characters into 8 brightness buckets, so the canvas changes colour 8 times a frame instead of thousands. The loop also pauses when the hero is off screen or the tab is hidden.',
      },
      {
        problem: 'Scroll-in animations never fired. Hiding elements with clip-path made the browser\'s IntersectionObserver report them as never on screen.',
        fix: 'Hid them behind an overlay that slides away instead, so the element keeps its real size and the observer can see it.',
      },
      {
        problem: 'GitHub Pages only serves real files, so refreshing or sharing a link like /projects/stock-compass gave a 404.',
        fix: 'The build copies the app into 404.html, so any page address loads the app and the router shows the right page.',
      },
      {
        problem: 'Heavy animation can be distracting, slow on phones, or a problem for people sensitive to motion.',
        fix: 'Added an Animations switch, a plain Recruiter mode, and automatic calm mode for devices set to reduce motion. The custom cursor only loads on computers with a mouse.',
      },
    ],
    results: [
      { value: '100', label: 'Lighthouse performance on desktop (96 on mobile)' },
      { value: '100', label: 'Lighthouse accessibility, best practices and SEO' },
      { value: '104 KB', label: 'JavaScript for the whole site, compressed' },
      { value: '$0', label: 'Hosting cost, served free by GitHub Pages' },
    ],
    next: 'Pull live market data into the ticker, add short write-ups behind each research chart, and keep adding a case study for every new project.', // CHECK
    links: { github: 'https://github.com/akhilganti7/akhilganti7.github.io', demo: 'https://akhilganti7.github.io', huggingface: '' },
  },
  {
    slug: 'stock-compass',
    name: 'Stock Compass',
    status: 'Built',
    year: 'Jul 2026',
    oneLiner: 'Full-stack stock and portfolio analysis app with a live DCF valuation model.',
    purpose: 'Investors jump between tabs to piece together one company. Stock Compass pulls the numbers into one place and lets you value the business yourself, with a DCF model you can adjust in real time.',
    role: 'Solo builder, design to deployment', // CHECK
    flow: ['React + Recharts UI (Vercel)', 'Flask API in Python (Render)', 'yfinance market data'],
    stack: ['React', 'Python', 'Flask', 'yfinance', 'Recharts', 'Vercel', 'Render'],
    challenges: [
      { problem: 'TODO: the hardest bug or design problem you hit', fix: 'TODO: how you solved it' },
    ],
    results: [
      { value: 'DCF', label: 'Valuation model with real-time sensitivity analysis, set by the user' },
      { value: '5+', label: 'Metrics on the dashboard: P/E, EBITDA, debt-to-equity, ROE, free cash flow and more' },
    ],
    next: 'TODO: what you would add next.',
    links: { github: 'https://github.com/akhilganti7/Stock-Compass', demo: '', huggingface: '' },
  },
  {
    slug: 'light-logger',
    name: 'Light Data Logging Unit',
    status: 'Built',
    year: 'Apr 2026',
    oneLiner: 'Autonomous light sensor that logs data on its own, plus a MATLAB tool that turns it into interactive visuals.',
    purpose: 'The existing solution was costly and needed someone there to record readings. This sensor records data by itself, and the software turns the raw output into something engineers and stakeholders can actually read.',
    role: 'TODO: your role (solo or team?)',
    flow: ['Light sensor, logging on its own', 'MATLAB processing of 10+ data types', 'XLSX export + interactive visuals'],
    stack: ['MATLAB', 'Excel', 'Sensors'],
    challenges: [{ problem: 'TODO: the hardest problem you hit', fix: 'TODO: how you solved it' }],
    results: [
      { value: '10+', label: 'Raw data types processed from the sensor' },
      { value: '4', label: 'Key variables turned into interactive visuals' },
    ],
    next: 'TODO: what you would add next.',
    links: { github: '', demo: '', huggingface: '' },
  },
  {
    slug: 'ai-companion',
    name: 'AI Companion',
    status: 'In progress',
    year: '2026',
    oneLiner: 'AI companion that checks in with elderly users over iMessage and voice, and remembers their life.',
    purpose: 'Many older adults are isolated and their families can\'t check in every day. The companion talks with them where they already are (iMessage, voice), remembers context, and keeps families in the loop.',
    role: 'Founder and builder', // CHECK
    flow: ['iMessage / voice', 'LLM with long-term memory', 'Family check-in summaries'],
    stack: ['LLMs', 'Voice', 'TODO: frameworks'],
    challenges: [{ problem: 'TODO', fix: 'TODO' }],
    results: [{ value: 'TODO', label: 'add a number: users, messages, retention' }],
    next: 'TODO',
    links: { github: '', demo: '', huggingface: '' },
  },
  {
    slug: 'tesla-routes',
    name: 'Tesla Scenic Routes',
    status: 'Concept',
    year: '2026',
    oneLiner: "Scenic route planner built on Tesla's Fleet API.",
    purpose: 'Navigation picks the fastest route. This picks the best drive, and sends it straight to the car.',
    role: 'Solo builder', // CHECK
    flow: ['Route request', 'Scenic scoring', 'Tesla Fleet API'],
    stack: ['Tesla Fleet API', 'TODO: maps API, frontend'],
    challenges: [{ problem: 'TODO', fix: 'TODO' }],
    results: [],
    next: 'TODO',
    links: { github: '', demo: '', huggingface: '' },
  },
]
