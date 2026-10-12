import fs from 'fs';

const code = fs.readFileSync('1s8uqnrz-0f75.patched.js', 'utf8');

console.log('Total file size:', code.length);

for (let p = 1; p <= 13; p++) {
  const hasPage = code.includes(`"data-page":${p}`) || code.includes(`'data-page':${p}`);
  console.log(`Page ${p} exists:`, hasPage);
}

const keyTerms = [
  'gdocs-menubar',
  'gdocs-toolbar',
  'anev-ruler-bar',
  'gdocs-statusbar',
  'docEditor',
  'docWorkspace',
  'toggleDocDropdown',
  'closeAllDocDropdowns',
  'updateToolbarState',
  'updateDocStats',
  'setDocFontName',
  'setDocFontSizePt',
  'stepDocFontSize',
  'setDocBlockFormat',
  'setDocTextColor',
  'setDocHighlightColor',
  'setDocLineSpacing',
  'applyDocZoom',
  'handleTableAction',
  'insertCustomTable',
  'handleInsertLogo',
  'handleInsertPageBreak',
  'handleCrossPageKeys',
  'resolveAutoTags',
  'RESERSE_LOGO_B64'
];

keyTerms.forEach(t => {
  console.log(`Key term "${t}":`, code.includes(t) ? 'OK' : 'MISSING');
});
