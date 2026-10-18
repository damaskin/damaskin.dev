// Smoke test of the static build (CI runs it after `ng build`):
// both language pages are prerendered with their head tags, and every local asset they reference exists.
//   node scripts/check-dist.mjs [dist/damaskin-dev/browser]
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'dist/damaskin-dev/browser');
const errors = [];
const check = (ok, message) => ok || errors.push(message);

const pages = [
  { file: 'index.html', lang: 'ru', h1: 'Иван', canonical: 'https://damaskin.dev/' },
  { file: 'en/index.html', lang: 'en', h1: 'Ivan', canonical: 'https://damaskin.dev/en' },
];

for (const page of pages) {
  const file = path.join(root, page.file);
  if (!fs.existsSync(file)) {
    errors.push(`${page.file}: missing`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const has = (re, what) => check(re.test(html), `${page.file}: ${what}`);

  has(new RegExp(`<html[^>]*lang="${page.lang}"`), `html lang="${page.lang}"`);
  has(/<title>[^<]{20,}<\/title>/, 'title');
  has(/<meta name="description" content="[^"]{80,}"/, 'meta description');
  has(new RegExp(`<link[^>]*rel="canonical"[^>]*href="${page.canonical}"`), 'canonical');
  has(/hreflang="ru"/, 'hreflang ru');
  has(/hreflang="en"/, 'hreflang en');
  has(/hreflang="x-default"/, 'hreflang x-default');
  has(/property="og:image" content="https:\/\/damaskin\.dev\/og\/og-(ru|en)\.png"/, 'og:image');
  has(
    /<script type="application\/ld\+json"[^>]*>\{"@context":"https:\/\/schema\.org","@type":"Person"/,
    'JSON-LD Person',
  );
  has(new RegExp(`<h1[^>]*>[\\s\\S]*${page.h1}`), 'h1 with the name');
  for (const id of ['about', 'experience', 'projects', 'ai', 'stack', 'contact'])
    has(new RegExp(`id="${id}"`), `#${id}`);
  check(!/localhost/.test(html), `${page.file}: mentions localhost`);

  // every root-relative asset referenced from the page must exist in the build
  const refs = new Set();
  for (const m of html.matchAll(/(?:src|href)="(\/[^"#?]*)"/g)) refs.add(m[1]);
  for (const m of html.matchAll(/srcset="([^"]+)"/g))
    for (const part of m[1].split(',')) refs.add(part.trim().split(/\s+/)[0]);
  for (const ref of refs) {
    if (!ref.startsWith('/') || ref === '/' || ref === '/en') continue;
    check(
      fs.existsSync(path.join(root, decodeURIComponent(ref))),
      `${page.file}: broken reference ${ref}`,
    );
  }
}

for (const file of [
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  '404.html',
  'favicon.svg',
  'favicon.ico',
  'cv/Ivan_Damaskin_CV.pdf',
  'og/og-ru.png',
  'og/og-en.png',
]) {
  check(fs.existsSync(path.join(root, file)), `${file}: missing`);
}

if (errors.length) {
  console.error(`check-dist: ${errors.length} problem(s)\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}
console.log(`check-dist: ok (${pages.length} pages, ${root})`);
