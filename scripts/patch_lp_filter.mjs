import fs from 'fs';

let content = fs.readFileSync('d:/Prototype CAS/EDIT MASTER MASAL/scratch/laporan-filter-perma-a15e28ec2e81.js', 'utf8');

// Replace sticky td white backgrounds
content = content.replaceAll(
  'position:"sticky",left:0,background:"#fff"',
  'position:"sticky",left:0,background:"var(--cas-bg-surface, #fff)"'
);
content = content.replaceAll(
  'position:"sticky",left:"3.5rem",background:"#fff"',
  'position:"sticky",left:"3.5rem",background:"var(--cas-bg-surface, #fff)"'
);
content = content.replaceAll(
  'borderCollapse:"collapse",width:"100%",minWidth:"20rem",background:"#fff"',
  'borderCollapse:"collapse",width:"100%",minWidth:"20rem",background:"var(--cas-bg-surface, #fff)"'
);

// Replace filter popover background
content = content.replaceAll(
  'background:"#fff",\n                border:"1px solid #dbe3ee"',
  'background:"var(--cas-bg-surface, #fff)",\n                border:"1px solid var(--cas-border-card, #dbe3ee)"'
);
content = content.replaceAll(
  'background:"#fff",border:"1px solid #dbe3ee"',
  'background:"var(--cas-bg-surface, #fff)",border:"1px solid var(--cas-border-card, #dbe3ee)"'
);

// Replace dark text in labels & headings
content = content.replaceAll(
  'color:"#0f172a"',
  'color:"var(--cas-text-primary, #0f172a)"'
);
content = content.replaceAll(
  'color:"#334155"',
  'color:"var(--cas-text-secondary, #334155)"'
);

// Replace sub-card backgrounds
content = content.replaceAll(
  'background:"#f8fafc",border:"1px solid #e2e8f0"',
  'background:"var(--cas-bg-subtle, #f8fafc)",border:"1px solid var(--cas-border-card, #e2e8f0)"'
);

fs.writeFileSync('d:/Prototype CAS/EDIT MASTER MASAL/scratch/laporan-filter-perma-a15e28ec2e81.patched.js', content, 'utf8');
console.log('laporan-filter-perma-a15e28ec2e81.patched.js created successfully!');
