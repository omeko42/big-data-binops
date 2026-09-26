import fs from 'fs';

// Read modern and original CSS
const modernCss = fs.readFileSync('20sy5p32bn-wu.modern.css', 'utf8');
const origCss = fs.readFileSync('20sy5p32bn-wu.css', 'utf8');

console.log('Original length:', origCss.length, 'Modern length:', modernCss.length);

// 1. Extract missing blocks 17, 18, 20 from origCss
const origBlocks = origCss.split(/(?=\/\* =+)/);
console.log('Total blocks in orig:', origBlocks.length);

const block17 = origBlocks[17]; // Unified filter, export & pdf modal
const block18 = origBlocks[18]; // Mobile sidebar drawer & backdrop stacking
const block20 = origBlocks[20]; // Kinerja perkara filter popover dropup & compact

if (!block17.includes('KINERJA PERKARA UNIFIED FILTER')) {
  throw new Error('Block 17 mismatch: ' + block17.slice(0, 100));
}
if (!block18.includes('MOBILE SIDEBAR DRAWER')) {
  throw new Error('Block 18 mismatch: ' + block18.slice(0, 100));
}
if (!block20.includes('KINERJA PERKARA FILTER POPOVER')) {
  throw new Error('Block 20 mismatch: ' + block20.slice(0, 100));
}

console.log('Block 17 length:', block17.length);
console.log('Block 18 length:', block18.length);
console.log('Block 20 length:', block20.length);

// 2. Fix button severities in modern CSS so text and outlined buttons are not given solid backgrounds
let updatedCss = modernCss;

const oldButtonSeverityBlock = `/* Explicit Button Severities */
.p-button.p-button-info,
.p-button-info.p-button {
  background: #0284c7 !important;
  border: 1px solid #0284c7 !important;
  color: #ffffff !important;
  font-weight: 700 !important;
}
.p-button.p-button-info:hover,
.p-button-info.p-button:hover {
  background: #0369a1 !important;
  border-color: #0369a1 !important;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35) !important;
}

.p-button.p-button-success,
.p-button-success.p-button {
  background: #16a34a !important;
  border: 1px solid #16a34a !important;
  color: #ffffff !important;
  font-weight: 700 !important;
}
.p-button.p-button-success:hover,
.p-button-success.p-button:hover {
  background: #15803d !important;
  border-color: #15803d !important;
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35) !important;
}

.p-button.p-button-warning,
.p-button-warning.p-button {
  background: #d97706 !important;
  border: 1px solid #d97706 !important;
  color: #ffffff !important;
  font-weight: 700 !important;
}
.p-button.p-button-warning:hover,
.p-button-warning.p-button:hover {
  background: #b45309 !important;
  border-color: #b45309 !important;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35) !important;
}

.p-button.p-button-secondary,
.p-button-secondary.p-button {
  background: #334155 !important;
  border: 1px solid #475569 !important;
  color: #f1f5f9 !important;
  font-weight: 700 !important;
}
.p-button.p-button-secondary:hover,
.p-button-secondary.p-button:hover {
  background: #475569 !important;
  border-color: #64748b !important;
}`;

