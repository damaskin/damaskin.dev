import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  Service,
  afterNextRender,
  inject,
} from '@angular/core';
import type { gsap as Gsap } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import type { SplitText as SplitTextType } from 'gsap/SplitText';
import type Lenis from 'lenis';

export interface MotionKit {
  readonly gsap: typeof Gsap;
  readonly ScrollTrigger: typeof ScrollTriggerType;
  readonly SplitText: typeof SplitTextType;
  readonly lenis: Lenis | null;
  readonly reduced: boolean;
  /** True on devices with a precise pointer (mouse / trackpad) — cursor and magnetic effects only there. */
  readonly finePointer: boolean;
}

declare global {
  interface Window {
    __ddMotion?: boolean;
  }
}

/**
 * Loads GSAP (+ ScrollTrigger, SplitText, ScrambleText) and Lenis once, in the browser only,
 * and wires Lenis into the GSAP ticker. Sections await `load()` from `afterNextRender`,
 * so nothing animation-related ships in the initial bundle or runs during prerender.
 */
@Service()
export class Motion {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private kit?: Promise<MotionKit>;

  load(): Promise<MotionKit> {
    if (!this.isBrowser) return new Promise<MotionKit>(() => undefined);
    return (this.kit ??= this.init());
  }

  /** Smooth-scrolls to an in-page anchor (#id) or element, respecting the fixed header. */
  async scrollTo(target: string | HTMLElement): Promise<void> {
    const { lenis, reduced } = await this.load();
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  private async init(): Promise<MotionKit> {
    const [
      { gsap },
      { ScrollTrigger },
      { SplitText },
      { ScrambleTextPlugin },
      { default: LenisCtor },
    ] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
      import('gsap/ScrambleTextPlugin'),
      import('lenis'),
    ]);
    gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
    gsap.defaults({ ease: 'expo.out', duration: 1 });

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

    let lenis: Lenis | null = null;
    if (!reduced) {
      lenis = new LenisCtor({ lerp: 0.11, wheelMultiplier: 0.9 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis?.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    window.__ddMotion = true;
    // Layout settles once the variable fonts arrive — recompute trigger positions then.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return { gsap, ScrollTrigger, SplitText, lenis, reduced, finePointer };
  }
}

/**
 * Runs `setup` after the first browser render with a GSAP context scoped to the host element,
 * and reverts every tween / ScrollTrigger / SplitText it created when the component is destroyed.
 */
export function useMotion(setup: (kit: MotionKit, host: HTMLElement) => void | (() => void)): void {
  const motion = inject(Motion);
  const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  const destroyRef = inject(DestroyRef);
  let revert: (() => void) | undefined;
  let destroyed = false;

  destroyRef.onDestroy(() => {
    destroyed = true;
    revert?.();
  });

  afterNextRender(() => {
    void motion.load().then((kit) => {
      if (destroyed) return;
      let cleanup: void | (() => void);
      const ctx = kit.gsap.context(() => {
        cleanup = setup(kit, host);
      }, host);
      revert = () => {
        cleanup?.();
        ctx.revert();
      };
    });
  });
}
