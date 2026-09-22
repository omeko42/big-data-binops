const fs = require('fs');
['0jwnqdsk5av20.js', '25xovob_oafqc.js', '3lvvhp-5u902i.js', '0djadui25rg1z.js'].forEach(f => {
  const p = `/usr/src/app/.next/static/chunks/${f}`;
  if (fs.existsSync(p)) {
    const s = fs.readFileSync(p, 'utf8');
    console.log(`=== FILE: ${f} (${s.length} bytes) ===`);
    const titleMatch = s.match(/cms-page-title["'],(?:children:)?["']([^"']+)/);
    console.log('Title:', titleMatch ? titleMatch[1] : 'none');
    console.log('Has DataTable:', s.includes('DataTable') || s.includes('treeTable') || s.includes('TreeTable'));
    console.log('Has TreeTable:', s.includes('TreeTable') || s.includes('treetable'));
    console.log('Has Paginator:', s.includes('Paginator') || s.includes('paginator') || s.includes('pagination'));
    console.log('Has Search/Filter:', s.includes('filter') || s.includes('search') || s.includes('Cari'));
  }
});
