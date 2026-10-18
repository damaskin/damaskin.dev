import { Component, input } from '@angular/core';
import { SiteContent } from '../../content';
import { useMotion } from '../../core/motion';

@Component({
  selector: 'dd-about',
  template: `
    @let a = content().about;
    <div class="container">
      <p class="section-head">
        <span class="section-head__index">{{ a.index }}</span
        >{{ a.label }}
      </p>
      <p class="about__statement" data-words>{{ a.statement }}</p>
      <div class="about__grid">
        <p class="about__text" data-reveal>{{ a.text }}</p>
        <dl class="about__facts">
          @for (f of a.facts; track f.term) {
            <div class="about__fact" data-reveal>
              <dt class="mono">{{ f.term }}</dt>
              <dd>{{ f.value }}</dd>
            </div>
          }
        </dl>
      </div>
    </div>
  `,
  styleUrl: './about.scss',
  host: { class: 'section about', id: 'about' },
})
export class About {
  readonly content = input.required<SiteContent>();

  constructor() {
    // The statement "reads itself": words light up as the paragraph scrolls through the viewport.
    useMotion(({ gsap, SplitText, reduced }, host) => {
      if (reduced) return;
      const el = host.querySelector<HTMLElement>('[data-words]');
      if (!el) return;
      const split = SplitText.create(el, { type: 'words', aria: 'none' });
      gsap.fromTo(
        split.words,
        { color: '#6a6a73' },
        {
          color: '#ecebe6',
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      );
    });
  }
}
