import { CV_PATH, EMAIL, GITHUB_URL, HH_URL, IMAGES, STACK, STORES } from './shared';
import { SiteContent } from './types';

export const EN: SiteContent = {
  lang: 'en',
  meta: {
    title: 'Ivan Damaskin — Fullstack Developer · Angular / Node.js',
    description:
      'Fullstack developer with 11+ years of commercial web development: Angular 20–22, TypeScript, Node.js / NestJS, Flutter. ' +
      'Frontend of 8 products and 180+ partner landings at the INSAPP insurtech platform. AI-assisted development: Claude Code, MCP, LLM APIs.',
    ogImage: '/og/og-en.png',
    locale: 'en_US',
  },
  a11y: {
    menu: 'Menu',
    skip: 'Skip to content',
    nav: 'Main navigation',
    langSwitch: 'Русская версия',
    theme: 'Switch colour theme',
    opensInNewTab: 'opens in a new tab',
    copied: 'Address copied',
    copy: 'Copy email address',
  },
  nav: [
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'AI', href: '#ai' },
    { label: 'Stack', href: '#stack' },
    { label: 'Contact', href: '#contact' },
  ],
  cvLabel: 'CV.pdf',
  cvHref: CV_PATH,
  hero: {
    role: 'Fullstack developer · Angular / Node.js',
    firstName: 'Ivan',
    lastName: 'Damaskin',
    lead:
      'For 11+ years I have been building web products end to end — from the interface to the backend. For almost five years ' +
      'I have been growing the frontend of the INSAPP insurtech platform: 8 products for banks and marketplaces. Routine goes to AI agents on Claude Code.',
    status: 'Open to offers',
    location: 'Moscow · remote · open to business trips',
    primaryCta: 'Get in touch',
    secondaryCta: 'Download CV',
  },
  metrics: [
    { value: '11+', label: 'years of commercial web development' },
    { value: '8', label: 'products in the INSAPP insurtech frontend' },
    { value: '180+', label: 'partner landings and widgets on a single codebase' },
    { value: '11 → 22', label: 'Angular: product line migration' },
  ],
  about: {
    index: '01',
    label: 'About',
    statement:
      'I build products that banks and marketplaces embed into their own apps — fast, reliable and equally polished across 180 brands.',
    text:
      'Fullstack developer with 11+ years of commercial experience. My main stack is Angular 20–22 and TypeScript; on the backend — ' +
      'Node.js / NestJS, PostgreSQL, Redis; mobile apps in Flutter and React Native. I bring AI-assisted development into the team: ' +
      'agents on Claude Code, MCP integrations and LLM APIs inside products.',
    facts: [
      { term: 'Frontend', value: 'Angular 20–22 · Signals · SSR' },
      { term: 'Backend', value: 'Node.js · NestJS · PostgreSQL' },
      { term: 'Mobile', value: 'Flutter · React Native' },
      { term: 'AI', value: 'Claude Code · MCP · LLM APIs' },
    ],
  },
  experience: {
    index: '02',
    label: 'Experience',
    title: '11+ years of commercial web development, almost five of them in insurtech.',
    timelineLabel: 'Career timeline',
    present: 'now',
    stackLabel: 'Stack',
    jobs: [
      {
        id: 'insapp',
        company: 'INSAPP',
        role: 'Frontend Developer',
        start: '2021-12',
        end: null,
        summary:
          'Insurtech platform: insurance and financial products that banks, marketplaces and services embed as landings and widgets.',
        points: [
          'Develop and maintain the frontend of 8 products: motor TPL (OSAGO), motor hull (KASKO), mortgage insurance, microloans / financial showcase, cashback subscriptions inside the Alfa-Bank webview, events listing, staff workstation and the corporate website.',
          'Maintain 180+ branded partner landings and widgets on a single codebase: partner specifics via fileReplacements, a dedicated GitLab CI stage per landing.',
          'Migrated the product line from Angular 11/15 to 20–22: standalone components, Signals, new control flow, replaced outdated libraries; the legacy frontend was decommissioned.',
          'Moved the corporate website to Angular SSR + Payload CMS (PostgreSQL): 100+ blog posts with URLs preserved, publishing without a rebuild.',
          'Built the white-label “Svyaz” widget for banking apps: selling phone numbers with eSIM from the catalogue to signing the contract via Gosuslugi / Goskey; the flow is confirmed by the partner on live orders.',
          'Introduced AI-assisted development: Claude Code agents that triage Yandex Tracker tasks, build landings end to end, review code and run visual QA; MCP integrations with Tracker, Figma and Swagger.',
        ],
        stack: STACK.insapp,
      },
      {
        id: 'globus',
        company: 'GLOBUS',
        role: 'Frontend Developer',
        start: '2018-07',
        end: null,
        summary: 'Web services and websites for clients: from the UX/UI prototype to production.',
        points: [
          'Chemexsol — a digital online system for the oil and gas industry: UX/UI design and the web app frontend.',
          'Yandex Delivery — the service website for international markets.',
          'Trullo — an SPA platform for project management.',
        ],
        stack: STACK.globus,
      },
      {
        id: 'dex',
        company: 'DEX technology',
        role: 'Frontend Developer',
        start: '2015-02',
        end: '2017-06',
        summary: 'Client side of web projects: SPAs, responsive layouts, REST API integration.',
        points: [],
        stack: STACK.dex,
      },
      {
        id: 'radikal',
        company: 'radikal.ru',
        role: 'Frontend Developer',
        start: '2013-09',
        end: '2014-07',
        summary: 'Markup and client-side JavaScript for a photo hosting service.',
        points: [],
        stack: STACK.radikal,
      },
    ],
    education: {
      label: 'Education',
      text: 'Moscow Institute of Entrepreneurship and Law — Finance and Credit, higher education, 2014',
    },
  },
  projects: {
    index: '03',
    label: 'Projects',
    title: 'Shipped and running',
    items: [
      {
        id: 'topbarber',
        name: 'TopBarber',
        kind: 'Own SaaS · online booking for barbershops',
        url: 'https://topbarber.app/',
        urlLabel: 'topbarber.app',
        description:
          'Multi-tenant platform: a public booking page on the business subdomain, admin panel, Telegram bots, subscriptions and payments. Migrated the data from Firestore to PostgreSQL.',
        highlights: [
          'Multi-tenancy',
          'Telegram bots',
          'Subscriptions & payments',
          'Firestore → PostgreSQL',
        ],
        stack: STACK.topbarber,
        image: { ...IMAGES.topbarber, alt: 'TopBarber home page — booking system for barbershops' },
      },
      {
        id: 'fithorse',
        name: 'FitHorse',
        kind: 'Own app · running, cycling, skiing',
        url: 'https://fithorse.ru/',
        urlLabel: 'fithorse.ru',
        description:
          'Mobile app for iOS and Android: GPS tracking, maps, BLE sensors, Apple Health / Health Connect, friends and group workouts. Own backend and web admin.',
        highlights: ['iOS + Android', 'GPS & BLE sensors', 'Health integrations', 'Own backend'],
        stack: STACK.fithorse,
        image: {
          ...IMAGES.fithorse,
          alt: 'FitHorse app website with the workout recording screen',
        },
        stores: STORES.fithorse,
      },
      {
        id: 'insapp',
        name: 'INSAPP',
        kind: 'Insurtech platform · 8 products',
        url: 'https://insapp.ru/',
        urlLabel: 'insapp.ru',
        description:
          'Insurance and financial products embedded by banks and marketplaces. 180+ branded landings on a single codebase, migration from Angular 11 to 22, corporate website on Angular SSR + Payload CMS.',
        highlights: [
          '180+ landings',
          'Angular 11 → 22',
          'SSR + Payload CMS',
          'CI stage per landing',
        ],
        stack: STACK.insappPlatform,
        image: {
          ...IMAGES.insapp,
          alt: 'Insapp corporate website — insurance and finance widgets',
        },
      },
      {
        id: 'takeaway',
        name: 'takeAway',
        kind: 'Own product · order ahead, skip the queue',
        url: 'https://takeaway.md/',
        urlLabel: 'takeaway.md',
        description:
          'Customers order ahead, follow the status and pick up a ready order without queuing. One profile and one cart across the iOS and Android apps, the website and a Telegram Mini App; businesses get a dashboard with analytics and a kitchen display.',
        highlights: [
          'iOS, Android & web',
          'Telegram Mini App',
          'Kitchen display (KDS)',
          'Poster & iiko POS',
        ],
        stack: STACK.takeaway,
        image: { ...IMAGES.takeaway, alt: 'takeAway website — pre-order at coffee shops nearby' },
        stores: STORES.takeaway,
      },
      {
        id: 'lunaclean',
        name: 'Luna Clean',
        kind: 'Client project · mobile upholstery cleaning',
        url: 'https://lunaclean.ru/',
        urlLabel: 'lunaclean.ru',
        description:
          'The company had no website, so I built it all end to end: a landing page with a price calculator and online booking into free slots, an app with no sign-up, an admin panel with statistics and a Telegram bot that sends new orders to the cleaner.',
        highlights: [
          'Price calculator',
          'Online booking',
          'App with no sign-in',
          'Orders via Telegram bot',
        ],
        stack: STACK.lunaclean,
        image: {
          ...IMAGES.lunaclean,
          alt: 'Luna Clean landing page — mobile upholstery cleaning',
        },
        stores: STORES.lunaclean,
      },
    ],
    clients: {
      label: 'More for GLOBUS clients',
      items: [
        'Chemexsol — online system for oil & gas',
        'Yandex Delivery — website for international markets',
        'Trullo — project management',
      ],
    },
  },
  ai: {
    index: '04',
    label: 'AI-assisted development',
    title: 'Agents handle the routine. I handle architecture and product.',
    text:
      'I built Claude Code into everyday development: agents triage Yandex Tracker tasks, build partner landings end to end, ' +
      'review code and run visual QA. MCP connects them to Tracker, Figma and Swagger, and task digests arrive in Telegram.',
    points: [
      {
        title: 'Task triage',
        text: 'An agent reads the Tracker task and turns it into a plan: product, repository, files, risks.',
      },
      {
        title: 'Landings end to end',
        text: 'A new partner means files, configuration, a CI stage and a build check — without manual routine.',
      },
      {
        title: 'Review & visual QA',
        text: 'The diff is checked against project rules, the page on desktop and mobile, the console for errors.',
      },
      {
        title: 'MCP integrations',
        text: 'Yandex Tracker, Figma and Swagger are available to agents directly; digests go to Telegram.',
      },
    ],
    terminalTitle: 'claude — fithorse',
    terminalNote: 'Example session, simplified',
    terminal: [
      { kind: 'cmd', text: 'claude "add 5K and 10K personal records to FitHorse"' },
      { kind: 'step', tag: 'plan', text: 'task broken down → API, app screen, tests' },
      { kind: 'step', tag: 'git', text: 'branch feature/personal-records from main' },
      { kind: 'step', tag: 'api', text: 'NestJS · GET /me/records · Prisma migration' },
      { kind: 'step', tag: 'app', text: 'Flutter · “Records” screen · Riverpod provider' },
      { kind: 'step', tag: 'test', text: 'jest + flutter test → all green' },
      { kind: 'step', tag: 'qa', text: 'iOS / Android emulators · screen screenshots' },
      { kind: 'step', tag: 'pr', text: 'pull request · CI green' },
      { kind: 'ok', text: 'done — over to human review' },
    ],
  },
  stack: {
    index: '05',
    label: 'Stack',
    groups: [
      {
        title: 'Frontend',
        items: [
          'Angular 20–22',
          'standalone',
          'Signals',
          'SSR',
          'TypeScript',
          'RxJS',
          'JavaScript',
          'HTML5',
          'CSS3 / SCSS',
          'Tailwind CSS',
          'React',
        ],
      },
      {
        title: 'Backend',
        items: [
          'Node.js',
          'NestJS',
          'PostgreSQL',
          'Prisma',
          'Redis',
          'BullMQ',
          'REST API',
          'WebSocket (Socket.IO)',
          'Swagger / OpenAPI',
        ],
      },
      { title: 'Mobile', items: ['Flutter (Riverpod)', 'React Native (Expo)'] },
      {
        title: 'AI',
        items: [
          'Claude Code',
          'Cursor',
          'Codex',
          'AI agents',
          'MCP',
          'Prompt engineering',
          'OpenAI API',
          'Gemini API',
        ],
      },
      {
        title: 'DevOps / QA',
        items: [
          'Git',
          'GitLab CI',
          'GitHub Actions',
          'Docker',
          'Vitest',
          'Jest',
          'Karma / Jasmine',
          'Sentry',
        ],
      },
      {
        title: 'Integrations',
        items: ['Telegram Bot API', 'Telegram Mini Apps', 'Firebase', 'Stripe', 'Figma'],
      },
    ],
  },
  contact: {
    index: '06',
    label: 'Contact',
    title: 'Have a challenge? Let’s talk.',
    text: 'Open to fullstack and frontend roles with Angular / Node.js. Moscow, remote, open to business trips.',
    email: EMAIL,
    links: [
      { label: 'GitHub', href: GITHUB_URL },
      { label: 'Resume on hh.ru', href: HH_URL },
      { label: 'CV as PDF', href: CV_PATH },
    ],
  },
  footer: {
    builtWith: 'Angular 22 · SSG · Signals · zoneless',
    source: 'Source on GitHub',
    build: 'build',
  },
  durations: {
    year: (n) => `${n} yr${n === 1 ? '' : 's'}`,
    month: (n) => `${n} mo`,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
};
