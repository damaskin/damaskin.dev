// Project screenshots → responsive AVIF + WebP in public/img/projects.
//   node scripts/images.mjs <dir with PNG screenshots>
// Expects <name>-desktop.png (1440×900) and optionally <name>-mobile.png (390×844 @2x).
// The outputs are committed; the raw screenshots are not.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/images.mjs <screenshots dir>');
  process.exit(1);
}
const out = path.resolve(import.meta.dirname, '../public/img/projects');
fs.mkdirSync(out, { recursive: true });

const jobs = [];
for (const file of fs.readdirSync(src).filter((f) => f.endsWith('.png'))) {
  const [name, kind] = path.basename(file, '.png').split('-');
  const input = path.join(src, file);
  const base = kind === 'mobile' ? `${name}-mobile` : name;
  const widths = kind === 'mobile' ? [400, 780] : [800, 1600];
  for (const width of widths) {
    const img = () => sharp(input).resize({ width, withoutEnlargement: false });
    jobs.push(
      img()
        .avif({ quality: 52, effort: 6 })
        .toFile(path.join(out, `${base}-${width}.avif`)),
    );
    jobs.push(
      img()
        .webp({ quality: 78, effort: 6 })
        .toFile(path.join(out, `${base}-${width}.webp`)),
    );
  }
}
await Promise.all(jobs);
for (const f of fs.readdirSync(out).sort()) {
  console.log(f.padEnd(32), `${(fs.statSync(path.join(out, f)).size / 1024).toFixed(0)} KB`);
}
