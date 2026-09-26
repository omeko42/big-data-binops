import { runFE } from './fe_exec.mjs';

const cmd = `curl -s http://127.0.0.1:3000/cms/dashboard | grep -o '[a-zA-Z0-9_-]*\\.js' | head -n 30`;
console.log(runFE(cmd));
