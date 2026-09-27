import fs from 'fs';

const cssPath = 'live-20sy5p32bn-wu.css';
let css = fs.readFileSync(cssPath, 'utf8');

const fixRule = `
/* ==========================================================================
   FIX NESTED INNER BORDER IN DROPDOWNS & MULTISELECTS (NO INNER SUB-CARD/BORDER)
   Ensure .p-dropdown-label and .p-multiselect-label never inherit .p-inputtext border/bg
   ========================================================================== */
.p-dropdown .p-dropdown-label,
.p-dropdown .p-dropdown-label.p-inputtext,
.p-dropdown .p-inputtext,
.p-dropdown input.p-dropdown-label,
.p-dropdown .p-dropdown-label:focus,
.p-dropdown .p-dropdown-label:hover,
.p-dropdown.p-focus .p-dropdown-label,
.p-multiselect .p-multiselect-label,
.p-multiselect .p-multiselect-label.p-inputtext,
.p-multiselect .p-inputtext,
.p-multiselect .p-multiselect-label:focus,
.p-multiselect .p-multiselect-label:hover,
.p-multiselect.p-focus .p-multiselect-label,
:root[data-theme="dark"] .p-dropdown .p-dropdown-label,
:root[data-theme="dark"] .p-dropdown .p-dropdown-label.p-inputtext,
:root[data-theme="dark"] .p-dropdown .p-inputtext,
:root[data-theme="dark"] .p-multiselect .p-multiselect-label,
:root[data-theme="dark"] .p-multiselect .p-multiselect-label.p-inputtext,
:root[data-theme="dark"] .p-multiselect .p-inputtext,
[data-theme="dark"] .p-dropdown .p-dropdown-label,
[data-theme="dark"] .p-dropdown .p-dropdown-label.p-inputtext,
[data-theme="dark"] .p-dropdown .p-inputtext,
[data-theme="dark"] .p-multiselect .p-multiselect-label,
[data-theme="dark"] .p-multiselect .p-multiselect-label.p-inputtext,
[data-theme="dark"] .p-multiselect .p-multiselect-label.p-placeholder,
[data-theme="dark"] .p-multiselect .p-inputtext {
  border: 0 none !important;
  border-width: 0 !important;
  border-style: none !important;
  outline: 0 none !important;
  outline-offset: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  border-radius: 0 !important;
}
`;

if (!css.includes('FIX NESTED INNER BORDER IN DROPDOWNS')) {
    css += fixRule;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Appended fixRule to live-20sy5p32bn-wu.css');
} else {
    console.log('fixRule already present in live-20sy5p32bn-wu.css');
}
