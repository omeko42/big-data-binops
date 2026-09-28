import fs from 'fs';
import cp from 'child_process';

const files = [
  'frontend-patch/0-gigr76s0g8t.synchronized.js',
  'frontend-patch/dashboard-perma-318125d33290_v2.synchronized.js'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const target = "var c = String(rawCallsign || '').trim().replace(/^@/, '');";
  const replacement = "var c = String(rawCallsign || '').trim().replace(/^@/, ''); if (c.startsWith('pers_') || c.startsWith('user_')) c = '';";
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(f, content, 'utf8');
    cp.execSync('node -c ' + f);
    console.log('✓ Updated formatCallsign in', f);
  } else {
    console.error('Target not found in', f);
    process.exit(1);
  }
});
