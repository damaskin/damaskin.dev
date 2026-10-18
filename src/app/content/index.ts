import { EN } from './content.en';
import { RU } from './content.ru';
import { Job, Lang, SiteContent } from './types';

export * from './types';
export * from './shared';

export const CONTENT: Record<Lang, SiteContent> = { ru: RU, en: EN };

/** Path of each language version; Russian lives in the root. */
export const LANG_PATH: Record<Lang, string> = { ru: '/', en: '/en' };

const parseMonth = (iso: string) => {
  const [year, month] = iso.split('-').map(Number);
  return { year, month };
};

/** Months between two ISO months, counting both ends — the way the CV does (Feb 2015 — Jun 2017 = 2 yrs 5 mo). */
export function monthsBetween(start: string, end: string): number {
  const a = parseMonth(start);
  const b = parseMonth(end);
  return (b.year - a.year) * 12 + (b.month - a.month) + 1;
}

export function toIsoMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function formatDuration(months: number, c: SiteContent): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years ? c.durations.year(years) : '', rest ? c.durations.month(rest) : '']
    .filter(Boolean)
    .join(' ');
}

export function formatPeriod(
  job: Job,
  c: SiteContent,
  now: Date,
): { range: string; duration: string } {
  const month = (iso: string) => {
    const { year, month } = parseMonth(iso);
    return `${c.durations.months[month - 1]} ${year}`;
  };
  const end = job.end ?? toIsoMonth(now);
  return {
    range: `${month(job.start)} — ${job.end ? month(job.end) : c.experience.present}`,
    duration: formatDuration(monthsBetween(job.start, end), c),
  };
}

export interface TimelineBar {
  readonly job: Job;
  /** Position and length on the axis, in percent of its width. */
  readonly left: number;
  readonly width: number;
  readonly from: string;
  readonly to: string;
}

export interface TimelineTick {
  readonly year: number;
  /** Middle of the year on the axis, in percent — where its label goes. */
  readonly left: number;
  /** Labels that stay on narrow screens: the first year and every third one after it. */
  readonly major: boolean;
}

/**
 * Career as a Gantt chart: the axis runs from January of the first job's year to the end of
 * the current year, each job is a bar from its first to its last month (current jobs — up to `now`).
 */
export function buildTimeline(
  jobs: readonly Job[],
  c: SiteContent,
  now: Date,
): { bars: TimelineBar[]; ticks: TimelineTick[] } {
  const first = Math.min(...jobs.map((j) => parseMonth(j.start).year));
  const last = now.getFullYear();
  const total = (last - first + 1) * 12;
  const offset = (iso: string) => {
    const { year, month } = parseMonth(iso);
    return (year - first) * 12 + month - 1;
  };
  const pct = (months: number) => Math.round((months / total) * 10000) / 100;
  const nowIso = toIsoMonth(now);

  const bars = jobs.map((job) => ({
    job,
    left: pct(offset(job.start)),
    width: pct(monthsBetween(job.start, job.end ?? nowIso)),
    from: job.start.slice(0, 4),
    to: job.end ? job.end.slice(0, 4) : c.experience.present,
  }));
  const ticks = Array.from({ length: last - first + 1 }, (_, i) => ({
    year: first + i,
    left: pct(i * 12 + 6),
    major: i % 3 === 0,
  }));
  return { bars, ticks };
}
