import { CONTENT, buildTimeline } from '../../content';

describe('career timeline', () => {
  const { bars, ticks } = buildTimeline(
    CONTENT.ru.experience.jobs,
    CONTENT.ru,
    new Date(2026, 9, 18),
  );
  const bar = (id: string) => bars.find((b) => b.job.id === id)!;

  it('runs the axis from the first job year to the current one', () => {
    expect(ticks.map((t) => t.year)).toEqual(Array.from({ length: 14 }, (_, i) => 2013 + i));
    expect(ticks[0].left).toBe(3.57); // labels sit in the middle of their year
    expect(ticks.filter((t) => t.major).map((t) => t.year)).toEqual([2013, 2016, 2019, 2022, 2025]);
  });

  it('places each job by its months on a 14-year axis', () => {
    // radikal.ru: Sep 2013 — Jul 2014 → starts 8 months in, 11 months long (of 168)
    expect(bar('radikal')).toMatchObject({ left: 4.76, width: 6.55, from: '2013', to: '2014' });
    expect(bar('dex')).toMatchObject({ from: '2015', to: '2017' });
    // GLOBUS: Jul 2018 — Dec 2022 → 66 months in, 54 months long
    expect(bar('globus')).toMatchObject({ left: 39.29, width: 32.14, from: '2018', to: '2022' });
  });

  it('stretches current jobs up to today', () => {
    const insapp = bar('insapp');
    expect(insapp.to).toBe('н. в.');
    // Dec 2021 + 59 months = Oct 2026, the build month
    expect(insapp.left + insapp.width).toBeCloseTo(((13 * 12 + 10) / 168) * 100, 1);
  });

  it('keeps every bar inside the axis', () => {
    for (const b of bars) {
      expect(b.left).toBeGreaterThanOrEqual(0);
      expect(b.left + b.width).toBeLessThanOrEqual(100);
    }
  });
});
