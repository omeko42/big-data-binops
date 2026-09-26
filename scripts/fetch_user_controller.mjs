import { runBE } from './be_exec.mjs';
import fs from 'fs';

const content = runBE(`docker exec bdb-api cat /usr/src/app/src/app_core/auth/user/user.controller.ts`);
fs.writeFileSync('user.controller.ts', content, 'utf8');
console.log('Saved user.controller.ts, length:', content.length);
