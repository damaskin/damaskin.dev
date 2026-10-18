# damaskin.dev — CV-сайт Ивана Дамаскина

Одностраничное CV/портфолио. Angular 22 (standalone, Signals, zoneless) со статическим пререндером (SSG, `outputMode: static`):
`/` — русская версия, `/en` — английская (route data `lang`, один компонент `pages/home.ts`). Анимации — GSAP 3.15
(ScrollTrigger, SplitText, ScrambleText) + Lenis, грузятся лениво из `core/motion.ts`; фон героя — WebGL2-шейдер
`sections/hero/signal-field.ts`. Репозиторий: github.com/damaskin/damaskin.dev (публичный).

## Где что

- `src/app/content/content.ru.ts`, `content.en.ts` — **все тексты**, единственный источник; структура — `types.ts`,
  общие факты (ссылки, стеки, картинки) — `shared.ts`. Тест `content.spec.ts` следит, чтобы RU и EN совпадали по составу.
- `core/motion.ts` — `Motion.load()` (GSAP + Lenis один раз, только в браузере) и `useMotion(setup)`: запускает анимации
  после первого рендера в `gsap.context`, откатывает при destroy. В пререндере ничего анимационного не выполняется.
- `core/seo.ts` — title, description, OG, canonical/hreflang, JSON-LD Person, preload шрифта.
- `[data-reveal]` — общий «въезд» при скролле (`pages/home.ts`). Под `html.motion` (ставится инлайн-скриптом в
  `index.html`, если нет reduced-motion) такие элементы скрыты до старта GSAP; сторож снимает класс через 3.5 с.
- Имя в герое — буквы рендерятся на сервере, въезжают чистым CSS (не зависит от JS, важно для LCP).
- `sections/projects` — на ≥1024px секция закрепляется и карточки едут вбок (ScrollTrigger pin + containerAnimation).
  Заголовок внутри закреплённого блока анимируется там же, не через `[data-reveal]`.
- Скриншоты проектов: `public/img/projects/*.{avif,webp}` из PNG через `npm run images -- <папка>`
  (`<name>-desktop.png` 1440×900, `<name>-mobile.png` 390×844@2x). OG-карточки — `scripts/og/og.html` (1200×630).
- Шрифты — `public/fonts`, только latin + cyrillic сабсеты Unbounded / Onest / JetBrains Mono (из @fontsource-variable).

## Команды

```bash
npm start            # dev, http://localhost:4200
npm run build        # dist/damaskin-dev/browser
npm run test:ci      # Vitest
npm run lint         # ESLint
npm run format       # Prettier
npm run check:dist   # проверка сборки
```

## Прод и деплой

**Прод — damaskin.dev на `hetzner`** (Raynor, 167.233.91.168), по схеме rayndev / vanglera: общий `edge-nginx`
(SNI passthrough) → контейнер `damaskin-nginx` (терминирует TLS, отдаёт статику). Домен в Cloudflare.

- Каталоги на сервере: `/opt/damaskin-dev/deploy` (копия `deploy/`), `site/releases/<id>` + симлинк `current`,
  `letsencrypt/active` → `bootstrap/` или `live/damaskin.dev`, `bin/ci-deploy`.
- **Контент** деплоит CI на push в `main`: архив сборки по ssh ключом, привязанным в `/root/.ssh/authorized_keys`
  через `command="/opt/damaskin-dev/bin/ci-deploy"` — им можно только залить релиз статики. Хранятся 5 релизов.
  Откат: `ssh hetzner "SSH_ORIGINAL_COMMAND='rollback <id>' /opt/damaskin-dev/bin/ci-deploy"` (`releases` — список).
- **Инфраструктура** (compose, nginx, сертификат, cron) — `npm run deploy:infra` с рабочей машины (ssh-алиас `hetzner`).
- Сертификат — `deploy/scripts/certs.sh`, cron `/etc/cron.d/damaskin-cert` каждые 15 мин: пока стоит временный,
  проверяет, что домен по HTTP доходит до сервера, и выпускает Let's Encrypt; потом продлевает. Лог `/var/log/damaskin-cert.log`.
- Маршрут в общем edge — строки `damaskin` в `personal/rayn-bot/infra/edge/nginx.conf` (в git! правка только на
  сервере пропадёт при деплое rayn).
- Секреты GitHub (environment `production`): `DEPLOY_HOST`, `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`.

---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
