import { runFE } from './fe_exec.mjs';

const cmd = `docker exec bdb-web node -e "
const fs = require('fs');
const glob = require('path');

const cssPath = '/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css';
const css = fs.readFileSync(cssPath, 'utf8');

console.log('=== 1. CSS Dark Mode Selectors in 20sy5p32bn-wu.css ===');
const darkSelectors = [...css.matchAll(/:root\\[data-theme=dark\\][^{]+|body\\[data-theme=dark\\][^{]+|\\[data-theme=dark\\][^{]+/g)].map(m => m[0].trim());
console.log('Count of dark selectors in CSS:', darkSelectors.length);
console.log('Sample dark selectors:');
console.log(darkSelectors.slice(0, 25));

console.log('\\n=== 2. Checking Dark Theme Coverage for Core UI Components ===');
const componentsToCheck = [
  '.cms-card',
  '.p-datatable',
  '.p-datatable-tbody',
  '.p-dialog',
  '.p-dropdown',
  '.p-inputtext',
  '.p-button',
  '.p-tag',
  '.att-icon-link',
  '.att-btn',
  '.satker-tree',
  '.p-tabview',
  '.p-paginator',
  '.p-toast',
  '.p-tooltip',
  '.p-calendar',
  '.p-multiselect',
  '.p-selectbutton',
  '.p-confirm-dialog',
  'table',
  'th',
  'td'
];

for (const comp of componentsToCheck) {
  const hasDark = css.includes('data-theme=dark') && css.includes(comp);
  console.log(comp.padEnd(20), '-> Dark CSS rule exists?', hasDark);
}
"`;

console.log(runFE(cmd));
