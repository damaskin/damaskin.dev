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
