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

  const mockService = {
    userRepository: {
      findOne: () => Promise.resolve(user1)
    },
    dataSource: {
      query: (sql, params) => client.query(sql, params).then(r => r.rows)
    },
    normalizeEmail: (e) => e ? e.trim().toLowerCase() : ''
  };

  const fn = UserService.prototype.getOwnProfile.bind(mockService);
  const profile = await fn(user1);
  console.log('getOwnProfile result for user 1:');
  console.log(profile);

  await client.end();
}

test();
