import { Component, computed, input } from '@angular/core';
import { SiteContent } from '../../content';
import { useMotion } from '../../core/motion';

@Component({
  selector: 'dd-stack',
  template: `
    @let s = content().stack;
    <div class="container">
      <p class="section-head">
        <span class="section-head__index">{{ s.index }}</span
        >{{ s.label }}
      </p>
      <h2 class="display h2" data-reveal>{{ s.title }}</h2>
    </div>

    <div class="marquee" aria-hidden="true">
      @for (row of rows(); track $index; let odd = $odd) {
        <div class="marquee__row" [class.marquee__row--reverse]="odd">
          @for (copy of [0, 1]; track copy) {
            <ul class="marquee__set">
              @for (item of row; track item) {
                <li class="display">{{ item }}<span class="marquee__sep">✦</span></li>
              }
            </ul>
          }
        </div>
      }
    </div>

    <div class="container">
      <ul class="groups">
        @for (group of s.groups; track group.title; let i = $index) {
          <li class="group" data-reveal>
            <div class="group__head">
              <span class="group__idx mono" aria-hidden="true">{{ s.index }}.{{ i + 1 }}</span>
              <h3 class="group__title">{{ group.title }}</h3>
            </div>
            <ul class="group__items">
              @for (item of group.items; track item) {
                <li class="chip">{{ item }}</li>
              }
            </ul>
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './stack.scss',
  host: { class: 'section stack', id: 'stack' },
})
export class Stack {
  readonly content = input.required<SiteContent>();

  /** Two marquee rows: frontend + mobile + AI one way, backend + devops + integrations the other. */
  protected readonly rows = computed(() => {
    const g = this.content().stack.groups;
    const pick = (idx: number[]) => idx.flatMap((i) => g[i]?.items.slice(0, 6) ?? []);
    return [pick([0, 2, 3]), pick([1, 4, 5])];
  });

  constructor() {
    // Scrolling nudges the marquee rows in opposite directions on top of their own drift.
    useMotion(({ gsap, reduced }, host) => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>('.marquee__row', host).forEach((row, i) => {
        gsap.fromTo(
          row,
          { xPercent: i % 2 ? -8 : 0 },
          {
            xPercent: i % 2 ? 0 : -8,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    });
  }
}
