import { Component, input } from '@angular/core';
import { Metric } from '../../content';
import { useMotion } from '../../core/motion';

@Component({
  selector: 'dd-metrics',
  template: `
    <ul class="metrics container">
      @for (m of metrics(); track m.label) {
        <li class="metric" data-metric>
          <p class="metric__value display" aria-hidden="true">
            @if (m.prefix) {
              <span class="metric__prefix">{{ m.prefix }}</span>
            }
            <span data-count [attr.data-from]="m.from ?? 0" [attr.data-to]="m.value">{{
              m.value
            }}</span>
            @if (m.suffix) {
              <span class="metric__suffix">{{ m.suffix }}</span>
            }
          </p>
          <p class="metric__label">
            <span class="sr-only">{{ (m.prefix ?? '') + m.value + (m.suffix ?? '') }} — </span
            >{{ m.label }}
          </p>
        </li>
      }
    </ul>
  `,
  styleUrl: './metrics.scss',
  host: { class: 'metrics-section' },
})
export class Metrics {
  readonly metrics = input.required<readonly Metric[]>();

  constructor() {
    useMotion(({ gsap, ScrollTrigger, reduced }, host) => {
      if (reduced) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-metric]', host);
      gsap.set(items, { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: host,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(items, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 });
          for (const el of host.querySelectorAll<HTMLElement>('[data-count]')) {
            const state = { v: Number(el.dataset['from']) };
            const to = Number(el.dataset['to']);
            el.textContent = String(state.v);
            gsap.to(state, {
              v: to,
              duration: 2,
              delay: 0.2,
              ease: 'power3.out',
              onUpdate: () => (el.textContent = String(Math.round(state.v))),
            });
          }
        },
      });
    });
  }
}
