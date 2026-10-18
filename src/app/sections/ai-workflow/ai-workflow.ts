import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { SiteContent } from '../../content';

@Component({
  selector: 'dd-ai-workflow',
  templateUrl: './ai-workflow.html',
  styleUrl: './ai-workflow.scss',
  host: { class: 'section', id: 'ai' },
})
export class AiWorkflow {
  readonly content = input.required<SiteContent>();

  /**
   * The terminal replays the agent session line by line when it scrolls into view. The lines are
   * in the HTML and visible by default; they are hidden ('wait') only if the browser can play
   * them back — the terminal is still below the fold and motion is not reduced.
   */
  protected readonly replay = signal<'off' | 'wait' | 'play'>('off');
  private readonly terminal = viewChild.required<ElementRef<HTMLElement>>('terminal');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.terminal().nativeElement;
      if (
        !('IntersectionObserver' in window) ||
        matchMedia('(prefers-reduced-motion: reduce)').matches ||
        el.getBoundingClientRect().top < innerHeight
      ) {
        return;
      }
      this.replay.set('wait');
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          this.replay.set('play');
          observer.disconnect();
        },
        { threshold: 0.4 },
      );
      observer.observe(el);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