const newButtonSeverityBlock = `/* Explicit Button Severities (Solid only, exclude text & outlined) */
.p-button.p-button-info:not(.p-button-outlined):not(.p-button-text),
.p-button-info.p-button:not(.p-button-outlined):not(.p-button-text) {
  background: #0284c7 !important;
  border: 1px solid #0284c7 !important;
  color: #ffffff !important;
  font-weight: 700 !important;
}
.p-button.p-button-info:not(.p-button-outlined):not(.p-button-text):hover,
.p-button-info.p-button:not(.p-button-outlined):not(.p-button-text):hover {
  background: #0369a1 !important;
  border-color: #0369a1 !important;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35) !important;
}

.p-button.p-button-success:not(.p-button-outlined):not(.p-button-text),
.p-button-success.p-button:not(.p-button-outlined):not(.p-button-text) {
  background: #16a34a !important;
  border: 1px solid #16a34a !important;
  color: #ffffff !important;
  font-weight: 700 !important;
}
.p-button.p-button-success:not(.p-button-outlined):not(.p-button-text):hover,
.p-button-success.p-button:not(.p-button-outlined):not(.p-button-text):hover {
  background: #15803d !important;
  border-color: #15803d !important;
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35) !important;
}

.p-button.p-button-warning:not(.p-button-outlined):not(.p-button-text),
.p-button-warning.p-button:not(.p-button-outlined):not(.p-button-text) {
  background: #d97706 !important;
  border: 1px solid #d97706 !important;
  color: #ffffff !important;
  font-weight: 700 !important;
}
.p-button.p-button-warning:not(.p-button-outlined):not(.p-button-text):hover,
.p-button-warning.p-button:not(.p-button-outlined):not(.p-button-text):hover {
  background: #b45309 !important;
  border-color: #b45309 !important;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35) !important;
}

.p-button.p-button-secondary:not(.p-button-outlined):not(.p-button-text),
.p-button-secondary.p-button:not(.p-button-outlined):not(.p-button-text) {
  background: #334155 !important;
  border: 1px solid #475569 !important;
  color: #f1f5f9 !important;
  font-weight: 700 !important;
}
.p-button.p-button-secondary:not(.p-button-outlined):not(.p-button-text):hover,
.p-button-secondary.p-button:not(.p-button-outlined):not(.p-button-text):hover {
  background: #475569 !important;
  border-color: #64748b !important;
}

/* Secondary Button text / ghost icon (Edit, refresh, etc.) */
.p-button.p-button-secondary.p-button-text,
.p-button-secondary.p-button.p-button-text {
  background: transparent !important;
  border-color: transparent !important;
  color: #64748b !important;
}
.p-button.p-button-secondary.p-button-text:hover,
.p-button-secondary.p-button.p-button-text:hover {
  background: rgba(100, 116, 139, 0.12) !important;
  color: #0f172a !important;
}
:root[data-theme="dark"] .p-button.p-button-secondary.p-button-text,
[data-theme="dark"] .p-button.p-button-secondary.p-button-text {
  background: transparent !important;
  border-color: transparent !important;
  color: #94a3b8 !important;
}
:root[data-theme="dark"] .p-button.p-button-secondary.p-button-text:hover,
[data-theme="dark"] .p-button.p-button-secondary.p-button-text:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #f8fafc !important;
}`;

if (!updatedCss.includes(oldButtonSeverityBlock)) {
  console.warn('Could not find exact oldButtonSeverityBlock, searching partial...');
} else {
  updatedCss = updatedCss.replace(oldButtonSeverityBlock, newButtonSeverityBlock);
  console.log('Replaced button severity block successfully!');
}

