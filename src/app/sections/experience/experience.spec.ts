import { CONTENT } from '../../content';
import { buildRows, shortHash } from './experience';

describe('experience graph', () => {
  const rows = buildRows(CONTENT.ru.experience.jobs, CONTENT.ru, new Date(2026, 9, 18));

  it('draws the main line from the newest commit down to the first one', () => {
    expect(rows.map((r) => r.lane0)).toEqual(['from-dot', 'full', 'full', 'to-dot']);
  });

  it('runs the GLOBUS branch from HEAD to the commit where it forks off', () => {
    expect(rows.map((r) => r.lane1)).toEqual(['full', 'fork', 'none', 'none']);
  });

  it('marks only current jobs as heads', () => {
    expect(rows.map((r) => r.head)).toEqual(['HEAD → main', 'HEAD → globus', null, null]);
  });

  it('gives each job a stable 7-char hash', () => {
    expect(shortHash('insapp')).toMatch(/^[0-9a-f]{7}$/);
    expect(shortHash('insapp')).toBe(shortHash('insapp'));
    expect(new Set(rows.map((r) => r.hash)).size).toBe(rows.length);
  });
});
