import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Motion } from '../core/motion';
import { Home } from './home';

/** Renders the page without animations (Motion never resolves, like during prerender). */
async function render(lang: 'ru' | 'en') {
  TestBed.configureTestingModule({
    imports: [Home],
    providers: [
      { provide: ActivatedRoute, useValue: { snapshot: { data: { lang } } } },
      {
        provide: Motion,
        useValue: { load: () => new Promise(() => undefined), scrollTo: () => Promise.resolve() },
      },
    ],
  });
  const fixture = TestBed.createComponent(Home);
  await fixture.whenStable();
  return { el: fixture.nativeElement as HTMLElement, doc: TestBed.inject(DOCUMENT) };
}

describe('Home', () => {
  it('renders the Russian CV with every section', async () => {
    const { el } = await render('ru');
    expect(el.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim()).toBe('Иван Дамаскин');
    for (const id of ['about', 'experience', 'projects', 'ai', 'stack', 'contact']) {
      expect(el.querySelector(`#${id}`), id).not.toBeNull();
    }
    expect(el.querySelectorAll('[data-job]').length).toBe(4);
    expect(el.querySelector('a[href="mailto:damaskin@live.ru"]')).not.toBeNull();
  });

  it('sets language, title, canonical and hreflang for the English page', async () => {
    const { el, doc } = await render('en');
    expect(el.querySelector('h1')?.textContent).toContain('Damaskin');
    expect(doc.documentElement.lang).toBe('en');
    expect(doc.title).toContain('Ivan Damaskin');
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://damaskin.dev/en',
    );
    expect(doc.querySelector('link[hreflang="ru"]')?.getAttribute('href')).toBe(
      'https://damaskin.dev/',
    );
    const ld = JSON.parse(
      doc.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );
    expect(ld['@type']).toBe('Person');
  });

  it('opens external links in a new tab safely', async () => {
    const { el } = await render('ru');
    for (const a of Array.from(el.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]'))) {
      expect(a.rel).toContain('noopener');
    }
  });
});