// 3. Fix status cards grid & scoping
const oldStatusCardsBlock = `/* ==========================================================================
   STATUS CARDS (RINCIAN STATUS LP - 11 STATUSES)
   ========================================================================== */

.lp-status-cards {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr)) !important;
  gap: 0.65rem !important;
  margin: 1.15rem 0 !important;
}

@media (min-width: 1400px) {
  .lp-status-cards {
    grid-template-columns: repeat(11, minmax(0, 1fr)) !important;
  }
}

.lp-stat {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: center !important;
  text-align: left !important;
  cursor: pointer !important;
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  border-top-width: 4px !important;
  border-top-style: solid !important;
  border-radius: 12px !important;
  padding: 0.75rem 0.85rem !important;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05) !important;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease !important;
  min-width: 0 !important;
  overflow: hidden !important;
}

.lp-stat:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08) !important;
}

:root[data-theme="dark"] .lp-stat,
[data-theme="dark"] .lp-stat {
  background: #111a2e !important;
  border-left: 1px solid rgba(255, 255, 255, 0.09) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.09) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09) !important;
  border-top-width: 4px !important;
  border-top-style: solid !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
}

.lp-stat .n {
  color: #0f172a !important;
  font-size: 1.45rem !important;
  font-weight: 850 !important;
  line-height: 1.15 !important;
  letter-spacing: -0.02em !important;
  font-variant-numeric: tabular-nums !important;
}

:root[data-theme="dark"] .lp-stat .n,
[data-theme="dark"] .lp-stat .n {
  color: #f8fafc !important;
}

.lp-stat .l,
.lp-stat .lbl {
  color: #64748b !important;
  font-size: 0.68rem !important;
  font-weight: 750 !important;
  line-height: 1.25 !important;
  letter-spacing: 0.035em !important;
  text-transform: uppercase !important;
  margin-top: 0.35rem !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 100% !important;
  display: block !important;
}

:root[data-theme="dark"] .lp-stat .l,
:root[data-theme="dark"] .lp-stat .lbl,
[data-theme="dark"] .lp-stat .l,
[data-theme="dark"] .lp-stat .lbl {
  color: #94a3b8 !important;
}

/* 11 Status LP Semantic Top Borders (Light & Dark) */
/* 1. Belum Update */
.lp-stat:nth-child(1),
:root[data-theme="dark"] .lp-stat:nth-child(1) { border-top-color: #ef4444 !important; }
/* 2. Lidik */
.lp-stat:nth-child(2),
:root[data-theme="dark"] .lp-stat:nth-child(2) { border-top-color: #0284c7 !important; }
/* 3. SP2 Lidik */
.lp-stat:nth-child(3),
:root[data-theme="dark"] .lp-stat:nth-child(3) { border-top-color: #2563eb !important; }
/* 4. Sidik */
.lp-stat:nth-child(4),
:root[data-theme="dark"] .lp-stat:nth-child(4) { border-top-color: #6366f1 !important; }
/* 5. Perma */
.lp-stat:nth-child(5),
:root[data-theme="dark"] .lp-stat:nth-child(5) { border-top-color: #10b981 !important; }
/* 6. SPDP */
.lp-stat:nth-child(6),
:root[data-theme="dark"] .lp-stat:nth-child(6) { border-top-color: #f59e0b !important; }
/* 7. SP3 */
.lp-stat:nth-child(7),
:root[data-theme="dark"] .lp-stat:nth-child(7) { border-top-color: #059669 !important; }
/* 8. Tahap I */
.lp-stat:nth-child(8),
:root[data-theme="dark"] .lp-stat:nth-child(8) { border-top-color: #8b5cf6 !important; }
/* 9. P19 */
.lp-stat:nth-child(9),
:root[data-theme="dark"] .lp-stat:nth-child(9) { border-top-color: #ea580c !important; }
/* 10. P21 */
.lp-stat:nth-child(10),
:root[data-theme="dark"] .lp-stat:nth-child(10) { border-top-color: #06b6d4 !important; }
/* 11. Tahap II */
.lp-stat:nth-child(11),
:root[data-theme="dark"] .lp-stat:nth-child(11) { border-top-color: #16a34a !important; }

/* Filter Bar .lp-stat variants (LP list page) */
.lp-stat.total { border-top-color: #0f172a !important; }
:root[data-theme="dark"] .lp-stat.total { border-top-color: #94a3b8 !important; }
.lp-stat.active {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.35) !important;
}`;

