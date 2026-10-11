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

  const fakeBanner = 'data:image/jpeg;base64,' + 'A'.repeat(50000);
  const testSoc = {
    banner_theme: fakeBanner,
    urls: []
  };

  try {
    const res = await client.query('UPDATE auth_users SET social_media = $1 WHERE id = 1 RETURNING id, social_media', [testSoc]);
    console.log('Update direct pg success! Banner length:', res.rows[0].social_media.banner_theme.length);
  } catch (e) {
    console.error('Update direct pg failed:', e);
  }

  await client.end();
}

test();
