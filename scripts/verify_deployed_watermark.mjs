import http from 'http';

function getUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verify() {
  const url = 'http://10.0.0.x:3000/_next/static/chunks/1s8uqnrz-0f75.js';
  const res = await getUrl(url);
  console.log('HTTP Status:', res.status, 'Length:', res.data.length);

  const hasOldWatermark = res.data.includes('currentUser?.username || currentUser?.nrp');
  console.log('Has old bugged watermark priority:', hasOldWatermark);

  const hasNrpFallback = res.data.includes('98010710');
  console.log('Has true NRP 98010710 logic:', hasNrpFallback);

  const hasCleanWatermark = res.data.includes('let activeNrp = String(rawNrp).replace');
  console.log('Has clean activeNrp logic:', hasCleanWatermark);

  const hasCleanWatermarkArray = res.data.includes('[activeNrp, activeNrp, activeNrp, activeNrp].join');
  console.log('Has clean watermark array (NRP only):', hasCleanWatermarkArray);

  const hasPrintedByNrpFixed = res.data.includes('printedByNrp: currentUser?.nrp || ((String(currentUser?.id) === "1"');
  console.log('Has printedByNrp fix:', hasPrintedByNrpFixed);
}

verify().catch(console.error);