const newStatusCardsBlock = `/* ==========================================================================
   STATUS CARDS (RINCIAN STATUS LP & EXECUTIVE KPI CARDS)
   ========================================================================== */

.lp-status-cards {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(7.2rem, 1fr)) !important;
  gap: 0.65rem !important;
  margin: 1.15rem 0 !important;
}

/* Individual Metric Card Base */
.lp-stat {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: center !important;
  text-align: left !important;
  cursor: pointer !important;
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  border-top-width: 4px !important;
  border-top-style: solid !important;
  border-top-color: #94a3b8 !important; /* Neutral border default for party cards & general roles */
  border-radius: 12px !important;
  padding: 0.75rem 0.85rem !important;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05) !important;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease !important;
  min-width: 0 !important;
  overflow: hidden !important;
  user-select: none !important;
}

.lp-stat:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08) !important;
}

:root[data-theme="dark"] .lp-stat,
[data-theme="dark"] .lp-stat {
  background: #111a2e !important;
  border-left: 1px solid rgba(255, 255, 255, 0.09) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.09) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09) !important;
  border-top-width: 4px !important;
  border-top-style: solid !important;
  border-top-color: #475569 !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
}

.lp-stat .n {
  color: #0f172a !important;
  font-size: 1.45rem !important;
  font-weight: 850 !important;
  line-height: 1.15 !important;
  letter-spacing: -0.02em !important;
  font-variant-numeric: tabular-nums !important;
}

:root[data-theme="dark"] .lp-stat .n,
[data-theme="dark"] .lp-stat .n {
  color: #f8fafc !important;
}

.lp-stat .l,
.lp-stat .lbl {
  color: #64748b !important;
  font-size: 0.68rem !important;
  font-weight: 750 !important;
  line-height: 1.25 !important;
  letter-spacing: 0.035em !important;
  text-transform: uppercase !important;
  margin-top: 0.35rem !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 100% !important;
  display: block !important;
}

:root[data-theme="dark"] .lp-stat .l,
:root[data-theme="dark"] .lp-stat .lbl,
[data-theme="dark"] .lp-stat .l,
[data-theme="dark"] .lp-stat .lbl {
  color: #94a3b8 !important;
}

/* Neutral Total / Semua Card */
.lp-stat.total {
  border-top-color: #0f172a !important;
}
:root[data-theme="dark"] .lp-stat.total {
  border-top-color: #94a3b8 !important;
}

/* Active State (Selected Filter) */
.lp-stat.active {
  border-color: #ef4444 !important;
  border-top-color: #ef4444 !important;
  background: #fef2f2 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.35), 0 6px 16px rgba(239, 68, 68, 0.15) !important;
}
:root[data-theme="dark"] .lp-stat.active {
  border-color: #ef4444 !important;
  border-top-color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.12) !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.45), 0 8px 20px rgba(0, 0, 0, 0.5) !important;
}
.lp-stat.active .l {
  color: #b91c1c !important;
  font-weight: 800 !important;
}
:root[data-theme="dark"] .lp-stat.active .l {
  color: #fca5a5 !important;
}

/* --- 1. DASHBOARD RINGKASAN: Rincian Status LP (Exact 11 Statuses, No Total Card) --- */
@media (min-width: 1400px) {
  .dash-section .lp-status-cards {
    grid-template-columns: repeat(11, minmax(0, 1fr)) !important;
  }
}
.dash-section .lp-status-cards .lp-stat:nth-child(1),
:root[data-theme="dark"] .dash-section .lp-status-cards .lp-stat:nth-child(1) { border-top-color: #ef4444 !important; } /* Belum Update */
.dash-section .lp-status-cards .lp-stat:nth-child(2),
:root[data-theme="dark"] .dash-section .lp-status-cards .lp-stat:nth-child(2) { border-top-color: #0284c7 !important; } /* Lidik */
.dash-section .lp-status-cards .lp-stat:nth-child(3),
:root[data-theme="dark"] .dash-section .lp-status-cards .lp-stat:nth-child(3) { border-top-color: #2563eb !important; } /* SP2 Lidik */
.dash-section .lp-status-cards .lp-stat:nth-child(4),
:root[data-theme="dark"] .dash-section .lp-status-cards .lp-stat:nth-child(4) { border-top-color: #6366f1 !important; } /* Sidik */
.dash-section .lp-status-cards .lp-stat:nth-child(5),
:root[data-theme="dark"] .dash-section .lp-status-cards .lp-stat:nth-child(5) { border-top-color: #10b981 !important; } /* Perma */
.dash-section .lp-status-cards .lp-stat:nth-child(6),
:root[data-theme="dark"] .dash-section .lp-status-cards .lp-stat:nth-child(6) { border-top-color: #f59e0b !important; } /* SPDP */
.dash-section .lp-status-cards .lp-stat:nth-child(7),
:root[data-theme="dark"] .dash-section .lp-status-cards .lp-stat:nth-child(7) { border-top-color: #059669 !important; } /* SP3 */
.dash-section .lp-status-cards .lp-stat:nth-child(8),
:root[data-theme="dark"] .dash-section .lp-status-cards .lp-stat:nth-child(8) { border-top-color: #8b5cf6 !important; } /* Tahap I */
.dash-section .lp-status-cards .lp-stat:nth-child(9),
:root[data-theme="dark"] .dash-section .lp-status-cards .lp-stat:nth-child(9) { border-top-color: #ea580c !important; } /* P19 */
.dash-section .lp-status-cards .lp-stat:nth-child(10),
:root[data-theme="dark"] .dash-section .lp-status-cards .lp-stat:nth-child(10) { border-top-color: #06b6d4 !important; } /* P21 */
.dash-section .lp-status-cards .lp-stat:nth-child(11),
:root[data-theme="dark"] .dash-section .lp-status-cards .lp-stat:nth-child(11) { border-top-color: #16a34a !important; } /* Tahap II */

/* --- 2. LAPORAN POLISI: 12 Cards (Semua LP + 11 Statuses) --- */
.lp-status-cards:has(.lp-stat:nth-child(12)) {
  grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr)) !important;
}
@media (min-width: 1360px) {
  .lp-status-cards:has(.lp-stat:nth-child(12)) {
    grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
  }
}
.lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(1),
:root[data-theme="dark"] .lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(1) { border-top-color: #0f172a !important; } /* Semua LP: Neutral Slate */
.lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(2),
:root[data-theme="dark"] .lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(2) { border-top-color: #ef4444 !important; } /* Belum Update */
.lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(3),
:root[data-theme="dark"] .lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(3) { border-top-color: #0284c7 !important; } /* Lidik */
.lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(4),
:root[data-theme="dark"] .lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(4) { border-top-color: #2563eb !important; } /* SP2 Lidik */
.lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(5),
:root[data-theme="dark"] .lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(5) { border-top-color: #6366f1 !important; } /* Sidik */
.lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(6),
:root[data-theme="dark"] .lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(6) { border-top-color: #10b981 !important; } /* Perma */
.lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(7),
:root[data-theme="dark"] .lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(7) { border-top-color: #f59e0b !important; } /* SPDP */
.lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(8),
:root[data-theme="dark"] .lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(8) { border-top-color: #059669 !important; } /* SP3 */
.lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(9),
:root[data-theme="dark"] .lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(9) { border-top-color: #8b5cf6 !important; } /* Tahap I */
.lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(10),
:root[data-theme="dark"] .lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(10) { border-top-color: #ea580c !important; } /* P19 */
.lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(11),
:root[data-theme="dark"] .lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(11) { border-top-color: #06b6d4 !important; } /* P21 */
.lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(12),
:root[data-theme="dark"] .lp-status-cards:has(.lp-stat:nth-child(12)) .lp-stat:nth-child(12) { border-top-color: #16a34a !important; } /* Tahap II */`;

