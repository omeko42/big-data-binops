import { runBE, runFE } from './fe_inspect.mjs';

console.log('1. Committing bdb-api on host .233...');
const beCommit = runBE('docker commit bdb-api bdb-api:anev-regional-scope-20260913');
console.log('BE Commit Result:', beCommit.trim());

console.log('2. Committing bdb-web on host .232...');
const feCommit = runFE('docker commit bdb-web bdb-web:anev-regional-scope-20260913');
console.log('FE Commit Result:', feCommit.trim());

console.log('Both docker commits completed successfully!');
