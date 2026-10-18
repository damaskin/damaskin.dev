import { Component, computed, inject, input, signal } from '@angular/core';
import { LANG_PATH, SiteContent } from '../../content';
import { Motion, useMotion } from '../../core/motion';

@Component({
  selector: 'dd-site-header',
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  host: {
    class: 'site-header',
    '[class.is-scrolled]': 'scrolled()',
    '[class.is-hidden]': 'hidden() && !menuOpen()',
    '[class.is-open]': 'menuOpen()',
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class SiteHeader {
  readonly content = input.required<SiteContent>();

  private readonly motion = inject(Motion);
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly hidden = signal(false);
  protected readonly otherLangHref = computed(
    () => LANG_PATH[this.content().lang === 'ru' ? 'en' : 'ru'],
  );
  protected readonly otherLangLabel = computed(() => (this.content().lang === 'ru' ? 'EN' : 'RU'));
  protected readonly homeHref = computed(() => LANG_PATH[this.content().lang]);

  constructor() {
    useMotion(({ ScrollTrigger, gsap }, host) => {
      const progress = host.querySelector<HTMLElement>('.site-header__progress');
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();
          this.scrolled.set(y > 40);
          // hide while reading down, come back on any scroll up
          this.hidden.set(self.direction === 1 && y > 320);
          if (progress) gsap.set(progress, { scaleX: self.progress });
        },
      });
    });
  }

  protected toggleMenu(): void {
    this.setMenu(!this.menuOpen());
  }

  protected closeMenu(): void {
    if (this.menuOpen()) this.setMenu(false);
  }

  protected go(event: MouseEvent, href: string): void {
    if (!href.startsWith('#')) return;
    event.preventDefault();
    this.setMenu(false);
    void this.motion.scrollTo(href);
    history.replaceState(null, '', href);
  }

  private setMenu(open: boolean): void {
    this.menuOpen.set(open);
    void this.motion.load().then(({ lenis }) => (open ? lenis?.stop() : lenis?.start()));
  }
}
