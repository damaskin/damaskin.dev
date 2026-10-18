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
} as const;

export const IMAGES = {
  topbarber: { src: '/img/projects/topbarber', width: 1440, height: 900 },
  fithorse: {
    src: '/img/projects/fithorse',
    width: 1440,
    height: 900,
    mobileSrc: '/img/projects/fithorse-mobile',
  },
  insapp: { src: '/img/projects/insapp', width: 1440, height: 900 },
} as const;
