import { Component, signal } from '@angular/core';
import { useMotion } from '../core/motion';

const INTERACTIVE = 'a, button, [data-cursor], .chip';

/**
 * A soft ring that trails the pointer and grows over interactive elements, showing a label
 * when the element has `data-cursor="…"`. The native cursor stays visible — this is decoration only.
 * Mouse / trackpad only; nothing is rendered on touch screens.
 */
@Component({
  selector: 'dd-cursor',
  template: `<span class="cursor__label mono">{{ label() }}</span>`,
  styles: `
    :host {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 950;
      display: none;
      width: 36px;
      height: 36px;
      margin: -18px 0 0 -18px;
      border: 1px solid rgb(236 235 230 / 0.5);
      border-radius: 50%;
      pointer-events: none;
      place-items: center;
      transition:
        width 0.45s var(--ease-out),
        height 0.45s var(--ease-out),
        margin 0.45s var(--ease-out),
        background-color 0.35s,
        border-color 0.35s,
        opacity 0.3s;
    }
    :host(.is-on) {
      display: grid;
    }
    :host(.is-hover) {
      width: 64px;
      height: 64px;
      margin: -32px 0 0 -32px;
      border-color: var(--accent);
      background: rgb(255 90 54 / 0.08);
    }
    :host(.has-label) {
      width: 96px;
      height: 96px;
      margin: -48px 0 0 -48px;
      border-color: var(--accent);
      background: var(--accent);
    }
    :host(.is-out) {
      opacity: 0;
    }
    .cursor__label {
      font-size: 0.75rem;
      color: var(--on-accent);
      opacity: 0;
      transition: opacity 0.25s;
    }
    :host(.has-label) .cursor__label {
      opacity: 1;
    }
  `,
  host: { 'aria-hidden': 'true' },
})
export class Cursor {
  protected readonly label = signal('');

  constructor() {
    useMotion(({ gsap, finePointer, reduced }, host) => {
      if (!finePointer || reduced) return;
      host.classList.add('is-on', 'is-out');
      const xTo = gsap.quickTo(host, 'x', { duration: 0.45, ease: 'power3.out' });
      const yTo = gsap.quickTo(host, 'y', { duration: 0.45, ease: 'power3.out' });

      const move = (e: PointerEvent) => {
        host.classList.remove('is-out');
        xTo(e.clientX);
        yTo(e.clientY);
      };
      const over = (e: PointerEvent) => {
        const target = (e.target as Element | null)?.closest<HTMLElement>(INTERACTIVE);
        const text = target?.dataset['cursor'] ?? '';
        host.classList.toggle('is-hover', !!target);
        host.classList.toggle('has-label', !!text);
        this.label.set(text);
      };
      const leave = () => host.classList.add('is-out');

      window.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerover', over, { passive: true });
      document.documentElement.addEventListener('pointerleave', leave);
      return () => {
        window.removeEventListener('pointermove', move);
        document.removeEventListener('pointerover', over);
        document.documentElement.removeEventListener('pointerleave', leave);
      };
    });
  }
}
