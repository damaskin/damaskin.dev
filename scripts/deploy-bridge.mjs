// ru-bridge (Moscow VPS, 132.243.16.97) in front of damaskin.dev for visitors from Russia: uploads deploy/ru-bridge
// and runs its setup.sh there (nginx site, certificate automation, log rotation).
//   npm run deploy:bridge
// Needs the `ru-bridge` ssh alias (~/.ssh/config, root). The server is shared with other projects — setup.sh
// touches only damaskin's own files and reloads nginx only after nginx -t.
import { execSync } from 'node:child_process';
import path from 'node:path';

const HOST = 'ru-bridge';
const TMP = '/tmp/damaskin-bridge';
const root = path.resolve(import.meta.dirname, '..');
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });

console.log(`==> upload deploy/ru-bridge, run setup.sh on ${HOST}`);
run(
  `tar -czf - -C deploy/ru-bridge . | ssh -o BatchMode=yes ${HOST} "rm -rf ${TMP} && mkdir ${TMP} && tar -xzf - --no-same-owner -C ${TMP} && bash ${TMP}/setup.sh"`,
);