if (!updatedCss.includes(oldStatusCardsBlock)) {
  console.warn('Could not find exact oldStatusCardsBlock, searching partial...');
} else {
  updatedCss = updatedCss.replace(oldStatusCardsBlock, newStatusCardsBlock);
  console.log('Replaced status cards block successfully!');
}

// 4. Append Blocks 17, 18, 20
let finalCss = updatedCss;

// Check if block17 already present
if (!finalCss.includes('KINERJA PERKARA UNIFIED FILTER')) {
  console.log('Appending Block 17 (Unified Filter & PDF Modal)...');
  finalCss += '\n\n' + block17;
}

// Check if block18 already present
if (!finalCss.includes('MOBILE SIDEBAR DRAWER & BACKDROP STACKING')) {
  console.log('Appending Block 18 (Mobile Sidebar)...');
  finalCss += '\n\n' + block18;
}

// Check if block20 already present
if (!finalCss.includes('KINERJA PERKARA FILTER POPOVER: DROPUP')) {
  console.log('Appending Block 20 (Filter Dropup & Compact)...');
  finalCss += '\n\n' + block20;
}

// 4b. Explicit Floating Popover Block (from Block 19)
const floatingPopoverBlock = `
/* ==========================================================================
   KINERJA PERKARA FLOATING POPOVER & ANCHOR FIX
   ========================================================================== */

/* Filter Popover Attached Beneath Button */
.kp-filter-wrapper {
  position: relative !important;
  display: inline-flex !important;
}

.kp-filter-popover,
.kp-modal-card.kp-filter-popover {
  position: absolute !important;
  top: calc(100% + 8px) !important;
  left: 0 !important;
  z-index: 2500 !important;
  width: min(44rem, calc(100vw - 2.5rem)) !important;
  max-width: 44rem !important;
  max-height: min(34rem, calc(100vh - 180px)) !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--cas-border-card, #233554) !important;
  animation: kpFilterPopFadeIn 0.15s ease-out !important;
}

.kp-filter-popover .kp-modal-header {
  padding: 0.85rem 1.15rem !important;
}

.kp-filter-popover .kp-modal-body {
  padding: 1.15rem !important;
  min-height: 240px !important;
  max-height: min(24rem, calc(100vh - 280px)) !important;
}

.kp-filter-popover .kp-modal-footer {
  padding: 0.75rem 1.15rem !important;
}

@keyframes kpFilterPopFadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.kp-filter-trigger-btn.active {
  background: rgba(220, 38, 38, 0.12) !important;
  border-color: #ef4444 !important;
  color: #ef4444 !important;
}
:root[data-theme=dark] .kp-filter-trigger-btn.active {
  background: rgba(239, 68, 68, 0.16) !important;
  border-color: #ef4444 !important;
  color: #fca5a5 !important;
}
`;

