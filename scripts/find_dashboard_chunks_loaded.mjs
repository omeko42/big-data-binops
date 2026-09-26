import { runFE } from './fe_exec.mjs';

const cmd = `curl -s http://127.0.0.1:3000/cms/dashboard | grep -o '/_next/static/chunks/[^"'"'"']\\+' | sort -u`;
console.log(runFE(cmd));
