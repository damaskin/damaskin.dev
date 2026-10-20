import { CV_PATH, EMAIL, GITHUB_URL, HH_URL, IMAGES, STACK, STORES } from './shared';
import { SiteContent } from './types';

export const RU: SiteContent = {
  lang: 'ru',
  meta: {
    title: 'Иван Дамаскин — Fullstack-разработчик · Angular / Node.js',
    description:
      'Fullstack-разработчик, 11+ лет в коммерческой веб-разработке: Angular 20–22, TypeScript, Node.js / NestJS, Flutter. ' +
      'Фронтенд 8 продуктов и 180+ лендингов insurtech-платформы INSAPP. AI-ассистированная разработка: Claude Code, MCP, LLM API.',
    ogImage: '/og/og-ru.png',
    locale: 'ru_RU',
  },
  a11y: {
    menu: 'Меню',
    skip: 'Перейти к содержанию',
    nav: 'Основная навигация',
    langSwitch: 'English version',
    theme: 'Сменить тему оформления',
    opensInNewTab: 'откроется в новой вкладке',
    copied: 'Адрес скопирован',
    copy: 'Скопировать адрес почты',
  },
  nav: [
    { label: 'Опыт', href: '#experience' },
    { label: 'Проекты', href: '#projects' },
    { label: 'AI', href: '#ai' },
    { label: 'Стек', href: '#stack' },
    { label: 'Контакты', href: '#contact' },
  ],
  cvLabel: 'CV.pdf',
  cvHref: CV_PATH,
  hero: {
    role: 'Fullstack-разработчик · Angular / Node.js',
    firstName: 'Иван',
    lastName: 'Дамаскин',
    lead:
      '11+ лет делаю веб-продукты — от интерфейса до бэкенда. Почти пять лет развиваю фронтенд insurtech-платформы ' +
      'INSAPP: 8 продуктов для банков и маркетплейсов. Рутину отдаю AI-агентам на Claude Code.',
    status: 'Открыт к предложениям',
    location: 'Москва · удалённо · готов к командировкам',
    primaryCta: 'Написать',
    secondaryCta: 'Скачать CV',
  },
  metrics: [
    { value: '11+', label: 'лет в коммерческой веб-разработке' },
    { value: '8', label: 'продуктов во фронтенде insurtech-платформы INSAPP' },
    { value: '180+', label: 'партнёрских лендингов и виджетов на одной кодовой базе' },
    { value: '11 → 22', label: 'Angular: миграция продуктовой линейки' },
  ],
  about: {
    index: '01',
    label: 'О себе',
    statement:
      'Строю продукты, которые банки и маркетплейсы встраивают к себе, — быстрые, надёжные и одинаково аккуратные на 180 брендах.',
    text:
      'Fullstack-разработчик с 11+ годами коммерческого опыта. Основной стек — Angular 20–22 и TypeScript, на бэкенде — ' +
      'Node.js / NestJS, PostgreSQL, Redis; мобильные приложения пишу на Flutter и React Native. Внедряю AI-ассистированную ' +
      'разработку: агенты на Claude Code, MCP-интеграции, LLM API в продуктах.',
    facts: [
      { term: 'Frontend', value: 'Angular 20–22 · Signals · SSR' },
      { term: 'Backend', value: 'Node.js · NestJS · PostgreSQL' },
      { term: 'Mobile', value: 'Flutter · React Native' },
      { term: 'AI', value: 'Claude Code · MCP · LLM API' },
    ],
  },
  experience: {
    index: '02',
    label: 'Опыт',
    title: '11+ лет в коммерческой веб-разработке, почти пять из них — в insurtech.',
    timelineLabel: 'Карьера по годам',
    present: 'н. в.',
    stackLabel: 'Стек',
    jobs: [
      {
        id: 'insapp',
        company: 'INSAPP',
        role: 'Frontend-разработчик',
        start: '2021-12',
        end: null,
        summary:
          'Insurtech-платформа: страховые и финансовые продукты, которые банки, маркетплейсы и сервисы встраивают к себе в виде лендингов и виджетов.',
        points: [
          'Разрабатываю и сопровождаю фронтенд 8 продуктов: ОСАГО, КАСКО, страхование ипотеки, МФО / финансовая витрина, подписки с кэшбэком в webview Альфа-Банка, афиша, АРМ сотрудников, корпоративный сайт.',
          'Поддерживаю 180+ брендированных лендингов и виджетов партнёров на единой кодовой базе: партнёрская специфика через fileReplacements, отдельный stage в GitLab CI на каждый лендинг.',
          'Перевёл продуктовую линейку с Angular 11/15 на 20–22: standalone-компоненты, Signals, новый control flow, замена устаревших библиотек; legacy-фронт выведен из эксплуатации.',
          'Перенёс корпоративный сайт на Angular SSR + Payload CMS (PostgreSQL): 100+ статей блога с сохранением URL, публикация без пересборки.',
          'Собрал white-label виджет «Связь» для банковских приложений: продажа номеров с eSIM от каталога до подписания договора через Госуслуги / Госключ; путь подтверждён партнёром на живых заказах.',
          'Внедрил AI-ассистированную разработку: агенты на Claude Code для разбора задач из Яндекс Трекера, сборки лендингов под ключ, код-ревью и визуального QA; MCP-интеграции с Трекером, Figma и Swagger.',
        ],
        stack: STACK.insapp,
      },
      {
        id: 'globus',
        company: 'GLOBUS',
        role: 'Frontend-разработчик',
        start: '2018-07',
        end: null,
        summary:
          'Разработка веб-сервисов и сайтов для заказчиков: от UX/UI-прототипа до продакшена.',
        points: [
          'Chemexsol — цифровая онлайн-система для нефтегазовой отрасли: UX/UI-дизайн и фронтенд веб-приложения.',
          'Яндекс Доставка — сайт сервиса для зарубежных стран.',
          'Trullo — SPA-платформа для управления проектами.',
        ],
        stack: STACK.globus,
      },
      {
        id: 'dex',
        company: 'DEX technology',
        role: 'Frontend-разработчик',
        start: '2015-02',
        end: '2017-06',
        summary:
          'Разработка клиентской части веб-проектов: SPA, адаптивная вёрстка, интеграция с REST API.',
        points: [],
        stack: STACK.dex,
      },
      {
        id: 'radikal',
        company: 'radikal.ru',
        role: 'Frontend-разработчик',
        start: '2013-09',
        end: '2014-07',
        summary: 'Вёрстка и клиентский JavaScript для фотохостинга.',
        points: [],
        stack: STACK.radikal,
      },
    ],
    education: {
      label: 'Образование',
      text: 'Московский институт предпринимательства и права — финансы и кредит, высшее, 2014',
    },
  },
  projects: {
    index: '03',
    label: 'Проекты',
    title: 'Сделано и работает',
    items: [
      {
        id: 'topbarber',
        name: 'TopBarber',
        kind: 'Собственный SaaS · онлайн-запись для барбершопов',
        url: 'https://topbarber.app/',
        urlLabel: 'topbarber.app',
        description:
          'Мультитенантная платформа: публичная страница записи на поддомене бизнеса, админка, Telegram-боты, подписки и платежи. Перенёс данные с Firestore на PostgreSQL.',
        highlights: [
          'Мультитенантность',
          'Telegram-боты',
          'Подписки и платежи',
          'Firestore → PostgreSQL',
        ],
        stack: STACK.topbarber,
        image: {
          ...IMAGES.topbarber,
          alt: 'Главная страница TopBarber — система записи для барбершопов',
        },
      },
      {
        id: 'fithorse',
        name: 'FitHorse',
        kind: 'Собственное приложение · бег, велозаезды, лыжи',
        url: 'https://fithorse.ru/',
        urlLabel: 'fithorse.ru',
        description:
          'Мобильное приложение для iOS и Android: GPS-трекинг, карты, BLE-датчики, Apple Health / Health Connect, друзья и совместные тренировки. Свой бэкенд и веб-админка.',
        highlights: ['iOS + Android', 'GPS и BLE-датчики', 'Health-интеграции', 'Свой бэкенд'],
        stack: STACK.fithorse,
        image: { ...IMAGES.fithorse, alt: 'Сайт приложения FitHorse с экраном записи тренировки' },
        stores: STORES.fithorse,
      },
      {
        id: 'insapp',
        name: 'INSAPP',
        kind: 'Insurtech-платформа · 8 продуктов',
        url: 'https://insapp.ru/',
        urlLabel: 'insapp.ru',
        description:
          'Страховые и финансовые продукты, которые встраивают банки и маркетплейсы. 180+ брендированных лендингов на единой кодовой базе, миграция с Angular 11 на 22, корпоративный сайт на Angular SSR + Payload CMS.',
        highlights: [
          '180+ лендингов',
          'Angular 11 → 22',
          'SSR + Payload CMS',
          'Stage в CI на лендинг',
        ],
        stack: STACK.insappPlatform,
        image: {
          ...IMAGES.insapp,
          alt: 'Корпоративный сайт Insapp — виджеты страховых и финансовых продуктов',
        },
      },
      {
        id: 'takeaway',
        name: 'takeAway',
        kind: 'Собственный продукт · предзаказ без очереди',
        url: 'https://takeaway.md/',
        urlLabel: 'takeaway.md',
        description:
          'Клиент заказывает заранее, следит за статусом и забирает готовый заказ без очереди. Один профиль и одна корзина в приложениях для iOS и Android, на сайте и в Telegram Mini App; у бизнеса — кабинет с аналитикой и кухонный экран.',
        highlights: [
          'iOS, Android и веб',
          'Telegram Mini App',
          'Кухонный экран (KDS)',
          'Кассы Poster и iiko',
        ],
        stack: STACK.takeaway,
        image: { ...IMAGES.takeaway, alt: 'Сайт takeAway — предзаказ в кофейнях рядом' },
        stores: STORES.takeaway,
      },
      {
        id: 'lunaclean',
        name: 'Luna Clean',
        kind: 'Для заказчика · выездная химчистка мебели',
        url: 'https://lunaclean.ru/',
        urlLabel: 'lunaclean.ru',
        description:
          'У компании не было сайта — сделал всё под ключ: лендинг с калькулятором цены и онлайн-записью на свободный слот, приложение без регистрации, админку со статистикой и Telegram-бота, который присылает заявки мастеру.',
        highlights: [
          'Калькулятор цены',
          'Онлайн-запись',
          'Приложение без входа',
          'Telegram-бот мастеру',
        ],
        stack: STACK.lunaclean,
        image: { ...IMAGES.lunaclean, alt: 'Лендинг Luna Clean — выездная химчистка мебели' },
        stores: STORES.lunaclean,
      },
    ],
    clients: {
      label: 'Ещё для заказчиков GLOBUS',
      items: [
        'Chemexsol — онлайн-система для нефтегаза',
        'Яндекс Доставка — сайт для зарубежных стран',
        'Trullo — управление проектами',
      ],
    },
  },
  ai: {
    index: '04',
    label: 'AI-assisted development',
    title: 'Агенты делают рутину. Я — архитектуру и продукт.',
    text:
      'Встроил Claude Code в ежедневную разработку: агенты разбирают задачи из Яндекс Трекера, собирают партнёрские лендинги под ключ, ' +
      'делают код-ревью и визуальный QA. MCP связывает их с Трекером, Figma и Swagger, а дайджесты по задачам приходят в Telegram.',
    points: [
      {
        title: 'Разбор задач',
        text: 'Агент читает задачу в Трекере и превращает её в план: продукт, репозиторий, файлы, риски.',
      },
      {
        title: 'Лендинги под ключ',
        text: 'Новый партнёр — это файлы, конфигурация, stage в CI и проверка сборки без ручной рутины.',
      },
      {
        title: 'Ревью и визуальный QA',
        text: 'Дифф проверяется по правилам проекта, страница — на desktop и mobile, консоль — на ошибки.',
      },
      {
        title: 'MCP-интеграции',
        text: 'Яндекс Трекер, Figma и Swagger доступны агентам напрямую, дайджесты — в Telegram.',
      },
    ],
    terminalTitle: 'claude — fithorse',
    terminalNote: 'Пример сессии, упрощённо',
    terminal: [
      { kind: 'cmd', text: 'claude "добавь в FitHorse личные рекорды на 5 и 10 км"' },
      { kind: 'step', tag: 'plan', text: 'задача разобрана → API, экран в приложении, тесты' },
      { kind: 'step', tag: 'git', text: 'ветка feature/personal-records от main' },
      { kind: 'step', tag: 'api', text: 'NestJS · GET /me/records · миграция Prisma' },
      { kind: 'step', tag: 'app', text: 'Flutter · экран «Рекорды» · провайдер Riverpod' },
      { kind: 'step', tag: 'test', text: 'jest + flutter test → всё зелёное' },
      { kind: 'step', tag: 'qa', text: 'эмуляторы iOS / Android · скриншоты экрана' },
      { kind: 'step', tag: 'pr', text: 'pull request · CI зелёный' },
      { kind: 'ok', text: 'готово — дальше ревью человеком' },
    ],
  },
  stack: {
    index: '05',
    label: 'Стек',
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
          'AI-агенты',
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
        title: 'Интеграции',
        items: ['Telegram Bot API', 'Telegram Mini Apps', 'Firebase', 'Stripe', 'Figma'],
      },
    ],
  },
  contact: {
    index: '06',
    label: 'Контакты',
    title: 'Есть задача? Давайте обсудим.',
    text: 'Открыт к предложениям по fullstack- и frontend-разработке на Angular / Node.js. Москва, удалённо, готов к командировкам.',
    email: EMAIL,
    links: [
      { label: 'GitHub', href: GITHUB_URL },
      { label: 'Резюме на hh.ru', href: HH_URL },
      { label: 'CV в PDF', href: CV_PATH },
    ],
  },
  footer: {
    builtWith: 'Angular 22 · SSG · Signals · zoneless',
    source: 'Исходники на GitHub',
    build: 'сборка',
  },
  durations: {
    year: (n) => `${n} г.`,
    month: (n) => `${n} мес.`,
    months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  },
};
