import { type KeyboardEvent as ReactKeyboardEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'

type Signal = 'Face' | 'Heartbeat' | 'Document' | 'Transaction' | 'Satellite image' | 'Deadline' | 'Vehicle'
type ProjectArea = 'Vision' | 'Hardware' | 'Product' | 'Web3'
type ProjectKey = 'nhai' | 'pravaha' | 'biowallet' | 'satellite' | 'classroom' | 'parkwise'
type CaseTab = 'play' | 'understand' | 'inspect'

type Scenario = {
  title: string
  description: string
}

type ProblemPrompt = {
  projectKey: ProjectKey
  prompt: string
  responseTitle: string
  response: string
  steps: [string, string, string]
}

type Project = {
  key: ProjectKey
  number: string
  signal: Signal
  constraint: string
  area: ProjectArea
  title: string
  summary: string
  status: string
  problem: string
  approach: string
  outcome: string
  contribution: string
  teamNote?: string
  stack: string[]
  limitations: string
  nextStep: string
  sourceLabel: string
  sourceUrl?: string
  scenarios: Scenario[]
}

const projects: Project[] = [
  {
    key: 'nhai',
    number: '01',
    signal: 'Face',
    constraint: 'Offline',
    area: 'Vision',
    title: 'NHAI Field Authentication',
    summary: 'Face authentication for field attendance when the network is gone. Verify locally, save the event, sync it later.',
    status: 'Working prototype',
    problem: 'At a field site, attendance cannot stop just because the connection dropped.',
    approach: 'The prototype checks the face on-device, stores confirmed attendance in a SQLite outbox, and syncs only when a connection is back.',
    outcome: 'The important moment still happens locally. The cloud sync can wait.',
    contribution: 'The interesting bit here is the offline outbox and the decision not to make a server round-trip part of attendance.',
    stack: ['Python', 'OpenCV', 'ONNX', 'MediaPipe', 'SQLite outbox'],
    limitations: 'This is the verified Python and OpenCV prototype. The React Native version is still planned.',
    nextStep: 'Package the on-device inference for mobile, then test the full offline and sync loop on a real field workflow.',
    sourceLabel: 'junaidjmomin/datalakeapp',
    sourceUrl: 'https://github.com/junaidjmomin/datalakeapp',
    scenarios: [
      { title: 'Verify at the edge', description: 'Face alignment, liveness, and matching happen locally so a field worker is not blocked by connectivity.' },
      { title: 'Record without a network', description: 'A confirmed attendance event is stored in a local outbox with the information needed to retry safely.' },
      { title: 'Sync when the connection returns', description: 'Only acknowledged records are removed locally, making the hand-off between device and cloud explicit.' },
    ],
  },
  {
    key: 'pravaha',
    number: '02',
    signal: 'Document',
    constraint: 'Buyer context',
    area: 'Product',
    title: 'Pravaha',
    summary: 'A hackathon sales tool that starts with a company catalogue and carries that context through proposals, chat, and follow-up.',
    status: 'Working prototype',
    problem: 'Sales information tends to live in too many tabs. Catalogues, calls, proposals, and follow-ups lose context between them.',
    approach: 'Pravaha ingests company documents, makes them searchable in a proposal and chat, then carries the activity back to the sales team.',
    outcome: 'A big hackathon build that tried to make a sales conversation feel less fragmented.',
    contribution: 'This page follows the buyer journey through the product, not an unverified breakdown of who on the team built which feature.',
    teamNote: 'Built with a hackathon team. The story here is the product flow, not a claim about individual ownership.',
    stack: ['Next.js', 'FastAPI', 'MongoDB', 'Pinecone', 'Cohere / Groq'],
    limitations: 'Marketing, competitor, and sales-performance claims need independent proof before they go public.',
    nextStep: 'Show where a buyer-facing answer came from when it is based on retrieved documents.',
    sourceLabel: 'Anjali-Mishra05/Arka-AlgoForge26',
    sourceUrl: 'https://github.com/Anjali-Mishra05/Arka-AlgoForge26',
    scenarios: [
      { title: 'Turn a catalogue into context', description: 'Company documents are prepared for retrieval so a proposal can answer from the same source of truth.' },
      { title: 'Meet the buyer in the proposal', description: 'The buyer-facing layer combines an interactive proposal with an opportunity to ask document-informed questions.' },
      { title: 'Give the team a next step', description: 'Engagement, call, and coaching signals are made available to the person responsible for follow-up.' },
    ],
  },
  {
    key: 'biowallet',
    number: '03',
    signal: 'Transaction',
    constraint: 'Recovery',
    area: 'Web3',
    title: 'BioWallet',
    summary: 'A passkey wallet prototype with a recovery story for when you lose a device.',
    status: 'Working prototype',
    problem: 'A wallet should not become useless because a phone is lost, and recovery should not turn into another password problem.',
    approach: 'BioWallet uses browser passkeys, smart-account contracts, and a guardian-assisted recovery path.',
    outcome: 'A working demo that asks what self-custody could feel like when recovery is designed in from the start.',
    contribution: 'The important part is the recovery story, including the places where the demo still stops short of a production integration.',
    stack: ['Next.js', 'WebAuthn', 'Fastify', 'Solidity', 'ERC-4337'],
    limitations: 'validateUserOp() uses a demo proof envelope, not production on-chain WebAuthn verification. Bundler submission is mocked and persistence is not production-grade.',
    nextStep: 'Replace the demo proof and mocked bundler boundary before calling it a production wallet.',
    sourceLabel: 'junaidjmomin/biowallet',
    sourceUrl: 'https://github.com/junaidjmomin/biowallet',
    scenarios: [
      { title: 'Approve with a passkey', description: 'The wallet begins with the device-native WebAuthn ceremony rather than a new password.' },
      { title: 'Treat device loss as a state', description: 'A lost device changes the recovery path; it is not treated as the end of access.' },
      { title: 'Recover with guardians', description: 'Guardian confirmation provides the recoverable-account flow represented by the prototype contracts.' },
    ],
  },
  {
    key: 'satellite',
    number: '04',
    signal: 'Satellite image',
    constraint: 'Time',
    area: 'Vision',
    title: 'Satellite Change Detection',
    summary: 'A Siamese U-Net experiment that compares two satellite images and marks the areas that changed.',
    status: 'Experiment',
    problem: 'Looking for change across large satellite scenes by eye gets tiring fast.',
    approach: 'The experiment trains a Siamese U-Net on before-and-after image pairs from LEVIR-CD and predicts a pixel-level mask.',
    outcome: 'An ML experiment that produces change masks from paired satellite imagery.',
    contribution: 'This is a straight look at the paired-image model and the evaluation work around it.',
    stack: ['TensorFlow', 'Siamese U-Net', 'LEVIR-CD', 'Image preprocessing', 'Evaluation scripts'],
    limitations: 'No final metric is shown without a reproducible training and evaluation run.',
    nextStep: 'Run the full training and evaluation process again, then document the result properly.',
    sourceLabel: 'junaidjmomin/detecion',
    sourceUrl: 'https://github.com/junaidjmomin/detecion',
    scenarios: [
      { title: 'Place two moments side by side', description: 'The model receives paired imagery so the task is anchored in what changed, not in a single scene.' },
      { title: 'Predict an area of change', description: 'A shared encoder compares the paired input and produces a pixel-level mask.' },
      { title: 'Review the evidence', description: 'The result should guide visual inspection; it is not a claim that every change has been verified.' },
    ],
  },
  {
    key: 'classroom',
    number: '05',
    signal: 'Deadline',
    constraint: 'Overload',
    area: 'Product',
    title: 'Classroom Intelligence',
    summary: 'A calmer view of Google Classroom that ranks the work that needs attention first.',
    status: 'Working prototype',
    problem: 'A long assignment list makes everything feel urgent and nothing feel startable.',
    approach: 'The app pulls coursework from Google Classroom, then uses rule-based scoring, quick wins, and time-block suggestions to make the next move clearer.',
    outcome: 'A working productivity prototype that gives a student a reason to start somewhere.',
    contribution: 'The useful piece is the rule-based priority model and its explanation, not a magic AI label.',
    stack: ['Google Classroom API', 'Priority scoring', 'Quick-win logic', 'Natural-language parser'],
    limitations: 'Some behaviour is rule-based scoring and parsing. It should be described that way.',
    nextStep: 'Let a student change the priority inputs and see the recommendation move with them.',
    sourceLabel: 'junaidjmomin/classroom',
    sourceUrl: 'https://github.com/junaidjmomin/classroom',
    scenarios: [
      { title: 'Collect the work in one place', description: 'Assignments and courses are retrieved so the person does not have to reconstruct the workload by hand.' },
      { title: 'Make the trade-offs visible', description: 'Deadline pressure, effort, impact, and switching cost contribute to a transparent priority score.' },
      { title: 'Recommend the next useful move', description: 'Quick wins and time blocks turn the score into an actionable, explainable plan.' },
    ],
  },
  {
    key: 'parkwise',
    number: '06',
    signal: 'Vehicle',
    constraint: 'Access',
    area: 'Product',
    title: 'ParkWise',
    summary: 'A team parking product that joins booking, occupancy, visitor passes, and the gate.',
    status: 'Working prototype · team project',
    problem: 'Parking is simple until booking, visitors, occupied slots, and the gate all disagree with each other.',
    approach: 'The team combined a Flutter and Django platform with an interactive layer for occupancy, visitor passes, and the QR gate flow.',
    outcome: 'A team project that ties the operational side of parking to what a visitor and guard actually need to see.',
    contribution: 'This page follows the visitor pass from generation to the gate-side hand-off.',
    teamNote: 'Team project. The operational product and interactive demo are separate layers, and security or payment claims still need to be checked. The linked source below is the operational platform.',
    stack: ['Flutter', 'Django REST Framework', 'Supabase PostgreSQL', 'JWT', 'QR gate-flow sandbox'],
    limitations: 'The interactive layer should not be used to imply every payment or security feature exists in the backend.',
    nextStep: 'Check every gate and payment claim against the backend before making a public checklist.',
    sourceLabel: 'Operational platform / Parkingapp-crce/Parkingapp',
    sourceUrl: 'https://github.com/Parkingapp-crce/Parkingapp',
    scenarios: [
      { title: 'See available capacity', description: 'The operational layer tracks parking slots and booking state so access begins with current occupancy.' },
      { title: 'Issue a visitor pass', description: 'A visitor workflow creates a pass that is understandable to both the visitor and gate staff.' },
      { title: 'Connect the gate action', description: 'The interactive layer illustrates how a scan updates the visitor-access story without overstating backend guarantees.' },
    ],
  },
]

const filters: Array<ProjectArea | 'All'> = ['All', 'Vision', 'Hardware', 'Product', 'Web3']

const problemPrompts: ProblemPrompt[] = [
  {
    projectKey: 'nhai',
    prompt: 'The network drops',
    responseTitle: 'Keep the important part on the device.',
    response: 'Attendance should not stop because a field site lost its connection.',
    steps: ['Check the face locally', 'Save the confirmed event', 'Sync when the network is back'],
  },
  {
    projectKey: 'satellite',
    prompt: 'Two satellite images disagree',
    responseTitle: 'Compare the two scenes before deciding what changed.',
    response: 'The model gets a before-and-after pair, then produces an area to review.',
    steps: ['Prepare the image pair', 'Predict a change mask', 'Review the marked area'],
  },
  {
    projectKey: 'biowallet',
    prompt: 'The phone gets lost',
    responseTitle: 'Recovery cannot be an afterthought.',
    response: 'Losing one device should change the path, not end access to the wallet.',
    steps: ['Start with a passkey', 'Recognise the lost-device state', 'Ask guardians to help recover access'],
  },
  {
    projectKey: 'classroom',
    prompt: 'The work piles up',
    responseTitle: 'Show the next move, not another list.',
    response: 'When every assignment looks urgent, a transparent priority can make starting less painful.',
    steps: ['Collect the work', 'Make the trade-offs visible', 'Suggest one useful next step'],
  },
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" className={diagonal ? 'arrow diagonal' : 'arrow'} viewBox="0 0 18 18" fill="none">
      <path d={diagonal ? 'M4 14 14 4M7 4h7v7' : 'M3 9h12M10 4l5 5-5 5'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  const className = `project-visual visual-${project.key}${compact ? ' compact' : ''}`

  if (project.key === 'nhai') {
    return <div className={className} aria-hidden="true"><div className="visual-bar"><span>ILLUSTRATED FLOW / LOCAL</span><i>●</i></div><div className="auth-visual-body"><div className="face-window"><span /><b /></div><div className="auth-readout"><strong>Identity verified</strong><span>Local match ready</span><div><i /> Offline queue ready</div></div></div></div>
  }
  if (project.key === 'pravaha') {
    return <div className={className} aria-hidden="true"><div className="visual-bar"><span>ILLUSTRATED FLOW / BUYER VIEW</span><i>●</i></div><div className="pravaha-page"><div className="pravaha-mark">P</div><div><small>DOCUMENT CONTEXT</small><strong>Make the first implementation step feel clear.</strong><span>Illustrative buyer step</span></div></div><div className="pravaha-progress"><i /><i /><i className="active" /><i /><i /></div></div>
  }
  if (project.key === 'biowallet') {
    return <div className={className} aria-hidden="true"><div className="visual-bar"><span>ILLUSTRATED FLOW / RECOVERY</span><i>●</i></div><div className="wallet-layout"><div className="wallet-orb"><span>✓</span></div><div><small>PASSKEY VERIFIED</small><strong>READY</strong><span>guardian-assisted path</span></div></div></div>
  }
  if (project.key === 'satellite') {
    return <div className={className} aria-hidden="true"><div className="visual-bar"><span>ILLUSTRATED FLOW / PAIRED IMAGE</span><i>●</i></div><div className="satellite-layout"><div className="sat-tile before"><small>BEFORE</small></div><div className="sat-tile after"><small>AFTER</small></div><div className="sat-mask"><span>CHANGE</span></div></div></div>
  }
  if (project.key === 'classroom') {
    return <div className={className} aria-hidden="true"><div className="visual-bar"><span>ILLUSTRATED FLOW / PRIORITY</span><i>●</i></div><div className="classroom-list"><div><span>01</span><strong>Review assignment</strong><small>High urgency</small></div><div><span>02</span><strong>Plan focused block</strong><small>Clear next step</small></div><div><span>03</span><strong>Submit work</strong><small>Lower switching cost</small></div></div></div>
  }
  return <div className={className} aria-hidden="true"><div className="visual-bar"><span>ILLUSTRATED FLOW / GATE</span><i>●</i></div><div className="parking-layout"><div className="parking-grid"><span /><span /><span /><b>GATE</b></div><div className="visitor-pass"><small>VISITOR PASS</small><strong>READY TO SCAN</strong><span>Gate-flow step</span></div></div></div>
}

function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Junaid Momin, back to top">Junaid <span>Momin</span></a>
      <nav aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#experience">Experience</a>
        <a href="#about">About</a>
      </nav>
      <a className="header-contact" href="mailto:junaidmominofficial@gmail.com">Get in touch <Arrow diagonal /></a>
    </header>
  )
}