if (!finalCss.includes('KINERJA PERKARA FLOATING POPOVER & ANCHOR FIX')) {
  console.log('Appending Floating Popover Block...');
  finalCss += '\n\n' + floatingPopoverBlock;
}


// 5. Add Profile and Summary Strip Enhancements
const profileEnhancement = `
/* ==========================================================================
   USER PROFILE & EXECUTIVE VIEW ENHANCEMENTS
   ========================================================================== */

/* User Profile Header Pills: Sleek glass integration */
.cms-card div:has(> .profile-pill),
div[style*="marginTop:-1.6rem"],
div[style*="margin-top: -1.6rem"],
div[style*="margin-top:-1.6rem"] {
  display: flex !important;
  align-items: center !important;
  gap: 0.65rem !important;
}

div[style*="marginTop:-1.6rem"] > span,
div[style*="margin-top: -1.6rem"] > span,
div[style*="margin-top:-1.6rem"] > span {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12) !important;
  backdrop-filter: blur(8px) !important;
  font-weight: 800 !important;
  letter-spacing: 0.02em !important;
}

:root[data-theme="dark"] div[style*="marginTop:-1.6rem"] > span,
[data-theme="dark"] div[style*="marginTop:-1.6rem"] > span {
  background: #111a2e !important;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4) !important;
}

/* Kinerja Perkara Summary Strip Smooth Horizontal Layout */
#kp-summary-strip {
  scrollbar-width: thin !important;
  scrollbar-color: rgba(148, 163, 184, 0.3) transparent !important;
}
#kp-summary-strip::-webkit-scrollbar {
  height: 5px !important;
}
#kp-summary-strip::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.25) !important;
  border-radius: 999px !important;
}
`;

if (!finalCss.includes('USER PROFILE & EXECUTIVE VIEW ENHANCEMENTS')) {
  console.log('Appending Profile Enhancements...');
  finalCss += '\n\n' + profileEnhancement;
}

// Write the fixed css back to 20sy5p32bn-wu.modern.css
fs.writeFileSync('20sy5p32bn-wu.modern.css', finalCss);
console.log('Successfully wrote updated 20sy5p32bn-wu.modern.css! Total chars:', finalCss.length);
