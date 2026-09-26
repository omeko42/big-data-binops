import fs from 'fs';

const content = fs.readFileSync('scratch/fe_auth/3def3ti6rk0vr.js', 'utf8');

// Let's write a small script to search for the Security section in 3def3ti6rk0vr.js
const secIdx = content.indexOf('Keamanan Akun');
if (secIdx !== -1) {
    console.log("Found Keamanan Akun at:", secIdx);
    const secSnippet = content.substring(secIdx - 100, secIdx + 3000);
    fs.writeFileSync('scratch/profile_security_snippet.js', secSnippet);
}

// And let's find the email displays in the profile view
const emailIdx = content.indexOf('Email Dinas (Polri)');
if (emailIdx !== -1) {
    console.log("Found Email Dinas (Polri) at:", emailIdx);
    const emailSnippet = content.substring(emailIdx - 200, emailIdx + 1000);
    fs.writeFileSync('scratch/profile_email_snippet.js', emailSnippet);
}
