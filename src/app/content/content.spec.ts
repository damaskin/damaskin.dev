import { CONTENT, formatPeriod, monthsBetween } from './index';

const { ru, en } = CONTENT;

describe('content', () => {
  it('keeps both languages in step: same jobs, projects, metrics and stack groups', () => {
    expect(en.experience.jobs.map((j) => j.id)).toEqual(ru.experience.jobs.map((j) => j.id));
    expect(en.experience.jobs.map((j) => [j.start, j.end])).toEqual(
      ru.experience.jobs.map((j) => [j.start, j.end]),
    );
    expect(en.projects.items.map((p) => p.id)).toEqual(ru.projects.items.map((p) => p.id));
    expect(en.metrics.map((m) => m.value)).toEqual(ru.metrics.map((m) => m.value));
    expect(en.stack.groups.length).toBe(ru.stack.groups.length);
    expect(en.projects.items.map((p) => [p.url, p.image?.src, p.stores])).toEqual(
      ru.projects.items.map((p) => [p.url, p.image?.src, p.stores]),
    );
    expect(en.nav.map((n) => n.href)).toEqual(ru.nav.map((n) => n.href));
  });

  it('points every nav anchor at a section that exists', () => {
    const sections = ['#experience', '#projects', '#ai', '#stack', '#contact'];
    for (const item of ru.nav) expect(sections).toContain(item.href);
  });

  it('has no empty strings anywhere', () => {
    const walk = (value: unknown, path: string): void => {
      if (typeof value === 'string') expect(value.trim(), path).not.toBe('');
      else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`));
      else if (value && typeof value === 'object')
        for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
    };
    walk(ru, 'ru');
    walk(en, 'en');
  });
});

describe('periods', () => {
  const job = (id: string) => ru.experience.jobs.find((j) => j.id === id)!;

  it('counts months inclusively, like the CV', () => {
    expect(monthsBetween('2015-02', '2017-06')).toBe(29);
    expect(monthsBetween('2013-09', '2014-07')).toBe(11);
  });

  it('formats finished jobs exactly as in the CV', () => {
    const now = new Date(2026, 9, 18);
    expect(formatPeriod(job('dex'), ru, now)).toEqual({
      range: 'Фев 2015 — Июн 2017',
      duration: '2 г. 5 мес.',
    });
    expect(formatPeriod(job('radikal'), ru, now)).toEqual({
      range: 'Сен 2013 — Июл 2014',
      duration: '11 мес.',
    });
    expect(formatPeriod(job('globus'), ru, now)).toEqual({
      range: 'Июл 2018 — Дек 2022',
      duration: '4 г. 6 мес.',
    });
    expect(formatPeriod(job('dex'), en, now).duration).toBe('2 yrs 5 mo');
  });

  it('counts current jobs up to the build date', () => {
    expect(formatPeriod(job('insapp'), ru, new Date(2026, 9, 18))).toEqual({
      range: 'Дек 2021 — н. в.',
      duration: '4 г. 11 мес.',
    });
    expect(formatPeriod(job('insapp'), ru, new Date(2026, 10, 2)).duration).toBe('5 г.');
  });
});
