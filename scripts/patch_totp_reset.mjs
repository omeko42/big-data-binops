import fs from 'fs';
import vm from 'vm';

let code = fs.readFileSync('3def3ti6rk0vr.patched.js', 'utf8');
let target = 'detail:"Google Authenticator (TOTP) berhasil diaktifkan!"});\nsetTotpModal(!1);await eT();';
if (code.includes(target)) {
  let replacement = 'detail:"Google Authenticator (TOTP) berhasil diaktifkan!"});\nsetOtpCooldown(0);setOtpAttempts(0);setOtpVerifyFails(0);\nsetTotpModal(!1);await eT();';
  code = code.replace(target, replacement);
  new vm.Script(code);
  fs.writeFileSync('3def3ti6rk0vr.patched.js', code, 'utf8');
  console.log('TOTP reset to 0 APPLIED successfully!');
} else {
  console.log('Target string not found, trying CRLF');
  let targetCRLF = 'detail:"Google Authenticator (TOTP) berhasil diaktifkan!"});\r\nsetTotpModal(!1);await eT();';
  if (code.includes(targetCRLF)) {
    let replacementCRLF = 'detail:"Google Authenticator (TOTP) berhasil diaktifkan!"});\r\nsetOtpCooldown(0);setOtpAttempts(0);setOtpVerifyFails(0);\r\nsetTotpModal(!1);await eT();';
    code = code.replace(targetCRLF, replacementCRLF);
    new vm.Script(code);
    fs.writeFileSync('3def3ti6rk0vr.patched.js', code, 'utf8');
    console.log('TOTP reset to 0 APPLIED with CRLF successfully!');
  }
}
