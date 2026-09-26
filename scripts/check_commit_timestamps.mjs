import { runFE } from './fe_exec.mjs';
import { runBE } from './be_exec.mjs';

console.log('=== FE DOCKER IMAGES (Top 5) ===');
console.log(runFE('docker images --format "table {{.Repository}}:{{.Tag}}\\t{{.ID}}\\t{{.CreatedAt}}" | head -n 6'));

console.log('=== BE DOCKER IMAGES (Top 5) ===');
console.log(runBE('docker images --format "table {{.Repository}}:{{.Tag}}\\t{{.ID}}\\t{{.CreatedAt}}" | head -n 6'));
