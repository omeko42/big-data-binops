import { runFE } from './fe_inspect.mjs';

const chunkContent = runFE('curl -s http://127.0.0.1:3000/_next/static/chunks/dashboard-perma-318125d33290.js');
console.log('Chunk has bdb-dashboard-v10:', chunkContent.includes('bdb-dashboard-v10'));
console.log('Chunk has var(--cas-text-primary, #f1f5f9):', chunkContent.includes('var(--cas-text-primary, #f1f5f9)'));
console.log('Chunk has rgba(255,255,255,0.08) rank badge:', chunkContent.includes('rgba(255,255,255,0.08)'));
console.log('Chunk still has #334155 in function E/L:', chunkContent.includes('color:"#334155",fontWeight:600'));

const cssContent = runFE('curl -s http://127.0.0.1:3000/_next/static/chunks/20sy5p32bn-wu.css');
console.log('CSS has dark rank badge:', cssContent.includes('ol > li > span:first-child'));
console.log('CSS has #334155 fix:', cssContent.includes('334155'));
