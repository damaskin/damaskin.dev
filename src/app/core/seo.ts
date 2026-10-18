import { DOCUMENT, Service, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  CONTENT,
  EMAIL,
  GITHUB_URL,
  HH_URL,
  LANG_PATH,
  Lang,
  SITE_URL,
  SiteContent,
} from '../content';

/** Onest subsets the first screen needs: Russian text mixes Cyrillic with Latin (Angular, INSAPP, digits). */
const FONT_SUBSETS: Record<Lang, readonly string[]> = { ru: ['cyrillic', 'latin'], en: ['latin'] };

/**
 * Head tags for a language version: title, description, Open Graph, canonical + hreflang,
 * JSON-LD Person and preloads of the font subsets the page starts with. Runs during prerender,
 * so the static HTML already carries all of it; on the client it only finds the same tags.
 */
@Service()
export class Seo {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  apply(c: SiteContent): void {
    const url = SITE_URL + LANG_PATH[c.lang];
    const image = SITE_URL + c.meta.ogImage;
    const other: Lang = c.lang === 'ru' ? 'en' : 'ru';

    this.doc.documentElement.lang = c.lang;
    this.title.setTitle(c.meta.title);

    const tags: Record<string, string> = {
      description: c.meta.description,
      'og:type': 'profile',
      'og:site_name': 'damaskin.dev',
      'og:url': url,
      'og:title': c.meta.title,
      'og:description': c.meta.description,
      'og:image': image,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': c.meta.title,
      'og:locale': c.meta.locale,
      'og:locale:alternate': CONTENT[other].meta.locale,
      'profile:first_name': c.hero.firstName,
      'profile:last_name': c.hero.lastName,
      'twitter:card': 'summary_large_image',
      'twitter:title': c.meta.title,
      'twitter:description': c.meta.description,
      'twitter:image': image,
    };
    for (const [key, content] of Object.entries(tags)) {
      const attr = key.startsWith('og:') || key.startsWith('profile:') ? 'property' : 'name';
      this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
    }

    this.link('canonical', { rel: 'canonical', href: url });
    this.link('alt-ru', { rel: 'alternate', hreflang: 'ru', href: SITE_URL + LANG_PATH.ru });
    this.link('alt-en', { rel: 'alternate', hreflang: 'en', href: SITE_URL + LANG_PATH.en });
    this.link('alt-default', {
      rel: 'alternate',
      hreflang: 'x-default',
      href: SITE_URL + LANG_PATH.ru,
    });

    for (const subset of FONT_SUBSETS[c.lang]) {
      this.link(`font-${subset}`, {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        crossorigin: '',
        href: `/fonts/onest-${subset}-wght-normal.woff2`,
      });
    }

    this.jsonLd(c, url, image);
  }

  private link(key: string, attrs: Record<string, string>): void {
    const head = this.doc.head;
    let el = head.querySelector<HTMLLinkElement>(`link[data-seo="${key}"]`);
    if (!el) {
      el = this.doc.createElement('link');
      el.setAttribute('data-seo', key);
      head.appendChild(el);
    }
    for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  }

  private jsonLd(c: SiteContent, url: string, image: string): void {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: `${c.hero.firstName} ${c.hero.lastName}`,
      alternateName: c.lang === 'ru' ? 'Ivan Damaskin' : 'Иван Дамаскин',
      jobTitle: c.hero.role,
      description: c.meta.description,
      url,
      image,
      email: `mailto:${EMAIL}`,
      sameAs: [GITHUB_URL, HH_URL],
      address: {
        '@type': 'PostalAddress',
        addressLocality: c.lang === 'ru' ? 'Москва' : 'Moscow',
        addressCountry: 'RU',
      },
      worksFor: { '@type': 'Organization', name: 'INSAPP', url: 'https://insapp.ru/' },
      knowsAbout: [
        'Angular',
        'TypeScript',
        'RxJS',
        'Node.js',
        'NestJS',
        'PostgreSQL',
        'Flutter',
        'Claude Code',
        'MCP',
      ],
    };
    let el = this.doc.head.querySelector<HTMLScriptElement>('script[data-seo="person"]');
    if (!el) {
      el = this.doc.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-seo', 'person');
      this.doc.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }
}
