import { Component, ElementRef, computed, input, viewChild } from '@angular/core';
import { SiteContent } from '../../content';
import { useMotion } from '../../core/motion';
import { Magnetic } from '../../ui/magnetic';
import { SignalField } from './signal-field';

@Component({
  selector: 'dd-hero',
  imports: [Magnetic],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  host: { class: 'hero', id: 'top' },
})
export class Hero {
  readonly content = input.required<SiteContent>();

  protected readonly firstChars = computed(() => [...this.content().hero.firstName]);
  protected readonly lastChars = computed(() => [...this.content().hero.lastName]);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    // The intro of the text is pure CSS (hero.scss); here — the WebGL field, the eyebrow glitch
    // and the scroll-away parallax.
    useMotion(({ gsap, reduced }, host) => {
      const canvas = this.canvas().nativeElement;
      const field = SignalField.create(canvas, { still: reduced });
      host.classList.toggle('has-field', !!field);
      const onLost = () => host.classList.remove('has-field');
      canvas.addEventListener('signalfield:lost', onLost);

      const onPointer = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        field?.pointerMove((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      };
      host.addEventListener('pointermove', onPointer, { passive: true });

      const reveal = { v: 0 };
      const growField = () => field?.setReveal(reveal.v);

      if (reduced) {
        reveal.v = 1;
        growField();
      } else {
        field?.play();
        gsap.to(reveal, { v: 1, duration: 2.6, ease: 'power2.out', onUpdate: growField });

        const eyebrow = host.querySelector<HTMLElement>('[data-hero="eyebrow"]');
        if (eyebrow) {
          gsap.to(eyebrow, {
            scrambleText: {
              text: eyebrow.textContent ?? '',
              chars: '01<>/_',
              speed: 0.6,
              revealDelay: 0.2,
            },
            duration: 1.2,
            ease: 'none',
          });
        }

        // Scrolling away: the two name lines drift apart and the field sinks.
        gsap
          .timeline({
            scrollTrigger: { trigger: host, start: 'top top', end: 'bottom top', scrub: true },
          })
          .to('[data-line="first"]', { xPercent: -14, ease: 'none' }, 0)
          .to('[data-line="last"]', { xPercent: 10, ease: 'none' }, 0)
          .fromTo(
            '.hero__inner',
            { yPercent: 0, opacity: 1 },
            { yPercent: 18, opacity: 0.2, ease: 'none' },
            0,
          )
          .fromTo(
            canvas,
            { yPercent: 0, opacity: 1 },
            { yPercent: 22, opacity: 0.35, ease: 'none' },
            0,
          );
      }

      return () => {
        host.removeEventListener('pointermove', onPointer);
        canvas.removeEventListener('signalfield:lost', onLost);
        field?.destroy();
      };
    });
  }
}
