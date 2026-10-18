import { Component, input } from '@angular/core';
import { SiteContent } from '../../content';
import { useMotion } from '../../core/motion';

const SPINNER = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';

@Component({
  selector: 'dd-ai-workflow',
  templateUrl: './ai-workflow.html',
  styleUrl: './ai-workflow.scss',
  host: { class: 'section ai', id: 'ai' },
})
export class AiWorkflow {
  readonly content = input.required<SiteContent>();

  constructor() {
    // The terminal replays an agent session once it scrolls into view.
    useMotion(({ gsap, ScrollTrigger, reduced }, host) => {
      if (reduced) return;
      const lines = gsap.utils.toArray<HTMLElement>('[data-line]', host);
      const typed = host.querySelector<HTMLElement>('[data-type]');
      const command = typed?.textContent ?? '';
      gsap.set(lines, { autoAlpha: 0 });
      host.querySelector('.terminal')?.classList.add('is-armed');

      const tl = gsap.timeline({ paused: true });
      tl.set(lines[0], { autoAlpha: 1 });
      if (typed) {
        const state = { n: 0 };
        typed.textContent = '';
        tl.to(state, {
          n: command.length,
          duration: command.length * 0.035,
          ease: 'none',
          onUpdate: () => (typed.textContent = command.slice(0, Math.round(state.n))),
        });
      }
      for (const line of lines.slice(1)) {
        const icon = line.querySelector<HTMLElement>('[data-icon]');
        const spin = { i: 0 };
        tl.set(line, { autoAlpha: 1 }, '+=0.15');
        if (icon) {
          tl.add(() => line.classList.add('is-running'));
          tl.to(spin, {
            i: 12,
            duration: 0.55,
            ease: 'none',
            onUpdate: () => (icon.textContent = SPINNER[Math.floor(spin.i) % SPINNER.length]),
          });
          tl.add(() => {
            icon.textContent = '✓';
            line.classList.remove('is-running');
          });
        }
      }

      ScrollTrigger.create({
        trigger: '.terminal',
        start: 'top 72%',
        once: true,
        onEnter: () => void tl.play(),
      });
    });
  }
}
