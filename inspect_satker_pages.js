const fs = require('fs');
['satker-tree', 'satker-eksternal', '../pengaturan/satker'].forEach(page => {
  const p = `/usr/src/app/.next/server/app/cms/master/${page}.html`;
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const matches = html.match(/static\/chunks\/[^"'\s>]+/g) || [];
    console.log(`Page: ${page}, Chunks:`, [...new Set(matches)]);
  } else {
    console.log(`Page: ${page} not found at ${p}`);
  }
});
