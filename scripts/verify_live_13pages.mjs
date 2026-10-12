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
    console.log('Contains SetDocFontSize:', d.includes('setDocFontSize'));
  });
});
