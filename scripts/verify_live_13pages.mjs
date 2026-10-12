import http from 'http';

http.get('http://10.0.0.x:3000/_next/static/chunks/1s8uqnrz-0f75.js', res => {
  console.log('HTTP Status:', res.statusCode, 'Length:', res.headers['content-length']);
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Contains data-page=13:', d.includes('data-page":13'));
    console.log('Contains isMabes / Superadmin:', d.includes('isMabes'));
    console.log('Contains BARESKRIM POLRI:', d.includes('BARESKRIM POLRI'));
    console.log('Contains Horizontal Ruler:', d.includes('anev-ruler-bar'));
    console.log('Contains Cross-page Backspace engine:', d.includes('handleCrossPageKeys'));
    console.log('Contains SetDocFontSize:', d.includes('setDocFontSizePt'));
    console.log('Contains gdocs-root-app:', d.includes('gdocs-root-app'));
    console.log('Contains gdocs-top-header:', d.includes('gdocs-top-header'));
    console.log('Contains docOutlinePanel:', d.includes('docOutlinePanel'));
    console.log('Contains docFindReplaceBox:', d.includes('docFindReplaceBox'));
    console.log('Contains gdocs-menubar:', d.includes('gdocs-menubar'));
    console.log('Contains statusWordInfo:', d.includes('statusWordInfo'));
    console.log('Contains DRAFT FORMAT title:', d.includes('DRAFT FORMAT LAPORAN HARIAN - MINGGUAN RESERSE - SHARE'));
    console.log('Contains docKopSurat:', d.includes('docKopSurat'));
    console.log('Contains gdocsCommentKop (KALO PAKE KOP):', d.includes('KALO PAKE KOP'));
    console.log('Contains Opsi TTD (btn-ttd-polri):', d.includes('btn-ttd-polri'));
    console.log('Contains BIRO PEMBINAAN OPERASIONAL:', d.includes('BIRO PEMBINAAN OPERASIONAL'));
    console.log('Contains Top Right Page Numbering logic:', d.includes('textAlign:"right",fontWeight:700,fontSize:"10pt"'));
  });
});
