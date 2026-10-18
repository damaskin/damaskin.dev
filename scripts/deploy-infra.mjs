// Server infrastructure for damaskin.dev: uploads deploy/ to /opt/damaskin-dev/deploy on `hetzner`
// and runs deploy/scripts/deploy.sh there (nginx container, certificate, cron, CI entry point).
//   npm run deploy:infra              — infrastructure only
//   npm run deploy:infra -- --site    — plus a release of the local build (dist/), like CI does
// Needs the `hetzner` ssh alias (~/.ssh/config, root). Site releases normally come from GitHub Actions.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const HOST = 'hetzner';
const IP = '167.233.91.168';
const REMOTE = '/opt/damaskin-dev';
const root = path.resolve(import.meta.dirname, '..');
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });
const ssh = (cmd) => `ssh -o BatchMode=yes ${HOST} "${cmd}"`;

console.log('==> upload deploy/');
run(
  `tar -czf - -C deploy . | ${ssh(`mkdir -p ${REMOTE}/deploy && tar -xzf - --no-same-owner -C ${REMOTE}/deploy`)}`,
);
run(ssh(`bash ${REMOTE}/deploy/scripts/deploy.sh`));

if (process.argv.includes('--site')) {
  const dist = path.join(root, 'dist/damaskin-dev/browser');
  if (!fs.existsSync(path.join(dist, 'index.html')))
    throw new Error('no build — run npm run build first');
  const sha = execSync('git rev-parse --short=7 HEAD', { cwd: root }).toString().trim();
  console.log(`\n==> release of the local build (${sha})`);
  // the same entry point the CI key is bound to
  run(
    `tar -czf - -C "${dist}" . | ${ssh(`SSH_ORIGINAL_COMMAND='deploy ${sha}' ${REMOTE}/bin/ci-deploy`)}`,
  );
}

console.log(
  '\n==> check through edge (by IP, works before DNS; -k: the certificate may still be temporary)',
);
run(
  `curl -sk -o ${process.platform === 'win32' ? 'NUL' : '/dev/null'} -w "https://damaskin.dev/health -> %{http_code}\\n" --resolve damaskin.dev:443:${IP} https://damaskin.dev/health`,
);
