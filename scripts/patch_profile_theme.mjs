import fs from 'fs';

let content = fs.readFileSync('d:/Prototype CAS/EDIT MASTER MASAL/3def3ti6rk0vr.patched.js', 'utf8');

// Replace badge backgrounds in profile
content = content.replaceAll(
  'gap:"0.35rem",background:"#fff",border:`1.5px solid ${eK}',
  'gap:"0.35rem",background:"var(--cas-bg-surface, #fff)",border:`1.5px solid ${eK}'
);
content = content.replaceAll(
  'gap:"0.35rem",background:"#fff",border:`1.5px solid ${eR',
  'gap:"0.35rem",background:"var(--cas-bg-surface, #fff)",border:`1.5px solid ${eR'
);
content = content.replaceAll(
  'gap:"0.35rem",background:"#fff",border:"1.5px solid #e2e8f0",color:"#334155"',
  'gap:"0.35rem",background:"var(--cas-bg-surface, #fff)",border:"1.5px solid var(--cas-border-card, #e2e8f0)",color:"var(--cas-text-secondary, #334155)"'
);

// Replace inputs
content = content.replaceAll(
  'backgroundColor:"#fff",fontSize:"0.85rem",color:"#1e293b"',
  'backgroundColor:"var(--cas-bg-surface, #fff)",fontSize:"0.85rem",color:"var(--cas-text-primary, #1e293b)",borderColor:"var(--cas-border-card, #cbd5e1)"'
);
content = content.replaceAll(
  'color:"#334155",marginBottom:"0.25rem"',
  'color:"var(--cas-text-secondary, #334155)",marginBottom:"0.25rem"'
);

fs.writeFileSync('d:/Prototype CAS/EDIT MASTER MASAL/3def3ti6rk0vr.patched.js', content, 'utf8');
console.log('3def3ti6rk0vr.patched.js updated with dark mode variables!');
