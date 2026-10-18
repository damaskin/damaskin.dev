import { Directive, input } from '@angular/core';
import { useMotion } from '../core/motion';

/** Pulls the element towards the pointer while it hovers (mouse / trackpad only). */
@Directive({ selector: '[ddMagnetic]' })
export class Magnetic {
  /** Share of the pointer offset the element follows; `ddMagnetic` alone means 0.3. */
  readonly strength = input(0.3, {
    alias: 'ddMagnetic',
    transform: (value: string | number) => Number(value) || 0.3,
  });

  constructor() {
    useMotion(({ gsap, finePointer, reduced }, el) => {
      if (!finePointer || reduced) return;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.45)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.45)' });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * this.strength());
        yTo((e.clientY - (r.top + r.height / 2)) * this.strength());
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      };
    });
  }
}
