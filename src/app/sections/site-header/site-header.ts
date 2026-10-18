import {
  Component,
  DOCUMENT,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { LANG_PATH, Lang, SiteContent } from '../../content';

@Component({
  selector: 'dd-site-header',
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  host: {
    class: 'site-header no-print',
    '[class.is-open]': 'menuOpen()',
    '(document:keydown.escape)': 'menuOpen.set(false)',
  },
})
export class SiteHeader {
  readonly content = input.required<SiteContent>();

  private readonly doc = inject(DOCUMENT);
  protected readonly menuOpen = signal(false);
  /** Nav anchor (#id) of the section in the middle of the screen. */
  protected readonly active = signal<string | null>(null);
  protected readonly otherLang = computed<Lang>(() => (this.content().lang === 'ru' ? 'en' : 'ru'));
  protected readonly otherLangHref = computed(() => LANG_PATH[this.otherLang()]);
  protected readonly homeHref = computed(() => LANG_PATH[this.content().lang]);

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Highlight the nav item of whatever section crosses the middle of the viewport.
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) return;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) this.active.set(`#${entry.target.id}`);
          }
        },
        { rootMargin: '-45% 0px -54% 0px' },
      );
      for (const el of this.doc.querySelectorAll('main > [id]')) observer.observe(el);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  /** Flips between light and dark, starting from what is on screen now, and remembers the choice. */
  protected toggleTheme(): void {
    const root = this.doc.documentElement;
    const current =
      root.dataset['theme'] ??
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset['theme'] = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // private mode — the choice just lasts for this page
    }
  }
}
