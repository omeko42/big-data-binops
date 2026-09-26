import fs from 'fs';

const content = fs.readFileSync('scratch/fe_auth/user-page-pagination-v9-dfbc949b.patched.js', 'utf8');
console.log("user page len:", content.length);

// search for email column
const emailColIdx = content.indexOf('header:"Email"');
console.log("email column index:", emailColIdx);
if (emailColIdx !== -1) {
    console.log("=== EMAIL COLUMN SNIPPET ===");
    console.log(content.substring(emailColIdx - 50, emailColIdx + 500));
}

// search for dialog inputs
const dialogIdx = content.indexOf('header:e9?"Edit Pengguna"');
if (dialogIdx === -1) {
    const d2 = content.indexOf('Edit Pengguna');
    console.log("Edit Pengguna index:", d2);
    if (d2 !== -1) {
        console.log(content.substring(d2 - 100, d2 + 800));
    }
} else {
    console.log("dialog index:", dialogIdx);
    console.log(content.substring(dialogIdx - 100, dialogIdx + 800));
}
