const { UserService } = require('/usr/src/app/dist/app_core/auth/user/user.service');
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

  const userRes = await client.query('SELECT * FROM auth_users WHERE id = 1');
  const user1 = userRes.rows[0];

  // Exactly what persistSocialMedia sends from 3def3ti6rk0vr.js:
  const payload = {
    name: user1.name || "",
    email: user1.email || user1.email_polri,
    email_polri: user1.email_polri,
    nrp: "98010710",
    pangkat: "Briptu",
    jabatan: "-",
    satuan: "ROBINOPSNAL BARESKRIM POLRI",
    no_hp: "",
    username: user1.username,
    is_pns: false,
    photo_url: user1.photo_url || "",
    foto: user1.photo_url || "",
    social_media: {
      urls: [],
      banner_theme: 'data:image/jpeg;base64,' + 'B'.repeat(30000)
    }
  };

  const mockService = {
    userRepository: {
      findOne: () => Promise.resolve(user1),
      update: (id, update) => {
        console.log('userRepository.update called with:', update);
        return client.query('UPDATE auth_users SET social_media = $1 WHERE id = $2', [update.social_media, id]);
      }
    },
    dataSource: {
      query: (sql, params) => client.query(sql, params).then(r => r.rows)
    },
    normalizeEmail: (e) => e ? e.trim().toLowerCase() : '',
    cleanOptionalText: (t) => t ? String(t).trim() : null,
    checkIdentifierAvailability: () => Promise.resolve({ available: true }),
    upsertPoliceProfileByEmail: UserService.prototype.upsertPoliceProfileByEmail
  };

  const fn = UserService.prototype.updateOwnProfile.bind(mockService);

  console.log('Testing updateOwnProfile with payload:');
  try {
    const res = await fn(user1, payload);
    console.log('updateOwnProfile result:', res.status, res.message);
    const checkDb = await client.query('SELECT social_media FROM auth_users WHERE id = 1');
    console.log('Check DB social_media keys:', Object.keys(checkDb.rows[0].social_media));
    console.log('Banner theme saved successfully? length:', checkDb.rows[0].social_media?.banner_theme?.length);
  } catch (err) {
    console.error('Error during updateOwnProfile:', err);
  }

  // Reset back to { urls: [] }
  await client.query('UPDATE auth_users SET social_media = $1 WHERE id = 1', [{ urls: [] }]);
  console.log('Reset complete.');

  await client.end();
}

test();
