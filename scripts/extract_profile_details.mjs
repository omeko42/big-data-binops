import fs from 'fs';

const content = fs.readFileSync('scratch/fe_auth/3def3ti6rk0vr.js', 'utf8');

// Find where the component function starts
const startIdx = content.indexOf('Profil Saya');
console.log("Found 'Profil Saya' at index:", startIdx);
if (startIdx !== -1) {
    const snippet = content.substring(startIdx - 500, startIdx + 4500);
    fs.writeFileSync('scratch/profile_view_snippet.js', snippet);
    console.log("Wrote scratch/profile_view_snippet.js, len:", snippet.length);
}

// Find edit dialog
const dialogIdx = content.indexOf('header:"Edit Profil"');
if (dialogIdx !== -1) {
    const dialogSnippet = content.substring(dialogIdx - 300, dialogIdx + 4500);
    fs.writeFileSync('scratch/profile_dialog_snippet.js', dialogSnippet);
    console.log("Wrote scratch/profile_dialog_snippet.js, len:", dialogSnippet.length);
}
