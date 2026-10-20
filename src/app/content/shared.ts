import { StoreLink } from './types';

/** Facts that do not depend on the language. */
export const SITE_URL = 'https://damaskin.dev';
export const EMAIL = 'damaskin@live.ru';
export const GITHUB_URL = 'https://github.com/damaskin';
export const HH_URL = 'https://hh.ru/resume/7106d07eff020e80d60039ed1f684d71313168';
export const SOURCE_URL = 'https://github.com/damaskin/damaskin.dev';
export const CV_PATH = '/cv/Ivan_Damaskin_CV.pdf';

export const STACK = {
  insapp: [
    'Angular 20–22',
    'TypeScript',
    'RxJS',
    'Signals',
    'SSR',
    'SCSS',
    'Vitest',
    'Karma / Jasmine',
    'GitLab CI',
    'Docker',
    'PostgreSQL',
    'Payload CMS',
    'Claude Code',
    'MCP',
  ],
  globus: ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'REST API', 'Figma'],
  dex: ['JavaScript', 'AngularJS', 'jQuery', 'HTML5', 'CSS3', 'Less', 'Bootstrap'],
  radikal: ['JavaScript', 'jQuery', 'jQuery Mobile', 'HTML5', 'CSS'],
  topbarber: [
    'NestJS (Fastify)',
    'Prisma',
    'PostgreSQL',
    'Redis',
    'BullMQ',
    'Socket.IO',
    'Angular',
    'Telegram Bot API',
    'Docker',
  ],
  fithorse: ['Flutter (Riverpod, drift)', 'NestJS 11', 'Prisma', 'PostgreSQL', 'Angular 22 (PWA)'],
  insappPlatform: ['Angular 22', 'Signals', 'SSR', 'Payload CMS', 'GitLab CI', 'Vitest'],
  takeaway: [
    'Flutter (Riverpod)',
    'Angular 21',
    'NestJS 11',
    'Prisma',
    'PostgreSQL',
    'Redis',
    'BullMQ',
    'Socket.IO',
    'Nx + pnpm',
  ],
  lunaclean: [
    'Vue 3 + Vite (SSG)',
    'NestJS 11',
    'Prisma',
    'PostgreSQL',
    'Angular 22',
    'Flutter (Riverpod)',
    'Telegram Bot API',
  ],
} as const;

const appStore = (href: string): StoreLink => ({ store: 'app-store', label: 'App Store', href });
const googlePlay = (id: string): StoreLink => ({
  store: 'google-play',
  label: 'Google Play',
  href: `https://play.google.com/store/apps/details?id=${id}`,
});

/** Published apps. Luna Clean is still in TestFlight on iOS. */
export const STORES = {
  fithorse: [
    appStore('https://apps.apple.com/ru/app/fithorse/id6816748824'),
    googlePlay('com.fithorse.app'),
  ],
  takeaway: [appStore('https://apps.apple.com/ru/app/id6816696544'), googlePlay('md.takeaway.app')],
  lunaclean: [googlePlay('ru.lunaclean.app')],
} as const satisfies Record<string, readonly StoreLink[]>;

export const IMAGES = {
  topbarber: { src: '/img/projects/topbarber', width: 1440, height: 900 },
  fithorse: {
    src: '/img/projects/fithorse',
    width: 1440,
    height: 900,
    mobileSrc: '/img/projects/fithorse-mobile',
  },
  insapp: { src: '/img/projects/insapp', width: 1440, height: 900 },
  takeaway: {
    src: '/img/projects/takeaway',
    width: 1440,
    height: 900,
    mobileSrc: '/img/projects/takeaway-mobile',
  },
  lunaclean: {
    src: '/img/projects/lunaclean',
    width: 1440,
    height: 900,
    mobileSrc: '/img/projects/lunaclean-mobile',
  },
} as const;
