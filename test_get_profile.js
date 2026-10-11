const { JukrahService } = require('/usr/src/app/dist/bdb/jukrah/jukrah.service');
const { Client } = require('/usr/src/app/node_modules/pg');

async function test() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  await client.connect();

  const mockService = {
    dataSource: {
      query: (sql, params) => client.query(sql, params).then(r => r.rows)
    }
  };

  const fn = JukrahService.prototype.getNetworkProfile.bind(mockService);

  console.log('--- Testing cleanTarget: "17038" ---');
  try {
    const res1 = await fn({ id: 1 }, '17038');
    console.log('Result for 17038:', res1);
  } catch (e) {
    console.error('Error 17038:', e);
  }

  console.log('--- Testing cleanTarget: "dwi_wahyuni.95" ---');
  try {
    const res2 = await fn({ id: 1 }, 'dwi_wahyuni.95');
    console.log('Result for dwi_wahyuni.95:', res2);
  } catch (e) {
    console.error('Error dwi_wahyuni.95:', e);
  }

  console.log('--- Testing cleanTarget: "@dwi_wahyuni.95" ---');
  try {
    const res3 = await fn({ id: 1 }, '@dwi_wahyuni.95');
    console.log('Result for @dwi_wahyuni.95:', res3);
  } catch (e) {
    console.error('Error @dwi_wahyuni.95:', e);
  }

  await client.end();
}

test();