function SectionHeading({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return <div className="section-heading"><span className="section-label">{label}</span><div><h2>{title}</h2>{children}</div></div>
}

function ProjectDialog({ project, onClose, backgroundRef }: { project: Project; onClose: () => void; backgroundRef: { current: HTMLDivElement | null } }) {
  const [activeTab, setActiveTab] = useState<CaseTab>('play')
  const [scenario, setScenario] = useState(0)
  const closeButton = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const tabId = (tab: CaseTab) => `${project.key}-${tab}`
  const activeScenario = project.scenarios[scenario]
  const caseTabs: CaseTab[] = ['play', 'understand', 'inspect']
  const onTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, tab: CaseTab) => {
    const currentIndex = caseTabs.indexOf(tab)
    let nextIndex = currentIndex
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % caseTabs.length
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex + caseTabs.length - 1) % caseTabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = caseTabs.length - 1
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (nextIndex === currentIndex) return
    const nextTab = caseTabs[nextIndex]
    setActiveTab(nextTab)
    window.requestAnimationFrame(() => document.getElementById(tabId(nextTab))?.focus())
  }

  useEffect(() => {
    const focusedElement = document.activeElement as HTMLElement | null
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute('disabled') && element.tabIndex !== -1 && !element.closest('[hidden]'))
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) return
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    const background = backgroundRef.current
    background?.setAttribute('inert', '')
    background?.setAttribute('aria-hidden', 'true')
    document.body.classList.add('dialog-open')
    document.addEventListener('keydown', onKeyDown)
    closeButton.current?.focus()
    return () => {
      document.body.classList.remove('dialog-open')
      document.removeEventListener('keydown', onKeyDown)
      background?.removeAttribute('inert')
      background?.removeAttribute('aria-hidden')
      focusedElement?.focus()
    }
  }, [backgroundRef, onClose])

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section ref={dialogRef} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby={`${project.key}-title`}>
        <header className="dialog-header">
          <div><span className="section-label">{project.number} / {project.signal} + {project.constraint}</span><h2 id={`${project.key}-title`}>{project.title}</h2></div>
          <button ref={closeButton} type="button" className="icon-button" onClick={onClose} aria-label="Close case study">×</button>
        </header>

        <div className="dialog-meta"><span className="status-pill">{project.status}</span><span>{project.area}</span></div>

        <div className="case-tabs" role="tablist" aria-label={`${project.title} case study sections`}>
          {caseTabs.map((tab) => <button key={tab} type="button" role="tab" id={tabId(tab)} tabIndex={activeTab === tab ? 0 : -1} aria-selected={activeTab === tab} aria-controls={`${tabId(tab)}-panel`} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)} onKeyDown={(event) => onTabKeyDown(event, tab)}>{tab}</button>)}
        </div>

        <div className="case-panel">
          <div role="tabpanel" id={`${tabId('play')}-panel`} aria-labelledby={tabId('play')} hidden={activeTab !== 'play'}><div className="play-layout"><ProjectVisual project={project} /><div className="scenario-card"><span className="section-label">Walkthrough / {String(scenario + 1).padStart(2, '0')}</span><h3>{activeScenario.title}</h3><p>{activeScenario.description}</p><div className="scenario-controls"><button type="button" onClick={() => setScenario((scenario + project.scenarios.length - 1) % project.scenarios.length)} aria-label="Previous walkthrough step">←</button><span>{String(scenario + 1).padStart(2, '0')} / {String(project.scenarios.length).padStart(2, '0')}</span><button type="button" onClick={() => setScenario((scenario + 1) % project.scenarios.length)} aria-label="Next walkthrough step">→</button></div><small>Illustrated walkthrough. It is not a live production environment.</small></div></div></div>
          <div role="tabpanel" id={`${tabId('understand')}-panel`} aria-labelledby={tabId('understand')} hidden={activeTab !== 'understand'}><div className="understand-grid"><article><span>The problem</span><p>{project.problem}</p></article><article><span>The approach</span><p>{project.approach}</p></article><article><span>The outcome</span><p>{project.outcome}</p></article></div></div>
          <div role="tabpanel" id={`${tabId('inspect')}-panel`} aria-labelledby={tabId('inspect')} hidden={activeTab !== 'inspect'}><div className="inspect-layout"><div><span className="section-label">Case-study focus</span><p className="inspect-copy">{project.contribution}</p>{project.teamNote && <p className="team-note">{project.teamNote}</p>}<span className="section-label">Scope note</span><p className="inspect-copy">{project.limitations}</p><span className="section-label">What to improve next</span><p className="inspect-copy">{project.nextStep}</p><span className="section-label">Source / repository</span>{project.sourceUrl ? <a className="source-link" href={project.sourceUrl} target="_blank" rel="noreferrer">{project.sourceLabel} <Arrow diagonal /></a> : <p className="inspect-copy">{project.sourceLabel}</p>}</div><div className="stack-list"><span className="section-label">Architecture / building blocks</span>{project.stack.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><b>{item}</b></div>)}</div></div></div>
        </div>
      </section>
    </div>
  )
}

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<ProjectArea | 'All'>('All')
  const [activePrompt, setActivePrompt] = useState<ProjectKey>('nhai')
  const siteContentRef = useRef<HTMLDivElement>(null)
  const filteredProjects = useMemo(() => filter === 'All' ? projects : projects.filter((project) => project.area === filter), [filter])
  const activeProblem = problemPrompts.find((prompt) => prompt.projectKey === activePrompt) ?? problemPrompts[0]
  const activeProblemProject = projects.find((project) => project.key === activeProblem.projectKey) ?? projects[0]

  return (
    <div className="site-shell" id="top">
      <div className="site-content" ref={siteContentRef}>
        <a className="skip-link" href="#content" onClick={() => window.setTimeout(() => document.getElementById('content')?.focus(), 0)}>Skip to content</a>
        <Header />
        <main id="content" tabIndex={-1}>
          <section className="hero content-wrap">
            <div className="hero-copy">
              <span className="section-label">Junaid Momin / Portfolio</span>
              <h1>Computer engineering student building <em>practical systems.</em></h1>
              <p>I am Junaid, a B.Tech student at Fr. CRCE in Mumbai. This is a record of coursework, hackathon builds, experiments, and the parts that are still being figured out.</p>
              <div className="hero-actions"><a className="button button-primary" href="#situations">Try a situation <Arrow /></a><a className="button button-quiet" href="#work">See the work</a></div>
            </div>
            <aside className="hero-index" aria-label="A short introduction to Junaid"><div className="portrait-frame"><img src="https://github.com/junaidjmomin.png?size=480" alt="Junaid Momin" /></div><span className="section-label">Profile</span><p>Based in Mumbai. Building across software, ML, and hardware. Also a state-level sprinter.</p><ul className="hero-notes"><li>Fr. CRCE / B.Tech Computer Engineering</li><li>Graduating 2028</li><li>junaidmominofficial@gmail.com</li></ul></aside>
          </section>

          <section className="problem-section" id="situations" aria-label="Choose a problem situation">
            <div className="content-wrap">
              <SectionHeading label="Project explorer" title="Four project constraints."><p>Select a constraint to see what the project had to account for.</p></SectionHeading>
              <div className="problem-playground">
                <div className="problem-picker" role="group" aria-label="Choose a problem situation">
                  {problemPrompts.map((prompt, index) => <button type="button" key={prompt.projectKey} className={activePrompt === prompt.projectKey ? 'active' : ''} aria-pressed={activePrompt === prompt.projectKey} onClick={() => setActivePrompt(prompt.projectKey)}><span>{String(index + 1).padStart(2, '0')}</span>{prompt.prompt}<Arrow /></button>)}
                </div>
                <article className={`problem-response response-${activeProblem.projectKey}`} aria-live="polite">
                  <div className="response-topline"><span className="section-label">A response to: {activeProblem.prompt}</span><span>{activeProblemProject.number} / {activeProblemProject.title}</span></div>
                  <div className="response-main"><div><h3>{activeProblem.responseTitle}</h3><p>{activeProblem.response}</p></div><div className="response-mark" aria-hidden="true"><i /><i /><i /></div></div>
                  <ol className="response-steps">{activeProblem.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol>
                  <button type="button" className="response-link" onClick={() => setSelectedProject(activeProblemProject)}>Open project <Arrow /></button>
                </article>
              </div>
            </div>
          </section>

          <section className="work-section" id="work">
            <div className="content-wrap">
              <SectionHeading label="01 / Selected projects" title="Projects"><p>Each case study includes the project context, current scope, and source where it is public.</p></SectionHeading>
              <div className="filter-row" aria-label="Filter projects">
                {filters.map((item) => <button type="button" aria-pressed={filter === item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}
              </div>
              <div className="project-grid">
                {filteredProjects.map((project) => <article className="project-card" key={project.key}><div className="project-card-content"><div className="project-card-heading"><span>{project.number}</span><span>{project.area}</span></div><h3>{project.title}</h3><p id={`project-${project.key}-summary`}>{project.summary}</p></div><button type="button" className="project-card-button" onClick={() => setSelectedProject(project)} aria-label={`Open ${project.title} case study`} aria-describedby={`project-${project.key}-summary`}><span>{project.signal} + {project.constraint}</span><Arrow /></button></article>)}
              </div>
            </div>
          </section>

          <section className="experience-section" id="experience">
            <div className="content-wrap">
              <SectionHeading label="02 / Experience and recognition" title="Work, research, and competitions" />
              <div className="experience-grid"><div className="experience-list"><article><span>2026</span><div><h3>Software Development Intern</h3><p>Specter Technology &amp; Games / Fantasy Cult</p></div></article><article><span>2025 to 2026</span><div><h3>Junior Technical Head</h3><p>Entrepreneurship Cell, Fr. CRCE</p></div></article><article><span>Research</span><div><h3>Abstract Algebra &amp; Differential Geometry</h3><p>Funded research experience under Dr. Filip Bar, Lund University</p></div></article></div><aside className="recognition"><span className="section-label">Recognition</span><ul><li>Smart India Hackathon 2025, National Winner</li><li>CryptoPulse selected for the JPMorgan Chase Technology Innovation Forum</li><li>Prakalp 2026, First Runner-Up</li><li>Hawkathon, Second Runner-Up</li></ul></aside></div>
            </div>
          </section>

          <section className="about-section content-wrap" id="about">
            <SectionHeading label="03 / About" title="A few facts" />
            <dl className="about-facts"><div><dt>Based</dt><dd>Mumbai, India</dd></div><div><dt>Studying</dt><dd>B.Tech Computer Engineering, Fr. CRCE</dd></div><div><dt>Graduating</dt><dd>2028</dd></div><div><dt>Outside coursework</dt><dd>State-level sprinting and student tech</dd></div></dl>
          </section>
        </main>
        <footer className="site-footer" id="contact"><div className="content-wrap footer-inner"><div><span className="section-label">Contact</span><h2>Junaid Momin</h2></div><div className="footer-links"><a href="mailto:junaidmominofficial@gmail.com">junaidmominofficial@gmail.com <Arrow diagonal /></a><a href="https://github.com/junaidjmomin" target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a><a href="#top">Back to top <Arrow /></a></div></div></footer>
      </div>
      {selectedProject && <ProjectDialog key={selectedProject.key} project={selectedProject} onClose={() => setSelectedProject(null)} backgroundRef={siteContentRef} />}
    </div>
  )
}

export default App
