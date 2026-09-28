import { runBE } from './be_exec.mjs';

const script = `
docker exec bdb-api find / -name "jukrah*.js" 2>/dev/null
`;

try {
  console.log(runBE(script));
} catch (e) {
  console.error("BE error:", e.message);
}
