import https from 'https';
import http from 'http';

// We can test locally via ssh or direct to BE
import { runBE } from './be_exec.mjs';

async function testBE() {
  console.log("=== 1. Testing Backend 2-Way Validation via Nest UsersService ===");
  const testScript = `
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { UserService } = require('./dist/app_core/auth/user/user.service');
const { AuthService } = require('./dist/app_core/auth/auth.service');

async function test() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const authService = app.get(AuthService);

  // Test 1: create with identical username and email_polri
  console.log("Test 1: create with identical username and email_polri");
  try {
    await userService.create({
      name: "Test User",
      email: "test@gmail.com",
      email_polri: "sameuser@polri.go.id",
      username: "sameuser@polri.go.id",
      password: "Password123!",
      password_confirmation: "Password123!"
    });
    console.log("FAIL: Expected create to throw BadRequestException");
  } catch (err) {
    const res = err.getResponse ? err.getResponse() : err.message;
    console.log("PASS: create threw expected exception:", JSON.stringify(res));
  }

  // Test 2: update with identical username and email_polri
  console.log("\\nTest 2: update with identical username and email_polri");
  try {
    await userService.update("1", {
      email_polri: "admin_test@polri.go.id",
      username: "admin_test@polri.go.id"
    });
    console.log("FAIL: Expected update to throw BadRequestException");
  } catch (err) {
    const res = err.getResponse ? err.getResponse() : err.message;
    console.log("PASS: update threw expected exception:", JSON.stringify(res));
  }

  // Test 3: OTP Cooldown test
  console.log("\\nTest 3: OTP Rate Limiter Cooldown");
  try {
    authService['checkOtpRateLimit']('test_user_cooldown:test');
    console.log("First OTP request: Allowed (PASS)");
  } catch (err) {
    console.log("First OTP request failed:", err.message);
  }

  try {
    authService['checkOtpRateLimit']('test_user_cooldown:test');
    console.log("FAIL: Expected second immediate OTP request to throw cooldown exception");
  } catch (err) {
    console.log("PASS: Second immediate OTP request rejected:", err.getResponse ? JSON.stringify(err.getResponse()) : err.message);
  }

  await app.close();
}
test().catch(e => { console.error(e); process.exit(1); });
`;

  const b64 = Buffer.from(testScript).toString('base64');
  const res = runBE(`
    echo "${b64}" | base64 -d > /tmp/test_verification.js
    docker cp /tmp/test_verification.js bdb-api:/usr/src/app/test_verification.js
    docker exec bdb-api node /usr/src/app/test_verification.js
    docker exec bdb-api rm -f /usr/src/app/test_verification.js
    rm -f /tmp/test_verification.js
  `);
  console.log(res);
}

testBE();
