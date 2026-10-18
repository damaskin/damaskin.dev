import { Component, computed, input } from '@angular/core';
import { Job, SiteContent, formatPeriod } from '../../content';
import { useMotion } from '../../core/motion';

type LaneShape = 'none' | 'full' | 'from-dot' | 'to-dot' | 'fork';

interface Row {
  readonly job: Job;
  readonly hash: string;
  readonly head: string | null;
  readonly range: string;
  readonly duration: string;
  readonly lane0: LaneShape;
  readonly lane1: LaneShape;
}

/** Stable pseudo commit hash for a job (FNV-1a → 7 hex chars). */
export function shortHash(id: string): string {
  let h = 0x811c9dc5;
  for (const ch of id) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0').slice(0, 7);
}

/**
 * Experience as `git log --graph`: the main line is lane 0, the long-running parallel job
 * (GLOBUS) is a branch on lane 1 that forked off the main line and is still open.
 */
export function buildRows(jobs: readonly Job[], c: SiteContent, now: Date): Row[] {
  const branchAt = jobs.findIndex((j) => j.lane === 1);
  return jobs.map((job, i) => {
    const first = i === 0;
    const last = i === jobs.length - 1;
    const lane0: LaneShape =
      job.lane === 1 ? 'full' : first ? 'from-dot' : last ? 'to-dot' : 'full';
    const lane1: LaneShape =
      branchAt < 0 || i > branchAt ? 'none' : i === branchAt ? 'fork' : 'full';
    const head = job.end ? null : job.lane === 0 ? 'HEAD → main' : `HEAD → ${job.id}`;
    return { job, hash: shortHash(job.id), head, ...formatPeriod(job, c, now), lane0, lane1 };
  });
}

@Component({
  selector: 'dd-experience',
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  host: { class: 'section experience', id: 'experience' },
})
export class Experience {
  readonly content = input.required<SiteContent>();

  protected readonly rows = computed(() =>
    buildRows(this.content().experience.jobs, this.content(), new Date()),
  );

  constructor() {
    useMotion(({ gsap, reduced }, host) => {
      if (reduced) return;
      for (const row of gsap.utils.toArray<HTMLElement>('[data-job]', host)) {
        gsap.fromTo(
          row,
          { '--p': 0 },
          {
            '--p': 1,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top 72%', end: 'bottom 72%', scrub: 0.6 },
          },
        );
        gsap.from(row.querySelector('.job__dot'), {
          scale: 0,
          duration: 0.9,
          ease: 'back.out(3)',
          scrollTrigger: { trigger: row, start: 'top 75%' },
        });
      }
      const title = host.querySelector<HTMLElement>('.experience__title');
      if (title) {
        gsap.to(title, {
          scrambleText: {
            text: title.textContent ?? '',
            chars: 'abcdef0123456789-',
            revealDelay: 0.4,
            speed: 0.5,
          },
          duration: 1.4,
          ease: 'none',
          scrollTrigger: { trigger: title, start: 'top 85%' },
        });
      }
    });
  }
}
