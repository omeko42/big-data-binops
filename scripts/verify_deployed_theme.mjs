import { runFE } from './fe_exec.mjs';

const nodeScript = `
const fs = require('fs');

const css = fs.readFileSync('/usr/src/app/.next/static/chunks/20sy5p32bn-wu.css', 'utf8');
console.log('CSS has PrimeReact dark --surface-0 mapping?', css.includes('--surface-0: #111a2e'));
console.log('CSS has dark table override for #0f172a?', css.includes('[style*="color: #0f172a"]'));
console.log('CSS has dark modal card override?', css.includes('.p-dialog [style*="background: #ffffff"]'));
console.log('CSS has dark filter popover override?', css.includes('[style*="position:absolute"][style*="background: #fff"]'));
console.log('CSS has SVG icon min sizes?', css.includes('min-width: 1.15rem !important'));

console.log('CSS has explicit .p-button-info #0284c7?', css.includes('.p-button.p-button-info'));
console.log('CSS has dark amber alert override?', css.includes('rgba(245, 158, 11, 0.14)'));
console.log('CSS has dark blue alert override?', css.includes('rgba(14, 165, 233, 0.14)'));
console.log('CSS has clean dialog close button style?', css.includes('.p-dialog-header-close'));

const userJs = fs.readFileSync('/usr/src/app/.next/static/chunks/user-page-pagination-v9-dfbc949b.js', 'utf8');
console.log('User page has --cas-text-primary for email?', userJs.includes('color:"var(--cas-text-primary, #0f172a)"'));
console.log('User page has --cas-bg-surface for modal cards?', userJs.includes('background:"var(--cas-bg-surface, #ffffff)"'));
console.log('User page has 17px action icons?', userJs.includes('(S.Eye,{size:17})'));
console.log('User page has 17px trash icon?', userJs.includes('(T.Trash2,{size:17})'));
console.log('User page has 38rem review dialog?', userJs.includes('style:{width:"38rem",maxWidth:"96vw"}'));
console.log('User page has column MutBox layout?', userJs.includes('flexDirection:"column",gap:"0.45rem"'));

const lpJs = fs.readFileSync('/usr/src/app/.next/static/chunks/laporan-filter-perma-a15e28ec2e81.js', 'utf8');
console.log('LP filter has --cas-bg-surface?', lpJs.includes('var(--cas-bg-surface, #fff)'));

const profJs = fs.readFileSync('/usr/src/app/.next/static/chunks/3def3ti6rk0vr.js', 'utf8');
console.log('Profile has dark badge background?', profJs.includes('background:"var(--cas-bg-surface, #fff)"'));
`;

const b64 = Buffer.from(nodeScript).toString('base64');
const cmd = `echo '${b64}' | base64 -d | docker exec -i bdb-web node`;

console.log(runFE(cmd));
