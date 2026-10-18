import { Component, input, signal } from '@angular/core';
import { SiteContent } from '../../content';
import { useMotion } from '../../core/motion';
import { Magnetic } from '../../ui/magnetic';

@Component({
  selector: 'dd-contact',
  imports: [Magnetic],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  host: { class: 'section contact', id: 'contact' },
})
export class Contact {
  readonly content = input.required<SiteContent>();

  protected readonly copied = signal(false);

  constructor() {
    useMotion(({ gsap, SplitText, reduced }, host) => {
      if (reduced) return;
      const title = host.querySelector<HTMLElement>('[data-title]');
      if (!title) return;
      const split = SplitText.create(title, { type: 'lines', mask: 'lines', aria: 'none' });
      gsap.set(title, { opacity: 1 });
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.12,
        scrollTrigger: { trigger: title, start: 'top 80%' },
      });
    });
  }

  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.content().contact.email);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2200);
    } catch {
      location.href = `mailto:${this.content().contact.email}`;
    }
  }
}
