import { runBE } from './be_exec.mjs';

const cmd = `docker exec bdb-api node -e '
  const { Client } = require("pg");
  // Let us call the HTTP endpoint /api/Authentication/user or inspect user object in bdb-api
  const http = require("http");
  // We can also test direct TypeORM query or inspect via Nest context
'`;

const testEndpoint = `docker exec bdb-api node -e '
  const http = require("http");
  // Let us check what Nest User entity has
  const { User } = require("/usr/src/app/dist/app_core/auth/user/entities/user.entity.js");
  console.log("User metadata/columns:", Object.keys(new User()));
'`;

console.log(runBE(testEndpoint));
