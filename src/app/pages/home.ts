import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CONTENT, Lang } from '../content';
import { useMotion } from '../core/motion';
import { Seo } from '../core/seo';
import { About } from '../sections/about/about';
import { AiWorkflow } from '../sections/ai-workflow/ai-workflow';
import { Contact } from '../sections/contact/contact';
import { Experience } from '../sections/experience/experience';
import { Hero } from '../sections/hero/hero';
import { Metrics } from '../sections/metrics/metrics';
import { Projects } from '../sections/projects/projects';
import { SiteFooter } from '../sections/site-footer/site-footer';
import { SiteHeader } from '../sections/site-header/site-header';
import { Stack } from '../sections/stack/stack';
import { Cursor } from '../ui/cursor';

/** The whole CV on one page; `/` renders it in Russian, `/en/` in English (route data `lang`). */
@Component({
  selector: 'dd-home',
  imports: [
    SiteHeader,
    Hero,
    Metrics,
    About,
    Experience,
    Projects,
    AiWorkflow,
    Stack,
    Contact,
    SiteFooter,
    Cursor,
  ],
  template: `
    <dd-site-header [content]="content" />
    <main id="main" tabindex="-1">
      <dd-hero [content]="content" />
      <dd-metrics [metrics]="content.metrics" />
      <dd-about [content]="content" />
      <dd-experience [content]="content" />
      <dd-projects [content]="content" />
      <dd-ai-workflow [content]="content" />
      <dd-stack [content]="content" />
      <dd-contact [content]="content" />
    </main>
    <dd-site-footer [content]="content" />
    <dd-cursor />
  `,
  styles: `
    main:focus {
      outline: none;
    }
  `,
})
export class Home {
  protected readonly content =
    CONTENT[(inject(ActivatedRoute).snapshot.data['lang'] as Lang | undefined) ?? 'ru'];

  constructor() {
    inject(Seo).apply(this.content);

    // Everything marked [data-reveal] fades up as it enters the viewport. Sections with their own
    // choreography run in their components; this is the shared default.
    useMotion(({ gsap, ScrollTrigger, reduced }, host) => {
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', host);
      if (reduced) {
        gsap.set(items, { opacity: 1 });
        return;
      }
      gsap.set(items, { opacity: 0, y: 36 });
      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, overwrite: true }),
      });

      // These triggers were created before the sections' own (incl. the projects pin) — once every
      // section has set up, put them in page order so positions below the pin account for its length.
      requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    });
  }
}
