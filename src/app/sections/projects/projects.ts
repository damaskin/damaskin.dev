import { Component, input } from '@angular/core';
import { SiteContent } from '../../content';
import { useMotion } from '../../core/motion';

@Component({
  selector: 'dd-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  host: { class: 'section projects', id: 'projects' },
})
export class Projects {
  readonly content = input.required<SiteContent>();

  constructor() {
    useMotion(({ gsap }, host) => {
      const mm = gsap.matchMedia();

      // The heading lives inside the pinned block, so it animates here rather than in the page-wide reveal.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.projects__title', {
          opacity: 0,
          y: 40,
          duration: 1.2,
          scrollTrigger: { trigger: host, start: 'top 75%' },
        });
      });

      // Wide screens: the section pins and the cards travel sideways while you scroll down.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        host.classList.add('is-horizontal');
        const pin = host.querySelector<HTMLElement>('.projects__pin')!;
        const track = host.querySelector<HTMLElement>('.projects__track')!;
        const distance = () =>
          Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            pin: true,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        for (const card of gsap.utils.toArray<HTMLElement>('[data-project]', host)) {
          const media = card.querySelector('.project__media');
          if (media) {
            gsap.fromTo(
              media,
              { xPercent: -3, scale: 1.07 },
              {
                xPercent: 3,
                scale: 1.07,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: travel,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              },
            );
          }
          const info = card.querySelectorAll('.project__info > *');
          if (!info.length) continue;
          gsap.from(info, {
            opacity: 0,
            x: 60,
            stagger: 0.05,
            duration: 1,
            scrollTrigger: { trigger: card, containerAnimation: travel, start: 'left 75%' },
          });
        }

        return () => host.classList.remove('is-horizontal');
      });

      // Phones and tablets: a plain vertical list, cards rise in one by one.
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        for (const card of gsap.utils.toArray<HTMLElement>('[data-project]', host)) {
          gsap.from(card, {
            opacity: 0,
            y: 60,
            duration: 1.1,
            scrollTrigger: { trigger: card, start: 'top 85%' },
          });
        }
      });

      return () => mm.revert();
    });
  }
}
